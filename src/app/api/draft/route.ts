import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { secureCompare } from "@/lib/crypto";
import { env } from "@/lib/env";
import { getPageBySlug, normalizeSlug } from "@/lib/wordpress/client";

export const runtime = "nodejs";

const ABSOLUTE_SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

type DraftDestination = {
  normalizedSlug: string;
  redirectPath: string;
};

function sanitizeDraftPath(rawSlug: string | null): DraftDestination | null {
  if (typeof rawSlug !== "string") {
    return null;
  }

  const trimmedSlug = rawSlug.trim();

  if (
    trimmedSlug.length === 0 ||
    !trimmedSlug.startsWith("/") ||
    trimmedSlug.startsWith("//") ||
    trimmedSlug.includes("\\") ||
    ABSOLUTE_SCHEME_PATTERN.test(trimmedSlug)
  ) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedSlug, "http://localhost");
    const normalizedPath = normalizeSlug(parsedUrl.pathname);
    const pathname = normalizedPath ? `/${normalizedPath}` : "/";

    return {
      normalizedSlug: normalizedPath,
      redirectPath: `${pathname}${parsedUrl.search}${parsedUrl.hash}`,
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret") ?? "";
  const sanitizedPath = sanitizeDraftPath(searchParams.get("slug"));

  if (!secureCompare(secret, env.WORDPRESS_PREVIEW_SECRET)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!sanitizedPath) {
    return NextResponse.json({ message: "Invalid slug" }, { status: 400 });
  }

  try {
    const page = await getPageBySlug(sanitizedPath.normalizedSlug, true);

    if (!page) {
      return NextResponse.json({ message: "Invalid slug" }, { status: 404 });
    }
  } catch (error) {
    console.error("[draft] Preview validation failed", {
      slug: sanitizedPath.normalizedSlug,
      message: error instanceof Error ? error.message : "Unknown preview error",
    });

    return NextResponse.json(
      { message: "Preview unavailable" },
      { status: 502 },
    );
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(sanitizedPath.redirectPath, request.url));
}
