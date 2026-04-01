import Link from "next/link";
import { conceptList } from "@/demo/shared/concepts";
import { buildConceptMetadata } from "@/demo/shared/metadata";

export const metadata = buildConceptMetadata(
  "Homepage UI Concepts",
  "Internal visual reference routes for the AgentFlow homepage redesign directions.",
);

export default function ConceptsIndexPage() {
  return (
    <main className="min-h-full bg-[#f3f3f1] text-[#111111]">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10 sm:px-10 sm:py-14">
        <div className="space-y-4 border-b border-black/10 pb-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.32em] text-black/50"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Internal Preview Routes
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
            Homepage concept directions for AgentFlow.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-black/68">
            These previews all pull the live homepage content from WordPress and
            only change the presentation layer. The production site stays
            untouched while we compare four visual directions side by side.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 2xl:grid-cols-4">
          {conceptList.map((concept) => (
            <article
              className="flex h-full flex-col justify-between rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_24px_60px_rgba(17,17,17,0.05)]"
              key={concept.slug}
            >
              <div className="space-y-4">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.32em] text-black/48"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  {concept.name}
                </p>
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-black">
                    {concept.direction}
                  </h2>
                  <p className="text-base leading-8 text-black/68">
                    {concept.summary}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
                  href={concept.route}
                >
                  Open Preview
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black transition hover:border-black"
                  href="/"
                >
                  Back to Live Site
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
