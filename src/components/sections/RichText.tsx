import type { RichTextSection as RichTextSectionData } from "@/types/cms";

export function RichText({ anchor, html }: RichTextSectionData) {
  return (
    <section className="py-16 md:py-24" id={anchor}>
      <div className="rounded-[2rem] border border-border/80 bg-surface/95 p-6 shadow-[0_20px_65px_rgba(33,28,22,0.06)] sm:p-10">
        <div className="prose prose-slate mx-auto max-w-none lg:prose-lg">
          {/* TRUST BOUNDARY: Assumes WordPress HTML is trusted. If editor privileges change, introduce isomorphic-dompurify here. */}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </section>
  );
}
