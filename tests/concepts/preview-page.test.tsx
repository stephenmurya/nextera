import { notFound } from "next/navigation";
import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";

const conceptPreviewMocks = vi.hoisted(() => ({
  draftMode: vi.fn(),
  getPageByUri: vi.fn(),
}));

vi.mock("next/headers", () => ({
  draftMode: conceptPreviewMocks.draftMode,
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/components/DraftIndicator", () => ({
  DraftIndicator: () => <div data-draft-indicator="true" />,
}));

vi.mock("@/demo/monograph/MonographHomepagePreview", () => ({
  MonographHomepagePreview: () => <div data-monograph-preview="true" />,
}));

vi.mock("@/demo/gridline/GridlineHomepagePreview", () => ({
  GridlineHomepagePreview: () => <div data-gridline-preview="true" />,
}));

vi.mock("@/demo/blueprint/BlueprintHomepagePreview", () => ({
  BlueprintHomepagePreview: () => <div data-blueprint-preview="true" />,
}));

vi.mock("@/demo/panorama/PanoramaHomepagePreview", () => ({
  PanoramaHomepagePreview: () => <div data-panorama-preview="true" />,
}));

vi.mock("@/lib/wordpress/client", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/wordpress/client")>(
      "@/lib/wordpress/client",
    );

  return {
    ...actual,
    getPageByUri: conceptPreviewMocks.getPageByUri,
  };
});

import { ConceptHomepagePreviewPage } from "@/demo/shared/ConceptHomepagePreviewPage";

const mockHomepage = {
  title: "Homepage",
  slug: "",
  seo: {
    canonicalUrl: "https://example.com/",
    description: "Homepage",
    openGraph: {
      description: "Homepage",
      title: "Homepage",
    },
    title: "Homepage",
  },
  sections: [],
};

describe("ConceptHomepagePreviewPage", () => {
  beforeEach(() => {
    conceptPreviewMocks.draftMode.mockReset();
    conceptPreviewMocks.getPageByUri.mockReset();
    conceptPreviewMocks.getPageByUri.mockResolvedValue(mockHomepage);
    vi.mocked(notFound).mockClear();
  });

  it("loads the homepage and renders the selected concept preview", async () => {
    conceptPreviewMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: false,
    });

    const html = renderToStaticMarkup(
      await ConceptHomepagePreviewPage({
        concept: "monograph",
      }),
    );

    expect(html).toContain("data-monograph-preview");
    expect(conceptPreviewMocks.getPageByUri).toHaveBeenCalledWith("/", false);
  });

  it("renders the draft indicator when preview mode is enabled", async () => {
    conceptPreviewMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: true,
    });

    const html = renderToStaticMarkup(
      await ConceptHomepagePreviewPage({
        concept: "gridline",
      }),
    );

    expect(html).toContain("data-draft-indicator");
    expect(html).toContain("data-gridline-preview");
    expect(conceptPreviewMocks.getPageByUri).toHaveBeenCalledWith("/", true);
  });

  it("calls notFound when the homepage cannot be resolved", async () => {
    conceptPreviewMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: false,
    });
    conceptPreviewMocks.getPageByUri.mockResolvedValue(null);

    await expect(
      ConceptHomepagePreviewPage({
        concept: "blueprint",
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("renders the panorama concept preview when requested", async () => {
    conceptPreviewMocks.draftMode.mockResolvedValue({
      disable: vi.fn(),
      enable: vi.fn(),
      isEnabled: false,
    });

    const html = renderToStaticMarkup(
      await ConceptHomepagePreviewPage({
        concept: "panorama",
      }),
    );

    expect(html).toContain("data-panorama-preview");
    expect(conceptPreviewMocks.getPageByUri).toHaveBeenCalledWith("/", false);
  });
});
