import {
  PanoramaCanvasSection,
  panoramaLightPanelStyle,
} from "@/components/panorama/PanoramaPrimitives";
import type { RichTextSection as RichTextSectionData } from "@/types/cms";

export function RichText({ anchor, html }: RichTextSectionData) {
  return (
    <PanoramaCanvasSection id={anchor} innerClassName="py-16 sm:py-20 lg:py-24">
      <div className="rounded-[2rem] p-6 sm:p-10" style={panoramaLightPanelStyle}>
        {/* TRUST BOUNDARY: Assumes WordPress HTML is trusted. If editor privileges change, introduce isomorphic-dompurify here. */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black/72 prose-strong:text-black [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </PanoramaCanvasSection>
  );
}
