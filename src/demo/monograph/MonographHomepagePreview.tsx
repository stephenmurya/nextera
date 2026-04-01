import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionIcon } from "@/components/sections/SectionIcons";
import { ConceptEmbeddedForm } from "@/demo/shared/ConceptEmbeddedForm";
import { getConceptPrimaryCta, getSectionNavItems } from "@/demo/shared/page-data";
import { PreviewButtonLink } from "@/demo/shared/PreviewButtonLink";
import { LiveSectionFallback } from "@/demo/shared/LiveSectionFallback";
import type {
  FeatureGridSection,
  FormSection,
  FaqSection,
  HeroSection,
  HowItWorksSection,
  Page,
  PageSection,
  RichTextSection,
  StatsStripSection,
  TestimonialSection,
  UseCasesSection,
  CtaBandSection,
} from "@/types/cms";

const serifFamily =
  'Iowan Old Style, Palatino Linotype, Book Antiqua, Georgia, serif';

const pageStyle: CSSProperties = {
  backgroundColor: "#f6f3ec",
  color: "#121212",
};

const headerStyle: CSSProperties = {
  backgroundColor: "rgba(246, 243, 236, 0.92)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(18, 18, 18, 0.12)",
  boxShadow: "0 20px 60px rgba(18, 18, 18, 0.06)",
};

const primaryButtonStyle: CSSProperties = {
  backgroundColor: "#111111",
  color: "#f7f3eb",
  WebkitTextFillColor: "#f7f3eb",
};

const secondaryButtonStyle: CSSProperties = {
  backgroundColor: "transparent",
  border: "1px solid rgba(17, 17, 17, 0.18)",
  color: "#111111",
  WebkitTextFillColor: "#111111",
};

