import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

type PreviewButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function PreviewButtonLink({
  href,
  children,
  className,
  style,
}: PreviewButtonLinkProps) {
  return (
    <Link
      className={[
        "inline-flex items-center justify-center text-sm font-semibold transition",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      href={href}
      style={style}
    >
      {children}
    </Link>
  );
}
