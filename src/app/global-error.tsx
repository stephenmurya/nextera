"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaDarkPanelClassName,
} from "@/components/panorama/PanoramaPrimitives";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";
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
        <main className="flex min-h-screen w-full flex-col">
          <PanoramaCanvasSection innerClassName="py-20 sm:py-24 lg:py-28">
            <div
              className={`${panoramaDarkPanelClassName} mx-auto max-w-4xl px-6 py-12 sm:px-10 sm:py-14 lg:px-14`}
            >
              <div className="space-y-8">
                <div className="space-y-4">
                  <PanoramaSectionEyebrow inverse>Application Error</PanoramaSectionEyebrow>
                  <div className="space-y-3">
                    <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                      Something went wrong.
                    </h1>
                    <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                      The app hit an unexpected failure while rendering this page.
                      Try again, or head back to the homepage while we recover the
                      experience.
                    </p>
                    {error.digest ? (
                      <p className="text-sm text-white/48">
                        Reference ID: {error.digest}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    className={getButtonClassName("cream", "sm")}
                    onClick={handleRetry}
                    style={getButtonStyle("cream")}
                    type="button"
                  >
                    Try Again
                  </button>
                  <Link
                    className={getButtonClassName("ghostInverse", "sm")}
                    href="/"
                    style={getButtonStyle("ghostInverse")}
                  >
                    Back Home
                  </Link>
                </div>
              </div>
            </div>
          </PanoramaCanvasSection>
        </main>
      </body>
    </html>
  );
}
