import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { DraftIndicator } from "@/components/DraftIndicator";
import { PageViewTracker } from "@/components/observability/PageViewTracker";
import { SectionRenderer } from "@/components/SectionRenderer";
import { env } from "@/lib/env";
import { formatDocumentTitle, resolveSiteName } from "@/lib/site";
import {
  getGlobalSettings,
  getPageByUri,
  normalizeSlug,
  normalizeWordPressUri,
} from "@/lib/wordpress/client";
import type { GlobalSettings, Page } from "@/types/cms";

type MarketingPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

type MarketingPageContentProps = {
  isDraft: boolean;
  page: Page;
  template: string;
};

const emptyGlobalSettings: GlobalSettings = {
  siteName: undefined,
  defaultSeoTitle: undefined,
  defaultSeoDescription: undefined,
  defaultSeoImage: undefined,
  twitterHandle: undefined,
  footerContactData: undefined,
  headerNav: [],
  footerNav: [],
  socialLinks: [],
  globalCta: null,
};

function buildCanonicalUrl(slug: string): string {
  const pathname = slug ? `/${slug}` : "/";

  return new URL(pathname, env.NEXT_PUBLIC_SITE_URL).toString();
}

function resolveMetadataImage(page: Page, globalSettings: GlobalSettings) {
  return page.seo.openGraph.image ?? globalSettings.defaultSeoImage;
}

function pageToMetadata(page: Page, globalSettings: GlobalSettings): Metadata {
  const siteName = resolveSiteName(globalSettings.siteName);
  const description =
    page.seo.description ?? globalSettings.defaultSeoDescription;
  const openGraphDescription =
    page.seo.openGraph.description ?? description;
  const image = resolveMetadataImage(page, globalSettings);
  const documentTitle = formatDocumentTitle(page.seo.title, siteName);
  const socialTitle = formatDocumentTitle(page.seo.openGraph.title, siteName);

  return {
    title: documentTitle,
    description,
    robots: page.noindex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    alternates: {
      canonical: page.seo.canonicalUrl,
    },
    openGraph: {
      title: socialTitle,
      description: openGraphDescription,
      siteName,
      type: "website",
      url: page.seo.canonicalUrl,
      images: image
        ? [
            {
              url: image.url,
              alt: image.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      site: globalSettings.twitterHandle,
      creator: globalSettings.twitterHandle,
      title: socialTitle,
      description: openGraphDescription,
      images: image ? [image.url] : undefined,
    },
  };
}

function buildFallbackMetadata(
  slug: string,
  globalSettings: GlobalSettings,
): Metadata {
  const siteName = resolveSiteName(globalSettings.siteName);
  const title = formatDocumentTitle(globalSettings.defaultSeoTitle, siteName);
  const description = globalSettings.defaultSeoDescription;
  const image = globalSettings.defaultSeoImage;
  const canonicalUrl = buildCanonicalUrl(slug);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
      url: canonicalUrl,
      images: image
        ? [
            {
              url: image.url,
              alt: image.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      site: globalSettings.twitterHandle,
      creator: globalSettings.twitterHandle,
      title,
      description,
      images: image ? [image.url] : undefined,
    },
  };
}

async function resolveRouteTarget(paramsPromise: MarketingPageProps["params"]) {
  const { slug } = await paramsPromise;
  const normalizedSlug = normalizeSlug(slug);

  return {
    slug: normalizedSlug,
    uri: normalizeWordPressUri(slug),
  };
}

function MarketingPageContent({
  isDraft,
  page,
  template,
}: MarketingPageContentProps) {
  return (
    <main className="flex-1 w-full" data-page-template={template}>
      <PageViewTracker template={template} />
      {isDraft ? <DraftIndicator /> : null}
      <SectionRenderer sections={page.sections} />
    </main>
  );
}

export async function generateMetadata({
  params,
}: MarketingPageProps): Promise<Metadata> {
  const { slug, uri } = await resolveRouteTarget(params);
  const { isEnabled } = await draftMode();
  const [pageResult, globalSettingsResult] = await Promise.allSettled([
    getPageByUri(uri, isEnabled),
    getGlobalSettings(isEnabled),
  ]);
  const globalSettings =
    globalSettingsResult.status === "fulfilled"
      ? globalSettingsResult.value
      : emptyGlobalSettings;

  if (pageResult.status !== "fulfilled" || !pageResult.value) {
    return buildFallbackMetadata(slug, globalSettings);
  }

  return pageToMetadata(pageResult.value, globalSettings);
}

export default async function MarketingPage({ params }: MarketingPageProps) {
  const { uri } = await resolveRouteTarget(params);
  const { isEnabled } = await draftMode();
  const page = await getPageByUri(uri, isEnabled);

  if (!page) {
    notFound();
  }

  return (
    <MarketingPageContent
      isDraft={isEnabled}
      page={page}
      template={page.template}
    />
  );
}
