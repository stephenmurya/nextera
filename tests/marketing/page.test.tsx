import { notFound } from "next/navigation";
import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";

const marketingPageMocks = vi.hoisted(() => ({
  draftMode: vi.fn(),
  getPageByUri: vi.fn(),
}));

vi.mock("next/headers", () => ({
  draftMode: marketingPageMocks.draftMode,
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/components/DraftIndicator", () => ({
  DraftIndicator: () => <div data-draft-indicator="true" />,
}));

vi.mock("@/components/observability/PageViewTracker", () => ({
  PageViewTracker: () => <div data-page-view-tracker="true" />,
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
    getPageByUri: marketingPageMocks.getPageByUri,
  };
});

import MarketingPage, {
  generateMetadata,
} from "@/app/(marketing)/[[...slug]]/page";

const mockPage = {
  title: "About",
  slug: "about",
  noindex: false,
  template: "standard",
  status: "publish",
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
    marketingPageMocks.getPageByUri.mockReset();
    marketingPageMocks.getPageByUri.mockResolvedValue(mockPage);
    vi.mocked(notFound).mockClear();
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
    expect(html).toContain("data-page-view-tracker");
    expect(html).toContain('data-page-template="standard"');
    expect(marketingPageMocks.getPageByUri).toHaveBeenCalledWith(
      "/about/",
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
    expect(html).toContain("data-page-view-tracker");
    expect(html).toContain('data-page-template="standard"');
    expect(marketingPageMocks.getPageByUri).toHaveBeenCalledWith(
      "/about/",
      false,
    );
  });

  it("joins nested slugs into the matching WordPress URI", async () => {
    marketingPageMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: false,
    });

    await MarketingPage({
      params: Promise.resolve({
        slug: ["about", "team"],
      }),
    });

    expect(marketingPageMocks.getPageByUri).toHaveBeenCalledWith(
      "/about/team/",
      false,
    );
  });

  it("calls notFound when WordPress returns no page for a URI", async () => {
    marketingPageMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: false,
    });
    marketingPageMocks.getPageByUri.mockResolvedValue(null);

    await expect(
      MarketingPage({
        params: Promise.resolve({
          slug: ["missing-page"],
        }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("returns noindex robots metadata for pages marked noindex", async () => {
    marketingPageMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: false,
    });
    marketingPageMocks.getPageByUri.mockResolvedValue({
      ...mockPage,
      noindex: true,
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({
        slug: ["about"],
      }),
    });

    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
