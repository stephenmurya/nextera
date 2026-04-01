import "server-only";
import { ClientError, GraphQLClient } from "graphql-request";
import { z } from "zod";
import { env } from "@/lib/env";
import {
  mapGlobalSettingsResponse,
  mapWordPressPageResponse,
  WordPressMappingError,
} from "@/lib/wordpress/mapper";
import {
  GET_ALL_PAGE_URIS,
  GET_GLOBAL_SETTINGS,
  GET_PAGE_BY_URI,
} from "@/lib/wordpress/queries";
import type { GlobalSettings, Page } from "@/types/cms";

export const WORDPRESS_REVALIDATE_SECONDS = 300;
export const WORDPRESS_TIMEOUT_MS = 10_000;

const WORDPRESS_QUERY_NAME = "GetPageByUri";
const WORDPRESS_CACHE_TAG = "wordpress";
const WORDPRESS_SITEMAP_QUERY_NAME = "GetAllPageUris";
const WORDPRESS_SITEMAP_CACHE_TAG = "wordpress-sitemap";
const WORDPRESS_GLOBAL_SETTINGS_QUERY_NAME = "GetGlobalSettings";
const WORDPRESS_GLOBAL_SETTINGS_CACHE_TAG = "wordpress-global-settings";

type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

type NextAwareRequestInit = RequestInit & {
  next?: NextFetchRequestConfig;
};

type WordPressRequestMode = "draft" | "published";

type WordPressErrorKind =
  | "timeout"
  | "graphql"
  | "mapping"
  | "network"
  | "unknown";

type GetPageByUriResponse = {
  page: unknown;
};

type GetGlobalSettingsResponse = {
  globalSettings?: unknown;
};

export type GetPageByUriVariables = {
  uri: string;
  asPreview: boolean;
};

type GetAllPageUrisVariables = {
  after?: string | null;
};

type CreateWordPressClientOptions = {
  isDraft?: boolean;
  tags?: string[];
};

const publishedPageUriSchema = z.object({
  uri: z.string().min(1),
  modified: z.string().nullish(),
});

const allPublishedPageUrisResponseSchema = z.object({
  pages: z.object({
    nodes: z.array(publishedPageUriSchema),
    pageInfo: z.object({
      hasNextPage: z.boolean(),
      endCursor: z.string().nullish(),
    }),
  }),
});

export type PublishedPageUri = {
  uri: string;
  modified?: string;
};

export type WordPressClientHeaders = Record<string, string>;

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export function normalizeSlug(
  input: string | readonly string[] | null | undefined,
) {
  if (Array.isArray(input)) {
    return input.join("/").trim().replace(/^\/+|\/+$/g, "");
  }

  if (typeof input === "string") {
    return input.trim().replace(/^\/+|\/+$/g, "");
  }

  return "";
}

export function toWordPressUri(slug: string) {
  return slug ? `/${slug}/` : "/";
}

export function normalizeWordPressUri(
  input: string | readonly string[] | null | undefined,
) {
  return toWordPressUri(normalizeSlug(input));
}

export function toPageCacheTag(slug: string) {
  return slug ? `page-${slug}` : "page-home";
}

export function getWordPressCacheTags(slug: string) {
  return unique([WORDPRESS_CACHE_TAG, toPageCacheTag(slug)]);
}

export function buildGetPageByUriVariables(
  input: string,
  isDraft = false,
): GetPageByUriVariables {
  return {
    uri: normalizeWordPressUri(input),
    asPreview: isDraft,
  };
}

export function getWordPressClientHeaders(
  isDraft = false,
): WordPressClientHeaders {
  return {
    "content-type": "application/json",
    ...(isDraft
      ? {
          Authorization: `Bearer ${env.WORDPRESS_PREVIEW_AUTH_TOKEN}`,
        }
      : {}),
  };
}

export function createWordPressFetch(
  slug: string,
  baseFetch: typeof fetch = fetch,
): typeof fetch {
  return createTaggedWordPressFetch(getWordPressCacheTags(slug), baseFetch);
}

export function createDraftWordPressFetch(
  baseFetch: typeof fetch = fetch,
): typeof fetch {
  return (input, init) => {
    const requestInit: NextAwareRequestInit = {
      ...((init as NextAwareRequestInit | undefined) ?? {}),
    };
    delete requestInit.next;

    return baseFetch(
      input,
      {
        ...requestInit,
        cache: "no-store",
      } as RequestInit,
    );
  };
}

function createTaggedWordPressFetch(
  tags: string[],
  baseFetch: typeof fetch = fetch,
): typeof fetch {
  const uniqueTags = unique(tags);

  return (input, init) => {
    const nextConfig = (init as NextAwareRequestInit | undefined)?.next;
    const requestInit: NextAwareRequestInit = {
      ...init,
      cache: "force-cache",
      next: {
        ...nextConfig,
        revalidate: WORDPRESS_REVALIDATE_SECONDS,
        tags: unique([...(nextConfig?.tags ?? []), ...uniqueTags]),
      },
    };

    return baseFetch(input, requestInit as RequestInit);
  };
}

function createWordPressClient({
  isDraft = false,
  tags = [],
}: CreateWordPressClientOptions) {
  return new GraphQLClient(env.WORDPRESS_GRAPHQL_URL, {
    fetch: isDraft
      ? createDraftWordPressFetch()
      : createTaggedWordPressFetch(tags),
    headers: getWordPressClientHeaders(isDraft),
  });
}

