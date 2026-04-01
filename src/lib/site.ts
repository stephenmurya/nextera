const DEFAULT_SITE_NAME = "AgentFlow";

function normalizeOptionalString(value: string | null | undefined) {
  const normalized = value?.trim();

  return normalized ? normalized : undefined;
}

export function resolveSiteName(siteName: string | null | undefined) {
  return normalizeOptionalString(siteName) ?? DEFAULT_SITE_NAME;
}

export function formatDocumentTitle(
  title: string | null | undefined,
  siteName: string | null | undefined,
) {
  const resolvedSiteName = resolveSiteName(siteName);
  const resolvedTitle = normalizeOptionalString(title);

  if (!resolvedTitle || resolvedTitle.toLowerCase() === resolvedSiteName.toLowerCase()) {
    return resolvedSiteName;
  }

  const suffix = `| ${resolvedSiteName}`;

  if (resolvedTitle.endsWith(suffix)) {
    return resolvedTitle;
  }

  return `${resolvedTitle} ${suffix}`;
}

export function isMinimalPageTemplate(template: string | null | undefined) {
  const normalizedTemplate = normalizeOptionalString(template)?.toLowerCase();

  return normalizedTemplate === "landing-page" || normalizedTemplate === "landing";
}
