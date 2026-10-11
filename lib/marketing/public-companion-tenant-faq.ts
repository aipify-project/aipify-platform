import "server-only";

import {
  dedupeCompanionSourcesByRoute,
  expandFaqIntentTokens,
  looksLikeFaqQuestionList,
} from "@/lib/marketing/website-kompis-answer-relevance";
import { createPublicAnonSupabaseClient } from "@/lib/supabase/public-anon";

export type PublicCompanionTenantFaqAnswer = {
  answer: {
    directAnswer: string;
    explanation: null;
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

export const PUBLIC_COMPANION_TENANT_FAQ_RPC = "search_tenant_public_visitor_knowledge" as const;
export const PUBLIC_COMPANION_TENANT_FAQ_MIN_QUERY_LENGTH = 2;
export const PUBLIC_COMPANION_TENANT_FAQ_MIN_RELEVANCE_SCORE = 10;
/** Weak RPC token_match alone must clear this higher bar or prove content overlap. */
export const PUBLIC_COMPANION_TENANT_FAQ_WEAK_MATCH_MIN_SCORE = 20;
export const PUBLIC_COMPANION_DOMAIN_MAX_LENGTH = 253;
export const PUBLIC_COMPANION_INSTALL_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PUBLIC_COMPANION_FAQ_STOPWORDS = new Set([
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
  "dere",
  "you",
  "your",
  "har",
  "å",
  "a",
  "an",
  "to",
  "is",
  "are",
  "do",
  "does",
  "can",
  "could",
  "would",
  "should",
]);

/** Distinctive content tokens from a visitor question (stopwords removed). */
export function tokenizePublicCompanionFaqQuestion(question: string): string[] {
  return question
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !PUBLIC_COMPANION_FAQ_STOPWORDS.has(token))
    .slice(0, 24);
}

/**
 * Shared commerce/membership wording that often co-occurs across unrelated FAQ rows.
 * When the question also has a more specific token (e.g. "push"), that token must match.
 */
const FAQ_GENERIC_TOPIC_TOKENS = new Set([
  "koster",
  "kostnad",
  "kostnaden",
  "pris",
  "prisen",
  "price",
  "cost",
  "costs",
  "markedsplass",
  "markedsplassen",
  "marketplace",
  "medlem",
  "medlemmer",
  "medlemskap",
  "gratis",
  "poeng",
  "points",
]);

/** Non-generic topic tokens that must appear in FAQ when present in the question. */
export function distinctivePublicCompanionFaqTopicTokens(question: string): string[] {
  return tokenizePublicCompanionFaqQuestion(question).filter(
    (token) => token.length >= 4 && !FAQ_GENERIC_TOPIC_TOKENS.has(token),
  );
}

function faqRowCorpus(row: Pick<PublicCompanionTenantFaqRow, "title" | "answer" | "category">): string {
  return `${row.title}\n${row.answer}\n${row.category ?? ""}`.toLowerCase();
}

/** True when at least one distinctive query token appears in the FAQ corpus. */
export function faqQuestionHasContentOverlap(
  question: string,
  row: Pick<PublicCompanionTenantFaqRow, "title" | "answer" | "category">,
): boolean {
  const tokens = [
    ...tokenizePublicCompanionFaqQuestion(question),
    ...expandFaqIntentTokens(question),
  ];
  if (tokens.length === 0) return false;
  const corpus = faqRowCorpus(row);
  return tokens.some(
    (token) =>
      corpus.includes(token) ||
      tokenizePublicCompanionFaqQuestion(corpus).some(
        (corpusToken) => corpusToken.includes(token) || token.includes(corpusToken),
      ),
  );
}

export type PublicCompanionTenantFaqRow = {
  item_id: string;
  title: string;
  answer: string;
  category: string | null;
  content_type: string;
  locale: string;
  source_url: string | null;
  score: number | null;
  matched_reason: string | null;
};

export type PublicCompanionVisitorContext = {
  installId: string | null;
  domain: string | null;
};

export function sanitizePublicCompanionInstallId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || !PUBLIC_COMPANION_INSTALL_ID_PATTERN.test(trimmed)) {
    return null;
  }
  return trimmed.toLowerCase();
}

