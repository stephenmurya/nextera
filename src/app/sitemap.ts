import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import {
  getAllPublishedPageUris,
  type PublishedPageUri,
} from "@/lib/wordpress/client";

function buildHomepageSitemapEntry(
  siteUrl: string,
): MetadataRoute.Sitemap[number] {
  return {
    url: new URL("/", siteUrl).toString(),
    changeFrequency: "weekly",
    priority: 1,
  };
}

function toSitemapEntry(
  page: PublishedPageUri,
  siteUrl: string,
): MetadataRoute.Sitemap[number] {
  const url = new URL(page.uri, siteUrl);
  const lastModified = page.modified ? new Date(page.modified) : null;

  return {
    url: url.toString(),
    changeFrequency: "weekly",
    priority: url.pathname === "/" ? 1 : 0.8,
    ...(lastModified && !Number.isNaN(lastModified.getTime())
      ? { lastModified }
      : {}),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const fallback = [buildHomepageSitemapEntry(siteUrl)];

  try {
    const pages = await getAllPublishedPageUris();

    if (pages.length === 0) {
      return fallback;
    }

    const seenUrls = new Set<string>();
    const entries: MetadataRoute.Sitemap = [];

    for (const page of pages) {
      const entry = toSitemapEntry(page, siteUrl);

      if (seenUrls.has(entry.url)) {
        continue;
      }

      seenUrls.add(entry.url);
      entries.push(entry);
    }

    return entries.length > 0 ? entries : fallback;
  } catch {
    return fallback;
  }
}
