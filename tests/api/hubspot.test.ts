import { POST } from "@/app/api/hubspot/route";
import { submitHubSpotProxySubmission } from "@/lib/hubspot/server";

vi.mock("@/lib/hubspot/server", () => {
  return {
    HubSpotSubmissionError: class HubSpotSubmissionError extends Error {},
    getHubSpotFormGuid: vi.fn((formType: string) => `${formType}-guid`),
    submitHubSpotProxySubmission: vi.fn(),
  };
});

function buildRequest(body: unknown, headers?: HeadersInit) {
  return new Request("http://localhost/api/hubspot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/hubspot", () => {
  const submitHubSpotProxySubmissionMock = vi.mocked(
    submitHubSpotProxySubmission,
  );

  beforeEach(() => {
    submitHubSpotProxySubmissionMock.mockReset();
  });

  it("returns 400 for invalid JSON payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/hubspot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Request body must be valid JSON.",
    });
  });

  it("returns 400 for invalid submission payloads", async () => {
    const response = await POST(
      buildRequest({
        formType: "demo",
        firstname: "",
        lastname: "",
        email: "invalid-email",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Invalid request payload.",
    });
    expect(submitHubSpotProxySubmissionMock).not.toHaveBeenCalled();
  });

  it("forwards valid payloads to HubSpot with server-side form mapping", async () => {
    submitHubSpotProxySubmissionMock.mockResolvedValue(undefined);

    const response = await POST(
      buildRequest(
        {
          formType: "contact",
          firstname: "Ada",
          lastname: "Lovelace",
          email: "ada@example.com",
          message: "Tell me more about the platform.",
        },
        {
          "x-forwarded-for": "203.0.113.10, 10.0.0.2",
          referer: "https://example.com/contact",
        },
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(submitHubSpotProxySubmissionMock).toHaveBeenCalledWith(
      {
        formType: "contact",
        firstname: "Ada",
        lastname: "Lovelace",
        email: "ada@example.com",
        message: "Tell me more about the platform.",
      },
      "contact-guid",
      "203.0.113.10",
      "https://example.com/contact",
    );
  });
});
