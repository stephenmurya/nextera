import Image from "next/image";
import { TrackedCtaLink } from "@/components/observability/TrackedCtaLink";
import {
  PanoramaFullBleedSection,
  PanoramaInner,
  PanoramaSectionEyebrow,
  panoramaGlassPanelStyle,
  panoramaImageGridOverlayStyle,
} from "@/components/panorama/PanoramaPrimitives";
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
  return (
    <PanoramaFullBleedSection
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
      className="min-h-[92vh] bg-[#111111]"
      id={anchor}
    >
      {backgroundImage ? (
        <Image
          alt={backgroundImage.alt ?? headline}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={backgroundImage.url}
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#111111_0%,#1b1b1b_46%,#303030_100%)]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.24),rgba(7,7,7,0.62))]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-55"
        style={panoramaImageGridOverlayStyle}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_24%)]" />
      <PanoramaInner className="relative flex min-h-[92vh] items-end py-24 pt-36 sm:py-28 sm:pt-40 lg:py-32 lg:pt-44">
        <div
          className="w-full max-w-3xl rounded-[2rem] p-6 text-white sm:p-8 lg:p-10"
          style={panoramaGlassPanelStyle}
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <PanoramaSectionEyebrow inverse>
                {eyebrow ?? "Real Estate CRM"}
              </PanoramaSectionEyebrow>
            </div>
            <div className="space-y-4">
              <h1
                className="max-w-4xl text-5xl font-semibold leading-none tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl"
                id={anchor ? `${anchor}-heading` : undefined}
              >
                {headline}
              </h1>
              {body ? (
                <p className="max-w-2xl text-lg leading-8 text-white/82">
                  {body}
                </p>
              ) : null}
            </div>
            {primaryCta || secondaryCta ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {primaryCta ? (
                  <TrackedCtaLink
                    className={getButtonClassName("cream")}
                    href={primaryCta.href}
                    label={primaryCta.label}
                    location="hero-primary"
                    style={getButtonStyle("cream")}
                  >
                    {primaryCta.label}
                  </TrackedCtaLink>
                ) : null}
                {secondaryCta ? (
                  <TrackedCtaLink
                    className={getButtonClassName("ghostInverse")}
                    href={secondaryCta.href}
                    label={secondaryCta.label}
                    location="hero-secondary"
                    style={getButtonStyle("ghostInverse")}
                  >
                    {secondaryCta.label}
                  </TrackedCtaLink>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </PanoramaInner>
    </PanoramaFullBleedSection>
  );
}
