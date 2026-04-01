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
      phone: "+1 (555) 123-4567",
      company_name: "Analytical Engines Ltd.",
      market_or_city: "Lagos",
      team_size: "2_5_agents",
      current_workflow: "We capture leads from landing pages and assign them manually.",
      biggest_pain_point: "Speed to lead is inconsistent across the team.",
      interest_type: "request_demo",
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
        { name: "phone", value: "+1 (555) 123-4567" },
        { name: "company", value: "Analytical Engines Ltd." },
        { name: "market_or_city", value: "Lagos" },
        { name: "team_size", value: "2_5_agents" },
        {
          name: "current_workflow",
          value: "We capture leads from landing pages and assign them manually.",
        },
        {
          name: "biggest_pain_point",
          value: "Speed to lead is inconsistent across the team.",
        },
        { name: "interest_type", value: "request_demo" },
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
