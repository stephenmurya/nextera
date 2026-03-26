import Link from "next/link";

export function DraftIndicator() {
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-2xl border border-amber-300 bg-amber-400 px-4 py-3 text-sm font-medium text-amber-950 shadow-lg shadow-amber-950/15">
      <div className="flex items-center gap-3">
        <span>Preview Mode Active</span>
        <Link
          className="rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-amber-400"
          href="/api/disable-draft"
          prefetch={false}
        >
          Exit Preview
        </Link>
      </div>
    </div>
  );
}
