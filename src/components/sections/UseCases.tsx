import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaLightPanelClassName,
  panoramaLightPanelStyle,
} from "@/components/panorama/PanoramaPrimitives";
import { SectionIcon } from "@/components/sections/SectionIcons";
import type { UseCasesSection as UseCasesSectionData } from "@/types/cms";

export function UseCases({
  anchor,
  headline,
  items,
}: UseCasesSectionData) {
  return (
    <PanoramaCanvasSection
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
      id={anchor}
    >
      <div className="space-y-8">
        {headline ? (
          <div className="space-y-3">
            <PanoramaSectionEyebrow>Applications</PanoramaSectionEyebrow>
            <h2
              className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl"
              id={anchor ? `${anchor}-heading` : undefined}
            >
              {headline}
            </h2>
          </div>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              className={`${panoramaLightPanelClassName} flex h-full flex-col p-6`}
              key={`${item.title}-${index}`}
              style={panoramaLightPanelStyle}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
                  <SectionIcon className="h-5 w-5" icon={item.icon} />
                </div>
                <PanoramaSectionEyebrow>
                  [{(index + 1).toString().padStart(2, "0")}]
                </PanoramaSectionEyebrow>
              </div>
              <div className="mt-6 space-y-3">
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
      </div>
    </PanoramaCanvasSection>
  );
}
