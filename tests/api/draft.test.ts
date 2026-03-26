import { vi } from "vitest";

const draftModeMocks = vi.hoisted(() => ({
  disable: vi.fn(),
  draftMode: vi.fn(),
  enable: vi.fn(),
  getPageBySlug: vi.fn(),
}));

vi.mock("next/headers", () => ({
  draftMode: draftModeMocks.draftMode,
}));

vi.mock("@/lib/wordpress/client", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/wordpress/client")>(
      "@/lib/wordpress/client",
    );

  return {
    ...actual,
    getPageBySlug: draftModeMocks.getPageBySlug,
  };
});

import { GET as disableDraft } from "@/app/api/disable-draft/route";
import { GET as enableDraft } from "@/app/api/draft/route";

describe("draft mode routes", () => {
  beforeEach(() => {
    draftModeMocks.enable.mockReset();
    draftModeMocks.disable.mockReset();
    draftModeMocks.draftMode.mockReset();
    draftModeMocks.getPageBySlug.mockReset();
    draftModeMocks.draftMode.mockResolvedValue({
      disable: draftModeMocks.disable,
      enable: draftModeMocks.enable,
      isEnabled: false,
    });
    draftModeMocks.getPageBySlug.mockResolvedValue({
      title: "About",
      slug: "about",
      seo: {
        canonicalUrl: "https://example.com/about",
        openGraph: {
          title: "About",
        },
        title: "About",
      },
      sections: [],
    });
  });

  it("returns 401 for an invalid preview secret", async () => {
    const response = await enableDraft(
      new Request("http://localhost/api/draft?secret=wrong&slug=/about"),
    );

    expect(response.status).toBe(401);
    expect(draftModeMocks.enable).not.toHaveBeenCalled();
  });

  it("returns 400 for unsafe preview slugs", async () => {
    const maliciousSlugs = ["https://evil.com", "//evil.com"];

    for (const slug of maliciousSlugs) {
      const response = await enableDraft(
        new Request(
          `http://localhost/api/draft?secret=preview-secret&slug=${encodeURIComponent(
            slug,
          )}`,
        ),
      );

      expect(response.status).toBe(400);
    }

    expect(draftModeMocks.enable).not.toHaveBeenCalled();
  });

  it("enables draft mode and redirects to a sanitized relative path", async () => {
    const response = await enableDraft(
      new Request(
        "http://localhost/api/draft?secret=preview-secret&slug=%2Fabout%2F",
      ),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/about");
    expect(draftModeMocks.getPageBySlug).toHaveBeenCalledWith("about", true);
    expect(draftModeMocks.enable).toHaveBeenCalledTimes(1);
  });

  it("does not enable draft mode when preview validation fails", async () => {
    draftModeMocks.getPageBySlug.mockRejectedValue(new Error("Expired token"));

    const response = await enableDraft(
      new Request(
        "http://localhost/api/draft?secret=preview-secret&slug=%2Fabout%2F",
      ),
    );

    expect(response.status).toBe(502);
    expect(draftModeMocks.enable).not.toHaveBeenCalled();
  });

  it("disables draft mode and redirects home", async () => {
    const response = await disableDraft(
      new Request("http://localhost/api/disable-draft"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/");
    expect(draftModeMocks.disable).toHaveBeenCalledTimes(1);
  });
});
