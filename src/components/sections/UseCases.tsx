import { SectionIcon } from "@/components/sections/SectionIcons";
import type { UseCasesSection as UseCasesSectionData } from "@/types/cms";

export function UseCases({
  anchor,
  headline,
  items,
}: UseCasesSectionData) {
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
              Use Cases
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              id={anchor ? `${anchor}-heading` : undefined}
            >
              {headline}
            </h2>
          </div>
        ) : null}
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              className="flex h-full flex-col rounded-[2rem] border border-border/80 bg-surface/95 p-6 shadow-[0_20px_65px_rgba(33,28,22,0.06)]"
              key={`${item.title}-${index}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#efe1cc] text-foreground">
                <SectionIcon className="h-5 w-5" icon={item.icon} />
              </div>
              <div className="mt-6 space-y-3">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="text-sm leading-7 text-muted sm:text-base">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