function classifyWordPressError(
  error: unknown,
): { kind: WordPressErrorKind; status?: number; message: string } {
  if (error instanceof WordPressMappingError) {
    return {
      kind: "mapping",
      message: error.message,
    };
  }

  if (error instanceof ClientError) {
    return {
      kind: "graphql",
      status: error.response.status,
      message: error.message,
    };
  }

  if (error instanceof DOMException && error.name === "TimeoutError") {
    return {
      kind: "timeout",
      message: "WordPress request timed out.",
    };
  }

  if (error instanceof Error) {
    return {
      kind: "network",
      message: error.message,
    };
  }

  return {
    kind: "unknown",
    message: "Unknown WordPress request failure.",
  };
}

export class WordPressRequestError extends Error {
  readonly code = "WORDPRESS_REQUEST_FAILED";

  constructor(
    message: string,
    public readonly details: {
      kind: WordPressErrorKind;
      queryName: string;
      slug: string;
      mode: WordPressRequestMode;
      status?: number;
    },
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "WordPressRequestError";
  }
}

export async function getPageBySlug(
  slugInput: string,
  isDraft = false,
): Promise<Page | null> {
  return getPageByUri(slugInput, isDraft);
}

export async function getPageByUri(
  uriInput: string,
  isDraft = false,
): Promise<Page | null> {
  const slug = normalizeSlug(uriInput);
  const mode: WordPressRequestMode = isDraft ? "draft" : "published";
  const variables = buildGetPageByUriVariables(uriInput, isDraft);

  try {
    const client = createWordPressClient({
      isDraft,
      tags: getWordPressCacheTags(slug),
    });
    const response = await client.request<
      GetPageByUriResponse,
      GetPageByUriVariables
    >({
      document: GET_PAGE_BY_URI,
      variables,
      signal: AbortSignal.timeout(WORDPRESS_TIMEOUT_MS),
    });

    return mapWordPressPageResponse(response, {
      siteUrl: env.NEXT_PUBLIC_SITE_URL,
    });
  } catch (error) {
    const details = classifyWordPressError(error);

    console.error("[wordpress] Query failed", {
      queryName: WORDPRESS_QUERY_NAME,
      slug,
      mode,
      variables,
      kind: details.kind,
      status: details.status,
      message: details.message,
    });

    throw new WordPressRequestError(
      `WordPress query ${WORDPRESS_QUERY_NAME} failed.`,
      {
        kind: details.kind,
        queryName: WORDPRESS_QUERY_NAME,
        slug,
        mode,
        status: details.status,
      },
      {
        cause: error instanceof Error ? error : undefined,
      },
    );
  }
}

export async function getAllPublishedPageUris(): Promise<PublishedPageUri[]> {
  const client = createWordPressClient({
    tags: [WORDPRESS_CACHE_TAG, WORDPRESS_SITEMAP_CACHE_TAG],
  });
  const pages: PublishedPageUri[] = [];
  let after: string | null = null;

  try {
    while (true) {
      const variables: GetAllPageUrisVariables = {
        after,
      };
      const response = await client.request<
        z.infer<typeof allPublishedPageUrisResponseSchema>,
        GetAllPageUrisVariables
      >({
        document: GET_ALL_PAGE_URIS,
        variables,
        signal: AbortSignal.timeout(WORDPRESS_TIMEOUT_MS),
      });
      const parsedResponse = allPublishedPageUrisResponseSchema.safeParse(
        response,
      );

      if (!parsedResponse.success) {
        throw new WordPressMappingError(
          "WordPress sitemap response failed validation.",
          parsedResponse.error.issues,
        );
      }

      pages.push(
        ...parsedResponse.data.pages.nodes.map((node) => ({
          uri: node.uri,
          modified: node.modified ?? undefined,
        })),
      );

      if (
        !parsedResponse.data.pages.pageInfo.hasNextPage ||
        !parsedResponse.data.pages.pageInfo.endCursor
      ) {
        break;
      }

      after = parsedResponse.data.pages.pageInfo.endCursor;
    }

    return pages;
  } catch (error) {
    const details = classifyWordPressError(error);

    console.error("[wordpress] Query failed", {
      queryName: WORDPRESS_SITEMAP_QUERY_NAME,
      kind: details.kind,
      status: details.status,
      message: details.message,
    });

    return [];
  }
}

export async function getGlobalSettings(
  isDraft = false,
): Promise<GlobalSettings> {
  const mode: WordPressRequestMode = isDraft ? "draft" : "published";

  try {
    const client = createWordPressClient({
      isDraft,
      tags: [WORDPRESS_CACHE_TAG, WORDPRESS_GLOBAL_SETTINGS_CACHE_TAG],
    });
    const response = await client.request<GetGlobalSettingsResponse>({
      document: GET_GLOBAL_SETTINGS,
      signal: AbortSignal.timeout(WORDPRESS_TIMEOUT_MS),
    });

    return mapGlobalSettingsResponse(response);
  } catch (error) {
    const details = classifyWordPressError(error);

    console.error("[wordpress] Query failed", {
      queryName: WORDPRESS_GLOBAL_SETTINGS_QUERY_NAME,
      mode,
      kind: details.kind,
      status: details.status,
      message: details.message,
    });

    throw new WordPressRequestError(
      `WordPress query ${WORDPRESS_GLOBAL_SETTINGS_QUERY_NAME} failed.`,
      {
        kind: details.kind,
        queryName: WORDPRESS_GLOBAL_SETTINGS_QUERY_NAME,
        slug: "global-settings",
        mode,
        status: details.status,
      },
      {
        cause: error instanceof Error ? error : undefined,
      },
    );
  }
}
