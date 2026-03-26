"use client";

import Link from "next/link";
import { useEffect } from "react";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry?: () => void;
};

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRetry = () => {
    if (typeof reset === "function") {
      reset();
      return;
    }

    unstable_retry?.();
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10 sm:px-10 sm:py-14">
          <div className="overflow-hidden rounded-[2.5rem] border border-border/80 bg-surface/95 shadow-[0_28px_90px_rgba(33,28,22,0.08)]">
            <div className="space-y-8 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
              <div className="space-y-4">
                <span className="rounded-full border border-border/80 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  Application Error
                </span>
                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    Something went wrong.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
                    The app hit an unexpected failure while rendering this page.
                    Try again, or head back to the homepage while we recover the
                    experience.
                  </p>
                  {error.digest ? (
                    <p className="text-sm text-muted">
                      Reference ID: {error.digest}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf3]"
                  onClick={handleRetry}
                  type="button"
                >
                  Try Again
                </button>
                <Link
                  className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf3]"
                  href="/"
                >
                  Back Home
                </Link>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
