import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";

const marketingPageMocks = vi.hoisted(() => ({
  draftMode: vi.fn(),
  getPageBySlug: vi.fn(),
}));

vi.mock("next/headers", () => ({
  draftMode: marketingPageMocks.draftMode,
}));

vi.mock("@/components/DraftIndicator", () => ({
  DraftIndicator: () => <div data-draft-indicator="true" />,
}));

vi.mock("@/components/SectionRenderer", () => ({
  SectionRenderer: () => <div data-section-renderer="true" />,
}));

vi.mock("@/lib/wordpress/client", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/wordpress/client")>(
      "@/lib/wordpress/client",
    );

  return {
    ...actual,
    getPageBySlug: marketingPageMocks.getPageBySlug,
  };
});

import MarketingPage from "@/app/(marketing)/[[...slug]]/page";

const mockPage = {
  title: "About",
  slug: "about",
  seo: {
    canonicalUrl: "https://example.com/about",
    description: "About page",
    openGraph: {
      description: "About page",
      title: "About",
    },
    title: "About",
  },
  sections: [],
};

describe("marketing page draft indicator", () => {
  beforeEach(() => {
    marketingPageMocks.draftMode.mockReset();
    marketingPageMocks.getPageBySlug.mockReset();
    marketingPageMocks.getPageBySlug.mockResolvedValue(mockPage);
  });

  it("renders the draft indicator only when preview mode is enabled", async () => {
    marketingPageMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: true,
    });

    const html = renderToStaticMarkup(
      await MarketingPage({
        params: Promise.resolve({
          slug: ["about"],
        }),
      }),
    );

    expect(html).toContain("data-draft-indicator");
    expect(marketingPageMocks.getPageBySlug).toHaveBeenCalledWith(
      "about",
      true,
    );
  });

  it("omits the draft indicator when preview mode is disabled", async () => {
    marketingPageMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: false,
    });

    const html = renderToStaticMarkup(
      await MarketingPage({
        params: Promise.resolve({
          slug: ["about"],
        }),
      }),
    );

    expect(html).not.toContain("data-draft-indicator");
    expect(marketingPageMocks.getPageBySlug).toHaveBeenCalledWith(
      "about",
      false,
    );
  });
});
