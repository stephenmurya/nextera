import Image from "next/image";
import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaDarkPanelClassName,
  panoramaLightPanelClassName,
  panoramaLightPanelStyle,
} from "@/components/panorama/PanoramaPrimitives";
import type { ProblemSolutionSection as ProblemSolutionSectionData } from "@/types/cms";

export function ProblemSolutionSection({
  anchor,
  image,
  problemHeadline,
  problemDescription,
  solutionHeadline,
  solutionDescription,
}: ProblemSolutionSectionData) {
  return (
    <PanoramaCanvasSection
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
      id={anchor}
    >
      <div className="space-y-8">
        <PanoramaSectionEyebrow className="block" >
          <span id={anchor ? `${anchor}-heading` : undefined}>Problem / Solution</span>
        </PanoramaSectionEyebrow>
        <div
          className={[
            "grid gap-5",
            image
              ? "lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]"
              : "lg:grid-cols-2",
          ].join(" ")}
        >
          {image ? (
            <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-black/12 bg-[#d9d4cb] shadow-[0_24px_60px_rgba(17,17,17,0.08)]">
              <Image
                alt={image.alt ?? solutionHeadline}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                src={image.url}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.08),rgba(17,17,17,0.2))]" />
            </div>
          ) : null}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <article className={`${panoramaDarkPanelClassName} p-6 sm:p-8`}>
              <div className="space-y-4">
                <PanoramaSectionEyebrow inverse>Problem</PanoramaSectionEyebrow>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[2rem]">
                    {problemHeadline}
                  </h3>
                  {problemDescription ? (
                    <p className="text-base leading-8 text-white/74">
                      {problemDescription}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
            <article
              className={`${panoramaLightPanelClassName} p-6 sm:p-8`}
              style={panoramaLightPanelStyle}
            >
              <div className="space-y-4">
                <PanoramaSectionEyebrow>Solution</PanoramaSectionEyebrow>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-black sm:text-[2rem]">
                    {solutionHeadline}
                  </h3>
                  {solutionDescription ? (
                    <p className="text-base leading-8 text-black/68">
                      {solutionDescription}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </PanoramaCanvasSection>
  );
}
