"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";

type PageViewTrackerProps = {
  template: string;
};

export function PageViewTracker({ template }: PageViewTrackerProps) {
  const pathname = usePathname();
  const lastTrackedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const path = pathname ?? "/";
    const trackingKey = `${path}:${template}`;

    if (lastTrackedKeyRef.current === trackingKey) {
      return;
    }

    trackAnalyticsEvent("page_view", {
      path,
      template,
    });
    lastTrackedKeyRef.current = trackingKey;
  }, [pathname, template]);

  return null;
}
