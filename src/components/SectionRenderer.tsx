import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { FormSection } from "@/components/sections/FormSection";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { RichText } from "@/components/sections/RichText";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { Testimonial } from "@/components/sections/Testimonial";
import { UseCases } from "@/components/sections/UseCases";
import type { PageSection } from "@/types/cms";

type SectionRendererProps = {
  sections: PageSection[];
};

function renderUnknownSection(section: never, index: number) {
  const unknownSection = section as {
    id?: string;
    _type?: string;
  };

  return (
    <section
      className="rounded-[2rem] border border-dashed border-amber-300 bg-amber-50/80 px-6 py-5 text-sm text-amber-900"
      key={unknownSection.id ?? `unknown-section-${index}`}
      role="status"
    >
      Unsupported section type
      {unknownSection._type ? `: ${unknownSection._type}` : ""}.
    </section>
  );
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <div className="flex flex-col">
      {sections.map((section, index) => {
        switch (section._type) {
          case "hero":
            return <Hero key={section.id} {...section} />;
          case "featureGrid":
            return <FeatureGrid key={section.id} {...section} />;
          case "richText":
            return <RichText key={section.id} {...section} />;
          case "faq":
            return <Faq key={section.id} {...section} />;
          case "ctaBand":
            return <CtaBand key={section.id} {...section} />;
          case "testimonial":
            return <Testimonial key={section.id} {...section} />;
          case "useCases":
            return <UseCases key={section.id} {...section} />;
          case "howItWorks":
            return <HowItWorks key={section.id} {...section} />;
          case "statsStrip":
            return <StatsStrip key={section.id} {...section} />;
          case "formSection":
            return <FormSection key={section.id} {...section} />;
          default:
            return renderUnknownSection(section, index);
        }
      })}
    </div>
  );
}
