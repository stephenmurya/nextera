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
  backgroundColor: "#f4f4f2",
  color: "#121212",
  backgroundImage:
    "linear-gradient(rgba(18,18,18,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(18,18,18,0.04) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
};

const cardStyle: CSSProperties = {
  backgroundColor: "rgba(244, 244, 242, 0.92)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 24px 64px rgba(18,18,18,0.06)",
};

const primaryButtonStyle: CSSProperties = {
  backgroundColor: "#121212",
  color: "#f4f4f2",
  WebkitTextFillColor: "#f4f4f2",
};

const lineButtonStyle: CSSProperties = {
  backgroundColor: "transparent",
  border: "1px solid rgba(18,18,18,0.22)",
  color: "#121212",
  WebkitTextFillColor: "#121212",
};

type ModuleGridProps = {
  anchor?: string;
  headline?: string;
  intro?: string;
  items: FeatureGridSection["items"] | UseCasesSection["items"];
  label: string;
};

function BlueprintHero(section: HeroSection) {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]" id={section.anchor}>
      <div className="relative overflow-hidden border border-black/15 bg-white p-6 sm:p-8 lg:p-10" style={cardStyle}>
        <div className="pointer-events-none absolute inset-0 border-[12px] border-transparent [border-image:linear-gradient(135deg,rgba(18,18,18,0.18),transparent)_1]" />
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.32em] text-black/48" style={{ fontFamily: "var(--font-geist-mono)" }}>
            <span>{section.eyebrow ?? "System Overview"}</span>
            <span>[ 01 / ENTRY ]</span>
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-black sm:text-6xl lg:text-7xl">
            {section.headline}
          </h1>
          {section.body ? (
            <p className="max-w-2xl text-lg leading-8 text-black/68">
              {section.body}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            {section.primaryCta ? (
              <PreviewButtonLink
                className="rounded-full px-6 py-3"
                href={section.primaryCta.href}
                style={primaryButtonStyle}
              >
                {section.primaryCta.label}
              </PreviewButtonLink>
            ) : null}
            {section.secondaryCta ? (
              <PreviewButtonLink
                className="rounded-full px-6 py-3"
                href={section.secondaryCta.href}
                style={lineButtonStyle}
              >
                {section.secondaryCta.label}
              </PreviewButtonLink>
            ) : null}
          </div>
        </div>
      </div>
      {section.backgroundImage ? (
        <div
          className="relative min-h-[360px] overflow-hidden border border-black/15 bg-[#ebebe9]"
          style={cardStyle}
        >
          <div className="absolute left-5 top-5 z-10 border border-black/15 bg-white/80 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-black/55" style={{ fontFamily: "var(--font-geist-mono)" }}>
            Render / Exterior
          </div>
          <Image
            alt={section.backgroundImage.alt ?? section.headline}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            src={section.backgroundImage.url}
          />
        </div>
      ) : null}
    </section>
  );
}

