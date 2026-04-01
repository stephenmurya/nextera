import { afterEach, describe, expect, it, vi } from "vitest";
import {
  mapGlobalSettingsResponse,
  mapWordPressPageResponse,
  WordPressMappingError,
} from "@/lib/wordpress/mapper";

const siteUrl = "https://example.com";

const validResponse = {
  page: {
    title: "About Real Estate CRM",
    slug: "about",
    uri: "/about/",
    status: "publish",
    template: {
      templateName: "standard",
    },
    seo: {
      title: "About | Real Estate CRM",
      metaDesc: "Build a better real estate growth engine.",
      canonical: "https://example.com/about",
      metaRobotsNoindex: "index",
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
          __typename: "PageBuilderSectionsRichTextLayout",
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
      noindex: false,
      template: "standard",
      status: "publish",
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
        status: "draft",
        template: null,
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
      noindex: false,
      template: "default",
      status: "draft",
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
        status: "publish",
        template: {
          templateName: null,
        },
        seo: {
          title: null,
          metaDesc: "Operational clarity for high-performing teams.",
          canonical: null,
          metaRobotsNoindex: true,
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
    expect(page?.noindex).toBe(true);
    expect(page?.template).toBe("default");
    expect(page?.status).toBe("publish");
  });

  it("maps the expanded flexible content layouts into normalized sections", () => {
    const response = {
      page: {
        title: "Expanded Sections",
        slug: "expanded-sections",
        uri: "/expanded-sections/",
        status: "publish",
        template: {
          templateName: "landing",
        },
        seo: null,
        pageBuilder: {
          sections: [
            {
              __typename: "PageBuilderSectionsFaqLayout",
              anchor: "faq",
              headline: "Questions, answered",
              faqs: [
                {
                  question: "Does it support team handoff?",
                  answer: "Yes, with shared lead visibility.",
                },
              ],
            },
            {
              __typename: "PageBuilderSectionsCtaBandLayout",
              anchor: "cta",
              headline: "See the CRM in action",
              subheadline: "Book a walkthrough built around your workflow.",
              ctaButton: {
                label: "Request demo",
                href: "/demo",
              },
            },
            {
              __typename: "PageBuilderSectionsTestimonialLayout",
              anchor: "testimonial",
              quote: "We stopped losing high-intent leads.",
              author: "Ada Lovelace",
              role: "Broker Owner",
              company: "Analytical Estates",
              image: {
                node: {
                  sourceUrl: "https://example.com/testimonial.jpg",
                  altText: "Ada Lovelace portrait",
                },
              },
            },
            {
              __typename: "PageBuilderSectionsUseCasesLayout",
              anchor: "use-cases",
              headline: "Built for the way agents work",
              items: [
                {
                  title: "Lead follow-up",
                  description: "Keep response time tight.",
                  icon: "route",
                },
              ],
            },
            {
              __typename: "PageBuilderSectionsHowItWorksLayout",
              anchor: "how-it-works",
              headline: "How it works",
              steps: [
                {
                  stepNumber: 1,
                  title: "Capture",
                  description: "Bring inbound leads into one place.",
                },
              ],
            },
            {
              __typename: "PageBuilderSectionsStatsStripLayout",
              anchor: "stats",
              stats: [
                {
                  value: "3x",
                  label: "faster follow-up",
                },
              ],
            },
            {
              __typename: "PageBuilderSectionsFormSectionLayout",
              anchor: "form",
              formType: ["demo"],
              headline: "Book your demo",
              body: "Tell us about your market and team.",
            },
          ],
        },
      },
    };

    const page = mapWordPressPageResponse(response, { siteUrl });

    expect(page?.sections).toEqual([
      {
        id: "faq",
        _type: "faq",
        anchor: "faq",
        headline: "Questions, answered",
        faqs: [
          {
            question: "Does it support team handoff?",
            answer: "Yes, with shared lead visibility.",
          },
        ],
      },
      {
        id: "cta",
        _type: "ctaBand",
        anchor: "cta",
        headline: "See the CRM in action",
        subheadline: "Book a walkthrough built around your workflow.",
        primaryCta: {
          label: "Request demo",
          href: "/demo",
        },
      },
      {
        id: "testimonial",
        _type: "testimonial",
        anchor: "testimonial",
        quote: "We stopped losing high-intent leads.",
        author: "Ada Lovelace",
        role: "Broker Owner",
        company: "Analytical Estates",
        image: {
          url: "https://example.com/testimonial.jpg",
          alt: "Ada Lovelace portrait",
        },
      },
      {
        id: "use-cases",
        _type: "useCases",
        anchor: "use-cases",
        headline: "Built for the way agents work",
        items: [
          {
            title: "Lead follow-up",
            description: "Keep response time tight.",
            icon: "route",
          },
        ],
      },
      {
        id: "how-it-works",
        _type: "howItWorks",
        anchor: "how-it-works",
        headline: "How it works",
        steps: [
          {
            stepNumber: "1",
            title: "Capture",
            description: "Bring inbound leads into one place.",
          },
        ],
      },
      {
        id: "stats",
        _type: "statsStrip",
        anchor: "stats",
        stats: [
          {
            value: "3x",
            label: "faster follow-up",
          },
        ],
      },
      {
        id: "form",
        _type: "formSection",
        anchor: "form",
        formType: "demo",
        headline: "Book your demo",
        body: "Tell us about your market and team.",
      },
    ]);
    expect(page?.template).toBe("landing");
    expect(page?.status).toBe("publish");
    expect(page?.noindex).toBe(false);
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
              __typename: "PageBuilderSectionsRichTextLayout",
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

describe("mapGlobalSettingsResponse", () => {
  it("maps a valid global settings payload into the normalized model", () => {
    expect(
      mapGlobalSettingsResponse({
        globalSettings: {
          globalContent: {
            headerNav: [
              {
                label: "Home",
                href: "/",
              },
              {
                label: "Contact",
                href: "/contact",
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
          },
        },
      }),
    ).toEqual({
      headerNav: [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Contact",
          href: "/contact",
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

  it("falls back to empty collections when global settings are missing", () => {
    expect(
      mapGlobalSettingsResponse({
        globalSettings: null,
      }),
    ).toEqual({
      headerNav: [],
      footerNav: [],
      socialLinks: [],
      globalCta: null,
    });
  });

  it("falls back to empty collections when global content is missing", () => {
    expect(
      mapGlobalSettingsResponse({
        globalSettings: {
          globalContent: null,
        },
      }),
    ).toEqual({
      headerNav: [],
      footerNav: [],
      socialLinks: [],
      globalCta: null,
    });
  });

  it("drops incomplete navigation and social entries while preserving valid ones", () => {
    expect(
      mapGlobalSettingsResponse({
        globalSettings: {
          globalContent: {
            headerNav: [
              {
                label: "Home",
                href: "/",
              },
              {
                label: "",
                href: "/broken",
              },
            ],
            footerNav: [
              {
                label: null,
                href: "/terms",
              },
            ],
            socialLinks: [
              {
                platform: "LinkedIn",
                url: "https://linkedin.com/company/agentflow",
              },
              {
                platform: "X",
                url: "",
              },
            ],
            globalCta: null,
          },
        },
      }),
    ).toEqual({
      headerNav: [
        {
          label: "Home",
          href: "/",
        },
      ],
      footerNav: [],
      socialLinks: [
        {
          platform: "LinkedIn",
          url: "https://linkedin.com/company/agentflow",
        },
      ],
      globalCta: null,
    });
  });
});
