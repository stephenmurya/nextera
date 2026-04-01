import Link from "next/link";
import { TrackedCtaLink } from "@/components/observability/TrackedCtaLink";
import { PanoramaInner } from "@/components/panorama/PanoramaPrimitives";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";
import type { CallToAction, NavigationLink } from "@/types/cms";

const navLinkClassName =
  "text-sm font-medium text-white/76 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]";

type NavbarProps = {
  headerNav: NavigationLink[];
  globalCta: CallToAction | null;
};

export function Navbar({ headerNav, globalCta }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/42 text-white backdrop-blur-md">
      <PanoramaInner className="py-4 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              className="text-xl font-semibold tracking-[-0.05em] text-white sm:text-[1.35rem]"
              href="/"
            >
              AgentFlow
            </Link>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <nav
              aria-label="Primary"
              className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:gap-x-7"
            >
              {headerNav.map((item) => (
                <Link
                  className={navLinkClassName}
                  href={item.href}
                  key={`${item.label}-${item.href}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {globalCta ? (
              <TrackedCtaLink
                className={getButtonClassName("cream", "sm")}
                href={globalCta.href}
                label={globalCta.label}
                location="navbar"
                style={getButtonStyle("cream")}
              >
                {globalCta.label}
              </TrackedCtaLink>
            ) : null}
          </div>
        </div>
      </PanoramaInner>
    </header>
  );
}
