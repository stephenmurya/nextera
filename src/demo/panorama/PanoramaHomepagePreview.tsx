import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionIcon } from "@/components/sections/SectionIcons";
import { ConceptEmbeddedForm } from "@/demo/shared/ConceptEmbeddedForm";
import { LiveSectionFallback } from "@/demo/shared/LiveSectionFallback";
import { getConceptPrimaryCta, getSectionNavItems } from "@/demo/shared/page-data";
import { PreviewButtonLink } from "@/demo/shared/PreviewButtonLink";
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
  backgroundColor: "#efeee8",
  color: "#111111",
};

const imageGridOverlayStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
  backgroundSize: "84px 84px",
};

const mutedGridOverlayStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(17,17,17,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.035) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

const glassPanelStyle: CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.14)",
  border: "1px solid rgba(255,255,255,0.22)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.16)",
};

const lightPanelStyle: CSSProperties = {
  backgroundColor: "rgba(252,251,247,0.9)",
  border: "1px solid rgba(17,17,17,0.12)",
  boxShadow: "0 24px 60px rgba(17,17,17,0.08)",
};

const whiteButtonStyle: CSSProperties = {
  backgroundColor: "#f5f5f1",
  color: "#111111",
  WebkitTextFillColor: "#111111",
};

const ghostLightButtonStyle: CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.22)",
  color: "#ffffff",
  WebkitTextFillColor: "#ffffff",
};

type ModuleGridProps = {
  anchor?: string;
  headline?: string;
  intro?: string;
  items: FeatureGridSection["items"] | UseCasesSection["items"];
  label: string;
};

