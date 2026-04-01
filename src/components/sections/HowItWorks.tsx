import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaLightPanelClassName,
  panoramaLightPanelStyle,
} from "@/components/panorama/PanoramaPrimitives";
import type { HowItWorksSection as HowItWorksSectionData } from "@/types/cms";

export function HowItWorks({
  anchor,
  headline,
  steps,
}: HowItWorksSectionData) {
  return (
    <PanoramaCanvasSection
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
      id={anchor}
    >
      <div className="space-y-8">
        {headline ? (
          <div className="space-y-3">
            <PanoramaSectionEyebrow>Sequence</PanoramaSectionEyebrow>
            <h2
              className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl"
              id={anchor ? `${anchor}-heading` : undefined}
            >
              {headline}
            </h2>
          </div>
        ) : null}
        <ol className="grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              className={`${panoramaLightPanelClassName} flex h-full flex-col p-6`}
              key={`${step.stepNumber}-${step.title}-${index}`}
              style={panoramaLightPanelStyle}
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
    </PanoramaCanvasSection>
  );
}
