import Link from "next/link";
import { TrackedCtaLink } from "@/components/observability/TrackedCtaLink";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";
import type { CallToAction, NavigationLink } from "@/types/cms";

const navLinkClassName =
  "text-sm font-medium text-foreground/80 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

type NavbarProps = {
  headerNav: NavigationLink[];
  globalCta: CallToAction | null;
};

export function Navbar({ headerNav, globalCta }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <div className="flex items-center gap-8 lg:gap-10">
          <Link
            className="text-lg font-extrabold tracking-[-0.04em] text-foreground sm:text-xl"
            href="/"
          >
            AgentFlow
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 md:flex lg:gap-8"
          >
            {headerNav.map((item) => (
              <Link className={navLinkClassName} href={item.href} key={`${item.label}-${item.href}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {globalCta ? (
          <TrackedCtaLink
            className={getButtonClassName(
              "primary",
              "sm",
              "focus-visible:ring-offset-white",
            )}
            href={globalCta.href}
            label={globalCta.label}
            location="navbar"
            style={getButtonStyle("primary")}
          >
            {globalCta.label}
          </TrackedCtaLink>
        ) : null}
      </div>
    </header>
  );
}
