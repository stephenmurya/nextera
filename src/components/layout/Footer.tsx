import Link from "next/link";
import {
  PanoramaFullBleedSection,
  PanoramaInner,
  panoramaImageGridOverlayStyle,
} from "@/components/panorama/PanoramaPrimitives";
import type { NavigationLink, SocialLink } from "@/types/cms";

type FooterProps = {
  siteName: string;
  footerContactData?: string;
  footerNav: NavigationLink[];
  socialLinks: SocialLink[];
};

const footerLinkClassName =
  "text-sm text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]";

export function Footer({
  siteName,
  footerContactData,
  footerNav,
  socialLinks,
}: FooterProps) {
  return (
    <PanoramaFullBleedSection className="mt-auto bg-[#111111] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={panoramaImageGridOverlayStyle}
      />
      <PanoramaInner className="relative py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-5">
            <div className="space-y-4">
              <p className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                {siteName}
              </p>
              <p className="max-w-xl text-base leading-8 text-white/68">
                Precision-built CRM infrastructure for modern real estate teams.
                A clear, modern system for managing leads, follow-up, and client
                relationships across the entire property journey.
              </p>
            </div>
            {footerContactData ? (
              <div
                className="max-w-xl text-sm leading-7 text-white/62 [&_a]:text-white [&_a]:underline [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_p]:my-0"
                dangerouslySetInnerHTML={{ __html: footerContactData }}
              />
            ) : null}
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-4">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
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
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
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
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs uppercase tracking-[0.22em] text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>{siteName} Marketing System</p>
          <p>Built for conversion, clarity, and control.</p>
        </div>
      </PanoramaInner>
    </PanoramaFullBleedSection>
  );
}
