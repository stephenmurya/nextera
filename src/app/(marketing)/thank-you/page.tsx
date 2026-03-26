import Link from "next/link";

export default function ThankYouPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-border/80 bg-surface/95 px-8 py-12 text-center shadow-[0_28px_90px_rgba(33,28,22,0.08)] sm:px-12">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            Submission Received
          </span>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Thanks, your request is in.
            </h1>
            <p className="text-base leading-8 text-muted sm:text-lg">
              Our team has everything they need and will follow up shortly with
              the right next step for your CRM rollout.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf3]"
              href="/"
            >
              Return home
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf3]"
              href="/"
            >
              Explore the site
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