export function sanitizePublicCompanionDomain(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  normalized = normalized.replace(/^https?:\/\//i, "");
  normalized = normalized.replace(/\/.*$/, "");
  normalized = normalized.replace(/:\d+$/, "");

  if (!normalized || normalized.length > PUBLIC_COMPANION_DOMAIN_MAX_LENGTH) {
    return null;
  }

  if (!/^[a-z0-9.-]+$/.test(normalized) || normalized.includes("..")) {
    return null;
  }

  return normalized;
}

export function resolvePublicCompanionVisitorContext(input: {
  clientDomain?: string | null;
  requestHost?: string | null;
  installId?: string | null;
}): PublicCompanionVisitorContext {
  const installId = sanitizePublicCompanionInstallId(input.installId ?? null);
  const clientDomain = sanitizePublicCompanionDomain(input.clientDomain ?? null);
  const hostDomain = sanitizePublicCompanionDomain(input.requestHost ?? null);

  // Install-scoped reads resolve by install id alone. Do not fall back to the
  // metadata/API request host (e.g. aipify.ai) when no explicit domain is given.
  const domain = clientDomain ?? (installId ? null : hostDomain);

  return {
    installId,
    domain,
  };
}

export function hasPublicCompanionVisitorContext(
  context: PublicCompanionVisitorContext,
): boolean {
  return Boolean(context.installId || context.domain);
}

export function isRelevantPublicCompanionTenantFaqResult(
  rows: PublicCompanionTenantFaqRow[],
  query: string,
): boolean {
  if (rows.length === 0) return false;
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < PUBLIC_COMPANION_TENANT_FAQ_MIN_QUERY_LENGTH) {
    return false;
  }

  const top = rows[0];
  const topScore = top?.score ?? 0;
  if (topScore < PUBLIC_COMPANION_TENANT_FAQ_MIN_RELEVANCE_SCORE) {
    return false;
  }

  // Hub dumps (lists of FAQ questions) are not valid answers.
  if (top && looksLikeFaqQuestionList(`${top.title}\n${top.answer}`)) {
    return false;
  }

  const contentTokens = tokenizePublicCompanionFaqQuestion(trimmedQuery);
  // Questions with distinctive content (e.g. "partner") must overlap the FAQ topic.
  // Prevents weak RPC token_match on stopwords ("bli"/"dere") from surfacing unrelated FAQ.
  if (contentTokens.length > 0 && top && !faqQuestionHasContentOverlap(trimmedQuery, top)) {
    return false;
  }

  // "Hva koster en Push …" must not accept membership FAQ via shared koster/markedsplass.
  const distinctive = distinctivePublicCompanionFaqTopicTokens(trimmedQuery);
  if (distinctive.length > 0 && top) {
    const corpus = faqRowCorpus(top);
    const corpusTokens = tokenizePublicCompanionFaqQuestion(corpus);
    const distinctiveHit = distinctive.some(
      (token) =>
        corpus.includes(token) ||
        corpusTokens.some(
          (corpusToken) => corpusToken.includes(token) || token.includes(corpusToken),
        ),
    );
    if (!distinctiveHit) {
      return false;
    }
  }

  const weakReason =
    top?.matched_reason === "token_match" ||
    top?.matched_reason === "fallback" ||
    top?.matched_reason == null;
  if (weakReason && topScore < PUBLIC_COMPANION_TENANT_FAQ_WEAK_MATCH_MIN_SCORE) {
    // Allow weak scores only when content overlap already proved topical fit above.
    if (!top || !faqQuestionHasContentOverlap(trimmedQuery, top)) {
      return false;
    }
  }

  return true;
}

function mapRpcRow(row: Record<string, unknown>): PublicCompanionTenantFaqRow | null {
  const itemId = typeof row.item_id === "string" ? row.item_id : null;
  const title = typeof row.title === "string" ? row.title.trim() : "";
  const answer = typeof row.answer === "string" ? row.answer.trim() : "";
  if (!itemId || !title || !answer) return null;

  return {
    item_id: itemId,
    title,
    answer,
    category: typeof row.category === "string" ? row.category : null,
    content_type: typeof row.content_type === "string" ? row.content_type : "faq",
    locale: typeof row.locale === "string" ? row.locale : "en",
    source_url: typeof row.source_url === "string" ? row.source_url.trim() || null : null,
    score: typeof row.score === "number" ? row.score : Number(row.score ?? 0) || 0,
    matched_reason: typeof row.matched_reason === "string" ? row.matched_reason : null,
  };
}

export async function searchPublicCompanionTenantFaq(input: {
  installId?: string | null;
  domain?: string | null;
  locale: string;
  query: string;
  pathname?: string | null;
  limit?: number;
}): Promise<PublicCompanionTenantFaqRow[]> {
  const client = createPublicAnonSupabaseClient();
  const { data, error } = await client.rpc(PUBLIC_COMPANION_TENANT_FAQ_RPC, {
    p_install_id: input.installId ?? null,
    p_domain: input.domain ?? null,
    p_locale: input.locale,
    p_query: input.query.trim(),
    p_pathname: input.pathname ?? null,
    p_limit: input.limit ?? 5,
  });

  if (error) {
    return [];
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((row) => mapRpcRow(row as Record<string, unknown>))
    .filter((row): row is PublicCompanionTenantFaqRow => row !== null);
}

function isSafeTenantFaqSourceUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function buildPublicCompanionTenantFaqResponse(
  rows: PublicCompanionTenantFaqRow[],
  locale: string,
): PublicCompanionTenantFaqAnswer {
  const usable = rows.filter(
    (row) => !looksLikeFaqQuestionList(`${row.title}\n${row.answer}`),
  );
  const primary = usable[0] ?? rows[0];
  // One relevant FAQ answer — do not append unrelated sibling FAQ titles/answers.
  const directAnswer = primary.answer.trim();

  const sources = dedupeCompanionSourcesByRoute(
    [primary].map((row) => ({
      title: row.title,
      route:
        row.source_url && isSafeTenantFaqSourceUrl(row.source_url)
          ? row.source_url
          : `website-kompis-faq:${row.content_type}`,
    })),
  );

  const topScore = primary.score ?? 0;
  const confidenceLevel = topScore >= 40 ? "high" : topScore >= 20 ? "medium" : "low";

  return {
    answer: {
      directAnswer,
      explanation: null,
      steps: [],
    },
    actions: [],
    sources,
    confidence: {
      level: confidenceLevel,
      score: Math.min(0.95, Math.max(0.25, topScore / 100)),
    },
    supportEscalation: { offered: false, reason: null },
    locale,
  };
}
