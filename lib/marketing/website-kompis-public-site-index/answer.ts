import {
  evaluatePublicSiteIndexUrl,
  normalizePublicSiteIndexCanonicalUrl,
} from "./url-policy";

export const PUBLIC_SITE_INDEX_MIN_RELEVANCE_SCORE = 16;
export const PUBLIC_SITE_INDEX_MIN_QUESTION_OVERLAP = 2;
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

const STOP = new Set([
  "og",
  "i",
  "på",
  "til",
  "av",
  "en",
  "et",
  "den",
  "det",
  "de",
  "som",
  "er",
  "for",
  "med",
  "fra",
  "om",
  "the",
  "and",
  "with",
  "from",
  "how",
  "what",
  "hva",
  "hvordan",
  "hvor",
  "kan",
  "jeg",
  "meg",
  "du",
  "deg",
  "bli",
]);

export function tokenizePublicSiteIndexQuestion(question: string): string[] {
  return question
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOP.has(t))
    .slice(0, 24);
}

export function isRelevantPublicSiteIndexResult(
  hits: PublicSiteIndexHit[],
  query: string,
): boolean {
  if (hits.length === 0) return false;
  if (query.trim().length < 2) return false;
  if ((hits[0]?.score ?? 0) < PUBLIC_SITE_INDEX_MIN_RELEVANCE_SCORE) return false;
  const tokens = tokenizePublicSiteIndexQuestion(query);
  if (tokens.length === 0) return false;
  const corpus = `${hits[0].title} ${hits[0].chunkContent} ${hits[0].excerpt}`.toLowerCase();
  const overlap = tokens.filter((t) => corpus.includes(t)).length;
  return overlap >= Math.min(PUBLIC_SITE_INDEX_MIN_QUESTION_OVERLAP, tokens.length);
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

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 24);
}

function scoreSentence(sentence: string, tokens: string[]): number {
  const lower = sentence.toLowerCase();
  return tokens.reduce((sum, token) => (lower.includes(token) ? sum + 1 : sum), 0);
}

/**
 * Compose a question-grounded extractive answer from ranked hits.
 * Does not invent facts; returns null when evidence does not address the question.
 */
export function composePublicSiteIndexAnswerText(
  question: string,
  hits: PublicSiteIndexHit[],
  locale: string,
): { directAnswer: string; explanation: string | null } | null {
  const tokens = tokenizePublicSiteIndexQuestion(question);
  if (tokens.length === 0 || hits.length === 0) return null;

  const primary = hits[0];
  const evidencePool = [
    neutralizeUntrustedPageEvidence(primary.chunkContent || ""),
    neutralizeUntrustedPageEvidence(primary.excerpt || ""),
    ...hits.slice(1, 3).map((h) => neutralizeUntrustedPageEvidence(h.chunkContent || "")),
  ].filter(Boolean);

  const sentences = evidencePool.flatMap(splitSentences);
  const ranked = sentences
    .map((sentence) => ({ sentence, score: scoreSentence(sentence, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return null;
  }

  const topOverlap = ranked[0].score;
  if (topOverlap < Math.min(PUBLIC_SITE_INDEX_MIN_QUESTION_OVERLAP, tokens.length)) {
    return null;
  }

  const chosen = ranked
    .slice(0, 3)
    .map((entry) => entry.sentence)
    .filter((sentence, index, all) => all.indexOf(sentence) === index);

  const lead =
    locale === "en"
      ? "Based on the site's public pages:"
      : locale === "sv"
        ? "Utifrån webbplatsens publika sidor:"
        : locale === "da"
          ? "Baseret på webbstedets offentlige sider:"
          : "Ut fra nettstedets offentlige sider:";

  const directAnswer = `${lead}\n\n${chosen.join(" ")}`.slice(0, 900);
  const explanation =
    primary.title.trim().length > 0
      ? locale === "en"
        ? `Source page: ${primary.title.trim()}.`
        : `Kilde: ${primary.title.trim()}.`
      : null;

  return { directAnswer, explanation };
}

export function buildPublicSiteIndexAnswer(
  hits: PublicSiteIndexHit[],
  locale: string,
  verifiedHost: string | null | undefined,
  question?: string,
): PublicSiteIndexAnswer | null {
  if (hits.length === 0) return null;
  if ((hits[0]?.score ?? 0) < PUBLIC_SITE_INDEX_MIN_RELEVANCE_SCORE) return null;

  const q = question?.trim() || hits[0].title;
  if (!isRelevantPublicSiteIndexResult(hits, q)) {
    return null;
  }

  const composed = composePublicSiteIndexAnswerText(q, hits, locale);
  if (!composed) {
    return null;
  }

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

  const topScore = hits[0].score;
  const confidenceLevel =
    topScore >= 40 ? "high" : topScore >= 24 ? "medium" : "low";

  return {
    answer: {
      directAnswer: composed.directAnswer,
      explanation: composed.explanation,
      steps: [],
    },
    actions: [],
    sources,
    confidence: {
      level: confidenceLevel,
      score: Math.min(0.92, Math.max(0.28, topScore / 100)),
    },
    supportEscalation: { offered: false, reason: null },
    locale,
  };
}
