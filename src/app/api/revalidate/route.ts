import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { secureCompare } from "@/lib/crypto";
import { env } from "@/lib/env";
import { normalizeSlug, toPageCacheTag } from "@/lib/wordpress/client";

export const runtime = "nodejs";

const MAX_REVALIDATION_TAGS = 25;
const ABSOLUTE_SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

const revalidatePayloadSchema = z.union([
  z.object({ slug: z.string() }).strict(),
  z.object({ tags: z.array(z.string()).min(1).max(MAX_REVALIDATION_TAGS) }).strict(),
]);

function getBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  return token.length > 0 ? token : null;
}

function normalizeWebhookSlug(rawSlug: string) {
  const trimmedSlug = rawSlug.trim();

  if (trimmedSlug.length === 0) {
    return "";
  }

  if (
    trimmedSlug.startsWith("//") ||
    trimmedSlug.includes("\\") ||
    ABSOLUTE_SCHEME_PATTERN.test(trimmedSlug)
  ) {
    return null;
  }

  if (trimmedSlug.startsWith("/")) {
    try {
      const parsedUrl = new URL(trimmedSlug, "http://localhost");

      return normalizeSlug(parsedUrl.pathname);
    } catch {
      return null;
    }
  }

  return normalizeSlug(trimmedSlug);
}

function normalizeTags(tags: string[]) {
  return Array.from(
    new Set(tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)),
  );
}

export async function POST(request: Request) {
  const bearerToken = getBearerToken(request.headers.get("authorization"));

  if (!bearerToken || !secureCompare(bearerToken, env.REVALIDATION_SECRET)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsedPayload = revalidatePayloadSchema.safeParse(body);

  if (!parsedPayload.success) {
    return NextResponse.json(
      { message: "Invalid revalidation payload." },
      { status: 400 },
    );
  }

  try {
    const tags =
      "slug" in parsedPayload.data
        ? (() => {
            const normalizedSlug = normalizeWebhookSlug(parsedPayload.data.slug);

            if (normalizedSlug === null) {
              return null;
            }

            return [toPageCacheTag(normalizedSlug)];
          })()
        : normalizeTags(parsedPayload.data.tags);

    if (!tags || tags.length === 0) {
      return NextResponse.json(
        { message: "Invalid revalidation payload." },
        { status: 400 },
      );
    }

    for (const tag of normalizeTags([...tags, "wordpress-sitemap"])) {
      revalidateTag(tag, "max");
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error("[revalidate] Webhook failed", {
      message: error instanceof Error ? error.message : "Unknown revalidation error",
    });

    return NextResponse.json(
      { message: "Unable to revalidate content." },
      { status: 500 },
    );
  }
}
