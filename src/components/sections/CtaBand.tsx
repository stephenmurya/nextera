import Link from "next/link";
import type { CtaBandSection as CtaBandSectionData } from "@/types/cms";

export function CtaBand({
  anchor,
  headline,
  subheadline,
  primaryCta,
}: CtaBandSectionData) {
  return (
    <section
      className="py-16 md:py-24"
      id={anchor}
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
    >
      <div className="overflow-hidden rounded-[2.5rem] border border-[#c5a15f]/35 bg-[linear-gradient(135deg,#211c16_0%,#2c241b_52%,#3e2f1f_100%)] px-6 py-10 text-background shadow-[0_30px_90px_rgba(33,28,22,0.18)] sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e7d5b7]">
              Ready to convert more leads
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
              id={anchor ? `${anchor}-heading` : undefined}
            >
              {headline}
            </h2>
            {subheadline ? (
              <p className="max-w-2xl text-base leading-8 text-[#f6eee4]/80 sm:text-lg">
                {subheadline}
              </p>
            ) : null}
          </div>
          {primaryCta ? (
            <div className="shrink-0">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-[#f4ede4] px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2c241b]"
                href={primaryCta.href}
              >
                {primaryCta.label}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
