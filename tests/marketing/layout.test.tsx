import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";

const marketingLayoutMocks = vi.hoisted(() => ({
  draftMode: vi.fn(),
  getGlobalSettings: vi.fn(),
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
  };
});

import MarketingLayout from "@/app/(marketing)/layout";

describe("marketing layout", () => {
  beforeEach(() => {
    marketingLayoutMocks.draftMode.mockReset();
    marketingLayoutMocks.getGlobalSettings.mockReset();
    marketingLayoutMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: false,
    });
    marketingLayoutMocks.getGlobalSettings.mockResolvedValue({
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

  it("renders WordPress-driven navbar and footer content", async () => {
    const html = renderToStaticMarkup(
      await MarketingLayout({
        children: <div data-page-content="true" />,
      }),
    );

    expect(marketingLayoutMocks.getGlobalSettings).toHaveBeenCalledWith(false);
    expect(html).toContain(">Home<");
    expect(html).toContain(">Early Access<");
    expect(html).toContain(">Request Demo<");
    expect(html).toContain(">Privacy<");
    expect(html).toContain(">LinkedIn<");
    expect(html).toContain("data-page-content");
  });
});
