import Image from "next/image";
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
    <section
      className="py-16 md:py-24"
      id={anchor}
      aria-labelledby={anchor ? `${anchor}-heading` : undefined}
    >
      <figure className="overflow-hidden rounded-[2.5rem] border border-border/80 bg-surface/95 p-8 shadow-[0_28px_90px_rgba(33,28,22,0.08)] sm:p-10 lg:p-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.6fr)] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
              Customer Story
            </p>
            <blockquote>
              <p
                className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl"
                id={anchor ? `${anchor}-heading` : undefined}
              >
                &ldquo;{quote}&rdquo;
              </p>
            </blockquote>
            <figcaption className="space-y-1">
              <p className="text-lg font-semibold text-foreground">{author}</p>
              {(role || company) ? (
                <p className="text-sm uppercase tracking-[0.2em] text-muted">
                  {[role, company].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </figcaption>
          </div>
          {image ? (
            <div className="relative mx-auto h-64 w-full max-w-xs overflow-hidden rounded-[2rem] border border-white/70 bg-[#eadbc6] shadow-[0_20px_65px_rgba(33,28,22,0.12)]">
              <Image
                alt={image.alt ?? author}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 280px"
                src={image.url}
              />
            </div>
          ) : null}
        </div>
      </figure>
    </section>
  );
}
