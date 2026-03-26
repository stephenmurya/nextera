import {
  HubSpotClientError,
  submitHubspotForm,
} from "@/lib/hubspot/client";

describe("submitHubspotForm", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts validated payloads to the BFF route", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    await expect(
      submitHubspotForm({
        formType: "demo",
        firstname: "Ada",
        lastname: "Lovelace",
        email: "ada@example.com",
        message: "Book me a demo.",
      }),
    ).resolves.toEqual({ success: true });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/hubspot",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const [, requestInit] = fetchMock.mock.calls[0] ?? [];

    expect(JSON.parse(String(requestInit?.body))).toEqual({
      formType: "demo",
      firstname: "Ada",
      lastname: "Lovelace",
      email: "ada@example.com",
      message: "Book me a demo.",
    });
  });

  it("throws a typed error when the proxy rejects a submission", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request payload.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    try {
      await submitHubspotForm({
        formType: "waitlist",
        firstname: "Ada",
        lastname: "Lovelace",
        email: "ada@example.com",
      });

      throw new Error("Expected submitHubspotForm to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(HubSpotClientError);
      expect(error).toMatchObject({
        name: "HubSpotClientError",
        message: "Invalid request payload.",
        status: 400,
      });
    }
  });
});
