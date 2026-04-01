import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionIcon } from "@/components/sections/SectionIcons";
import { ConceptEmbeddedForm } from "@/demo/shared/ConceptEmbeddedForm";
import { getConceptPrimaryCta, getSectionNavItems } from "@/demo/shared/page-data";
import { PreviewButtonLink } from "@/demo/shared/PreviewButtonLink";
import { LiveSectionFallback } from "@/demo/shared/LiveSectionFallback";
import type {
  CtaBandSection,
  FaqSection,
  FeatureGridSection,
  FormSection,
  HeroSection,
  HowItWorksSection,
  Page,
  PageSection,
  RichTextSection,
  StatsStripSection,
  TestimonialSection,
  UseCasesSection,
} from "@/types/cms";

const pageStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#0f0f0f",
  backgroundImage:
    "linear-gradient(to right, rgba(15,15,15,0.05) 1px, transparent 1px)",
  backgroundSize: "96px 96px",
};

const shellStyle: CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.94)",
};

const primaryButtonStyle: CSSProperties = {
  backgroundColor: "#0f0f0f",
  color: "#ffffff",
  WebkitTextFillColor: "#ffffff",
};

const secondaryButtonStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #0f0f0f",
  color: "#0f0f0f",
  WebkitTextFillColor: "#0f0f0f",
};

type ItemGridProps = {
  anchor?: string;
  headline?: string;
  intro?: string;
  items: FeatureGridSection["items"] | UseCasesSection["items"];
  label: string;
};

