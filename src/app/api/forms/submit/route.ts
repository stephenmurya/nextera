import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getHubSpotFormGuid,
  HubSpotSubmissionError,
  submitToHubSpot,
} from "@/lib/hubspot/server";
import { formSchemaMap, formTypeSchema } from "@/lib/validations/forms";

export const runtime = "nodejs";
const FORM_SUCCESS_REDIRECT = "/thank-you";

function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (!forwardedFor) {
    return undefined;
  }

  const [ipAddress] = forwardedFor.split(",");

  return ipAddress?.trim() || undefined;
}

function getPageUri(request: Request, landingPageUrl?: string) {
  return (
    request.headers.get("referer") ??
    request.headers.get("origin") ??
    landingPageUrl
  );
}

function extractBotField(body: unknown) {
  if (typeof body !== "object" || body === null || !("bot_field" in body)) {
    return "";
  }

  const botField = body.bot_field;

  return typeof botField === "string" ? botField.trim() : "";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        errors: {
          formErrors: ["Request body must be valid JSON."],
          fieldErrors: {},
        },
      },
      { status: 400 },
    );
  }

  if (extractBotField(body).length > 0) {
    return NextResponse.json({
      success: true,
      redirectTo: FORM_SUCCESS_REDIRECT,
    });
  }

  const formTypeResult = z
    .object({
      formType: formTypeSchema,
    })
    .safeParse(body);

  if (!formTypeResult.success) {
    return NextResponse.json(
      {
        success: false,
        errors: formTypeResult.error.flatten(),
      },
      { status: 400 },
    );
  }

  const formType = formTypeResult.data.formType;
  const validationResult = formSchemaMap[formType].safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        success: false,
        errors: validationResult.error.flatten(),
      },
      { status: 400 },
    );
  }

  const payload = validationResult.data;
  const pageUri = getPageUri(request, payload.landing_page_url);
  const ipAddress = getRequestIp(request);

  try {
    await submitToHubSpot(
      payload,
      getHubSpotFormGuid(formType),
      ipAddress,
      pageUri,
    );

    return NextResponse.json({
      success: true,
      redirectTo: FORM_SUCCESS_REDIRECT,
    });
  } catch (error) {
    console.error("[forms] Submission failed", {
      formType,
      status: error instanceof HubSpotSubmissionError ? error.status : undefined,
      message: error instanceof Error ? error.message : "Unknown submission error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}