function BlueprintModuleGrid({
  anchor,
  headline,
  intro,
  items,
  label,
}: ModuleGridProps) {
  return (
    <section className="space-y-8" id={anchor}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/48"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {label}
          </p>
          {headline ? (
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
              {headline}
            </h2>
          ) : null}
        </div>
        {intro ? (
          <p className="max-w-xl text-base leading-8 text-black/68">{intro}</p>
        ) : null}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item, index) => (
          <article
            className="relative overflow-hidden border border-black/15 bg-white p-6"
            key={`${item.title}-${index}`}
            style={cardStyle}
          >
            <div className="absolute right-4 top-4 text-[11px] uppercase tracking-[0.3em] text-black/38" style={{ fontFamily: "var(--font-geist-mono)" }}>
              [{(index + 1).toString().padStart(2, "0")}]
            </div>
            <div className="space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-[#111111] text-white">
                <SectionIcon className="h-5 w-5" icon={item.icon} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-black">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="text-base leading-8 text-black/68">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BlueprintStats(section: StatsStripSection) {
  return (
    <section className="grid gap-5 lg:grid-cols-4" id={section.anchor}>
      {section.stats.map((stat, index) => (
        <div
          className="relative overflow-hidden border border-black/15 bg-white p-6"
          key={`${stat.value}-${stat.label}-${index}`}
          style={cardStyle}
        >
          <span
            className="text-[11px] uppercase tracking-[0.3em] text-black/42"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {stat.label}
          </span>
          <p className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-black sm:text-6xl">
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
}

function BlueprintHowItWorks(section: HowItWorksSection) {
  return (
    <section className="space-y-8" id={section.anchor}>
      {section.headline ? (
        <div className="space-y-3">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/48"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Sequence
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
            {section.headline}
          </h2>
        </div>
      ) : null}
      <ol className="grid gap-5 lg:grid-cols-3">
        {section.steps.map((step, index) => (
          <li
            className="relative overflow-hidden border border-black/15 bg-white p-6"
            key={`${step.stepNumber}-${step.title}-${index}`}
            style={cardStyle}
          >
            <div className="space-y-4">
              <span
                className="inline-flex rounded-full border border-black/15 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-black/65"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Step {step.stepNumber}
              </span>
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-black">
                {step.title}
              </h3>
              {step.description ? (
                <p className="text-base leading-8 text-black/68">
                  {step.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function BlueprintTestimonial(section: TestimonialSection) {
  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_320px]" id={section.anchor}>
      <figure className="overflow-hidden border border-black/15 bg-white p-8 sm:p-10" style={cardStyle}>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/48"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Field Validation
        </p>
        <blockquote className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] text-black sm:text-4xl">
          &ldquo;{section.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-8 space-y-1">
          <p className="text-lg font-semibold text-black">{section.author}</p>
          {(section.role || section.company) ? (
            <p className="text-sm uppercase tracking-[0.24em] text-black/52">
              {[section.role, section.company].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </figcaption>
      </figure>
      {section.image ? (
        <div className="relative min-h-[320px] overflow-hidden border border-black/15 bg-[#e9e9e7]" style={cardStyle}>
          <Image
            alt={section.image.alt ?? section.author}
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            src={section.image.url}
          />
        </div>
      ) : null}
    </section>
  );
}

function BlueprintFaq(section: FaqSection) {
  return (
    <section className="space-y-6" id={section.anchor}>
      {section.headline ? (
        <div className="space-y-3">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/48"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Questions
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
            {section.headline}
          </h2>
        </div>
      ) : null}
      <div className="grid gap-4">
        {section.faqs.map((faq, index) => (
          <details
            className="overflow-hidden border border-black/15 bg-white p-5"
            key={`${faq.question}-${index}`}
            style={cardStyle}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
              <span className="text-xl font-semibold tracking-[-0.03em] text-black">
                {faq.question}
              </span>
              <span className="text-black/38">+</span>
            </summary>
            <p className="pt-4 text-base leading-8 text-black/68">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function BlueprintRichText(section: RichTextSection) {
  return (
    <section className="overflow-hidden border border-black/15 bg-white p-6 sm:p-10" id={section.anchor} style={cardStyle}>
      <div className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black/72 prose-strong:text-black">
        <div dangerouslySetInnerHTML={{ __html: section.html }} />
      </div>
    </section>
  );
}

function BlueprintCtaBand(section: CtaBandSection) {
  return (
    <section className="overflow-hidden border border-black bg-[#111111] p-8 text-white sm:p-10" id={section.anchor}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Conversion Node
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            {section.headline}
          </h2>
          {section.subheadline ? (
            <p className="max-w-2xl text-lg leading-8 text-white/72">
              {section.subheadline}
            </p>
          ) : null}
        </div>
        {section.primaryCta ? (
          <PreviewButtonLink
            className="rounded-full px-6 py-3"
            href={section.primaryCta.href}
            style={{
              backgroundColor: "#f4f4f2",
              color: "#111111",
              WebkitTextFillColor: "#111111",
            }}
          >
            {section.primaryCta.label}
          </PreviewButtonLink>
        ) : null}
      </div>
    </section>
  );
}

function BlueprintForm(section: FormSection) {
  return (
    <section className="space-y-6" id={section.anchor}>
      <div className="overflow-hidden border border-black/15 bg-white p-6 sm:p-8" style={cardStyle}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/48"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Acquisition
            </p>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
              {section.headline}
            </h2>
          </div>
          {section.body ? (
            <p className="max-w-xl text-base leading-8 text-black/68">{section.body}</p>
          ) : null}
        </div>
      </div>
      <ConceptEmbeddedForm section={section} />
    </section>
  );
}

function BlueprintSectionRenderer({
  sections,
}: {
  sections: PageSection[];
}) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section._type) {
          case "hero":
            return <BlueprintHero key={section.id} {...section} />;
          case "featureGrid":
            return (
              <BlueprintModuleGrid
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
              <BlueprintModuleGrid
                key={section.id}
                anchor={section.anchor}
                headline={section.headline}
                items={section.items}
                label="Applications"
              />
            );
          case "statsStrip":
            return <BlueprintStats key={section.id} {...section} />;
          case "howItWorks":
            return <BlueprintHowItWorks key={section.id} {...section} />;
          case "testimonial":
            return <BlueprintTestimonial key={section.id} {...section} />;
          case "faq":
            return <BlueprintFaq key={section.id} {...section} />;
          case "richText":
            return <BlueprintRichText key={section.id} {...section} />;
          case "ctaBand":
            return <BlueprintCtaBand key={section.id} {...section} />;
          case "formSection":
            return <BlueprintForm key={section.id} {...section} />;
          default:
            return (
              <LiveSectionFallback
                key={`blueprint-fallback-${index}`}
                section={section as PageSection}
              />
            );
        }
      })}
    </>
  );
}

type BlueprintHomepagePreviewProps = {
  page: Page;
};

export function BlueprintHomepagePreview({
  page,
}: BlueprintHomepagePreviewProps) {
  const primaryCta = getConceptPrimaryCta(page);
  const navItems = getSectionNavItems(page.sections);

  return (
    <main className="min-h-full" style={pageStyle}>
      <div className="mx-auto flex w-full max-w-[1320px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header
          className="sticky top-4 z-30 overflow-hidden border border-black/15 px-5 py-4"
          style={cardStyle}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Link className="text-xl font-semibold tracking-[-0.05em] text-black" href="/">
                AgentFlow
              </Link>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/48"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Blueprint / Luxury Real Estate Tech
              </p>
            </div>
            <nav
              aria-label="Blueprint preview navigation"
              className="flex flex-wrap items-center gap-4 text-sm text-black/66"
            >
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <PreviewButtonLink
              className="rounded-full px-5 py-3"
              href={primaryCta.href}
              style={primaryButtonStyle}
            >
              {primaryCta.label}
            </PreviewButtonLink>
          </div>
        </header>

        <div className="flex flex-col gap-10 py-8 md:gap-12 md:py-10">
          <BlueprintSectionRenderer sections={page.sections} />
        </div>

        <footer
          className="overflow-hidden border border-black/15 bg-white p-6 sm:p-8"
          style={cardStyle}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/48"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Concept Preview
              </p>
              <p className="max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-black">
                A more category-specific monochrome direction with architectural rhythm.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PreviewButtonLink
                className="rounded-full px-5 py-3"
                href="/concepts"
                style={lineButtonStyle}
              >
                View All Concepts
              </PreviewButtonLink>
              <PreviewButtonLink
                className="rounded-full px-5 py-3"
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
