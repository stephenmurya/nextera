import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaLightPanelStyle,
} from "@/components/panorama/PanoramaPrimitives";
import type { FaqSection as FaqSectionData } from "@/types/cms";

export function Faq({ anchor, headline, faqs }: FaqSectionData) {
  return (
    <PanoramaCanvasSection
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
      id={anchor}
    >
      <div className="space-y-6">
        {headline ? (
          <div className="space-y-3">
            <PanoramaSectionEyebrow>Questions</PanoramaSectionEyebrow>
            <h2
              className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl"
              id={anchor ? `${anchor}-heading` : undefined}
            >
              {headline}
            </h2>
          </div>
        ) : null}
        <div className="grid gap-4">
          {faqs.map((item, index) => (
            <details
              className="group rounded-[1.5rem] p-5"
              key={`${item.question}-${index}`}
              style={panoramaLightPanelStyle}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left text-xl font-semibold tracking-[-0.03em] text-black marker:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="mt-1 text-black/38 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div
                className="prose prose-base max-w-none pt-4 text-black/68 prose-p:text-black/68 prose-strong:text-black [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </details>
          ))}
        </div>
      </div>
    </PanoramaCanvasSection>
  );
}
