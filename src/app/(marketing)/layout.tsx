import { draftMode } from "next/headers";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { GlobalSettings } from "@/types/cms";
import { getGlobalSettings } from "@/lib/wordpress/client";

const emptyGlobalSettings: GlobalSettings = {
  headerNav: [],
  footerNav: [],
  socialLinks: [],
  globalCta: null,
};

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();

  let globalSettings = emptyGlobalSettings;

  try {
    globalSettings = await getGlobalSettings(isEnabled);
  } catch (error) {
    console.error("[marketing-layout] Failed to load global settings", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return (
    <>
      <Navbar
        globalCta={globalSettings.globalCta}
        headerNav={globalSettings.headerNav}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 sm:px-10 sm:py-14">
        {children}
      </div>
      <Footer
        footerNav={globalSettings.footerNav}
        socialLinks={globalSettings.socialLinks}
      />
    </>
  );
}
