import type { NextConfig } from "next";

type SecurityHeader = {
  key: string;
  value: string;
};

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

type ContentSecurityPolicyOptions = {
  nodeEnv?: string;
  wordpressOrigin?: string | null;
};

function safeParseUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function getWordPressOrigin(
  wordpressGraphqlUrl = process.env.WORDPRESS_GRAPHQL_URL,
) {
  return safeParseUrl(wordpressGraphqlUrl)?.origin ?? null;
}

export function buildRemotePatterns(
  wordpressOrigin = getWordPressOrigin(),
): RemotePattern[] {
  if (!wordpressOrigin) {
    return [];
  }

  const parsedUrl = new URL(wordpressOrigin);
  const protocol =
    parsedUrl.protocol === "http:"
      ? "http"
      : parsedUrl.protocol === "https:"
        ? "https"
        : null;

  if (!protocol) {
    return [];
  }

  return [
    {
      protocol,
      hostname: parsedUrl.hostname,
      pathname: "/**",
      ...(parsedUrl.port ? { port: parsedUrl.port } : {}),
    },
  ];
}

export function buildContentSecurityPolicy({
  nodeEnv = process.env.NODE_ENV,
  wordpressOrigin = getWordPressOrigin(),
}: ContentSecurityPolicyOptions = {}) {
  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    ...(nodeEnv === "development" ? ["'unsafe-eval'"] : []),
    "https://js.hsforms.net",
    "https://*.hsforms.net",
    "https://va.vercel-scripts.com",
  ];

  const connectSources = [
    "'self'",
    "https://*.hubspot.com",
    "https://*.hsforms.com",
    "https://*.hsforms.net",
    "https://vitals.vercel-insights.com",
    ...(nodeEnv === "development" ? ["ws:", "wss:"] : []),
  ];

  const directives: Array<[string, string[]]> = [
    ["default-src", ["'self'"]],
    ["base-uri", ["'self'"]],
    ["object-src", ["'none'"]],
    ["frame-ancestors", ["'self'"]],
    ["script-src", scriptSources],
    ["script-src-elem", scriptSources],
    ["style-src", ["'self'", "'unsafe-inline'"]],
    ["connect-src", connectSources],
    ["frame-src", ["'self'", "https://*.hsforms.net", "https://*.hubspot.com"]],
    ["child-src", ["'self'", "https://*.hsforms.net", "https://*.hubspot.com"]],
    [
      "img-src",
      wordpressOrigin
        ? ["'self'", "data:", wordpressOrigin]
        : ["'self'", "data:"],
    ],
  ];

  return directives
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");
}

export function buildSecurityHeaders(
  options: ContentSecurityPolicyOptions = {},
): SecurityHeader[] {
  return [
    {
      key: "X-DNS-Prefetch-Control",
      value: "on",
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    {
      key: "X-XSS-Protection",
      value: "1; mode=block",
    },
    {
      key: "X-Frame-Options",
      value: "SAMEORIGIN",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy(options),
    },
  ];
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: buildRemotePatterns(),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: buildSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
