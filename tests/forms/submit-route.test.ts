import { POST } from "@/app/api/forms/submit/route";
import { submitToHubSpot } from "@/lib/hubspot/server";

vi.mock("@/lib/hubspot/server", () => {
  return {
    HubSpotSubmissionError: class HubSpotSubmissionError extends Error {},
    getHubSpotFormGuid: vi.fn((formType: string) => `${formType}-guid`),
    submitToHubSpot: vi.fn(),
  };
});

function buildRequest(body: unknown, headers?: HeadersInit) {
  return new Request("http://localhost/api/forms/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/forms/submit", () => {
  const submitToHubSpotMock = vi.mocked(submitToHubSpot);

  beforeEach(() => {
    submitToHubSpotMock.mockReset();
  });

  it("silently accepts honeypot submissions and skips HubSpot", async () => {
    const response = await POST(
      buildRequest({
        formType: "demo",
        bot_field: "spam-link",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(submitToHubSpotMock).not.toHaveBeenCalled();
  });

  it("returns validation errors for invalid payloads", async () => {
    const response = await POST(
      buildRequest({
        formType: "contact",
        first_name: "",
        last_name: "",
        email: "bad-email",
        company_name: "",
      }),
    );
    const json = (await response.json()) as {
      success: boolean;
      errors: {
        fieldErrors: Record<string, string[] | undefined>;
      };
    };

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.errors.fieldErrors.first_name).toBeTruthy();
    expect(json.errors.fieldErrors.email).toBeTruthy();
    expect(submitToHubSpotMock).not.toHaveBeenCalled();
  });

  it("submits validated payloads to the correct HubSpot form with context", async () => {
    submitToHubSpotMock.mockResolvedValue(undefined);

    const response = await POST(
      buildRequest(
        {
          formType: "waitlist",
          first_name: "Ada",
          last_name: "Lovelace",
          email: "ada@example.com",
          company_name: "Analytical Engines Ltd.",
          landing_page_url: "https://example.com/fallback",
          bot_field: "",
        },
        {
          "x-forwarded-for": "203.0.113.1, 10.0.0.2",
          referer: "https://example.com/waitlist",
        },
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(submitToHubSpotMock).toHaveBeenCalledWith(
      expect.objectContaining({
        formType: "waitlist",
        first_name: "Ada",
        last_name: "Lovelace",
        email: "ada@example.com",
        company_name: "Analytical Engines Ltd.",
      }),
      "waitlist-guid",
      "203.0.113.1",
      "https://example.com/waitlist",
    );
  });
});
