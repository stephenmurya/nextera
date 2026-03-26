import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { DraftIndicator } from "@/components/DraftIndicator";
import { SectionRenderer } from "@/components/SectionRenderer";
import { env } from "@/lib/env";
import { getPageBySlug, normalizeSlug } from "@/lib/wordpress/client";
import type { Page } from "@/types/cms";

type MarketingPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

function buildCanonicalUrl(slug: string): string {
  const pathname = slug ? `/${slug}` : "/";

  return new URL(pathname, env.NEXT_PUBLIC_SITE_URL).toString();
}

function pageToMetadata(page: Page): Metadata {
  return {
    title: page.seo.title,
    description: page.seo.description,
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

async function resolveSlug(paramsPromise: MarketingPageProps["params"]) {
  const { slug } = await paramsPromise;

  return normalizeSlug(slug);
}

export async function generateMetadata({
  params,
}: MarketingPageProps): Promise<Metadata> {
  const slug = await resolveSlug(params);
  const { isEnabled } = await draftMode();

  try {
    const page = await getPageBySlug(slug, isEnabled);

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
  const slug = await resolveSlug(params);
  const { isEnabled } = await draftMode();
  const page = await getPageBySlug(slug, isEnabled);

  if (!page) {
    notFound();
  }

  return (
    <>
      {isEnabled ? <DraftIndicator /> : null}
      <div className="space-y-10">
        <header className="rounded-[2rem] border border-border/80 bg-surface/95 px-8 py-10 shadow-[0_24px_80px_rgba(33,28,22,0.08)]">
          <div className="max-w-3xl space-y-4">
            <span className="rounded-full border border-border/80 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Headless Marketing Route
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {page.title}
              </h1>
              <p className="text-base leading-7 text-muted sm:text-lg">
                This route is rendering WordPress-backed section data through the
                normalized CMS pipeline.
              </p>
            </div>
          </div>
        </header>
        <SectionRenderer sections={page.sections} />
      </div>
    </>
  );
}
