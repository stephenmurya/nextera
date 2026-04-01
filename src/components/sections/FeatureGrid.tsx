import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaLightPanelClassName,
  panoramaLightPanelStyle,
} from "@/components/panorama/PanoramaPrimitives";
import { SectionIcon } from "@/components/sections/SectionIcons";
import type { FeatureGridSection as FeatureGridSectionData } from "@/types/cms";

export function FeatureGrid({
  anchor,
  headline,
  intro,
  items,
}: FeatureGridSectionData) {
  return (
    <PanoramaCanvasSection
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
      id={anchor}
    >
      <div className="space-y-8">
        {headline || intro ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <PanoramaSectionEyebrow>Platform</PanoramaSectionEyebrow>
              {headline ? (
                <h2
                  className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl"
                  id={anchor ? `${anchor}-heading` : undefined}
                >
                  {headline}
                </h2>
              ) : null}
            </div>
            {intro ? (
              <p className="max-w-xl text-base leading-8 text-black/68">
                {intro}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              className={`${panoramaLightPanelClassName} relative overflow-hidden p-6`}
              key={`${item.title}-${index}`}
              style={panoramaLightPanelStyle}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
                    <SectionIcon className="h-5 w-5" icon={item.icon} />
                  </div>
                  <PanoramaSectionEyebrow>
                    [{(index + 1).toString().padStart(2, "0")}]
                  </PanoramaSectionEyebrow>
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
    </PanoramaCanvasSection>
  );
}