function GridlineHero(section: HeroSection) {
  return (
    <section
      className="grid gap-8 border border-black bg-white p-6 sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]"
      id={section.anchor}
    >
      <div className="space-y-6">
        {section.eyebrow ? (
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {section.eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-black sm:text-6xl lg:text-7xl">
          {section.headline}
        </h1>
        {section.body ? (
          <p className="max-w-2xl text-lg leading-8 text-black/68">
            {section.body}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          {section.primaryCta ? (
            <PreviewButtonLink
              className="rounded-none px-6 py-3 uppercase tracking-[0.18em]"
              href={section.primaryCta.href}
              style={primaryButtonStyle}
            >
              {section.primaryCta.label}
            </PreviewButtonLink>
          ) : null}
          {section.secondaryCta ? (
            <PreviewButtonLink
              className="rounded-none px-6 py-3 uppercase tracking-[0.18em]"
              href={section.secondaryCta.href}
              style={secondaryButtonStyle}
            >
              {section.secondaryCta.label}
            </PreviewButtonLink>
          ) : null}
        </div>
      </div>
      {section.backgroundImage ? (
        <div className="relative min-h-[320px] overflow-hidden border border-black bg-[#f3f3f3]">
          <Image
            alt={section.backgroundImage.alt ?? section.headline}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 42vw"
            src={section.backgroundImage.url}
          />
        </div>
      ) : null}
    </section>
  );
}

function GridlineItemGrid({
  anchor,
  headline,
  intro,
  items,
  label,
}: ItemGridProps) {
  return (
    <section className="space-y-8" id={anchor}>
      <div className="space-y-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/55"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {label}
        </p>
        {headline ? (
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
            {headline}
          </h2>
        ) : null}
        {intro ? (
          <p className="max-w-3xl text-lg leading-8 text-black/68">{intro}</p>
        ) : null}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item, index) => (
          <article
            className="flex h-full flex-col border border-black bg-white p-6"
            key={`${item.title}-${index}`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-black pb-5">
              <div className="flex h-11 w-11 items-center justify-center border border-black bg-black text-white">
                <SectionIcon className="h-5 w-5" icon={item.icon} />
              </div>
              <span
                className="text-[11px] uppercase tracking-[0.3em] text-black/45"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {(index + 1).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="mt-5 space-y-3">
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-black">
                {item.title}
              </h3>
              {item.description ? (
                <p className="text-base leading-8 text-black/68">
                  {item.description}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GridlineStats(section: StatsStripSection) {
  return (
    <section
      className="grid gap-px overflow-hidden border border-black bg-black sm:grid-cols-2 xl:grid-cols-4"
      id={section.anchor}
    >
      {section.stats.map((stat, index) => (
        <div className="bg-white p-6" key={`${stat.value}-${stat.label}-${index}`}>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {stat.label}
          </p>
          <p className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-black sm:text-6xl">
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
}

function GridlineHowItWorks(section: HowItWorksSection) {
  return (
    <section className="space-y-8" id={section.anchor}>
      {section.headline ? (
        <div className="space-y-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Workflow
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
            {section.headline}
          </h2>
        </div>
      ) : null}
      <ol className="grid gap-5 lg:grid-cols-3">
        {section.steps.map((step, index) => (
          <li
            className="flex h-full flex-col border border-black bg-white p-6"
            key={`${step.stepNumber}-${step.title}-${index}`}
          >
            <span
              className="inline-flex w-fit border border-black px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-black"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {step.stepNumber}
            </span>
            <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-black">
              {step.title}
            </h3>
            {step.description ? (
              <p className="mt-4 text-base leading-8 text-black/68">
                {step.description}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

function GridlineTestimonial(section: TestimonialSection) {
  return (
    <section
      className="grid gap-px overflow-hidden border border-black bg-black lg:grid-cols-[minmax(0,1.25fr)_300px]"
      id={section.anchor}
    >
      <div className="bg-white p-8 sm:p-10">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/55"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Customer Story
        </p>
        <blockquote className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] text-black sm:text-4xl">
          &ldquo;{section.quote}&rdquo;
        </blockquote>
        <div className="mt-8 space-y-1">
          <p className="text-lg font-semibold text-black">{section.author}</p>
          {(section.role || section.company) ? (
            <p className="text-sm uppercase tracking-[0.24em] text-black/55">
              {[section.role, section.company].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
      </div>
      {section.image ? (
        <div className="relative min-h-[320px] bg-[#efefef]">
          <Image
            alt={section.image.alt ?? section.author}
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 300px"
            src={section.image.url}
          />
        </div>
      ) : (
        <div className="hidden bg-white lg:block" />
      )}
    </section>
  );
}

function GridlineFaq(section: FaqSection) {
  return (
    <section className="space-y-6" id={section.anchor}>
      {section.headline ? (
        <div className="space-y-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            FAQ
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
            {section.headline}
          </h2>
        </div>
      ) : null}
      <div className="grid gap-4">
        {section.faqs.map((faq, index) => (
          <details className="border border-black bg-white p-5" key={`${faq.question}-${index}`}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
              <span className="text-xl font-semibold tracking-[-0.03em] text-black">
                {faq.question}
              </span>
              <span className="text-black/45">+</span>
            </summary>
            <p className="pt-4 text-base leading-8 text-black/68">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function GridlineRichText(section: RichTextSection) {
  return (
    <section className="border border-black bg-white p-6 sm:p-10" id={section.anchor}>
      <div className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black/72 prose-strong:text-black">
        <div dangerouslySetInnerHTML={{ __html: section.html }} />
      </div>
    </section>
  );
}

function GridlineCtaBand(section: CtaBandSection) {
  return (
    <section className="border border-black bg-black p-8 text-white sm:p-10" id={section.anchor}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Action Block
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            {section.headline}
          </h2>
          {section.subheadline ? (
            <p className="max-w-2xl text-lg leading-8 text-white/70">
              {section.subheadline}
            </p>
          ) : null}
        </div>
        {section.primaryCta ? (
          <PreviewButtonLink
            className="rounded-none px-6 py-3 uppercase tracking-[0.18em]"
            href={section.primaryCta.href}
            style={{
              backgroundColor: "#ffffff",
              color: "#0f0f0f",
              WebkitTextFillColor: "#0f0f0f",
            }}
          >
            {section.primaryCta.label}
          </PreviewButtonLink>
        ) : null}
      </div>
    </section>
  );
}

function GridlineForm(section: FormSection) {
  return (
    <section className="space-y-6" id={section.anchor}>
      <div className="flex flex-col gap-4 border border-black bg-white p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Conversion
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
            {section.headline}
          </h2>
        </div>
        {section.body ? (
          <p className="max-w-xl text-base leading-8 text-black/68">{section.body}</p>
        ) : null}
      </div>
      <ConceptEmbeddedForm section={section} />
    </section>
  );
}

function GridlineSectionRenderer({
  sections,
}: {
  sections: PageSection[];
}) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section._type) {
          case "hero":
            return <GridlineHero key={section.id} {...section} />;
          case "featureGrid":
            return (
              <GridlineItemGrid
                key={section.id}
                anchor={section.anchor}
                headline={section.headline}
                intro={section.intro}
                items={section.items}
                label="Platform"
              />
            );
          case "useCases":
            return (
              <GridlineItemGrid
                key={section.id}
                anchor={section.anchor}
                headline={section.headline}
                items={section.items}
                label="Use Cases"
              />
            );
          case "statsStrip":
            return <GridlineStats key={section.id} {...section} />;
          case "howItWorks":
            return <GridlineHowItWorks key={section.id} {...section} />;
          case "testimonial":
            return <GridlineTestimonial key={section.id} {...section} />;
          case "faq":
            return <GridlineFaq key={section.id} {...section} />;
          case "richText":
            return <GridlineRichText key={section.id} {...section} />;
          case "ctaBand":
            return <GridlineCtaBand key={section.id} {...section} />;
          case "formSection":
            return <GridlineForm key={section.id} {...section} />;
          default:
            return (
              <LiveSectionFallback
                key={`gridline-fallback-${index}`}
                section={section as PageSection}
              />
            );
        }
      })}
    </>
  );
}

type GridlineHomepagePreviewProps = {
  page: Page;
};

export function GridlineHomepagePreview({
  page,
}: GridlineHomepagePreviewProps) {
  const primaryCta = getConceptPrimaryCta(page);
  const navItems = getSectionNavItems(page.sections);

  return (
    <main className="min-h-full" style={pageStyle}>
      <div className="mx-auto flex w-full max-w-[1320px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header
          className="sticky top-0 z-30 border border-black px-5 py-4"
          style={shellStyle}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Link className="text-xl font-semibold tracking-[-0.05em] text-black" href="/">
                AgentFlow
              </Link>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/55"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Gridline / Modern Product Minimal
              </p>
            </div>
            <nav
              aria-label="Gridline preview navigation"
              className="flex flex-wrap items-center gap-4 text-sm text-black/66"
            >
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <PreviewButtonLink
              className="rounded-none px-5 py-3 uppercase tracking-[0.18em]"
              href={primaryCta.href}
              style={primaryButtonStyle}
            >
              {primaryCta.label}
            </PreviewButtonLink>
          </div>
        </header>

        <div className="flex flex-col gap-10 py-8 md:gap-12 md:py-10">
          <GridlineSectionRenderer sections={page.sections} />
        </div>

        <footer className="border border-black bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/55"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Concept Preview
              </p>
              <p className="max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-black">
                A sharper product-system expression built around strict layout rhythm.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PreviewButtonLink
                className="rounded-none px-5 py-3 uppercase tracking-[0.18em]"
                href="/concepts"
                style={secondaryButtonStyle}
              >
                View All Concepts
              </PreviewButtonLink>
              <PreviewButtonLink
                className="rounded-none px-5 py-3 uppercase tracking-[0.18em]"
                href={primaryCta.href}
                style={primaryButtonStyle}
              >
                {primaryCta.label}
              </PreviewButtonLink>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
