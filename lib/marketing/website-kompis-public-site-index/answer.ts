import {
  evaluatePublicSiteIndexUrl,
  normalizePublicSiteIndexCanonicalUrl,
} from "./url-policy";

export const PUBLIC_SITE_INDEX_MIN_RELEVANCE_SCORE = 16;
export const PUBLIC_SITE_INDEX_MIN_QUESTION_OVERLAP = 2;
export const PUBLIC_SITE_INDEX_MIN_TOPIC_OVERLAP = 1;
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

/** Function/process words that match boilerplate ("Slik fungerer…") without topical fit. */
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
  "fungerer",
  "works",
  "work",
  "working",
  "say",
  "says",
  "sier",
  "according",
  "does",
  "did",
  "tell",
  "fortell",
  "page",
  "siden",
  "website",
  "nettsted",
  "nettstedet",
  "nettsiden",
  "please",
  "takk",
  "hello",
  "hei",
  "when",
  "når",
  "har",
  "dere",
  "you",
  "your",
  "din",
  "ditt",
  "deres",
  "our",
  "vår",
  "this",
  "that",
  "these",
  "those",
  "into",
  "over",
  "under",
  "also",
  "just",
  "only",
  "more",
  "than",
  "then",
  "them",
  "they",
  "their",
  "have",
  "has",
  "had",
  "are",
  "was",
  "were",
  "been",
  "being",
  "will",
  "would",
  "could",
  "should",
  "about",
  "into",
  "mellom",
  "between",
  "among",
  "blant",
  "forskjell",
  "forskjellen",
  "difference",
  "differences",
  "versus",
  "against",
  "ulike",
  "annen",
  "other",
  "others",
  // Fixture / placeholder site labels — not topical content.
  "nettsted_navn",
  "domen",
]);

export function tokenizePublicSiteIndexQuestion(question: string): string[] {
  const lower = question.toLowerCase();
  const parts = lower
    .split(/[^\p{L}\p{N}-]+/u)
    .map((t) => t.trim())
    .filter(Boolean);
  // Keep hyphenated path tokens (how-it-works) alongside split words.
  const tokens: string[] = [];
  for (const part of parts) {
    if (part.includes("-")) {
      if (part.length >= 5 && !STOP.has(part)) tokens.push(part);
      for (const piece of part.split("-")) {
        if (piece.length >= 2 && !STOP.has(piece)) tokens.push(piece);
      }
    } else if (part.length >= 2 && !STOP.has(part)) {
      tokens.push(part);
    }
  }
  return [...new Set(tokens)].slice(0, 24);
}

/**
 * Distinctive topic tokens for retrieval focus / relevance.
 * Prefer content words (length ≥4 keeps gold/gift/safe); fall back to shorter tokens.
 */
export function topicTokensForPublicSiteIndex(question: string): string[] {
  const tokens = tokenizePublicSiteIndexQuestion(question);
  const strong = tokens.filter((t) => t.length >= 4);
  if (strong.length >= 1) return strong.slice(0, 8);
  return tokens.slice(0, 8);
}

/** Hub/legal paths that often share nav keywords without answering the topic. */
function isPublicSiteIndexHubPath(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return (
    /\/(terms|terms-and-conditions|privacy|cookie|cookies)(\/|$)/.test(p) ||
    /\/faq\/?$/.test(p)
  );
}

/**
 * Narrow long natural-language questions to topic tokens so RPC ranking
 * is not dominated by process verbs ("fungerer"/"works") matching boilerplate titles.
 */
export function focusPublicSiteIndexQuery(question: string): string {
  const trimmed = question.trim();
  if (trimmed.length < 2) return trimmed;
  const topics = topicTokensForPublicSiteIndex(trimmed);
  if (topics.length === 0) return trimmed;
  const focused = topics.join(" ");
  // Keep original when focusing would drop too much signal (very short queries).
  if (focused.length < 3) return trimmed;
  return focused;
}

function hitCorpus(hit: PublicSiteIndexHit): string {
  return `${hit.title} ${hit.pathname} ${hit.excerpt} ${hit.chunkContent}`.toLowerCase();
}

export function scorePublicSiteIndexHitTopicOverlap(
  hit: PublicSiteIndexHit,
  topicTokens: string[],
): number {
  if (topicTokens.length === 0) return 0;
  const title = (hit.title || "").toLowerCase();
  const pathname = (hit.pathname || "").toLowerCase();
  const body = `${hit.excerpt} ${hit.chunkContent}`.toLowerCase();
  let score = 0;
  for (const token of topicTokens) {
    if (title.includes(token)) score += 4;
    if (pathname.includes(token)) score += 3;
    if (body.includes(token)) score += 1;
  }
  return score;
}

/**
 * Drop boilerplate hits that only match process/site wording, then prefer
 * title/pathname topic fit over raw RPC score.
 */
