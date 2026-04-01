import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { DraftIndicator } from "@/components/DraftIndicator";
import { PageViewTracker } from "@/components/observability/PageViewTracker";
import { SectionRenderer } from "@/components/SectionRenderer";
import { env } from "@/lib/env";
import {
  getPageByUri,
  normalizeSlug,
  normalizeWordPressUri,
} from "@/lib/wordpress/client";
import type { Page } from "@/types/cms";

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

function buildCanonicalUrl(slug: string): string {
  const pathname = slug ? `/${slug}` : "/";

  return new URL(pathname, env.NEXT_PUBLIC_SITE_URL).toString();
}

function pageToMetadata(page: Page): Metadata {
  return {
    title: page.seo.title,
    description: page.seo.description,
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
      title: page.seo.openGraph.title,
      description: page.seo.openGraph.description,
      type: "website",
      url: page.seo.canonicalUrl,
      images: page.seo.openGraph.image
        ? [
            {
              url: page.seo.openGraph.image.url,
              alt: page.seo.openGraph.image.alt,
            },
          ]
        : undefined,
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

  try {
    const page = await getPageByUri(uri, isEnabled);

    if (!page) {
      return {
        alternates: {
          canonical: buildCanonicalUrl(slug),
        },
      };
    }

    return pageToMetadata(page);
  } catch {
    return {
      alternates: {
        canonical: buildCanonicalUrl(slug),
      },
    };
  }
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
