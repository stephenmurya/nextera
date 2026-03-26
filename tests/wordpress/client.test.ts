import { describe, expect, it, vi } from "vitest";
import {
  buildGetPageByUriVariables,
  createDraftWordPressFetch,
  createWordPressFetch,
  getWordPressCacheTags,
  getWordPressClientHeaders,
  normalizeSlug,
  toPageCacheTag,
  toWordPressUri,
  WORDPRESS_REVALIDATE_SECONDS,
} from "@/lib/wordpress/client";

type FetchCallInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

describe("WordPress client helpers", () => {
  it("normalizes slugs and converts them to WordPress URIs", () => {
    expect(normalizeSlug("about/")).toBe("about");
    expect(normalizeSlug(["solutions", "enterprise"])).toBe(
      "solutions/enterprise",
    );
    expect(normalizeSlug(undefined)).toBe("");
    expect(toWordPressUri("about")).toBe("/about/");
    expect(toWordPressUri("")).toBe("/");
  });

  it("builds cache tags for homepage and nested pages", () => {
    expect(toPageCacheTag("")).toBe("page-home");
    expect(toPageCacheTag("about")).toBe("page-about");
    expect(getWordPressCacheTags("solutions/enterprise")).toEqual([
      "wordpress",
      "page-solutions/enterprise",
    ]);
  });

  it("injects revalidate and cache tags into published fetch options", async () => {
    const baseFetch = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify({ ok: true })),
    );
    const wrappedFetch = createWordPressFetch("about", baseFetch);

    await wrappedFetch("https://example.com/graphql", {
      method: "POST",
      next: {
        tags: ["existing-tag"],
      },
    } as RequestInit);

    const [, init] = baseFetch.mock.calls[0] ?? [];
    const requestInit = init as FetchCallInit;

    expect(requestInit.cache).toBe("force-cache");
    expect(requestInit.next).toEqual({
      revalidate: WORDPRESS_REVALIDATE_SECONDS,
      tags: ["existing-tag", "wordpress", "page-about"],
    });
  });

  it("forces no-store and drops next cache metadata for draft fetches", async () => {
    const baseFetch = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify({ ok: true })),
    );
    const wrappedFetch = createDraftWordPressFetch(baseFetch);

    await wrappedFetch("https://example.com/graphql", {
      method: "POST",
      next: {
        revalidate: WORDPRESS_REVALIDATE_SECONDS,
        tags: ["page-about"],
      },
    } as RequestInit);

    const [, init] = baseFetch.mock.calls[0] ?? [];
    const requestInit = init as FetchCallInit;

    expect(requestInit.cache).toBe("no-store");
    expect(requestInit.next).toBeUndefined();
  });

  it("adds the preview auth header only for draft requests", () => {
    expect(getWordPressClientHeaders(false)).toEqual({
      "content-type": "application/json",
    });
    expect(getWordPressClientHeaders(true)).toEqual({
      "content-type": "application/json",
      Authorization: "Bearer preview-auth-token",
    });
  });

  it("builds preview variables with asPreview enabled for draft requests", () => {
    expect(buildGetPageByUriVariables("about", false)).toEqual({
      uri: "/about/",
      asPreview: false,
    });
    expect(buildGetPageByUriVariables("about", true)).toEqual({
      uri: "/about/",
      asPreview: true,
    });
  });
});
