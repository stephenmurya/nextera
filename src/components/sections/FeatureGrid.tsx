import { SectionIcon } from "@/components/sections/SectionIcons";
import type { FeatureGridSection as FeatureGridSectionData } from "@/types/cms";

export function FeatureGrid({
  anchor,
  headline,
  intro,
  items,
}: FeatureGridSectionData) {
  return (
    <section
      className="py-16 md:py-24"
      id={anchor}
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
    >
      <div className="space-y-10">
        {headline || intro ? (
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            {headline ? (
              <h2
                className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                id={anchor ? `${anchor}-heading` : undefined}
              >
                {headline}
              </h2>
            ) : null}
            {intro ? (
              <p className="text-base leading-8 text-muted sm:text-lg">
                {intro}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              className="group flex h-full flex-col rounded-[2rem] border border-border/80 bg-surface/95 p-6 shadow-[0_20px_65px_rgba(33,28,22,0.06)] transition-transform hover:-translate-y-1"
              key={`${item.title}-${index}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
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
