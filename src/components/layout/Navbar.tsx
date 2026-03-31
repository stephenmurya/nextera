import Link from "next/link";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";

const navLinkClassName =
  "text-sm font-medium text-foreground/80 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function Navbar() {
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
            <Link className={navLinkClassName} href="/">
              Home
            </Link>
            <Link className={navLinkClassName} href="/early-access">
              Early Access
            </Link>
            <Link className={navLinkClassName} href="/contact">
              Contact
            </Link>
          </nav>
        </div>
        <Link
          className={getButtonClassName(
            "primary",
            "sm",
            "focus-visible:ring-offset-white",
          )}
          href="/demo"
          style={getButtonStyle("primary")}
        >
          Request Demo
        </Link>
      </div>
    </header>
  );
}
