import { HubSpotForm } from "@/components/forms/HubSpotForm";
import { FormViewTracker } from "@/components/observability/FormViewTracker";
import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaLightPanelStyle,
} from "@/components/panorama/PanoramaPrimitives";
import type { FormSection as FormSectionData } from "@/types/cms";

export function FormSection({
  anchor,
  formType,
  headline,
  body,
}: FormSectionData) {
  const sectionId = anchor ?? (formType === "waitlist" ? "waitlist" : undefined);
  const formLocation = sectionId ?? `form-${formType}`;

  return (
    <PanoramaCanvasSection id={sectionId}>
      <FormViewTracker formType={formType} location={formLocation} />
      <div className="space-y-6">
        <div className="rounded-[2rem] p-6 sm:p-8" style={panoramaLightPanelStyle}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <PanoramaSectionEyebrow>
                {formType === "demo"
                  ? "Request Demo"
                  : formType === "waitlist"
                    ? "Early Access"
                    : "Contact Sales"}
              </PanoramaSectionEyebrow>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
                {headline}
              </h2>
            </div>
            {body ? (
              <p className="max-w-xl text-base leading-8 text-black/68">
                {body}
              </p>
            ) : null}
          </div>
        </div>
        <HubSpotForm formType={formType} />
      </div>
    </PanoramaCanvasSection>
  );
}
