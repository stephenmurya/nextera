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
  const directives: Array<[string, string[]]> = [
    ["default-src", ["'self'"]],
    ["base-uri", ["'self'"]],
    ["object-src", ["'none'"]],
    ["frame-ancestors", ["'self'"]],
    [
      "script-src",
      nodeEnv === "development"
        ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
        : ["'self'", "'unsafe-inline'"],
    ],
    ["style-src", ["'self'", "'unsafe-inline'"]],
    [
      "img-src",
      wordpressOrigin
        ? ["'self'", "data:", wordpressOrigin]
        : ["'self'", "data:"],
    ],
  ];

  if (nodeEnv === "development") {
    directives.push(["connect-src", ["'self'", "ws:", "wss:"]]);
  }

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
