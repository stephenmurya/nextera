import { draftMode } from "next/headers";
import {
  MinimalMarketingShell,
  StandardMarketingShell,
} from "@/components/layout/MarketingShell";
import { isMinimalPageTemplate } from "@/lib/site";
import {
  getGlobalSettings,
  getPageByUri,
  normalizeWordPressUri,
} from "@/lib/wordpress/client";
import type { GlobalSettings } from "@/types/cms";

const emptyGlobalSettings: GlobalSettings = {
  siteName: undefined,
  defaultSeoTitle: undefined,
  defaultSeoDescription: undefined,
  defaultSeoImage: undefined,
  twitterHandle: undefined,
  footerContactData: undefined,
  headerNav: [],
  footerNav: [],
  socialLinks: [],
  globalCta: null,
};

type CmsMarketingLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function CmsMarketingLayout({
  children,
  params,
}: CmsMarketingLayoutProps) {
  const { isEnabled } = await draftMode();
  const { slug } = await params;
  const uri = normalizeWordPressUri(slug);

  let globalSettings = emptyGlobalSettings;
  let template = "default";

  try {
    globalSettings = await getGlobalSettings(isEnabled);
  } catch (error) {
    console.error("[cms-marketing-layout] Failed to load global settings", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  try {
    const page = await getPageByUri(uri, isEnabled);

    if (page?.template) {
      template = page.template;
    }
  } catch (error) {
    console.error("[cms-marketing-layout] Failed to resolve page template", {
      message: error instanceof Error ? error.message : "Unknown error",
      uri,
    });
  }

  if (isMinimalPageTemplate(template)) {
    return (
      <MinimalMarketingShell siteName={globalSettings.siteName}>
        {children}
      </MinimalMarketingShell>
    );
  }

  return (
    <StandardMarketingShell globalSettings={globalSettings}>
      {children}
    </StandardMarketingShell>
  );
}
