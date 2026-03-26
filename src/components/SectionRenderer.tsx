import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { Hero } from "@/components/sections/Hero";
import { RichText } from "@/components/sections/RichText";
import type { PageSection } from "@/types/cms";

type SectionRendererProps = {
  sections: PageSection[];
};

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <div className="flex flex-col gap-8">
      {sections.map((section) => {
        switch (section._type) {
          case "hero":
            return <Hero key={section.id} {...section} />;
          case "featureGrid":
            return <FeatureGrid key={section.id} {...section} />;
          case "richText":
            return <RichText key={section.id} {...section} />;
          default: {
            const exhaustiveCheck: never = section;

            return exhaustiveCheck;
          }
        }
      })}
    </div>
  );
}
