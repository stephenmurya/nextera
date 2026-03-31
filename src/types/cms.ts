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

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TestimonialAuthorImage extends MediaAsset {}

export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  description?: string;
}

export interface StatItem {
  value: string;
  label: string;
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

export interface FaqSection extends BaseSection {
  _type: "faq";
  headline?: string;
  faqs: FaqItem[];
}

export interface CtaBandSection extends BaseSection {
  _type: "ctaBand";
  headline: string;
  subheadline?: string;
  primaryCta?: CallToAction;
}

export interface TestimonialSection extends BaseSection {
  _type: "testimonial";
  quote: string;
  author: string;
  role?: string;
  company?: string;
  image?: TestimonialAuthorImage;
}

export interface UseCasesSection extends BaseSection {
  _type: "useCases";
  headline?: string;
  items: FeatureGridItem[];
}

export interface HowItWorksSection extends BaseSection {
  _type: "howItWorks";
  headline?: string;
  steps: HowItWorksStep[];
}

export interface StatsStripSection extends BaseSection {
  _type: "statsStrip";
  stats: StatItem[];
}

export interface FormSection extends BaseSection {
  _type: "formSection";
  formType: "waitlist" | "demo" | "contact";
  headline: string;
  body?: string;
}

export type PageSection =
  | HeroSection
  | FeatureGridSection
  | RichTextSection
  | FaqSection
  | CtaBandSection
  | TestimonialSection
  | UseCasesSection
  | HowItWorksSection
  | StatsStripSection
  | FormSection;

export interface Page {
  title: string;
  slug: string;
  seo: SeoMetadata;
  sections: PageSection[];
}