export function filterAndRankPublicSiteIndexHits(
  hits: PublicSiteIndexHit[],
  question: string,
): PublicSiteIndexHit[] {
  const topics = topicTokensForPublicSiteIndex(question);
  if (hits.length === 0) return [];
  if (topics.length === 0) {
    return [...hits].sort((a, b) => b.score - a.score);
  }

  const scored = hits
    .map((hit) => {
      let topicScore = scorePublicSiteIndexHitTopicOverlap(hit, topics);
      // Demote legal/FAQ hubs that only share a keyword with a stronger guide page.
      if (isPublicSiteIndexHubPath(hit.pathname) && topicScore > 0) {
        topicScore = Math.max(0, topicScore - 2);
      }
      return { hit, topicScore };
    })
    .filter((entry) => entry.topicScore >= PUBLIC_SITE_INDEX_MIN_TOPIC_OVERLAP)
    .sort((a, b) => {
      if (b.topicScore !== a.topicScore) return b.topicScore - a.topicScore;
      return b.hit.score - a.hit.score;
    });

  if (scored.length === 0) return [];

  // When a clear topical winner exists, drop weak keyword-only companions (terms/faq).
  const best = scored[0].topicScore;
  const floor =
    best >= 6
      ? Math.max(PUBLIC_SITE_INDEX_MIN_TOPIC_OVERLAP, Math.floor(best * 0.35))
      : PUBLIC_SITE_INDEX_MIN_TOPIC_OVERLAP;

  return scored.filter((entry) => entry.topicScore >= floor).map((entry) => entry.hit);
}

export function isRelevantPublicSiteIndexResult(
  hits: PublicSiteIndexHit[],
  query: string,
): boolean {
  if (hits.length === 0) return false;
  if (query.trim().length < 2) return false;

  const filtered = filterAndRankPublicSiteIndexHits(hits, query);
  if (filtered.length === 0) return false;
  if ((filtered[0]?.score ?? 0) < PUBLIC_SITE_INDEX_MIN_RELEVANCE_SCORE) return false;

  const topics = topicTokensForPublicSiteIndex(query);
  if (topics.length === 0) return false;

  const top = filtered[0];
  const topOverlap = scorePublicSiteIndexHitTopicOverlap(top, topics);
  if (topOverlap < PUBLIC_SITE_INDEX_MIN_TOPIC_OVERLAP) return false;

  // Hub pages need a stronger topical fit than guide/content pages.
  if (isPublicSiteIndexHubPath(top.pathname) && topOverlap < 4) {
    return false;
  }

  // Multi-token questions: require title/path topic fit, a shared stem, or ≥2 matched tokens.
  if (topics.length >= 2 && topOverlap < 3) {
    const corpus = hitCorpus(top);
    const matched = topics.filter((t) => corpus.includes(t)).length;
    const titlePath = `${top.title} ${top.pathname}`.toLowerCase();
    const titlePathHit = topics.some((t) => titlePath.includes(t));
    const stemHit = topics.some((topic) => {
      if (topic.length < 4) return false;
      const stem = topic.slice(0, Math.min(5, topic.length));
      return titlePath
        .split(/[^\p{L}\p{N}]+/u)
        .some((word) => word.length >= 4 && (word.startsWith(stem) || topic.startsWith(word.slice(0, 4))));
    });
    if (matched < 1 && !stemHit) return false;
    if (!titlePathHit && !stemHit && matched < 2) return false;
  }

  return true;
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
  const topics = topicTokensForPublicSiteIndex(question);
  const tokens = topics.length > 0 ? topics : tokenizePublicSiteIndexQuestion(question);
  if (tokens.length === 0 || hits.length === 0) return null;

  const rankedHits = filterAndRankPublicSiteIndexHits(hits, question);
  if (rankedHits.length === 0) return null;

  const primary = rankedHits[0];
  const evidencePool = [
    neutralizeUntrustedPageEvidence(primary.chunkContent || ""),
    neutralizeUntrustedPageEvidence(primary.excerpt || ""),
    ...rankedHits.slice(1, 3).map((h) => neutralizeUntrustedPageEvidence(h.chunkContent || "")),
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
  if (topOverlap < Math.min(PUBLIC_SITE_INDEX_MIN_TOPIC_OVERLAP, tokens.length)) {
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

  const q = question?.trim() || hits[0].title;
  const ranked = filterAndRankPublicSiteIndexHits(hits, q);
  if (ranked.length === 0) return null;
  if ((ranked[0]?.score ?? 0) < PUBLIC_SITE_INDEX_MIN_RELEVANCE_SCORE) return null;
  if (!isRelevantPublicSiteIndexResult(ranked, q)) {
    return null;
  }

  const composed = composePublicSiteIndexAnswerText(q, ranked, locale);
  if (!composed) {
    return null;
  }

  const sources = ranked
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

  const topics = topicTokensForPublicSiteIndex(q);
  const topicScore = scorePublicSiteIndexHitTopicOverlap(ranked[0], topics);
  const confidenceLevel =
    topicScore >= 6 && ranked[0].score >= 40
      ? "high"
      : topicScore >= 3 || ranked[0].score >= 24
        ? "medium"
        : "low";

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
      score: Math.min(0.92, Math.max(0.28, (ranked[0].score + topicScore * 4) / 120)),
    },
    supportEscalation: { offered: false, reason: null },
    locale,
  };
}