function FullBleedSection({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      className={[
        "relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      id={id}
    >
      {children}
    </section>
  );
}

function Inner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

function CanvasSection({
  children,
  id,
  innerClassName = "py-16 sm:py-20",
}: {
  children: ReactNode;
  id?: string;
  innerClassName?: string;
}) {
  return (
    <FullBleedSection className="bg-[#efeee8]" id={id}>
      <div className="absolute inset-0 opacity-70" style={mutedGridOverlayStyle} />
      <Inner className={`relative ${innerClassName}`}>{children}</Inner>
    </FullBleedSection>
  );
}

function PanoramaHero(section: HeroSection) {
  return (
    <FullBleedSection className="min-h-[92vh]" id={section.anchor}>
      {section.backgroundImage ? (
        <Image
          alt={section.backgroundImage.alt ?? section.headline}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={section.backgroundImage.url}
        />
      ) : (
        <div className="absolute inset-0 bg-[#111111]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.3),rgba(7,7,7,0.58))]" />
      <div className="absolute inset-0 opacity-55" style={imageGridOverlayStyle} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_24%)]" />
      <Inner className="relative flex min-h-[92vh] items-end py-24 pt-36 sm:pt-40">
        <div
          className="w-full max-w-3xl rounded-[2rem] p-6 text-white sm:p-8 lg:p-10"
          style={glassPanelStyle}
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.32em] text-white/72">
              <span style={{ fontFamily: "var(--font-geist-mono)" }}>
                {section.eyebrow ?? "Real Estate CRM"}
              </span>
              <span style={{ fontFamily: "var(--font-geist-mono)" }}>
                [ FULL-BLEED / ENTRY ]
              </span>
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-none tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              {section.headline}
            </h1>
            {section.body ? (
              <p className="max-w-2xl text-lg leading-8 text-white/84">
                {section.body}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3 pt-3">
              {section.primaryCta ? (
                <PreviewButtonLink
                  className="rounded-full px-6 py-3"
                  href={section.primaryCta.href}
                  style={whiteButtonStyle}
                >
                  {section.primaryCta.label}
                </PreviewButtonLink>
              ) : null}
              {section.secondaryCta ? (
                <PreviewButtonLink
                  className="rounded-full px-6 py-3"
                  href={section.secondaryCta.href}
                  style={ghostLightButtonStyle}
                >
                  {section.secondaryCta.label}
                </PreviewButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </Inner>
    </FullBleedSection>
  );
}

function PanoramaModuleGrid({
  anchor,
  headline,
  intro,
  items,
  label,
}: ModuleGridProps) {
  return (
    <CanvasSection id={anchor}>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/48"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {label}
            </p>
            {headline ? (
              <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
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
              className="relative overflow-hidden rounded-[1.75rem] p-6"
              key={`${item.title}-${index}`}
              style={lightPanelStyle}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
                    <SectionIcon className="h-5 w-5" icon={item.icon} />
                  </div>
                  <span
                    className="text-[11px] uppercase tracking-[0.3em] text-black/38"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    [{(index + 1).toString().padStart(2, "0")}]
                  </span>
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
      </div>
    </CanvasSection>
  );
}

function PanoramaStats(section: StatsStripSection) {
  return (
    <CanvasSection id={section.anchor} innerClassName="py-8 sm:py-10">
      <div className="grid gap-5 lg:grid-cols-4">
        {section.stats.map((stat, index) => (
          <div
            className="rounded-[1.5rem] border border-black/10 bg-[#111111] p-6 text-white shadow-[0_24px_60px_rgba(17,17,17,0.18)]"
            key={`${stat.value}-${stat.label}-${index}`}
          >
            <p className="text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
              {stat.value}
            </p>
            <p
              className="mt-4 text-[11px] uppercase tracking-[0.3em] text-white/56"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </CanvasSection>
  );
}

function PanoramaHowItWorks(section: HowItWorksSection) {
  return (
    <CanvasSection id={section.anchor}>
      <div className="space-y-8">
        {section.headline ? (
          <div className="space-y-3">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/48"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Sequence
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
              {section.headline}
            </h2>
          </div>
        ) : null}
        <ol className="grid gap-5 lg:grid-cols-3">
          {section.steps.map((step, index) => (
            <li
              className="rounded-[1.75rem] p-6"
              key={`${step.stepNumber}-${step.title}-${index}`}
              style={lightPanelStyle}
            >
              <div className="space-y-4">
                <span
                  className="inline-flex rounded-full border border-black/12 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-black/64"
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
      </div>
    </CanvasSection>
  );
}

function PanoramaTestimonial(section: TestimonialSection) {
  return (
    <CanvasSection id={section.anchor}>
      <div
        className="grid overflow-hidden rounded-[2rem] border border-black/12 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]"
        style={{ boxShadow: "0 28px 72px rgba(17,17,17,0.1)" }}
      >
        <figure className="bg-[#f8f6ef] p-8 sm:p-10">
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
              <p className="text-sm uppercase tracking-[0.24em] text-black/56">
                {[section.role, section.company].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </figcaption>
        </figure>
        {section.image ? (
          <div className="relative min-h-[320px] bg-[#ddd8cf] lg:min-h-full">
            <Image
              alt={section.image.alt ?? section.author}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 38vw"
              src={section.image.url}
            />
          </div>
        ) : (
          <div className="hidden bg-[#ddd8cf] lg:block" />
        )}
      </div>
    </CanvasSection>
  );
}

function PanoramaFaq(section: FaqSection) {
  return (
    <CanvasSection id={section.anchor}>
      <div className="space-y-6">
        {section.headline ? (
          <div className="space-y-3">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/48"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Questions
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
              {section.headline}
            </h2>
          </div>
        ) : null}
        <div className="grid gap-4">
          {section.faqs.map((faq, index) => (
            <details
              className="rounded-[1.5rem] p-5"
              key={`${faq.question}-${index}`}
              style={lightPanelStyle}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                <span className="text-xl font-semibold tracking-[-0.03em] text-black">
                  {faq.question}
                </span>
                <span className="text-black/38">+</span>
              </summary>
              <div
                className="prose prose-base max-w-none pt-4 text-black/68 prose-p:text-black/68 prose-strong:text-black [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </details>
          ))}
        </div>
      </div>
    </CanvasSection>
  );
}

function PanoramaRichText(section: RichTextSection) {
  return (
    <CanvasSection id={section.anchor}>
      <div className="rounded-[2rem] p-6 sm:p-10" style={lightPanelStyle}>
        <div
          className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black/72 prose-strong:text-black [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: section.html }}
        />
      </div>
    </CanvasSection>
  );
}

function PanoramaCtaBand(section: CtaBandSection) {
  return (
    <CanvasSection id={section.anchor}>
      <div className="flex flex-col gap-6 rounded-[2rem] bg-[#111111] p-8 text-white shadow-[0_28px_72px_rgba(17,17,17,0.18)] sm:p-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Conversion Canvas
          </p>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
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
            style={whiteButtonStyle}
          >
            {section.primaryCta.label}
          </PreviewButtonLink>
        ) : null}
      </div>
    </CanvasSection>
  );
}

function PanoramaForm(section: FormSection) {
  return (
    <CanvasSection id={section.anchor}>
      <div className="space-y-6">
        <div className="rounded-[2rem] p-6 sm:p-8" style={lightPanelStyle}>
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
              <p className="max-w-xl text-base leading-8 text-black/68">
                {section.body}
              </p>
            ) : null}
          </div>
        </div>
        <ConceptEmbeddedForm section={section} />
      </div>
    </CanvasSection>
  );
}

function PanoramaSectionRenderer({
  sections,
}: {
  sections: PageSection[];
}) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section._type) {
          case "hero":
            return <PanoramaHero key={section.id} {...section} />;
          case "featureGrid":
            return (
              <PanoramaModuleGrid
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
              <PanoramaModuleGrid
                key={section.id}
                anchor={section.anchor}
                headline={section.headline}
                items={section.items}
                label="Applications"
              />
            );
          case "statsStrip":
            return <PanoramaStats key={section.id} {...section} />;
          case "howItWorks":
            return <PanoramaHowItWorks key={section.id} {...section} />;
          case "testimonial":
            return <PanoramaTestimonial key={section.id} {...section} />;
          case "faq":
            return <PanoramaFaq key={section.id} {...section} />;
          case "richText":
            return <PanoramaRichText key={section.id} {...section} />;
          case "ctaBand":
            return <PanoramaCtaBand key={section.id} {...section} />;
          case "formSection":
            return <PanoramaForm key={section.id} {...section} />;
          default:
            return (
              <LiveSectionFallback
                key={`panorama-fallback-${index}`}
                section={section as PageSection}
              />
            );
        }
      })}
    </>
  );
}

type PanoramaHomepagePreviewProps = {
  page: Page;
};

export function PanoramaHomepagePreview({
  page,
}: PanoramaHomepagePreviewProps) {
  const primaryCta = getConceptPrimaryCta(page);
  const navItems = getSectionNavItems(page.sections);

  return (
    <main className="min-h-full" style={pageStyle}>
      <header className="sticky top-0 z-40 w-full bg-black/45 text-white backdrop-blur-md">
        <Inner className="py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Link className="text-xl font-semibold tracking-[-0.05em] text-white" href="/">
                AgentFlow
              </Link>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
                Expansive / Full-Bleed Canvas
            </p>
          </div>
          <nav
              aria-label="Expansive preview navigation"
              className="flex flex-wrap items-center gap-4 text-sm text-white/78"
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
              style={whiteButtonStyle}
            >
              {primaryCta.label}
            </PreviewButtonLink>
          </div>
        </Inner>
      </header>

      <PanoramaSectionRenderer sections={page.sections} />

      <CanvasSection innerClassName="py-14 sm:py-16">
        <div className="flex flex-col gap-5 rounded-[2rem] bg-[#111111] p-8 text-white shadow-[0_28px_72px_rgba(17,17,17,0.18)] sm:p-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Concept Preview
            </p>
            <p className="max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-white">
              A full-bleed canvas direction built for premium property storytelling.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PreviewButtonLink
              className="rounded-full px-5 py-3"
              href="/concepts"
              style={ghostLightButtonStyle}
            >
              View All Concepts
            </PreviewButtonLink>
            <PreviewButtonLink
              className="rounded-full px-5 py-3"
              href={primaryCta.href}
              style={whiteButtonStyle}
            >
              {primaryCta.label}
            </PreviewButtonLink>
          </div>
        </div>
      </CanvasSection>
    </main>
  );
}
