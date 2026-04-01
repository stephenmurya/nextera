import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";

const marketingLayoutMocks = vi.hoisted(() => ({
  draftMode: vi.fn(),
  getGlobalSettings: vi.fn(),
  getPageByUri: vi.fn(),
}));

vi.mock("next/headers", () => ({
  draftMode: marketingLayoutMocks.draftMode,
}));

vi.mock("@/lib/wordpress/client", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/wordpress/client")>(
      "@/lib/wordpress/client",
    );

  return {
    ...actual,
    getGlobalSettings: marketingLayoutMocks.getGlobalSettings,
    getPageByUri: marketingLayoutMocks.getPageByUri,
  };
});

import CmsMarketingLayout from "@/app/(marketing)/[[...slug]]/layout";

describe("CMS marketing layout", () => {
  beforeEach(() => {
    marketingLayoutMocks.draftMode.mockReset();
    marketingLayoutMocks.getGlobalSettings.mockReset();
    marketingLayoutMocks.getPageByUri.mockReset();
    marketingLayoutMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: false,
    });
    marketingLayoutMocks.getGlobalSettings.mockResolvedValue({
      siteName: "AgentFlow",
      defaultSeoTitle: "AgentFlow",
      defaultSeoDescription: "Default SEO description",
      defaultSeoImage: {
        url: "https://example.com/default-og.jpg",
        alt: "Default social preview",
      },
      twitterHandle: "@agentflow",
      footerContactData: "<p>hello@example.com</p>",
      headerNav: [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Early Access",
          href: "/early-access",
        },
      ],
      footerNav: [
        {
          label: "Privacy",
          href: "/privacy",
        },
      ],
      socialLinks: [
        {
          platform: "LinkedIn",
          url: "https://linkedin.com/company/agentflow",
        },
      ],
      globalCta: {
        label: "Request Demo",
        href: "/demo",
      },
    });
  });

  it("renders the standard shell for default templates", async () => {
    marketingLayoutMocks.getPageByUri.mockResolvedValue({
      template: "default",
    });

    const html = renderToStaticMarkup(
      await CmsMarketingLayout({
        children: <div data-page-content="true" />,
        params: Promise.resolve({
          slug: ["about"],
        }),
      }),
    );

    expect(marketingLayoutMocks.getGlobalSettings).toHaveBeenCalledWith(false);
    expect(marketingLayoutMocks.getPageByUri).toHaveBeenCalledWith(
      "/about/",
      false,
    );
    expect(html).toContain(">Home<");
    expect(html).toContain(">Early Access<");
    expect(html).toContain(">Request Demo<");
    expect(html).toContain(">Privacy<");
    expect(html).toContain(">LinkedIn<");
    expect(html).toContain("hello@example.com");
    expect(html).toContain("data-page-content");
  });

  it("renders the minimal shell for landing page templates", async () => {
    marketingLayoutMocks.getPageByUri.mockResolvedValue({
      template: "landing-page",
    });

    const html = renderToStaticMarkup(
      await CmsMarketingLayout({
        children: <div data-page-content="true" />,
        params: Promise.resolve({
          slug: ["demo"],
        }),
      }),
    );

    expect(html).toContain(">Landing Page<");
    expect(html).toContain(">AgentFlow<");
    expect(html).not.toContain(">Home<");
    expect(html).not.toContain(">Privacy<");
    expect(html).not.toContain(">Request Demo<");
    expect(html).toContain("data-page-content");
  });
});
