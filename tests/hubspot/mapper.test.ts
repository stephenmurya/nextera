import {
  mapHubSpotProxySubmissionToHubSpot,
  mapSubmissionToHubSpot,
} from "@/lib/hubspot/mapper";
import type { DemoFormValues } from "@/lib/validations/forms";

describe("mapSubmissionToHubSpot", () => {
  it("maps snake_case lead fields to HubSpot field names and omits empty values", () => {
    const payload: DemoFormValues = {
      formType: "demo",
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@example.com",
      company_name: "Analytical Engines Ltd.",
      utm_source: "newsletter",
      utm_medium: "",
      utm_campaign: undefined,
      landing_page_url: "https://example.com/demo",
      bot_field: "",
    };

    expect(mapSubmissionToHubSpot(payload)).toEqual({
      fields: [
        { name: "firstname", value: "Ada" },
        { name: "lastname", value: "Lovelace" },
        { name: "email", value: "ada@example.com" },
        { name: "company", value: "Analytical Engines Ltd." },
        { name: "utm_source", value: "newsletter" },
        { name: "landing_page_url", value: "https://example.com/demo" },
      ],
    });
  });

  it("maps the lightweight BFF payload to the expected HubSpot fields", () => {
    expect(
      mapHubSpotProxySubmissionToHubSpot({
        formType: "contact",
        firstname: "Grace",
        lastname: "Hopper",
        email: "grace@example.com",
        message: "I would like to talk to sales.",
      }),
    ).toEqual({
      fields: [
        { name: "email", value: "grace@example.com" },
        { name: "firstname", value: "Grace" },
        { name: "lastname", value: "Hopper" },
        { name: "message", value: "I would like to talk to sales." },
      ],
    });
  });
});
