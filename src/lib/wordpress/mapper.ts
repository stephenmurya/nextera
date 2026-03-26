import { z } from "zod";
import type {
  CallToAction,
  FeatureGridItem,
  MediaAsset,
  Page,
  PageSection,
  SeoMetadata,
} from "@/types/cms";

const rawMediaSchema = z.object({
  sourceUrl: z.string().url(),
  altText: z.string().nullish(),
});

const rawMediaEdgeSchema = z.object({
  node: rawMediaSchema,
});

const rawCtaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const rawFeatureItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  icon: z.string().nullish(),
});

const rawHeroSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsHeroLayout"),
  anchor: z.string().nullish(),
  eyebrow: z.string().nullish(),
  headline: z.string().min(1),
  body: z.string().nullish(),
  primaryCta: rawCtaSchema.nullish(),
  secondaryCta: rawCtaSchema.nullish(),
  backgroundImage: rawMediaEdgeSchema.nullish(),
});

const rawFeatureGridSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsFeatureGridLayout"),
  anchor: z.string().nullish(),
  headline: z.string().nullish(),
  intro: z.string().nullish(),
  items: z.array(rawFeatureItemSchema),
});

const rawRichTextSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsRichtextLayout"),
  anchor: z.string().nullish(),
  html: z.string().min(1),
});

const rawSeoImageSchema = z
  .object({
    sourceUrl: z.string().nullish(),
  })
  .nullish();

const rawSeoSchema = z
  .object({
    title: z.string().nullish(),
    metaDesc: z.string().nullish(),
    canonical: z.string().nullish(),
    opengraphTitle: z.string().nullish(),
    opengraphDescription: z.string().nullish(),
    opengraphImage: rawSeoImageSchema,
  })
  .nullish();

const rawPageNodeSchema = z.object({
  title: z.string().min(1),
  slug: z.string().nullish(),
  uri: z.string().min(1),
  seo: rawSeoSchema,
  pageBuilder: z
    .object({
      sections: z.array(z.record(z.string(), z.unknown())).nullish().transform(val => val ?? []),
    })
    .nullish(),
});

const rawPageResponseSchema = z.object({
  page: rawPageNodeSchema.nullable(),
});

type RawPageNode = z.infer<typeof rawPageNodeSchema>;
type RawSectionRecord = Record<string, unknown>;

type MapWordPressPageOptions = {
  siteUrl: string;
};

export class WordPressMappingError extends Error {
  constructor(
    message: string,
    public readonly issues: z.ZodIssue[],
  ) {
    super(message);
    this.name = "WordPressMappingError";
  }
}

function normalizeOptionalString(value: string | null | undefined) {
  const nextValue = value?.trim();

  return nextValue ? nextValue : undefined;
}

function normalizeUriToSlug(uri: string) {
  const normalized = uri.trim().replace(/^\/+|\/+$/g, "");

  return normalized === "" ? "" : normalized;
}

function buildCanonicalUrl(slug: string, siteUrl: string) {
  const pathname = slug ? `/${slug}` : "/";

  return new URL(pathname, siteUrl).toString();
}

function mapMediaAsset(
  asset: z.infer<typeof rawMediaSchema> | null | undefined,
): MediaAsset | undefined {
  if (!asset) {
    return undefined;
  }

  return {
    url: asset.sourceUrl,
    alt: normalizeOptionalString(asset.altText),
  };
}

function mapSeoImageAsset(
  asset: z.infer<typeof rawSeoImageSchema>,
): MediaAsset | undefined {
  const url = normalizeOptionalString(asset?.sourceUrl);

  if (!url) {
    return undefined;
  }

  return {
    url,
  };
}

function mapCallToAction(
  cta: z.infer<typeof rawCtaSchema> | null | undefined,
): CallToAction | undefined {
  if (!cta) {
    return undefined;
  }

  return {
    label: cta.label,
    href: cta.href,
  };
}

function mapFeatureItem(
  item: z.infer<typeof rawFeatureItemSchema>,
): FeatureGridItem {
  return {
    title: item.title,
    description: normalizeOptionalString(item.description),
    icon: normalizeOptionalString(item.icon),
  };
}

