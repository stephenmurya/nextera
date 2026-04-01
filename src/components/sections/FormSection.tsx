import { HubSpotForm } from "@/components/forms/HubSpotForm";
import { FormViewTracker } from "@/components/observability/FormViewTracker";
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
    <section className="relative py-16 md:py-24" id={sectionId}>
      <FormViewTracker formType={formType} location={formLocation} />
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-[linear-gradient(180deg,#fffaf3_0%,#f8f1e7_100%)] px-5 py-5 shadow-[0_28px_90px_rgba(33,28,22,0.08)] sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,_rgba(195,153,93,0.18),_transparent_70%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(22rem,1fr)] lg:items-start">
          <div className="space-y-5 px-2 py-2 lg:px-4 lg:py-6">
            <span className="inline-flex rounded-full border border-border bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              {formType === "demo"
                ? "Request Demo"
                : formType === "waitlist"
                  ? "Early Access"
                  : "Contact Sales"}
            </span>
            <div className="space-y-3">
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {headline}
              </h2>
              {body ? (
                <p className="max-w-xl text-base leading-8 text-muted sm:text-lg">
                  {body}
                </p>
              ) : null}
            </div>
          </div>
          <HubSpotForm formType={formType} />
        </div>
      </div>
    </section>
  );
}
