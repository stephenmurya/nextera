import type {
  HubSpotProxySubmission,
  SubmissionPayload,
} from "@/lib/validations/forms";

export interface HubSpotField {
  name: string;
  value: string;
}

export interface HubSpotSubmissionBody {
  fields: HubSpotField[];
}

const hubSpotFieldMap = {
  first_name: "firstname",
  last_name: "lastname",
  email: "email",
  company_name: "company",
  utm_source: "utm_source",
  utm_medium: "utm_medium",
  utm_campaign: "utm_campaign",
  landing_page_url: "landing_page_url",
} as const;

type HubSpotMappableField = keyof typeof hubSpotFieldMap;

export function mapSubmissionToHubSpot(
  payload: SubmissionPayload,
): HubSpotSubmissionBody {
  const fields: HubSpotField[] = [];

  const fieldEntries = Object.entries(hubSpotFieldMap) as Array<
    [HubSpotMappableField, (typeof hubSpotFieldMap)[HubSpotMappableField]]
  >;

  for (const [sourceField, hubSpotFieldName] of fieldEntries) {
    const value = payload[sourceField];

    if (typeof value !== "string" || value.trim().length === 0) {
      continue;
    }

    fields.push({
      name: hubSpotFieldName,
      value,
    });
  }

  return { fields };
}

export function mapHubSpotProxySubmissionToHubSpot(
  payload: HubSpotProxySubmission,
): HubSpotSubmissionBody {
  const fields: HubSpotField[] = [
    {
      name: "email",
      value: payload.email,
    },
    {
      name: "firstname",
      value: payload.firstname,
    },
    {
      name: "lastname",
      value: payload.lastname,
    },
  ];

  if (payload.message) {
    fields.push({
      name: "message",
      value: payload.message,
    });
  }

  return { fields };
}
