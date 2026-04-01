import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaDarkPanelClassName,
} from "@/components/panorama/PanoramaPrimitives";
import type { StatsStripSection as StatsStripSectionData } from "@/types/cms";

export function StatsStrip({ anchor, stats }: StatsStripSectionData) {
  return (
    <PanoramaCanvasSection id={anchor} innerClassName="py-8 sm:py-10 lg:py-12">
      <dl className="grid gap-5 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            className={`${panoramaDarkPanelClassName} p-6`}
            key={`${stat.value}-${stat.label}-${index}`}
          >
            <dd className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
              {stat.value}
            </dd>
            <dt className="mt-4">
              <PanoramaSectionEyebrow inverse>{stat.label}</PanoramaSectionEyebrow>
            </dt>
          </div>
        ))}
      </dl>
    </PanoramaCanvasSection>
  );
}
