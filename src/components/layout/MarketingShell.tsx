import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PanoramaInner } from "@/components/panorama/PanoramaPrimitives";
import { resolveSiteName } from "@/lib/site";
import type { GlobalSettings } from "@/types/cms";

type MarketingShellProps = {
  children: React.ReactNode;
};

type StandardMarketingShellProps = MarketingShellProps & {
  globalSettings: GlobalSettings;
};

type MinimalMarketingShellProps = MarketingShellProps & {
  siteName?: string;
};

export function StandardMarketingShell({
  children,
  globalSettings,
}: StandardMarketingShellProps) {
  const siteName = resolveSiteName(globalSettings.siteName);

  return (
    <>
      <Navbar
        globalCta={globalSettings.globalCta}
        headerNav={globalSettings.headerNav}
        siteName={siteName}
      />
      <div className="flex w-full flex-1 flex-col">{children}</div>
      <Footer
        footerContactData={globalSettings.footerContactData}
        footerNav={globalSettings.footerNav}
        siteName={siteName}
        socialLinks={globalSettings.socialLinks}
      />
    </>
  );
}

export function MinimalMarketingShell({
  children,
  siteName,
}: MinimalMarketingShellProps) {
  const resolvedSiteName = resolveSiteName(siteName);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[#fcfbf7]/92 text-black backdrop-blur-md">
        <PanoramaInner className="py-4 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/44"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Landing Page
            </p>
            <Link
              className="text-lg font-semibold tracking-[-0.05em] text-black sm:text-[1.2rem]"
              href="/"
            >
              {resolvedSiteName}
            </Link>
          </div>
        </PanoramaInner>
      </header>
      <div className="flex w-full flex-1 flex-col">{children}</div>
    </>
  );
}
