import {
  evaluatePublicSiteIndexUrl,
  normalizePublicSiteIndexCanonicalUrl,
} from "./url-policy";

export const PUBLIC_SITE_INDEX_MIN_RELEVANCE_SCORE = 16;
export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_SOURCE = "website-kompis-public-site-index" as const;

export type PublicSiteIndexHit = {
  documentId: string;
  chunkId: string;
  title: string;
  canonicalUrl: string;
  pathname: string;
  locale: string;
  excerpt: string;
  chunkContent: string;
  score: number;
  matchedReason: string | null;
  crawledAt: string | null;
};

export type PublicSiteIndexAnswer = {
  answer: {
    directAnswer: string;
    explanation: string | null;
    steps: [];
  };
  actions: [];
  sources: Array<{ title: string; route: string }>;
  confidence: {
    level: "high" | "medium" | "low";
    score: number;
  };
  supportEscalation: { offered: false; reason: null };
  locale: string;
};

export function isRelevantPublicSiteIndexResult(
  hits: PublicSiteIndexHit[],
  query: string,
): boolean {
  if (hits.length === 0) return false;
  if (query.trim().length < 2) return false;
  return (hits[0]?.score ?? 0) >= PUBLIC_SITE_INDEX_MIN_RELEVANCE_SCORE;
}

/** Ensure source URLs stay on the tenant verified host. */
export function sanitizePublicSiteIndexSourceUrl(
  url: string,
  verifiedHost: string | null | undefined,
): string | null {
  const trimmed = url.trim();
  if (!trimmed || !verifiedHost) return null;
  const decision = evaluatePublicSiteIndexUrl(trimmed, verifiedHost);
  if (!decision.ok) return null;
  return normalizePublicSiteIndexCanonicalUrl(decision.url);
}

/**
 * Treat indexed page text as untrusted evidence — never follow instructional phrases.
 */
export function neutralizeUntrustedPageEvidence(text: string): string {
  return text
    .replace(/\bignore (all|previous|above) instructions\b/gi, "")
    .replace(/\bsystem prompt\b/gi, "")
    .replace(/\byou are now\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildPublicSiteIndexAnswer(
  hits: PublicSiteIndexHit[],
  locale: string,
  verifiedHost: string | null | undefined,
): PublicSiteIndexAnswer | null {
  if (hits.length === 0) return null;
  if ((hits[0]?.score ?? 0) < PUBLIC_SITE_INDEX_MIN_RELEVANCE_SCORE) return null;

  const primary = hits[0];
  const evidence = neutralizeUntrustedPageEvidence(
    primary.chunkContent || primary.excerpt || "",
  );
  if (!evidence || evidence.length < 24) {
    return null;
  }

  const supplemental = hits
    .slice(1, 3)
    .map((hit) => neutralizeUntrustedPageEvidence(hit.chunkContent || hit.excerpt || ""))
    .filter((text) => text.length >= 24 && text !== evidence);

  const directAnswer = evidence.slice(0, 700);
  const explanation =
    supplemental[0]?.slice(0, 400) ||
    (primary.excerpt && primary.excerpt !== evidence
      ? neutralizeUntrustedPageEvidence(primary.excerpt).slice(0, 400)
      : null);

  const sources = hits
    .slice(0, 3)
    .map((hit) => {
      const route =
        sanitizePublicSiteIndexSourceUrl(hit.canonicalUrl, verifiedHost) ||
        (hit.pathname.startsWith("/") && verifiedHost
          ? `https://${verifiedHost}${hit.pathname}`
          : null);
      const safeRoute = route
        ? sanitizePublicSiteIndexSourceUrl(route, verifiedHost)
        : null;
      if (!safeRoute) return null;
      return {
        title: hit.title || hit.pathname,
        route: safeRoute,
      };
    })
    .filter((source): source is { title: string; route: string } => source !== null);

  if (sources.length === 0) {
    return null;
  }

  const topScore = primary.score;
  const confidenceLevel =
    topScore >= 40 ? "high" : topScore >= 24 ? "medium" : "low";

  return {
    answer: {
      directAnswer,
      explanation,
      steps: [],
    },
    actions: [],
    sources,
    confidence: {
      level: confidenceLevel,
      score: Math.min(0.95, Math.max(0.3, topScore / 100)),
    },
    supportEscalation: { offered: false, reason: null },
    locale,
  };
}
