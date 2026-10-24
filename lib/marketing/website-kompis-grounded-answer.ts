import type { SupabaseClient } from "@supabase/supabase-js";
import { selectModelProfile } from "@/lib/intelligence/router";
import {
  requestKompisGroundedTextCompletion,
  type KompisGroundedCompletionResult,
  type KompisGroundedCostControlsMode,
  type KompisGroundedProviderDiagnostics,
} from "@/lib/kompis-operator/grounded-completion";
import type { PublicCompanionTenantFaqRow } from "@/lib/marketing/public-companion-tenant-faq";
import type { PublicSiteIndexHit } from "@/lib/marketing/website-kompis-public-site-index";
import {
  isWeakGeneralPublicSitePath,
  neutralizeUntrustedPageEvidence,
  topicTokensForPublicSiteIndex,
} from "@/lib/marketing/website-kompis-public-site-index";
import {
  dedupeCompanionSourcesByRoute,
  isProductOrPriceVisitorQuestion,
  isPurchaseProcessVisitorQuestion,
  looksLikeBareFaqQuestionHeading,
  looksLikeFaqQuestionList,
  textLooksLikePublishedPrice,
} from "@/lib/marketing/website-kompis-answer-relevance";
import {
  isWebsiteKompisExplicitCurrentPageQuestion,
  publicEvidenceUrlForVerifiedHost,
  type WebsiteKompisPublicPageContext,
} from "@/lib/marketing/website-kompis-public-page-context";
import { buildWebsiteKompisPublicAnswerPolicyPrompt } from "@/lib/marketing/website-kompis-public-answer-policy";

export type WebsiteKompisGroundedAskResponse = {
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
  supportEscalation: { offered: boolean; reason: "knowledge_gap" | null };
  locale: string;
};

export const WEBSITE_KOMPIS_GROUNDED_ANSWER_SOURCE = "website-kompis-grounded-answer" as const;
export const WEBSITE_KOMPIS_GROUNDED_MAX_EVIDENCE = 6;
export const WEBSITE_KOMPIS_GROUNDED_MAX_EVIDENCE_CHARS = 900;
export const WEBSITE_KOMPIS_GROUNDED_MAX_RECENT = 4;

export type WebsiteKompisEvidenceKind = "faq" | "current-page" | "public-site-index";

export type WebsiteKompisEvidenceSnippet = {
  id: string;
  kind: WebsiteKompisEvidenceKind;
  title: string;
  url: string | null;
  locale: string;
  text: string;
};

export type WebsiteKompisEvidencePack = {
  question: string;
  locale: string;
  recentContext: Array<{ role: "user" | "assistant"; text: string }>;
  evidence: WebsiteKompisEvidenceSnippet[];
};

export type WebsiteKompisGroundedCompletionFn = (input: {
  system: string;
  user: string;
}) => Promise<KompisGroundedCompletionResult>;

export type WebsiteKompisGroundedModelPayload = {
  answer: string;
  sourceIds: string[];
  followUp: string | null;
  covered: boolean;
};

