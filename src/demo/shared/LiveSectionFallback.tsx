import { SectionRenderer } from "@/components/SectionRenderer";
import type { PageSection } from "@/types/cms";

type LiveSectionFallbackProps = {
  section: PageSection;
};

export function LiveSectionFallback({
  section,
}: LiveSectionFallbackProps) {
  return <SectionRenderer sections={[section]} />;
}
