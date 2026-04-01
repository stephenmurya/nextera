import Image from "next/image";
import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
} from "@/components/panorama/PanoramaPrimitives";
import type { TestimonialSection as TestimonialSectionData } from "@/types/cms";

export function Testimonial({
  anchor,
  quote,
  author,
  role,
  company,
  image,
}: TestimonialSectionData) {
  return (
    <PanoramaCanvasSection
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
      id={anchor}
    >
      <figure
        className="grid overflow-hidden rounded-[2rem] border border-black/12 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]"
        style={{ boxShadow: "0 28px 72px rgba(17,17,17,0.1)" }}
      >
        <div className="bg-[#f8f6ef] p-8 sm:p-10">
          <PanoramaSectionEyebrow>Field Validation</PanoramaSectionEyebrow>
          <blockquote className="mt-5">
            <p
              className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-black sm:text-4xl"
              id={anchor ? `${anchor}-heading` : undefined}
            >
              &ldquo;{quote}&rdquo;
            </p>
          </blockquote>
          <figcaption className="mt-8 space-y-1">
            <p className="text-lg font-semibold text-black">{author}</p>
            {(role || company) ? (
              <p className="text-sm uppercase tracking-[0.24em] text-black/56">
                {[role, company].filter(Boolean).join(" / ")}
              </p>
            ) : null}
          </figcaption>
        </div>
        {image ? (
          <div className="relative min-h-[320px] bg-[#ddd8cf] lg:min-h-full">
            <Image
              alt={image.alt ?? author}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 38vw"
              src={image.url}
            />
          </div>
        ) : (
          <div className="hidden bg-[#ddd8cf] lg:block" />
        )}
      </figure>
    </PanoramaCanvasSection>
  );
}