function clip(text: string, max: number): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trim()}…`;
}

export function buildWebsiteKompisFaqEvidence(
  rows: PublicCompanionTenantFaqRow[],
  verifiedHost?: string | null,
): WebsiteKompisEvidenceSnippet[] {
  return rows
    .slice(0, WEBSITE_KOMPIS_GROUNDED_MAX_EVIDENCE * 2)
    .filter((row) => {
      const answer = typeof row.answer === "string" ? row.answer : "";
      const title = typeof row.title === "string" ? row.title : "";
      if (!answer.trim()) return false;
      if (looksLikeFaqQuestionList(answer) || looksLikeFaqQuestionList(`${title}\n${answer}`)) {
        return false;
      }
      return true;
    })
    .slice(0, WEBSITE_KOMPIS_GROUNDED_MAX_EVIDENCE)
    .map((row, index) => ({
      id: `faq:${row.item_id || index}`,
      kind: "faq" as const,
      title: row.title?.trim() || "FAQ",
      url: publicEvidenceUrlForVerifiedHost(row.source_url, verifiedHost),
      locale: row.locale || "no",
      text: clip(
        neutralizeUntrustedPageEvidence(`${row.title}\n${row.answer}`),
        WEBSITE_KOMPIS_GROUNDED_MAX_EVIDENCE_CHARS,
      ),
    }));
}

export function buildWebsiteKompisPageEvidence(
  pageContext: WebsiteKompisPublicPageContext | null | undefined,
  locale: string,
  verifiedHost?: string | null,
): WebsiteKompisEvidenceSnippet[] {
  if (!pageContext) return [];
  const parts = [
    pageContext.title,
    pageContext.metaDescription,
    ...(pageContext.headings ?? []).map((h) => h.text),
    ...(pageContext.textSnippets ?? []),
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .slice(0, 8);
  if (parts.length === 0) return [];
  const url =
    publicEvidenceUrlForVerifiedHost(pageContext.canonicalUrl, verifiedHost) ??
    publicEvidenceUrlForVerifiedHost(pageContext.pathname, verifiedHost);
  return [
    {
      id: "page:current",
      kind: "current-page",
      title: pageContext.title?.trim() || pageContext.pathname || "Current page",
      url,
      locale: pageContext.locale || locale,
      text: clip(
        neutralizeUntrustedPageEvidence(parts.join("\n")),
        WEBSITE_KOMPIS_GROUNDED_MAX_EVIDENCE_CHARS,
      ),
    },
  ];
}

export function buildWebsiteKompisIndexEvidence(
  hits: PublicSiteIndexHit[],
  verifiedHost?: string | null,
): WebsiteKompisEvidenceSnippet[] {
  return hits.slice(0, WEBSITE_KOMPIS_GROUNDED_MAX_EVIDENCE).map((hit) => ({
    id: `index:${hit.chunkId || hit.documentId}`,
    kind: "public-site-index" as const,
    title: hit.title?.trim() || "Public page",
    url: publicEvidenceUrlForVerifiedHost(hit.canonicalUrl, verifiedHost),
    locale: hit.locale || "no",
    text: clip(
      neutralizeUntrustedPageEvidence(hit.chunkContent || hit.excerpt || hit.title),
      WEBSITE_KOMPIS_GROUNDED_MAX_EVIDENCE_CHARS,
    ),
  }));
}

/** Whole words that must not qualify a source by themselves. */
const INSUFFICIENT_ALONE_TOPIC_TOKENS = new Set([
  "model",
  "models",
  "modell",
  "function",
  "functions",
  "funksjon",
  "funksjonen",
  "funktion",
  "funktionen",
  "used",
  "brukes",
  "bruges",
  "land",
  "lande",
  "country",
  "countries",
  "koster",
  "kostnad",
  "kostnaden",
  "pris",
  "prisen",
  "price",
  "cost",
  "costs",
  "gratis",
]);
const WEAK_PUBLIC_TOPIC_TOKENS = new Set([
  "alle",
  "all",
  "kan",
  "hvilke",
  "hvilken",
  "hvilket",
  "which",
  "betyr",
  "mean",
  "means",
]);

function followUpTopicQuestion(
  question: string,
  recentContext: Array<{ role: "user" | "assistant"; text: string }> | null | undefined,
): string {
  const topics = tokensWrittenInQuestion(question);
  if (topics.length > 0) return question;
  const previousUser = [...(recentContext ?? [])].reverse().find((entry) => entry.role === "user");
  const previous = previousUser?.text.trim() ?? "";
  if (!previous) return question;
  return `${previous} ${question}`;
}

function wholeTopicTokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length >= 2);
}

/** Whole word only. model/modell does not match. medlem/medlemskap does. */
function textHasWholeTopicToken(text: string, token: string): boolean {
  const words = wholeTopicTokens(text);
  if (words.includes(token)) return true;
  return words.some((word) => {
    if (token.length < 6 || word.length < 6) return false;
    const limit = Math.min(token.length, word.length);
    let shared = 0;
    while (shared < limit && token[shared] === word[shared]) shared += 1;
    return shared >= 6;
  });
}

function distinctiveEvidenceTopics(question: string): string[] {
  return topicTokensForPublicSiteIndex(question).filter(
    (token) => token.length >= 4 && !WEAK_PUBLIC_TOPIC_TOKENS.has(token),
  );
}

function tokensWrittenInQuestion(question: string): string[] {
  const written = new Set(wholeTopicTokens(question));
  return distinctiveEvidenceTopics(question).filter((token) => written.has(token));
}

function evidenceTopicScore(
  item: WebsiteKompisEvidenceSnippet,
  topicTokens: string[],
): number {
  if (topicTokens.length === 0) return 0;
  const corpus = `${item.title} ${item.url ?? ""} ${item.text}`;
  let score = 0;
  for (const token of topicTokens) {
    if (WEAK_PUBLIC_TOPIC_TOKENS.has(token)) continue;
    if (textHasWholeTopicToken(item.title, token)) score += 4;
    if (textHasWholeTopicToken(item.url ?? "", token)) score += 3;
    if (textHasWholeTopicToken(corpus, token)) score += 1;
  }
  return score;
}

/**
 * Keep only index hits that would survive grounded pack topic filtering for the
 * visitor question — used when empty pack must not reintroduce rejected material.
 */
export function filterSiteIndexHitsMatchingEvidenceTopic(
  hits: PublicSiteIndexHit[],
  question: string,
): PublicSiteIndexHit[] {
  if (hits.length === 0) return [];
  return hits.filter((hit) => {
    const [snippet] = buildWebsiteKompisIndexEvidence([hit]);
    if (!snippet?.text.trim()) return false;
    if (looksLikeFaqQuestionList(snippet.text)) return false;
    return evidenceSnippetMatchesQuestionTopic(snippet, question);
  });
}

export function evidenceSnippetMatchesQuestionTopic(
  item: WebsiteKompisEvidenceSnippet,
  question: string,
): boolean {
  // Deictic "what is this page about" questions: topic tokens are meta words
  // (e.g. handler/denne) that never appear in page body. The topical target is
  // the current-page evidence itself — not FAQ/index rows that share those words.
  // Do not auto-approve every current-page cite for concrete product/price asks.
  if (isWebsiteKompisExplicitCurrentPageQuestion(question)) {
    return item.kind === "current-page";
  }

  const topics = tokensWrittenInQuestion(question);
  if (topics.length === 0) return true;
  const corpus = `${item.title} ${item.url ?? ""} ${item.text}`;
  const specific = topics.filter((token) => !INSUFFICIENT_ALONE_TOPIC_TOKENS.has(token));
  const specificHits = specific.filter((token) => textHasWholeTopicToken(corpus, token));
  if (specific.length >= 2) {
    const titleHits = specific.filter(
      (token) =>
        textHasWholeTopicToken(item.title, token) || textHasWholeTopicToken(item.url ?? "", token),
    );
    return specificHits.length >= 2 || titleHits.length >= 1;
  }
  if (specific.length === 1) return specificHits.length === 1;
  const hits = topics.filter((token) => textHasWholeTopicToken(corpus, token));
  return new Set(hits).size >= 2;
}

export function buildWebsiteKompisEvidencePack(input: {
  question: string;
  locale: string;
  recentContext?: Array<{ role: "user" | "assistant"; text: string }> | null;
  faqRows?: PublicCompanionTenantFaqRow[];
  siteIndexHits?: PublicSiteIndexHit[];
  pageContext?: WebsiteKompisPublicPageContext | null;
  verifiedHost?: string | null;
}): WebsiteKompisEvidencePack {
  const question = input.question.trim();
  const topicQuestion = followUpTopicQuestion(question, input.recentContext);
  const topicTokens = topicTokensForPublicSiteIndex(topicQuestion);
  const candidates = [
    ...buildWebsiteKompisFaqEvidence(input.faqRows ?? [], input.verifiedHost),
    ...buildWebsiteKompisIndexEvidence(input.siteIndexHits ?? [], input.verifiedHost),
    ...buildWebsiteKompisPageEvidence(input.pageContext, input.locale, input.verifiedHost),
  ].filter((item) => item.text.trim().length > 0);

  const productQ = isProductOrPriceVisitorQuestion(question);
  const purchaseQ = isPurchaseProcessVisitorQuestion(question);
  const seen = new Set<string>();
  const ranked = candidates
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      if (looksLikeFaqQuestionList(item.text)) return false;
      // Keep current-page when present — unless product/price Q and page has no price.
      if (item.kind === "current-page") {
        if ((productQ || purchaseQ) && !textLooksLikePublishedPrice(item.text)) {
          return false;
        }
        if (isWebsiteKompisExplicitCurrentPageQuestion(question)) return true;
        const distinctive = tokensWrittenInQuestion(topicQuestion);
        if (distinctive.length >= 2 && !evidenceSnippetMatchesQuestionTopic(item, topicQuestion)) {
          return false;
        }
        return true;
      }
      if (topicTokens.length === 0) return true;
      if (!evidenceSnippetMatchesQuestionTopic(item, topicQuestion)) return false;
      return true;
    })
    .sort((a, b) => {
      const scoreDelta =
        evidenceTopicScore(b, topicTokens) - evidenceTopicScore(a, topicTokens);
      if (scoreDelta !== 0) return scoreDelta;
      // Kind alone must not win — only break ties after thematic score.
      // Guide/index pages beat FAQ on ties; FAQ beats weak home/campaign index paths.
      const kindRank = (item: WebsiteKompisEvidenceSnippet) => {
        if (item.kind === "current-page") return 1;
        if (item.kind === "faq") return 2;
        const path = (() => {
          try {
            return new URL(item.url ?? "", "https://example.invalid").pathname;
          } catch {
            return item.url ?? "";
          }
        })();
        if (isWeakGeneralPublicSitePath(path)) return 3;
        return 0;
      };
      return kindRank(a) - kindRank(b);
    })
    .slice(0, WEBSITE_KOMPIS_GROUNDED_MAX_EVIDENCE);

  return {
    question,
    locale: input.locale,
    recentContext: (input.recentContext ?? [])
      .filter((entry) => entry.text.trim().length > 0)
      .slice(-WEBSITE_KOMPIS_GROUNDED_MAX_RECENT),
    evidence: ranked,
  };
}

export function resolveWebsiteKompisGroundedIntelligenceProfile(): {
  profileId: string;
  providerKey: string;
} {
  const selection = selectModelProfile({ task: "knowledge_retrieval" });
  return {
    profileId: selection?.profile_id ?? "aipify-fast",
    providerKey: selection?.provider_key ?? "managed-fast",
  };
}

export function buildWebsiteKompisGroundedSystemPrompt(locale: string): string {
  // Shared public Website Kompis contract — same policy id as deterministic extract/FAQ/fallback.
  return buildWebsiteKompisPublicAnswerPolicyPrompt(locale);
}

export function buildWebsiteKompisGroundedUserPrompt(pack: WebsiteKompisEvidencePack): string {
  const recent = pack.recentContext
    .map((entry) => `${entry.role}: ${clip(entry.text, 240)}`)
    .join("\n");

  const evidenceBlock = pack.evidence
    .map(
      (item) =>
        `[${item.id}] kind=${item.kind}; title=${item.title}; url=${item.url ?? ""}; locale=${item.locale}\n${item.text}`,
    )
    .join("\n\n");

  return [
    `Visitor locale: ${pack.locale}`,
    `Question: ${clip(pack.question, 500)}`,
    recent ? `Recent conversation:\n${recent}` : "Recent conversation: (none)",
    "Evidence (cite sourceIds using the exact bracket ids, including kind prefixes):",
    evidenceBlock || "(none)",
  ].join("\n\n");
}

function extractJsonObjectText(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

export function parseWebsiteKompisGroundedModelPayload(
  raw: string,
): WebsiteKompisGroundedModelPayload | null {
  try {
    const parsed = JSON.parse(extractJsonObjectText(raw)) as Record<string, unknown>;
    const answer = typeof parsed.answer === "string" ? parsed.answer.trim() : "";
    if (!answer || answer.length > 1200) return null;
    const sourceIds = Array.isArray(parsed.sourceIds)
      ? parsed.sourceIds
          .filter((value): value is string => typeof value === "string")
          .map((value) => value.trim())
          .filter(Boolean)
          .slice(0, WEBSITE_KOMPIS_GROUNDED_MAX_EVIDENCE)
      : [];
    const followUp =
      typeof parsed.followUp === "string" && parsed.followUp.trim()
        ? clip(parsed.followUp, 240)
        : null;
    const covered = parsed.covered === true;
    return { answer, sourceIds, followUp, covered };
  } catch {
    return null;
  }
}

const INJECTION_MARKERS =
  /\b(ignore (all|previous) instructions|system prompt|reveal (the )?prompt|act as|jailbreak)\b/i;

export function detectWebsiteKompisPromptInjection(question: string): boolean {
  return INJECTION_MARKERS.test(question);
}

/**
 * Resolve a model-cited source id against THIS request's evidence pack only.
 * Canonical ids are kind-prefixed (`faq:…`, `index:…`, `page:current`).
 * Compatibility: if the model omits the kind prefix and exactly one pack item
 * has that id segment after the first `:`, accept that unique match.
 * Ambiguous aliases and ids outside the pack stay unknown — never cross-tenant.
 */
export function resolveWebsiteKompisCitedEvidenceId(
  citedId: string,
  evidence: readonly WebsiteKompisEvidenceSnippet[],
): WebsiteKompisEvidenceSnippet | null {
  const cited = citedId.trim();
  if (!cited) return null;

  const exact = evidence.find((item) => item.id === cited);
  if (exact) return exact;

  const suffixMatches = evidence.filter((item) => {
    const separator = item.id.indexOf(":");
    if (separator <= 0) return false;
    return item.id.slice(separator + 1) === cited;
  });
  return suffixMatches.length === 1 ? suffixMatches[0]! : null;
}

function resolveAndGroundCitedSources(
  payload: WebsiteKompisGroundedModelPayload,
  evidence: WebsiteKompisEvidenceSnippet[],
): { ok: true; sources: WebsiteKompisEvidenceSnippet[] } | { ok: false; reason: string } {
  const sources: WebsiteKompisEvidenceSnippet[] = [];
  const seenIds = new Set<string>();
  for (const id of payload.sourceIds) {
    const match = resolveWebsiteKompisCitedEvidenceId(id, evidence);
    if (!match) return { ok: false, reason: `unknown_source:${id}` };
    if (seenIds.has(match.id)) continue;
    seenIds.add(match.id);
    sources.push(match);
  }

  const citedText = sources.map((source) => source.text).join(" ");
  const answerNumbers = payload.answer.match(/\d{2,}/g) ?? [];
  for (const token of answerNumbers) {
    if (!citedText.includes(token)) {
      return { ok: false, reason: `ungrounded_number:${token}` };
    }
  }

  return { ok: true, sources };
}

export function validateWebsiteKompisGroundedPayload(
  payload: WebsiteKompisGroundedModelPayload,
  evidence: WebsiteKompisEvidenceSnippet[],
): { ok: true; sources: WebsiteKompisEvidenceSnippet[] } | { ok: false; reason: string } {
  if (detectWebsiteKompisPromptInjection(payload.answer)) {
    return { ok: false, reason: "injection_in_answer" };
  }

  // covered=false may cite sources for a verified next step when the concrete
  // requested value is missing — that is a partial knowledge gap, not always an error.
  if (!payload.covered) {
    if (payload.sourceIds.length === 0) {
      return { ok: true, sources: [] };
    }
    return resolveAndGroundCitedSources(payload, evidence);
  }

  if (payload.sourceIds.length === 0) {
    return { ok: false, reason: "missing_sources" };
  }

  // Valid sourceIds alone are not enough — cited snippets must match question topic.
  // Callers that know the question should use validateWebsiteKompisGroundedPayloadForQuestion.
  return resolveAndGroundCitedSources(payload, evidence);
}

export function validateWebsiteKompisGroundedPayloadForQuestion(
  payload: WebsiteKompisGroundedModelPayload,
  evidence: WebsiteKompisEvidenceSnippet[],
  question: string,
): { ok: true; sources: WebsiteKompisEvidenceSnippet[] } | { ok: false; reason: string } {
  const base = validateWebsiteKompisGroundedPayload(payload, evidence);
  if (!base.ok) return base;
  if (!payload.covered) return base;

  const topical = base.sources.filter((source) =>
    evidenceSnippetMatchesQuestionTopic(source, question),
  );
  if (!payload.covered) {
    return { ok: true, sources: topical };
  }
  if (topical.length === 0) {
    return { ok: false, reason: "sources_off_topic" };
  }
  return { ok: true, sources: topical };
}

export function createDefaultWebsiteKompisGroundedCompletion(options?: {
  supabase?: SupabaseClient;
  organizationId?: string | null;
  runId?: string | null;
  costControls?: KompisGroundedCostControlsMode;
}): WebsiteKompisGroundedCompletionFn {
  return async ({ system, user }) =>
    requestKompisGroundedTextCompletion({
      system,
      user,
      supabase: options?.supabase,
      organizationId: options?.organizationId,
      // Core RPC expects uuid | null — never a free-form label string.
      runId: options?.runId ?? null,
      costControls: options?.costControls,
    });
}

export type WebsiteKompisGroundedSynthesizeResult =
  | {
      status: "ok";
      response: WebsiteKompisGroundedAskResponse;
      providerDiagnostics?: KompisGroundedProviderDiagnostics;
    }
  | {
      status: "skipped";
      reason: "no_evidence" | "injection";
      evidenceCount: number;
    }
  | {
      status: "failed";
      reason: "provider" | "parse" | "validate";
      detail: string;
      evidenceCount: number;
      providerDiagnostics?: KompisGroundedProviderDiagnostics;
    };

export async function synthesizeWebsiteKompisGroundedAnswer(input: {
  pack: WebsiteKompisEvidencePack;
  completion?: WebsiteKompisGroundedCompletionFn;
  costControls?: KompisGroundedCostControlsMode;
  supabase?: SupabaseClient;
  organizationId?: string | null;
}): Promise<WebsiteKompisGroundedSynthesizeResult> {
  const pack = input.pack;
  if (detectWebsiteKompisPromptInjection(pack.question)) {
    return {
      status: "skipped",
      reason: "injection",
      evidenceCount: pack.evidence.length,
    };
  }
  if (pack.evidence.length === 0) {
    return { status: "skipped", reason: "no_evidence", evidenceCount: 0 };
  }
  console.warn("[website-kompis-grounded]", {
    event: "synthesize_start",
    evidenceCount: pack.evidence.length,
    evidenceKinds: pack.evidence.map((item) => item.kind),
  });

  const intelligence = resolveWebsiteKompisGroundedIntelligenceProfile();
  const requestCompletion =
    input.completion ??
    createDefaultWebsiteKompisGroundedCompletion({
      supabase: input.supabase,
      organizationId: input.organizationId,
      costControls: input.costControls,
    });

  const completion = await requestCompletion({
    system: buildWebsiteKompisGroundedSystemPrompt(pack.locale),
    user: buildWebsiteKompisGroundedUserPrompt(pack),
  });

  if (!completion.ok) {
    console.warn("[website-kompis-grounded]", {
      event: "synthesize_provider_failed",
      errorCode: completion.errorCode,
      modelProfile: completion.modelProfile,
      category: completion.providerDiagnostics?.category ?? null,
      providerErrorType: completion.providerDiagnostics?.providerErrorType ?? null,
      providerErrorCode: completion.providerDiagnostics?.providerErrorCode ?? null,
      requestId: completion.providerDiagnostics?.requestId ?? null,
    });
    return {
      status: "failed",
      reason: "provider",
      detail: completion.errorCode,
      evidenceCount: pack.evidence.length,
      providerDiagnostics: completion.providerDiagnostics,
    };
  }

  const payload = parseWebsiteKompisGroundedModelPayload(completion.text);
  if (!payload) {
    console.warn("[website-kompis-grounded]", {
      event: "synthesize_parse_failed",
      textChars: completion.text.length,
    });
    return {
      status: "failed",
      reason: "parse",
      detail: `text_chars:${completion.text.length}`,
      evidenceCount: pack.evidence.length,
    };
  }

  const validated = validateWebsiteKompisGroundedPayloadForQuestion(
    payload,
    pack.evidence,
    pack.question,
  );
  if (!validated.ok) {
    console.warn("[website-kompis-grounded]", {
      event: "synthesize_validate_failed",
      reason: validated.reason,
    });
    return {
      status: "failed",
      reason: "validate",
      detail: validated.reason,
      evidenceCount: pack.evidence.length,
    };
  }

  void intelligence.profileId; // selected via selectModelProfile(knowledge_retrieval)

  // Confidence follows topical source support, not raw source-id count alone.
  const topicStrength = validated.sources.reduce(
    (sum, source) =>
      sum + evidenceTopicScore(source, topicTokensForPublicSiteIndex(pack.question)),
    0,
  );

  const followUp =
    payload.followUp && !looksLikeBareFaqQuestionHeading(payload.followUp)
      ? payload.followUp
      : null;

  return {
    status: "ok",
    response: {
      answer: {
        directAnswer: payload.answer,
        explanation: followUp,
        steps: [],
      },
      actions: [],
      sources: dedupeCompanionSourcesByRoute(
        validated.sources.flatMap((source) => {
          const route = publicEvidenceUrlForVerifiedHost(source.url);
          if (!route) return [];
          return [{ title: source.title, route }];
        }),
      ),
      confidence: payload.covered
        ? {
            level:
              topicStrength >= 8 && validated.sources.length >= 1
                ? "high"
                : topicStrength >= 3
                  ? "medium"
                  : "low",
            score:
              topicStrength >= 8
                ? 0.84
                : topicStrength >= 3
                  ? 0.62
                  : 0.35,
          }
        : { level: "low", score: 0.25 },
      supportEscalation: payload.covered
        ? { offered: false, reason: null }
        : { offered: true, reason: "knowledge_gap" },
      locale: pack.locale,
    },
    providerDiagnostics: completion.providerDiagnostics,
  };
}
