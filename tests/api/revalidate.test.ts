import { vi } from "vitest";

const revalidateMocks = vi.hoisted(() => ({
  revalidateTag: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidateTag: revalidateMocks.revalidateTag,
}));

import { POST } from "@/app/api/revalidate/route";

function buildRequest(body: unknown, authorization?: string) {
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidateMocks.revalidateTag.mockReset();
  });

  it("returns 401 for an invalid bearer secret", async () => {
    const response = await POST(
      buildRequest({ slug: "/about" }, "Bearer wrong-secret"),
    );

    expect(response.status).toBe(401);
    expect(revalidateMocks.revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 400 for mixed or empty payloads", async () => {
    const mixedPayloadResponse = await POST(
      buildRequest(
        { slug: "/about", tags: ["page-about"] },
        "Bearer revalidation-secret",
      ),
    );
    const emptyPayloadResponse = await POST(
      buildRequest({}, "Bearer revalidation-secret"),
    );

    expect(mixedPayloadResponse.status).toBe(400);
    expect(emptyPayloadResponse.status).toBe(400);
    expect(revalidateMocks.revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates the derived page tag and the sitemap tag for slug payloads", async () => {
    const response = await POST(
      buildRequest({ slug: "/about/" }, "Bearer revalidation-secret"),
    );

    expect(response.status).toBe(200);
    expect(revalidateMocks.revalidateTag.mock.calls).toEqual([
      ["page-about", "max"],
      ["wordpress-sitemap", "max"],
    ]);
  });

  it("trims, filters, and deduplicates tag payloads before revalidation", async () => {
    const response = await POST(
      buildRequest(
        {
          tags: [" page-about ", "", "page-about", "page-contact "],
        },
        "Bearer revalidation-secret",
      ),
    );

    expect(response.status).toBe(200);
    expect(revalidateMocks.revalidateTag.mock.calls).toEqual([
      ["page-about", "max"],
      ["page-contact", "max"],
      ["wordpress-sitemap", "max"],
    ]);
  });

  it("rejects oversized tag arrays", async () => {
    const response = await POST(
      buildRequest(
        {
          tags: Array.from({ length: 26 }, (_, index) => `page-${index}`),
        },
        "Bearer revalidation-secret",
      ),
    );

    expect(response.status).toBe(400);
    expect(revalidateMocks.revalidateTag).not.toHaveBeenCalled();
  });
});
