import "server-only";

import { env } from "@/lib/env";
import {
  mapHubSpotProxySubmissionToHubSpot,
  mapSubmissionToHubSpot,
  type HubSpotSubmissionBody,
} from "@/lib/hubspot/mapper";
import type {
  HubSpotProxySubmission,
  SubmissionFormType,
  SubmissionPayload,
} from "@/lib/validations/forms";

type HubSpotContext = {
  ipAddress?: string;
  pageUri?: string;
};

type HubSpotResponseBody = {
  status?: string;
  message?: string;
  errors?: unknown;
};

export class HubSpotSubmissionError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly formGuid: string,
    public readonly body?: HubSpotResponseBody,
  ) {
    super(message);
    this.name = "HubSpotSubmissionError";
  }
}

async function safeParseHubSpotResponse(
  response: Response,
): Promise<HubSpotResponseBody | undefined> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return undefined;
  }

  try {
    return (await response.json()) as HubSpotResponseBody;
  } catch {
    return undefined;
  }
}

function buildHubSpotContext(ip?: string, pageUri?: string): HubSpotContext {
  return {
    ...(ip ? { ipAddress: ip } : {}),
    ...(pageUri ? { pageUri } : {}),
  };
}

async function postToHubSpot(
  submission: HubSpotSubmissionBody,
  formGuid: string,
  ip?: string,
  pageUri?: string,
) {
  const endpoint = `https://api.hsforms.com/submissions/v3/integration/secure/submit/${env.HUBSPOT_PORTAL_ID}/${formGuid}`;
  const context = buildHubSpotContext(ip, pageUri);
  const requestBody = {
    ...submission,
    ...(Object.keys(context).length > 0 ? { context } : {}),
  };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.HUBSPOT_PRIVATE_APP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new HubSpotSubmissionError(
      "HubSpot submission failed.",
      response.status,
      formGuid,
      await safeParseHubSpotResponse(response),
    );
  }
}

export function getHubSpotFormGuid(formType: SubmissionFormType): string {
  switch (formType) {
    case "demo":
      return env.HUBSPOT_FORM_GUID_DEMO;
    case "waitlist":
      return env.HUBSPOT_FORM_GUID_WAITLIST;
    case "contact":
      return env.HUBSPOT_FORM_GUID_CONTACT;
  }
}

export async function submitToHubSpot(
  payload: SubmissionPayload,
  formGuid: string,
  ip?: string,
  pageUri?: string,
) {
  await postToHubSpot(mapSubmissionToHubSpot(payload), formGuid, ip, pageUri);
}

export async function submitHubSpotProxySubmission(
  payload: HubSpotProxySubmission,
  formGuid: string,
  ip?: string,
  pageUri?: string,
) {
  await postToHubSpot(
    mapHubSpotProxySubmissionToHubSpot(payload),
    formGuid,
    ip,
    pageUri,
  );
}
