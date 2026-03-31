"use client";

import Link from "next/link";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";

type MarketingErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function MarketingError({
  unstable_retry,
}: MarketingErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center gap-6 rounded-[2rem] border border-border/80 bg-surface/95 p-8 shadow-[0_24px_80px_rgba(33,28,22,0.08)]">
      <span className="rounded-full border border-border/80 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
        CMS Unavailable
      </span>
      <div className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Content is temporarily unavailable.
        </h1>
        <p className="text-base leading-7 text-muted sm:text-lg">
          The marketing site is online, but WordPress did not respond in time.
          Try the request again or head back to the homepage while the CMS
          connection recovers.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className={getButtonClassName("primary", "sm")}
          onClick={() => unstable_retry()}
          style={getButtonStyle("primary")}
          type="button"
        >
          Try Again
        </button>
        <Link
          className={getButtonClassName("secondary", "sm")}
          href="/"
          style={getButtonStyle("secondary")}
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
