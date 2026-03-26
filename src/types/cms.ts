export interface MediaAsset {
  url: string;
  alt?: string;
}

export interface CallToAction {
  label: string;
  href: string;
}

export interface SeoMetadata {
  title: string;
  description?: string;
  canonicalUrl: string;
  openGraph: {
    title: string;
    description?: string;
    image?: MediaAsset;
  };
}

export interface FeatureGridItem {
  title: string;
  description?: string;
  icon?: string;
}

interface BaseSection {
  id: string;
  anchor?: string;
}

export interface HeroSection extends BaseSection {
  _type: "hero";
  eyebrow?: string;
  headline: string;
  body?: string;
  primaryCta?: CallToAction;
  secondaryCta?: CallToAction;
  backgroundImage?: MediaAsset;
}

export interface FeatureGridSection extends BaseSection {
  _type: "featureGrid";
  headline?: string;
  intro?: string;
  items: FeatureGridItem[];
}

export interface RichTextSection extends BaseSection {
  _type: "richText";
  html: string;
}

export type PageSection = HeroSection | FeatureGridSection | RichTextSection;

export interface Page {
  title: string;
  slug: string;
  seo: SeoMetadata;
  sections: PageSection[];
}
