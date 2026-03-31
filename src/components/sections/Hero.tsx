import Image from "next/image";
import Link from "next/link";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";
import type { HeroSection as HeroSectionData } from "@/types/cms";

export function Hero({
  anchor,
  eyebrow,
  headline,
  body,
  primaryCta,
  secondaryCta,
  backgroundImage,
}: HeroSectionData) {
  const hasImage = Boolean(backgroundImage);

  return (
    <section
      className="relative py-16 md:py-24"
      id={anchor}
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
    >
      <div className="absolute inset-x-6 top-0 -z-10 h-40 rounded-full bg-[radial-gradient(circle,_rgba(195,153,93,0.28),_transparent_68%)] blur-3xl" />
      <div className="overflow-hidden rounded-[2.5rem] border border-border/80 bg-surface/95 shadow-[0_28px_90px_rgba(33,28,22,0.08)]">
        <div
          className={[
            "grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16",
            hasImage
              ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center"
              : "justify-items-center text-center",
          ].join(" ")}
        >
          <div className={["space-y-6", hasImage ? "max-w-2xl" : "max-w-3xl"].join(" ")}>
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted">
                {eyebrow}
              </p>
            ) : null}
            <div className="space-y-4">
              <h1
                className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                id={anchor ? `${anchor}-heading` : undefined}
              >
                {headline}
              </h1>
              {body ? (
                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  {body}
                </p>
              ) : null}
            </div>
            {primaryCta || secondaryCta ? (
              <div
                className={[
                  "flex flex-wrap gap-3",
                  hasImage ? "justify-start" : "justify-center",
                ].join(" ")}
              >
                {primaryCta ? (
                  <Link
                    className={getButtonClassName("primary")}
                    href={primaryCta.href}
                    style={getButtonStyle("primary")}
                  >
                    {primaryCta.label}
                  </Link>
                ) : null}
                {secondaryCta ? (
                  <Link
                    className={getButtonClassName("secondary")}
                    href={secondaryCta.href}
                    style={getButtonStyle("secondary")}
                  >
                    {secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
          {backgroundImage ? (
            <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/70 bg-[#efe4d2] shadow-[0_24px_80px_rgba(33,28,22,0.12)] sm:min-h-[420px]">
              <Image
                alt={backgroundImage.alt ?? headline}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                src={backgroundImage.url}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-[#211c16]/30 via-transparent to-transparent"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
