"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { trackAnalyticsEvent } from "@/lib/analytics";

type TrackedCtaLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  label: string;
  location: string;
  rel?: string;
  style?: CSSProperties;
  target?: string;
};

export function TrackedCtaLink({
  children,
  className,
  href,
  label,
  location,
  rel,
  style,
  target,
}: TrackedCtaLinkProps) {
  return (
    <Link
      className={className}
      href={href}
      onClick={() => {
        trackAnalyticsEvent("cta_click", {
          label,
          href,
          location,
        });
      }}
      rel={rel}
      style={style}
      target={target}
    >
      {children}
    </Link>
  );
}
