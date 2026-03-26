import nextConfig, {
  buildContentSecurityPolicy,
  buildRemotePatterns,
  buildSecurityHeaders,
  getWordPressOrigin,
} from "../../next.config";

describe("next.config security helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("derives the WordPress origin and remote patterns from the GraphQL URL", () => {
    expect(getWordPressOrigin("https://cms.example.com/graphql")).toBe(
      "https://cms.example.com",
    );
    expect(buildRemotePatterns("https://cms.example.com")).toEqual([
      {
        protocol: "https",
        hostname: "cms.example.com",
        pathname: "/**",
      },
    ]);
  });

  it("includes the derived image origin and toggles unsafe-eval only in development", () => {
    const developmentCsp = buildContentSecurityPolicy({
      nodeEnv: "development",
      wordpressOrigin: "https://cms.example.com",
    });
    const productionCsp = buildContentSecurityPolicy({
      nodeEnv: "production",
      wordpressOrigin: "https://cms.example.com",
    });

    expect(developmentCsp).toContain(
      "img-src 'self' data: https://cms.example.com",
    );
    expect(developmentCsp).toContain(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    );
    expect(developmentCsp).toContain("connect-src 'self' ws: wss:");
    expect(productionCsp).toContain("img-src 'self' data: https://cms.example.com");
    expect(productionCsp).toContain("script-src 'self' 'unsafe-inline'");
    expect(productionCsp).not.toContain("'unsafe-eval'");
    expect(productionCsp).not.toContain("connect-src");
  });

  it("emits the exact required security headers for all routes", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("WORDPRESS_GRAPHQL_URL", "https://cms.example.com/graphql");

    const headersResult = await nextConfig.headers?.();
    const routeHeaders = headersResult?.[0];

    expect(routeHeaders?.source).toBe("/(.*)");
    expect(buildSecurityHeaders({ nodeEnv: "development" })).toEqual(
      routeHeaders?.headers,
    );
    expect(routeHeaders?.headers).toEqual(
      expect.arrayContaining([
        { key: "X-DNS-Prefetch-Control", value: "on" },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ]),
    );
  });
});
