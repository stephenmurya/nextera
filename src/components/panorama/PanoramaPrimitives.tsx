import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

export const panoramaImageGridOverlayStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.11) 1px, transparent 1px)",
  backgroundSize: "96px 96px",
};

export const panoramaMutedGridOverlayStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(17,17,17,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.03) 1px, transparent 1px)",
  backgroundSize: "72px 72px",
};

export const panoramaGlassPanelStyle: CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.14)",
  border: "1px solid rgba(255,255,255,0.24)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.16)",
};

export const panoramaLightPanelStyle: CSSProperties = {
  backgroundColor: "rgba(252, 251, 247, 0.92)",
  border: "1px solid rgba(17,17,17,0.12)",
  boxShadow: "0 24px 60px rgba(17,17,17,0.08)",
};

export const panoramaLightPanelClassName =
  "rounded-[1.75rem] border border-black/12 bg-[#fcfbf7]/92 shadow-[0_24px_60px_rgba(17,17,17,0.08)]";

export const panoramaDarkPanelClassName =
  "rounded-[2rem] border border-white/12 bg-[#111111] text-white shadow-[0_28px_72px_rgba(17,17,17,0.18)]";

type PanoramaFullBleedSectionProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  children: ReactNode;
};

export function PanoramaFullBleedSection({
  children,
  className = "",
  id,
  ...props
}: PanoramaFullBleedSectionProps) {
  return (
    <section
      className={[
        "relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      id={id}
      {...props}
    >
      {children}
    </section>
  );
}

type PanoramaInnerProps = {
  children: ReactNode;
  className?: string;
};

export function PanoramaInner({
  children,
  className = "",
}: PanoramaInnerProps) {
  return (
    <div
      className={["mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

type PanoramaCanvasSectionProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  children: ReactNode;
  innerClassName?: string;
};

export function PanoramaCanvasSection({
  children,
  className = "",
  id,
  innerClassName = "py-16 sm:py-20 lg:py-24",
  ...props
}: PanoramaCanvasSectionProps) {
  return (
    <PanoramaFullBleedSection
      className={`bg-background ${className}`.trim()}
      id={id}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={panoramaMutedGridOverlayStyle}
      />
      <PanoramaInner className={`relative ${innerClassName}`.trim()}>
        {children}
      </PanoramaInner>
    </PanoramaFullBleedSection>
  );
}

type PanoramaSectionEyebrowProps = {
  children: ReactNode;
  className?: string;
  inverse?: boolean;
};

export function PanoramaSectionEyebrow({
  children,
  className = "",
  inverse = false,
}: PanoramaSectionEyebrowProps) {
  return (
    <p
      className={[
        "text-[11px] font-semibold uppercase tracking-[0.32em]",
        inverse ? "text-white/60" : "text-black/46",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ fontFamily: "var(--font-geist-mono)" }}
    >
      {children}
    </p>
  );
}
