import type { FC, SVGProps } from "react";
import type { FeatureGridSection as FeatureGridSectionData } from "@/types/cms";

type IconComponent = FC<SVGProps<SVGSVGElement>>;

const baseIconClassName = "h-5 w-5";

const RouteIcon: IconComponent = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M6 6h6a3 3 0 1 1 0 6h-1a3 3 0 1 0 0 6h7" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
};

const TimelineIcon: IconComponent = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 4v16" />
      <path d="M7 8h10" />
      <path d="M7 16h10" />
      <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="20" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
};

const ShieldIcon: IconComponent = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 3 5 6v5c0 4.5 2.7 8.6 7 10 4.3-1.4 7-5.5 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.2-3.6" />
    </svg>
  );
};

const MarkerIcon: IconComponent = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="5" />
    </svg>
  );
};

const IconMap: Record<string, IconComponent> = {
  route: RouteIcon,
  timeline: TimelineIcon,
  shield: ShieldIcon,
};

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
          {items.map((item, index) => {
            const Icon = item.icon ? IconMap[item.icon] ?? MarkerIcon : MarkerIcon;

            return (
              <article
                className="group flex h-full flex-col rounded-[2rem] border border-border/80 bg-surface/95 p-6 shadow-[0_20px_65px_rgba(33,28,22,0.06)] transition-transform hover:-translate-y-1"
                key={`${item.title}-${index}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
                  <Icon className={baseIconClassName} />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