function mapSeo(rawPage: RawPageNode, siteUrl: string): SeoMetadata {
  const slug = normalizeUriToSlug(rawPage.uri);
  const title = normalizeOptionalString(rawPage.seo?.title) ?? rawPage.title;
  const description = normalizeOptionalString(rawPage.seo?.metaDesc);

  return {
    title,
    description,
    canonicalUrl:
      normalizeOptionalString(rawPage.seo?.canonical) ?? buildCanonicalUrl(slug, siteUrl),
    openGraph: {
      title: normalizeOptionalString(rawPage.seo?.opengraphTitle) ?? title,
      description:
        normalizeOptionalString(rawPage.seo?.opengraphDescription) ?? description,
      image: mapSeoImageAsset(rawPage.seo?.opengraphImage),
    },
  };
}

function buildSectionId(
  sectionType: PageSection["_type"],
  index: number,
  anchor?: string,
) {
  return anchor ?? `${sectionType}-${index}`;
}

function logDroppedSection(
  index: number,
  sectionType: string | undefined,
  issues?: z.ZodIssue[],
) {
  console.warn("[wordpress] Dropped invalid section", {
    index,
    sectionType,
    issues: issues?.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  });
}

function mapSection(
  rawSection: RawSectionRecord,
  index: number,
): PageSection | null {
  const heroSection = rawHeroSectionSchema.safeParse(rawSection);

  if (heroSection.success) {
    const anchor = normalizeOptionalString(heroSection.data.anchor);

    return {
      id: buildSectionId("hero", index, anchor),
      _type: "hero",
      anchor,
      eyebrow: normalizeOptionalString(heroSection.data.eyebrow),
      headline: heroSection.data.headline,
      body: normalizeOptionalString(heroSection.data.body),
      primaryCta: mapCallToAction(heroSection.data.primaryCta),
      secondaryCta: mapCallToAction(heroSection.data.secondaryCta),
      backgroundImage: mapMediaAsset(heroSection.data.backgroundImage?.node),
    };
  }

  const featureGridSection = rawFeatureGridSectionSchema.safeParse(rawSection);

  if (featureGridSection.success) {
    const anchor = normalizeOptionalString(featureGridSection.data.anchor);

    return {
      id: buildSectionId("featureGrid", index, anchor),
      _type: "featureGrid",
      anchor,
      headline: normalizeOptionalString(featureGridSection.data.headline),
      intro: normalizeOptionalString(featureGridSection.data.intro),
      items: featureGridSection.data.items.map(mapFeatureItem),
    };
  }

  const richTextSection = rawRichTextSectionSchema.safeParse(rawSection);

  if (richTextSection.success) {
    const anchor = normalizeOptionalString(richTextSection.data.anchor);

    return {
      id: buildSectionId("richText", index, anchor),
      _type: "richText",
      anchor,
      html: richTextSection.data.html,
    };
  }

  logDroppedSection(
    index,
    typeof rawSection.__typename === "string" ? rawSection.__typename : undefined,
  );

  return null;
}

export function mapWordPressPageResponse(
  response: unknown,
  { siteUrl }: MapWordPressPageOptions,
): Page | null {
  const parsedResponse = rawPageResponseSchema.safeParse(response);

if (!parsedResponse.success) {
  // CRACK OPEN THE ZOD ERROR
  console.error("ZOD ISSUES:", JSON.stringify(parsedResponse.error.issues, null, 2));
  
  throw new WordPressMappingError(
    "WordPress response failed validation.",
    parsedResponse.error.issues
  );
}

  if (!parsedResponse.data.page) {
    return null;
  }

  const rawPage = parsedResponse.data.page;
  const slug = normalizeUriToSlug(rawPage.uri);
  const rawSections = rawPage.pageBuilder?.sections ?? [];
  const sections = rawSections.reduce<PageSection[]>((accumulator, rawSection, index) => {
    const mappedSection = mapSection(rawSection, index);

    if (mappedSection) {
      accumulator.push(mappedSection);
    }

    return accumulator;
  }, []);

  return {
    title: rawPage.title,
    slug,
    seo: mapSeo(rawPage, siteUrl),
    sections,
  };
}