function MonographHero(section: HeroSection) {
  return (
    <section
      className="grid gap-10 border-b border-black/10 pb-12 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] md:items-end md:pb-16"
      id={section.anchor}
    >
      <div className="space-y-8">
        {section.eyebrow ? (
          <p
            className="text-xs font-semibold uppercase tracking-[0.34em] text-black/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {section.eyebrow}
          </p>
        ) : null}
        <div className="space-y-6">
          <h1
            className="max-w-4xl text-5xl leading-none sm:text-6xl lg:text-7xl"
            style={{ fontFamily: serifFamily, letterSpacing: "-0.04em" }}
          >
            {section.headline}
          </h1>
          {section.body ? (
            <p className="max-w-2xl text-lg leading-9 text-black/68">
              {section.body}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
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
              style={secondaryButtonStyle}
            >
              {section.secondaryCta.label}
            </PreviewButtonLink>
          ) : null}
        </div>
      </div>
      {section.backgroundImage ? (
        <div className="space-y-4">
          <div
            className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-black/10 bg-[#ece7dc]"
            style={{ boxShadow: "0 28px 80px rgba(17, 17, 17, 0.08)" }}
          >
            <Image
              alt={section.backgroundImage.alt ?? section.headline}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 42vw"
              src={section.backgroundImage.url}
            />
          </div>
          <p
            className="text-xs uppercase tracking-[0.28em] text-black/45"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Editorial Concept Preview
          </p>
        </div>
      ) : null}
    </section>
  );
}

function MonographFeatureColumns({
  anchor,
  headline,
  intro,
  items,
  label,
}: {
  anchor?: string;
  headline?: string;
  intro?: string;
  items: FeatureGridSection["items"] | UseCasesSection["items"];
  label: string;
}) {
  return (
    <section className="space-y-8" id={anchor}>
      <div className="max-w-3xl space-y-4">
        <p
          className="text-xs font-semibold uppercase tracking-[0.34em] text-black/55"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {label}
        </p>
        {headline ? (
          <h2
            className="text-4xl leading-tight sm:text-5xl"
            style={{ fontFamily: serifFamily, letterSpacing: "-0.04em" }}
          >
            {headline}
          </h2>
        ) : null}
        {intro ? (
          <p className="text-lg leading-9 text-black/68">{intro}</p>
        ) : null}
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <article
            className="space-y-5 border-t border-black/15 pt-5"
            key={`${item.title}-${index}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-black">
                <SectionIcon className="h-5 w-5" icon={item.icon} />
              </div>
              <span
                className="text-xs uppercase tracking-[0.34em] text-black/40"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="space-y-3">
              <h3
                className="text-2xl leading-tight"
                style={{ fontFamily: serifFamily }}
              >
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

function MonographStats(section: StatsStripSection) {
  return (
    <section
      className="grid gap-6 border-y border-black/12 py-8 md:grid-cols-2 xl:grid-cols-4"
      id={section.anchor}
    >
      {section.stats.map((stat, index) => (
        <div key={`${stat.value}-${stat.label}-${index}`}>
          <p className="text-sm uppercase tracking-[0.28em] text-black/46">
            {stat.label}
          </p>
          <p
            className="mt-3 text-5xl sm:text-6xl"
            style={{ fontFamily: serifFamily, letterSpacing: "-0.05em" }}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
}

function MonographTestimonial(section: TestimonialSection) {
  return (
    <section
      className="grid gap-8 border-y border-black/10 py-10 md:grid-cols-[minmax(0,1.2fr)_280px] md:items-center"
      id={section.anchor}
    >
      <div className="space-y-6">
        <p
          className="text-xs font-semibold uppercase tracking-[0.34em] text-black/55"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Client Perspective
        </p>
        <blockquote
          className="text-3xl leading-tight sm:text-4xl"
          style={{ fontFamily: serifFamily, letterSpacing: "-0.03em" }}
        >
          &ldquo;{section.quote}&rdquo;
        </blockquote>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-black">{section.author}</p>
          {(section.role || section.company) ? (
            <p className="text-sm uppercase tracking-[0.24em] text-black/48">
              {[section.role, section.company].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
      </div>
      {section.image ? (
        <div
          className="relative min-h-[300px] overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#e8e3d8]"
          style={{ boxShadow: "0 22px 50px rgba(17, 17, 17, 0.08)" }}
        >
          <Image
            alt={section.image.alt ?? section.author}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            src={section.image.url}
          />
        </div>
      ) : null}
    </section>
  );
}

function MonographHowItWorks(section: HowItWorksSection) {
  return (
    <section className="space-y-8" id={section.anchor}>
      {section.headline ? (
        <div className="max-w-3xl space-y-4">
          <p
            className="text-xs font-semibold uppercase tracking-[0.34em] text-black/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Workflow
          </p>
          <h2
            className="text-4xl sm:text-5xl"
            style={{ fontFamily: serifFamily, letterSpacing: "-0.04em" }}
          >
            {section.headline}
          </h2>
        </div>
      ) : null}
      <ol className="grid gap-6 lg:grid-cols-3">
        {section.steps.map((step, index) => (
          <li
            className="space-y-4 border-t border-black/12 pt-5"
            key={`${step.stepNumber}-${step.title}-${index}`}
          >
            <p
              className="text-xs uppercase tracking-[0.34em] text-black/42"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Step {step.stepNumber}
            </p>
            <h3
              className="text-2xl leading-tight"
              style={{ fontFamily: serifFamily }}
            >
              {step.title}
            </h3>
            {step.description ? (
              <p className="text-base leading-8 text-black/68">
                {step.description}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

function MonographRichText(section: RichTextSection) {
  return (
    <section className="border-y border-black/10 py-10" id={section.anchor}>
      <div
        className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black/72 prose-strong:text-black"
        style={{ fontFamily: serifFamily }}
      >
        <div dangerouslySetInnerHTML={{ __html: section.html }} />
      </div>
    </section>
  );
}

function MonographFaq(section: FaqSection) {
  return (
    <section className="space-y-8" id={section.anchor}>
      {section.headline ? (
        <div className="space-y-4">
          <p
            className="text-xs font-semibold uppercase tracking-[0.34em] text-black/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Questions
          </p>
          <h2
            className="text-4xl sm:text-5xl"
            style={{ fontFamily: serifFamily, letterSpacing: "-0.04em" }}
          >
            {section.headline}
          </h2>
        </div>
      ) : null}
      <div className="divide-y divide-black/10 border-y border-black/10">
        {section.faqs.map((faq, index) => (
          <details className="group py-6" key={`${faq.question}-${index}`}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
              <span className="text-xl leading-snug text-black">
                {faq.question}
              </span>
              <span className="text-black/42 transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="max-w-3xl pt-4 text-base leading-8 text-black/68">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function MonographCtaBand(section: CtaBandSection) {
  return (
    <section
      className="overflow-hidden rounded-[2rem] px-8 py-10 sm:px-12 sm:py-14"
      id={section.anchor}
      style={{ backgroundColor: "#111111", color: "#f7f3eb" }}
    >
      <div className="space-y-6 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.34em] text-white/55"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Closing Argument
        </p>
        <div className="space-y-4">
          <h2
            className="text-4xl sm:text-5xl"
            style={{ fontFamily: serifFamily, letterSpacing: "-0.04em" }}
          >
            {section.headline}
          </h2>
          {section.subheadline ? (
            <p className="mx-auto max-w-2xl text-lg leading-8 text-white/72">
              {section.subheadline}
            </p>
          ) : null}
        </div>
        {section.primaryCta ? (
          <PreviewButtonLink
            className="rounded-full px-6 py-3"
            href={section.primaryCta.href}
            style={{
              backgroundColor: "#f7f3eb",
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

function MonographForm(section: FormSection) {
  return (
    <section className="space-y-8" id={section.anchor}>
      <div className="max-w-3xl space-y-4">
        <p
          className="text-xs font-semibold uppercase tracking-[0.34em] text-black/55"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Conversion
        </p>
        <h2
          className="text-4xl sm:text-5xl"
          style={{ fontFamily: serifFamily, letterSpacing: "-0.04em" }}
        >
          {section.headline}
        </h2>
        {section.body ? (
          <p className="text-lg leading-8 text-black/68">{section.body}</p>
        ) : null}
      </div>
      <ConceptEmbeddedForm section={section} />
    </section>
  );
}

function MonographSectionRenderer({
  sections,
}: {
  sections: PageSection[];
}) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section._type) {
          case "hero":
            return <MonographHero key={section.id} {...section} />;
          case "featureGrid":
            return (
              <MonographFeatureColumns
                key={section.id}
                {...section}
                label="Platform"
              />
            );
          case "useCases":
            return (
              <MonographFeatureColumns
                key={section.id}
                {...section}
                label="Use Cases"
              />
            );
          case "statsStrip":
            return <MonographStats key={section.id} {...section} />;
          case "testimonial":
            return <MonographTestimonial key={section.id} {...section} />;
          case "howItWorks":
            return <MonographHowItWorks key={section.id} {...section} />;
          case "faq":
            return <MonographFaq key={section.id} {...section} />;
          case "ctaBand":
            return <MonographCtaBand key={section.id} {...section} />;
          case "richText":
            return <MonographRichText key={section.id} {...section} />;
          case "formSection":
            return <MonographForm key={section.id} {...section} />;
          default:
            return (
              <LiveSectionFallback
                key={`monograph-fallback-${index}`}
                section={section as PageSection}
              />
            );
        }
      })}
    </>
  );
}

type MonographHomepagePreviewProps = {
  page: Page;
};

export function MonographHomepagePreview({
  page,
}: MonographHomepagePreviewProps) {
  const primaryCta = getConceptPrimaryCta(page);
  const navItems = getSectionNavItems(page.sections);

  return (
    <main className="min-h-full" style={pageStyle}>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col px-6 py-6 sm:px-10 lg:px-14">
        <header
          className="sticky top-4 z-30 flex flex-col gap-4 rounded-[1.75rem] px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
          style={headerStyle}
        >
          <div className="space-y-2">
            <Link
              className="text-xl font-semibold tracking-[-0.04em] text-black"
              href="/"
              style={{ fontFamily: serifFamily }}
            >
              AgentFlow
            </Link>
            <p
              className="text-[11px] uppercase tracking-[0.34em] text-black/48"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Monograph / Editorial Luxury
            </p>
          </div>
          <nav
            aria-label="Monograph preview navigation"
            className="flex flex-wrap items-center gap-4 text-sm text-black/62"
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
        </header>

        <div className="flex flex-col gap-12 py-10 sm:py-14 md:gap-16">
          <MonographSectionRenderer sections={page.sections} />
        </div>

        <footer className="mt-6 border-t border-black/10 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p
                className="text-xs uppercase tracking-[0.34em] text-black/48"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Concept Preview
              </p>
              <p
                className="max-w-2xl text-2xl sm:text-3xl"
                style={{ fontFamily: serifFamily, letterSpacing: "-0.03em" }}
              >
                A quieter, more editorial homepage treatment for AgentFlow.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PreviewButtonLink
                className="rounded-full px-5 py-3"
                href="/concepts"
                style={secondaryButtonStyle}
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
