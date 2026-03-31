import type { FaqSection as FaqSectionData } from "@/types/cms";

export function Faq({ anchor, headline, faqs }: FaqSectionData) {
  return (
    <section
      className="py-16 md:py-24"
      id={anchor}
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
    >
      <div className="space-y-8">
        {headline ? (
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
              FAQ
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              id={anchor ? `${anchor}-heading` : undefined}
            >
              {headline}
            </h2>
          </div>
        ) : null}
        <div className="mx-auto grid max-w-4xl gap-4">
          {faqs.map((item, index) => (
            <details
              className="group rounded-[1.75rem] border border-border/80 bg-surface/95 p-6 shadow-[0_20px_65px_rgba(33,28,22,0.06)]"
              key={`${item.question}-${index}`}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left text-lg font-semibold tracking-tight text-foreground marker:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="mt-1 text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pt-4 text-base leading-8 text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
