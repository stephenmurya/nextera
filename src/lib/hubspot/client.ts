import { hubSpotProxySubmissionSchema, type HubSpotProxySubmission } from "@/lib/validations/forms";

export type SubmitHubSpotFormInput = HubSpotProxySubmission;

type HubSpotProxySuccessResponse = {
  success: true;
};

type HubSpotProxyErrorResponse = {
  success: false;
  error: string;
};

export type HubSpotProxyResponse =
  | HubSpotProxySuccessResponse
  | HubSpotProxyErrorResponse;

export class HubSpotClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "HubSpotClientError";
  }
}

function isHubSpotProxyResponse(value: unknown): value is HubSpotProxyResponse {
  if (typeof value !== "object" || value === null || !("success" in value)) {
    return false;
  }

  const candidate = value as { success?: unknown; error?: unknown };

  if (candidate.success === true) {
    return true;
  }

  return candidate.success === false && typeof candidate.error === "string";
}

export async function submitHubspotForm(
  input: SubmitHubSpotFormInput,
): Promise<HubSpotProxySuccessResponse> {
  const payload = hubSpotProxySubmissionSchema.parse(input);
  const response = await fetch("/api/hubspot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch {
    responseBody = undefined;
  }

  if (!response.ok) {
    const message =
      isHubSpotProxyResponse(responseBody) && responseBody.success === false
        ? responseBody.error
        : "Something went wrong. Please try again.";

    throw new HubSpotClientError(message, response.status);
  }

  if (!isHubSpotProxyResponse(responseBody) || responseBody.success !== true) {
    throw new HubSpotClientError(
      "Unexpected response from the HubSpot proxy.",
      response.status,
    );
  }

  return responseBody;
}
