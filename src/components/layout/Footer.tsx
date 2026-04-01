import Link from "next/link";
import type { NavigationLink, SocialLink } from "@/types/cms";

type FooterProps = {
  footerNav: NavigationLink[];
  socialLinks: SocialLink[];
};

const footerLinkClassName =
  "text-sm text-foreground/68 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f2]";

export function Footer({ footerNav, socialLinks }: FooterProps) {
  return (
    <footer className="mt-auto w-full border-t border-black/10 bg-[#faf8f2]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-4">
            <p className="text-lg font-extrabold tracking-[-0.04em] text-foreground sm:text-xl">
              AgentFlow
            </p>
            <p className="max-w-md text-sm leading-7 text-foreground/68">
              Precision-built CRM infrastructure for modern real estate teams.
              WordPress manages the story. AgentFlow turns that story into conversion.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground/44">
                Navigation
              </p>
              <nav aria-label="Footer">
                <ul className="space-y-3">
                  {footerNav.map((item) => (
                    <li key={`${item.label}-${item.href}`}>
                      <Link className={footerLinkClassName} href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground/44">
                Social
              </p>
              <ul className="space-y-3">
                {socialLinks.map((item) => (
                  <li key={`${item.platform}-${item.url}`}>
                    <Link
                      className={footerLinkClassName}
                      href={item.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.platform}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-black/8 pt-5 text-xs uppercase tracking-[0.22em] text-foreground/40 sm:flex-row sm:items-center sm:justify-between">
          <p>AgentFlow Marketing System</p>
          <p>Built for conversion, clarity, and control.</p>
        </div>
      </div>
    </footer>
  );
}
