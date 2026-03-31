import type { HowItWorksSection as HowItWorksSectionData } from "@/types/cms";

export function HowItWorks({
  anchor,
  headline,
  steps,
}: HowItWorksSectionData) {
  return (
    <section
      className="py-16 md:py-24"
      id={anchor}
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
    >
      <div className="space-y-10">
        {headline ? (
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
              How It Works
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              id={anchor ? `${anchor}-heading` : undefined}
            >
              {headline}
            </h2>
          </div>
        ) : null}
        <ol className="grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              className="flex h-full flex-col rounded-[2rem] border border-border/80 bg-surface/95 p-6 shadow-[0_20px_65px_rgba(33,28,22,0.06)]"
              key={`${step.stepNumber}-${step.title}-${index}`}
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#c5a15f]/45 bg-[#fff5e8] text-base font-semibold text-foreground">
                  {step.stepNumber}
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
              </div>
              {step.description ? (
                <p className="mt-5 text-sm leading-7 text-muted sm:text-base">
                  {step.description}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
