"use client";

import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { SubmissionFormType } from "@/lib/validations/forms";

type FormViewTrackerProps = {
  formType: SubmissionFormType;
  location: string;
};

export function FormViewTracker({
  formType,
  location,
}: FormViewTrackerProps) {
  const trackerRef = useRef<HTMLSpanElement | null>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) {
      return;
    }

    const element = trackerRef.current;

    if (!element) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      trackAnalyticsEvent("form_view", {
        formType,
        location,
      });
      hasTrackedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting || hasTrackedRef.current) {
          return;
        }

        trackAnalyticsEvent("form_view", {
          formType,
          location,
        });
        hasTrackedRef.current = true;
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -20% 0px",
        threshold: 0.2,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [formType, location]);

  return (
    <span
      aria-hidden="true"
      className="absolute left-0 top-0 h-px w-px opacity-0 pointer-events-none"
      ref={trackerRef}
    />
  );
}
