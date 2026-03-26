import { afterEach, describe, expect, it, vi } from "vitest";
import {
  mapWordPressPageResponse,
  WordPressMappingError,
} from "@/lib/wordpress/mapper";

const siteUrl = "https://example.com";

const validResponse = {
  page: {
    title: "About Real Estate CRM",
    slug: "about",
    uri: "/about/",
    seo: {
      title: "About | Real Estate CRM",
      metaDesc: "Build a better real estate growth engine.",
      canonical: "https://example.com/about",
      opengraphTitle: "About Real Estate CRM",
      opengraphDescription: "Build a better real estate growth engine.",
      opengraphImage: {
        sourceUrl: "https://example.com/og-about.jpg",
      },
    },
    pageBuilder: {
      sections: [
        {
          __typename: "PageBuilderSectionsHeroLayout",
          anchor: "hero",
          eyebrow: "Growth Platform",
          headline: "A smarter CRM foundation for brokers.",
          body: "Turn marketing pages into a reliable acquisition funnel.",
          primaryCta: {
            label: "Book a demo",
            href: "/demo",
          },
          secondaryCta: {
            label: "See pricing",
            href: "/pricing",
          },
          backgroundImage: {
            node: {
              sourceUrl: "https://example.com/hero.jpg",
              altText: "Dashboard preview",
            },
          },
        },
        {
          __typename: "PageBuilderSectionsFeatureGridLayout",
          anchor: "features",
          headline: "Why teams switch",
          intro: "The operational pieces that unblock revenue.",
          items: [
            {
              title: "Lead routing",
              description: "Assign contacts faster.",
              icon: "route",
            },
            {
              title: "Lifecycle tracking",
              description: "Keep teams aligned.",
              icon: "timeline",
            },
          ],
        },
        {
          __typename: "PageBuilderSectionsRichtextLayout",
          anchor: "details",
          html: "<p>Rich body content from WordPress.</p>",
        },
      ],
    },
  },
};

describe("mapWordPressPageResponse", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps a valid WordPress payload into the normalized page model", () => {
    const page = mapWordPressPageResponse(validResponse, { siteUrl });

    expect(page).toEqual({
      title: "About Real Estate CRM",
      slug: "about",
      seo: {
        title: "About | Real Estate CRM",
        description: "Build a better real estate growth engine.",
        canonicalUrl: "https://example.com/about",
        openGraph: {
          title: "About Real Estate CRM",
          description: "Build a better real estate growth engine.",
          image: {
            url: "https://example.com/og-about.jpg",
          },
        },
      },
      sections: [
        {
          id: "hero",
          _type: "hero",
          anchor: "hero",
          eyebrow: "Growth Platform",
          headline: "A smarter CRM foundation for brokers.",
          body: "Turn marketing pages into a reliable acquisition funnel.",
          primaryCta: {
            label: "Book a demo",
            href: "/demo",
          },
          secondaryCta: {
            label: "See pricing",
            href: "/pricing",
          },
          backgroundImage: {
            url: "https://example.com/hero.jpg",
            alt: "Dashboard preview",
          },
        },
        {
          id: "features",
          _type: "featureGrid",
          anchor: "features",
          headline: "Why teams switch",
          intro: "The operational pieces that unblock revenue.",
          items: [
            {
              title: "Lead routing",
              description: "Assign contacts faster.",
              icon: "route",
            },
            {
              title: "Lifecycle tracking",
              description: "Keep teams aligned.",
              icon: "timeline",
            },
          ],
        },
        {
          id: "details",
          _type: "richText",
          anchor: "details",
          html: "<p>Rich body content from WordPress.</p>",
        },
      ],
    });
  });

  it("normalizes the homepage slug and derives SEO fallbacks", () => {
    const response = {
      page: {
        title: "Homepage",
        slug: "home",
        uri: "/",
        seo: null,
        pageBuilder: {
          sections: [],
        },
      },
    };

    const page = mapWordPressPageResponse(response, { siteUrl });

    expect(page).toEqual({
      title: "Homepage",
      slug: "",
      seo: {
        title: "Homepage",
        description: undefined,
        canonicalUrl: "https://example.com/",
        openGraph: {
          title: "Homepage",
          description: undefined,
          image: undefined,
        },
      },
      sections: [],
    });
  });

  it("maps Yoast SEO fallbacks into the normalized SEO model", () => {
    const response = {
      page: {
        title: "Platform Overview",
        slug: "platform",
        uri: "/platform/",
        seo: {
          title: null,
          metaDesc: "Operational clarity for high-performing teams.",
          canonical: null,
          opengraphTitle: null,
          opengraphDescription: null,
          opengraphImage: null,
        },
        pageBuilder: {
          sections: [],
        },
      },
    };

    const page = mapWordPressPageResponse(response, { siteUrl });

    expect(page?.seo).toEqual({
      title: "Platform Overview",
      description: "Operational clarity for high-performing teams.",
      canonicalUrl: "https://example.com/platform",
      openGraph: {
        title: "Platform Overview",
        description: "Operational clarity for high-performing teams.",
        image: undefined,
      },
    });
  });

  it("drops unknown or malformed sections without crashing the page", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
      return undefined;
    });

    const response = {
      ...validResponse,
      page: {
        ...validResponse.page,
        pageBuilder: {
          sections: [
            validResponse.page.pageBuilder.sections[0],
            {
              __typename: "PageBuilderSectionsUnknownLayout",
            },
            {
              __typename: "PageBuilderSectionsRichtextLayout",
              anchor: "bad-rich-text",
            },
          ],
        },
      },
    };

    const page = mapWordPressPageResponse(response, { siteUrl });

    expect(page?.sections).toHaveLength(1);
    expect(page?.sections[0]?._type).toBe("hero");
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });

  it("returns null when the page node is missing", () => {
    expect(
      mapWordPressPageResponse(
        {
          page: null,
        },
        { siteUrl },
      ),
    ).toBeNull();
  });

  it("throws when the top-level payload is invalid", () => {
    expect(() =>
      mapWordPressPageResponse(
        {
          page: {
            title: 42,
          },
        },
        { siteUrl },
      ),
    ).toThrow(WordPressMappingError);
  });
});
