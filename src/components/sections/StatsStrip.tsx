import type { StatsStripSection as StatsStripSectionData } from "@/types/cms";

export function StatsStrip({ anchor, stats }: StatsStripSectionData) {
  return (
    <section className="py-16 md:py-24" id={anchor}>
      <div className="overflow-hidden rounded-[2.5rem] border border-border/80 bg-[#211c16] px-6 py-8 text-background shadow-[0_28px_90px_rgba(33,28,22,0.12)] sm:px-8 sm:py-10 lg:px-12">
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              className="space-y-2 border-b border-white/10 pb-6 last:border-b-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6 last:sm:border-r-0 lg:pr-8"
              key={`${stat.value}-${stat.label}-${index}`}
            >
              <dt className="text-sm uppercase tracking-[0.2em] text-white/70">
                {stat.label}
              </dt>
              <dd className="text-4xl font-semibold tracking-tight text-[#f5e4c6] sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
