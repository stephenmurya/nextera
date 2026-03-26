import { vi } from "vitest";
import sitemap from "@/app/sitemap";
import { getAllPublishedPageUris } from "@/lib/wordpress/client";

vi.mock("@/lib/wordpress/client", () => {
  return {
    getAllPublishedPageUris: vi.fn(),
  };
});

describe("sitemap", () => {
  const getAllPublishedPageUrisMock = vi.mocked(getAllPublishedPageUris);

  beforeEach(() => {
    getAllPublishedPageUrisMock.mockReset();
  });

  it("maps CMS routes into deduplicated sitemap entries", async () => {
    getAllPublishedPageUrisMock.mockResolvedValue([
      { uri: "/" },
      { uri: "" },
      { uri: "/about/", modified: "2025-03-01T10:00:00.000Z" },
      { uri: "/pricing/", modified: "not-a-date" },
    ]);

    const entries = await sitemap();

    expect(entries).toHaveLength(3);
    expect(entries.filter((entry) => entry.url === "https://example.com/")).toHaveLength(1);
    expect(entries).toContainEqual(
      expect.objectContaining({
        url: "https://example.com/",
        priority: 1,
        changeFrequency: "weekly",
      }),
    );
    expect(entries).toContainEqual(
      expect.objectContaining({
        url: "https://example.com/about/",
        priority: 0.8,
        changeFrequency: "weekly",
        lastModified: new Date("2025-03-01T10:00:00.000Z"),
      }),
    );
    expect(entries).toContainEqual(
      expect.objectContaining({
        url: "https://example.com/pricing/",
        priority: 0.8,
        changeFrequency: "weekly",
      }),
    );
    expect(
      entries.find((entry) => entry.url === "https://example.com/pricing/")
        ?.lastModified,
    ).toBeUndefined();
  });

  it("falls back to the homepage when the client returns no pages", async () => {
    getAllPublishedPageUrisMock.mockResolvedValue([]);

    await expect(sitemap()).resolves.toEqual([
      {
        url: "https://example.com/",
        changeFrequency: "weekly",
        priority: 1,
      },
    ]);
  });

  it("falls back to the homepage when the client throws", async () => {
    getAllPublishedPageUrisMock.mockRejectedValue(new Error("cms unavailable"));

    await expect(sitemap()).resolves.toEqual([
      {
        url: "https://example.com/",
        changeFrequency: "weekly",
        priority: 1,
      },
    ]);
  });
});
