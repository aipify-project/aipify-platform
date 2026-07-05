export type CompanionSubmitPageContextSurface = "public" | "app";

export type CompanionSubmitPageContext = {
  pathname?: string;
  title?: string;
  metaDescription?: string;
  surface?: CompanionSubmitPageContextSurface;
};

export const COMPANION_SUBMIT_PAGE_CONTEXT_MAX_PATHNAME_LENGTH = 240;
export const COMPANION_SUBMIT_PAGE_CONTEXT_MAX_TITLE_LENGTH = 200;
export const COMPANION_SUBMIT_PAGE_CONTEXT_MAX_META_DESCRIPTION_LENGTH = 320;

const ALLOWED_PAGE_CONTEXT_KEYS = new Set([
  "pathname",
  "title",
  "metaDescription",
  "surface",
]);

function slugSignificantTerms(slug: string): string[] {
  const stopWords = new Set(["what", "is", "a", "an", "the", "how", "with", "and", "for", "to"]);
  return slug
    .split("-")
    .map((term) => term.trim().toLowerCase())
    .filter((term) => term.length > 2 && !stopWords.has(term));
}

export function sanitizeCompanionSubmitPageContext(
  value: unknown,
): CompanionSubmitPageContext | undefined {
  if (value == null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("pageContext must be an object");
  }

  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!ALLOWED_PAGE_CONTEXT_KEYS.has(key)) {
      throw new Error(`Forbidden pageContext field: ${key}`);
    }
  }

  const pathname =
    typeof record.pathname === "string"
      ? record.pathname.trim().slice(0, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_PATHNAME_LENGTH)
      : "";
  const title =
    typeof record.title === "string"
      ? record.title.trim().slice(0, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_TITLE_LENGTH)
      : "";
  const metaDescription =
    typeof record.metaDescription === "string"
      ? record.metaDescription.trim().slice(0, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_META_DESCRIPTION_LENGTH)
      : "";
  const surfaceRaw = typeof record.surface === "string" ? record.surface.trim() : "";
  const surface =
    surfaceRaw === "public" || surfaceRaw === "app"
      ? (surfaceRaw as CompanionSubmitPageContextSurface)
      : undefined;

  if (pathname && !pathname.startsWith("/")) {
    throw new Error("pageContext.pathname must start with /");
  }

  if (!pathname && !title && !metaDescription && !surface) {
    return undefined;
  }

  const pageContext: CompanionSubmitPageContext = {};
  if (pathname) pageContext.pathname = pathname;
  if (title) pageContext.title = title;
  if (metaDescription) pageContext.metaDescription = metaDescription;
  if (surface) pageContext.surface = surface;
  return pageContext;
}

export function collectPublicCompanionSubmitPageContext(windowLike?: {
  location?: { pathname?: string };
  document?: {
    title?: string;
    querySelector?: (selector: string) => { getAttribute?: (name: string) => string | null } | null;
  };
}): CompanionSubmitPageContext | undefined {
  const pathname = windowLike?.location?.pathname?.trim() ?? "";
  if (!pathname.startsWith("/")) {
    return undefined;
  }

  const title =
    windowLike?.document?.title?.trim().slice(0, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_TITLE_LENGTH) ??
    "";
  const metaDescription =
    windowLike?.document
      ?.querySelector?.('meta[name="description"]')
      ?.getAttribute?.("content")
      ?.trim()
      .slice(0, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_META_DESCRIPTION_LENGTH) ?? "";

  return sanitizeCompanionSubmitPageContext({
    pathname,
    title: title || undefined,
    metaDescription: metaDescription || undefined,
    surface: "public",
  });
}

export function buildAppCompanionSubmitPageContext(
  pathname: string,
  windowLike?: {
    document?: {
      title?: string;
      querySelector?: (selector: string) => { getAttribute?: (name: string) => string | null } | null;
    };
  },
): CompanionSubmitPageContext | undefined {
  const normalizedPath = pathname.trim();
  if (!normalizedPath.startsWith("/app")) {
    return undefined;
  }

  const title =
    windowLike?.document?.title?.trim().slice(0, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_TITLE_LENGTH) ??
    "";
  const metaDescription =
    windowLike?.document
      ?.querySelector?.('meta[name="description"]')
      ?.getAttribute?.("content")
      ?.trim()
      .slice(0, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_META_DESCRIPTION_LENGTH) ?? "";

  return sanitizeCompanionSubmitPageContext({
    pathname: normalizedPath,
    title: title || undefined,
    metaDescription: metaDescription || undefined,
    surface: "app",
  });
}

export function isCompanionSubmitPageContextQuestion(
  question: string,
  source: { title: string; slug?: string; searchIntents?: string[] },
  pageContext?: CompanionSubmitPageContext,
): boolean {
  const normalized = question.trim().toLowerCase().replace(/[?!.]+$/, "").replace(/\s+/g, " ");

  if (
    /\b(denne siden|this page|denne artikelen|this article|på denne siden|on this page)\b/.test(
      normalized,
    ) ||
    /\b(forklar denne|oppsummer denne|explain this|summarize this|what is this page about|hva handler denne)\b/.test(
      normalized,
    )
  ) {
    return true;
  }

  const titleSource = (pageContext?.title ?? source.title).toLowerCase();
  const titleTokens = titleSource.split(/\W+/).filter((token) => token.length > 3);
  if (titleTokens.filter((token) => normalized.includes(token)).length >= 2) {
    return true;
  }

  if (source.slug) {
    const slugTerms = slugSignificantTerms(source.slug);
    if (slugTerms.filter((term) => normalized.includes(term)).length >= 2) {
      return true;
    }
  }

  for (const intent of source.searchIntents ?? []) {
    const intentNorm = intent.trim().toLowerCase();
    if (intentNorm && normalized.includes(intentNorm)) {
      return true;
    }
  }

  return false;
}

export function buildCompanionSubmitPageContextRetrievalQuery(
  question: string,
  source: {
    title: string;
    metaDescription?: string;
    introduction?: string;
  },
  pageContext?: CompanionSubmitPageContext,
): string {
  const title = pageContext?.title?.trim() || source.title.trim();
  const description = pageContext?.metaDescription?.trim() || source.metaDescription?.trim() || "";
  const introduction = source.introduction?.trim().slice(0, 400) ?? "";

  return [
    `Current page: ${title}`,
    description ? `Page summary: ${description}` : null,
    introduction ? `Page introduction: ${introduction}` : null,
    `User question: ${question.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");
}
