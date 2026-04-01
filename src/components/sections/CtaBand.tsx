import { TrackedCtaLink } from "@/components/observability/TrackedCtaLink";
import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaDarkPanelClassName,
} from "@/components/panorama/PanoramaPrimitives";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";
import type { CtaBandSection as CtaBandSectionData } from "@/types/cms";

export function CtaBand({
  anchor,
  headline,
  subheadline,
  primaryCta,
}: CtaBandSectionData) {
  return (
    <PanoramaCanvasSection
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
      id={anchor}
    >
      <div
        className={`${panoramaDarkPanelClassName} flex flex-col gap-6 p-8 sm:p-10 lg:flex-row lg:items-end lg:justify-between`}
      >
        <div className="space-y-4">
          <PanoramaSectionEyebrow inverse>Conversion Canvas</PanoramaSectionEyebrow>
          <h2
            className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl"
            id={anchor ? `${anchor}-heading` : undefined}
          >
            {headline}
          </h2>
          {subheadline ? (
            <p className="max-w-2xl text-lg leading-8 text-white/72">
              {subheadline}
            </p>
          ) : null}
        </div>
        {primaryCta ? (
          <div className="shrink-0">
            <TrackedCtaLink
              className={getButtonClassName("cream")}
              href={primaryCta.href}
              label={primaryCta.label}
              location="cta-band"
              style={getButtonStyle("cream")}
            >
              {primaryCta.label}
            </TrackedCtaLink>
          </div>
        ) : null}
      </div>
    </PanoramaCanvasSection>
  );
}
