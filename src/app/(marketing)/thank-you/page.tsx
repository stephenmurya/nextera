import Link from "next/link";
import {
  PanoramaCanvasSection,
  PanoramaSectionEyebrow,
  panoramaDarkPanelClassName,
} from "@/components/panorama/PanoramaPrimitives";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";

export default function ThankYouPage() {
  return (
    <PanoramaCanvasSection innerClassName="py-20 sm:py-24">
      <div
        className={`${panoramaDarkPanelClassName} mx-auto max-w-4xl px-8 py-12 text-center sm:px-12`}
      >
        <div className="space-y-5">
          <PanoramaSectionEyebrow inverse>Submission Received</PanoramaSectionEyebrow>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              Thanks, your request is in.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-white/74 sm:text-lg">
              Our team has everything they need and will follow up shortly with
              the right next step for your CRM rollout.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <Link
              className={getButtonClassName("cream")}
              href="/"
              style={getButtonStyle("cream")}
            >
              Return home
            </Link>
            <Link
              className={getButtonClassName("ghostInverse")}
              href="/"
              style={getButtonStyle("ghostInverse")}
            >
              Explore the site
            </Link>
          </div>
        </div>
      </div>
    </PanoramaCanvasSection>
  );
}
