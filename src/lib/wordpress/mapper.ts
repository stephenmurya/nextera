import { z } from "zod";
import type {
  CallToAction,
  FaqItem,
  FeatureGridItem,
  HowItWorksStep,
  MediaAsset,
  Page,
  PageSection,
  SeoMetadata,
  StatItem,
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

const RawRichTextSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsRichTextLayout"),
  anchor: z.string().nullish(),
  html: z.string().min(1),
});

const rawFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const rawFaqSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsFaqLayout"),
  anchor: z.string().nullish(),
  headline: z.string().nullish(),
  faqs: z.array(rawFaqItemSchema),
});

const rawCtaBandSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsCtaBandLayout"),
  anchor: z.string().nullish(),
  headline: z.string().min(1),
  subheadline: z.string().nullish(),
  ctaButton: rawCtaSchema.nullish(),
});

const rawTestimonialSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsTestimonialLayout"),
  anchor: z.string().nullish(),
  quote: z.string().min(1),
  author: z.string().min(1),
  role: z.string().nullish(),
  company: z.string().nullish(),
  image: rawMediaEdgeSchema.nullish(),
});

const rawUseCasesSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsUseCasesLayout"),
  anchor: z.string().nullish(),
  headline: z.string().nullish(),
  items: z.array(rawFeatureItemSchema),
});

const rawHowItWorksStepSchema = z.object({
  stepNumber: z.union([z.string().min(1), z.number()]),
  title: z.string().min(1),
  description: z.string().nullish(),
});

const rawHowItWorksSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsHowItWorksLayout"),
  anchor: z.string().nullish(),
  headline: z.string().nullish(),
  steps: z.array(rawHowItWorksStepSchema),
});

const rawStatSchema = z.object({
  value: z.union([z.string().min(1), z.number()]),
  label: z.string().min(1),
});

const rawStatsStripSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsStatsStripLayout"),
  anchor: z.string().nullish(),
  stats: z.array(rawStatSchema),
});

const rawFormSectionSchema = z.object({
  __typename: z.literal("PageBuilderSectionsFormSectionLayout"),
  anchor: z.string().nullish(),
  formType: z.enum(["waitlist", "demo", "contact"]),
  headline: z.string().min(1),
  body: z.string().nullish(),
});

const rawSectionSchema = z.discriminatedUnion("__typename", [
  rawHeroSectionSchema,
  rawFeatureGridSectionSchema,
  RawRichTextSectionSchema,
  rawFaqSectionSchema,
  rawCtaBandSectionSchema,
  rawTestimonialSectionSchema,
  rawUseCasesSectionSchema,
  rawHowItWorksSectionSchema,
  rawStatsStripSectionSchema,
  rawFormSectionSchema,
]);

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
type RawSection = z.infer<typeof rawSectionSchema>;

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

function mapFaqItem(item: z.infer<typeof rawFaqItemSchema>): FaqItem {
  return {
    question: item.question,
    answer: item.answer,
  };
}

function normalizeDisplayValue(value: string | number) {
  return typeof value === "number" ? value.toString() : value.trim();
}

function mapHowItWorksStep(
  step: z.infer<typeof rawHowItWorksStepSchema>,
): HowItWorksStep {
  return {
    stepNumber: normalizeDisplayValue(step.stepNumber),
    title: step.title,
    description: normalizeOptionalString(step.description),
  };
}

