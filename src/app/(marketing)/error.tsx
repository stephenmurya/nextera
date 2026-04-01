"use client";

import Link from "next/link";
import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaDarkPanelClassName,
} from "@/components/panorama/PanoramaPrimitives";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";

type MarketingErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function MarketingError({
  unstable_retry,
}: MarketingErrorProps) {
  return (
    <PanoramaCanvasSection innerClassName="py-20 sm:py-24">
      <div
        className={`${panoramaDarkPanelClassName} mx-auto flex min-h-[60vh] max-w-4xl flex-col items-start justify-center gap-6 px-8 py-10 sm:px-10`}
      >
        <PanoramaSectionEyebrow inverse>CMS Unavailable</PanoramaSectionEyebrow>
        <div className="max-w-2xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
            Content is temporarily unavailable.
          </h1>
          <p className="text-base leading-8 text-white/72 sm:text-lg">
            The marketing site is online, but WordPress did not respond in time.
            Try the request again or head back to the homepage while the CMS
            connection recovers.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className={getButtonClassName("cream", "sm")}
            onClick={() => unstable_retry()}
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
    </PanoramaCanvasSection>
  );
}
