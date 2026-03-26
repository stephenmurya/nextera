import { NextResponse } from "next/server";
import { hubSpotProxySubmissionSchema } from "@/lib/validations/forms";
import {
  getHubSpotFormGuid,
  HubSpotSubmissionError,
  submitHubSpotProxySubmission,
} from "@/lib/hubspot/server";

export const runtime = "nodejs";

function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (!forwardedFor) {
    return undefined;
  }

  const [ipAddress] = forwardedFor.split(",");

  return ipAddress?.trim() || undefined;
}

function getPageUri(request: Request) {
  return request.headers.get("referer") ?? request.headers.get("origin") ?? undefined;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Request body must be valid JSON.",
      },
      { status: 400 },
    );
  }

  const validationResult = hubSpotProxySubmissionSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request payload.",
      },
      { status: 400 },
    );
  }

  const payload = validationResult.data;
  const formGuid = getHubSpotFormGuid(payload.formType);

  try {
    await submitHubSpotProxySubmission(
      payload,
      formGuid,
      getRequestIp(request),
      getPageUri(request),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[hubspot] Submission failed", {
      formType: payload.formType,
      status: error instanceof HubSpotSubmissionError ? error.status : undefined,
      message: error instanceof Error ? error.message : "Unknown submission error",
    });

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}