function mapStat(item: z.infer<typeof rawStatSchema>): StatItem {
  return {
    value: normalizeDisplayValue(item.value),
    label: item.label,
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
  rawSectionRecord: RawSectionRecord,
  index: number,
): PageSection | null {
  const parsedSection = rawSectionSchema.safeParse(rawSectionRecord);

  if (!parsedSection.success) {
    logDroppedSection(
      index,
      typeof rawSectionRecord.__typename === "string"
        ? rawSectionRecord.__typename
        : undefined,
      parsedSection.error.issues,
    );

    return null;
  }

  return mapParsedSection(parsedSection.data, index);
}

function mapParsedSection(rawSection: RawSection, index: number): PageSection {
  const anchor = normalizeOptionalString(rawSection.anchor);

  switch (rawSection.__typename) {
    case "PageBuilderSectionsHeroLayout":
      return {
        id: buildSectionId("hero", index, anchor),
        _type: "hero",
        anchor,
        eyebrow: normalizeOptionalString(rawSection.eyebrow),
        headline: rawSection.headline,
        body: normalizeOptionalString(rawSection.body),
        primaryCta: mapCallToAction(rawSection.primaryCta),
        secondaryCta: mapCallToAction(rawSection.secondaryCta),
        backgroundImage: mapMediaAsset(rawSection.backgroundImage?.node),
      };
    case "PageBuilderSectionsFeatureGridLayout":
      return {
        id: buildSectionId("featureGrid", index, anchor),
        _type: "featureGrid",
        anchor,
        headline: normalizeOptionalString(rawSection.headline),
        intro: normalizeOptionalString(rawSection.intro),
        items: rawSection.items.map(mapFeatureItem),
      };
    case "PageBuilderSectionsRichTextLayout":
      return {
        id: buildSectionId("richText", index, anchor),
        _type: "richText",
        anchor,
        html: rawSection.html,
      };
    case "PageBuilderSectionsFaqLayout":
      return {
        id: buildSectionId("faq", index, anchor),
        _type: "faq",
        anchor,
        headline: normalizeOptionalString(rawSection.headline),
        faqs: rawSection.faqs.map(mapFaqItem),
      };
    case "PageBuilderSectionsCtaBandLayout":
      return {
        id: buildSectionId("ctaBand", index, anchor),
        _type: "ctaBand",
        anchor,
        headline: rawSection.headline,
        subheadline: normalizeOptionalString(rawSection.subheadline),
        primaryCta: mapCallToAction(rawSection.ctaButton),
      };
    case "PageBuilderSectionsTestimonialLayout":
      return {
        id: buildSectionId("testimonial", index, anchor),
        _type: "testimonial",
        anchor,
        quote: rawSection.quote,
        author: rawSection.author,
        role: normalizeOptionalString(rawSection.role),
        company: normalizeOptionalString(rawSection.company),
        image: mapMediaAsset(rawSection.image?.node),
      };
    case "PageBuilderSectionsUseCasesLayout":
      return {
        id: buildSectionId("useCases", index, anchor),
        _type: "useCases",
        anchor,
        headline: normalizeOptionalString(rawSection.headline),
        items: rawSection.items.map(mapFeatureItem),
      };
    case "PageBuilderSectionsHowItWorksLayout":
      return {
        id: buildSectionId("howItWorks", index, anchor),
        _type: "howItWorks",
        anchor,
        headline: normalizeOptionalString(rawSection.headline),
        steps: rawSection.steps.map(mapHowItWorksStep),
      };
    case "PageBuilderSectionsStatsStripLayout":
      return {
        id: buildSectionId("statsStrip", index, anchor),
        _type: "statsStrip",
        anchor,
        stats: rawSection.stats.map(mapStat),
      };
    case "PageBuilderSectionsFormSectionLayout":
      return {
        id: buildSectionId("formSection", index, anchor),
        _type: "formSection",
        anchor,
        formType: rawSection.formType,
        headline: rawSection.headline,
        body: normalizeOptionalString(rawSection.body),
      };
  }
}

export function mapWordPressPageResponse(
  response: unknown,
  { siteUrl }: MapWordPressPageOptions,
): Page | null {
  const parsedResponse = rawPageResponseSchema.safeParse(response);

  if (!parsedResponse.success) {
    throw new WordPressMappingError(
      "WordPress response failed validation.",
      parsedResponse.error.issues,
    );
  }

  if (!parsedResponse.data.page) {
    return null;
  }

  const rawPage = parsedResponse.data.page;
  const slug = normalizeUriToSlug(rawPage.uri);
  const rawSections = rawPage.pageBuilder?.sections ?? [];
  const sections = rawSections.reduce<PageSection[]>(
    (accumulator, rawSection, index) => {
      const mappedSection = mapSection(rawSection, index);

      if (mappedSection) {
        accumulator.push(mappedSection);
      }

      return accumulator;
    },
    [],
  );

  return {
    title: rawPage.title,
    slug,
    seo: mapSeo(rawPage, siteUrl),
    sections,
  };
}
