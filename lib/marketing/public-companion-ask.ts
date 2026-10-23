import "server-only";

import { isPlatformProductKnowledgeQuery } from "@/lib/companion-platform-knowledge/platform-product-foundation";
import { getPlatformCorpusEntry } from "@/lib/companion-platform-knowledge/platform-corpus";
import { searchPlatformKnowledge } from "@/lib/companion-platform-knowledge/search";
import type {
  PlatformKnowledgeAction,
  PlatformKnowledgeAnswer,
  PlatformSearchContext,
  PlatformCorpusArticleId,
} from "@/lib/companion-platform-knowledge/types";
import { getPlatformRouteByKey } from "@/lib/companion-platform-knowledge/route-registry";
import {
  buildHonestKnowledgeGapAnswer,
  buildPricingLabels,
} from "@/lib/companion-platform-knowledge/answer-builder";
import {
  buildPublishedPricingSummary,
  getCanonicalPricingSource,
  type PricingBridgeLabels,
} from "@/lib/companion-platform-knowledge/pricing-bridge";
import { createEmptyCompanionTenantContext } from "@/lib/companion-runtime/companion-tenant-context";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { proposePublicContentLocale } from "@/lib/kompis-content-languages/proposed-public-locale";
import type { FaqContentLanguageCode } from "@/lib/website-kompis-faq/content-languages";
import { isPublicFooterEnabledLocale } from "@/lib/i18n/public-locales";
import { createTranslator, type Translator } from "@/lib/i18n/translate";
import {
  formatLimitValue,
  getPublicPlanCatalog,
} from "@/lib/marketing/public-pricing";
import { getPublicKnowledgeArticle } from "@/lib/marketing/knowledge/load";
import { resolvePublicKnowledgeArticleSlugFromPathname } from "@/lib/marketing/knowledge/registry";
import type { PublicKnowledgeArticleMeta } from "@/lib/marketing/knowledge/types";
import {
  sanitizeWebsiteCompanionPageContext,
  type WebsiteCompanionPageContext,
} from "@/lib/marketing/website-companion-chat";
import {
  buildPublicCompanionTenantFaqResponse,
  faqQuestionHasContentOverlap,
  hasPublicCompanionVisitorContext,
  isRelevantPublicCompanionTenantFaqResult,
  resolvePublicCompanionVisitorContext,
  sanitizePublicCompanionDomain,
  sanitizePublicCompanionInstallId,
  searchPublicCompanionTenantFaq,
  type PublicCompanionVisitorContext,
} from "@/lib/marketing/public-companion-tenant-faq";
import {
  isLowSignalWebsiteKompisFollowUp,
  rewriteWebsiteKompisRetrievalIntent,
} from "@/lib/marketing/website-kompis-retrieval-intent";
import {
  buildWebsiteKompisPrivateScopeRefusalResponse,
  buildWebsiteKompisSafeFallbackResponse,
  isCustomerWebsiteVisitorContext,
  isOutOfScopePrivateMemberOrAdminQuestion,
  shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite,
} from "@/lib/marketing/website-kompis-public-boundary";
import {
  filterWebsiteKompisSafeFaqRows,
  tryBuildWebsiteKompisSafetyPolicyAnswer,
} from "@/lib/marketing/website-kompis-faq-match-safety";
import { tryBuildWebsiteKompisCurrentPublicPageAnswer } from "@/lib/marketing/website-kompis-public-page-context";
import {
  presentWebsiteKompisCustomerSiteAnswer,
  type WebsiteKompisVisitorAnswerSource,
} from "@/lib/marketing/website-kompis-visitor-tone";
import {
  evaluateWebsiteKompisDeterministicAnswerPolicy,
  isWebsiteKompisProviderKnowledgeGapResponse,
  isWebsiteKompisProviderPartialKnowledgeGapResponse,
  withWebsiteKompisPublicAnswerPathDiagnostic,
  type WebsiteKompisPublicAnswerPath,
} from "@/lib/marketing/website-kompis-public-answer-policy";
import {
  buildWebsiteKompisPublicAskTracePayload,
  createWebsiteKompisPublicAskCorrelationId,
  estimatePublicPageContextChars,
  listAvailablePublicPageSignals,
  logWebsiteKompisPublicAskTrace,
} from "@/lib/marketing/website-kompis-public-ask-trace";
import {
  buildWebsiteKompisDisabledResponse,
  getWebsiteKompisInstallConfigForPublicRequest,
  type GetWebsiteKompisInstallConfigOptions,
  type WebsiteKompisInstallConfig,
} from "@/lib/marketing/website-kompis-install-config";
import {
  resolveWebsiteKompisPublicLicensedAvailability,
} from "@/lib/marketing/website-kompis-licensed-availability-server";
import type { WebsiteKompisLicensedAvailability } from "@/lib/marketing/website-kompis-licensed-availability";
import {
  buildWebsiteKompisEvidencePack,
  createDefaultWebsiteKompisGroundedCompletion,
  filterSiteIndexHitsMatchingEvidenceTopic,
  synthesizeWebsiteKompisGroundedAnswer,
} from "@/lib/marketing/website-kompis-grounded-answer";
import type { KompisGroundedCompletionResult } from "@/lib/kompis-operator/grounded-completion";
import {
  finalizeWebsiteKompisPublicAiCostControls,
  reserveWebsiteKompisPublicAiCostControls,
  type WebsiteKompisPublicAiCostDecision,
} from "@/lib/marketing/website-kompis-public-ai-cost-controls";
import {
  buildPublicSiteIndexAnswer,
  isRelevantPublicSiteIndexResult,
  isWeakGeneralPublicSitePath,
  scorePublicSiteIndexHitTopicOverlap,
  searchTenantPublicSiteIndex,
  topicTokensForPublicSiteIndex,
  type PublicSiteIndexHit,
} from "@/lib/marketing/website-kompis-public-site-index";
import type { PublicCompanionTenantFaqRow } from "@/lib/marketing/public-companion-tenant-faq";

/** Prefer strong site-index evidence over thin/stale structured FAQ without source URL. */
export function preferStrongSiteIndexOverSparseFaq(input: {
  question: string;
  faqRows: PublicCompanionTenantFaqRow[];
  siteIndexHits: PublicSiteIndexHit[];
}): {
  faqRows: PublicCompanionTenantFaqRow[];
  siteIndexHits: PublicSiteIndexHit[];
} {
  const { question, faqRows, siteIndexHits } = input;
  if (faqRows.length === 0 || siteIndexHits.length === 0) {
    return { faqRows, siteIndexHits };
  }
  const topics = topicTokensForPublicSiteIndex(question);
  const topIndex = siteIndexHits[0];
  const indexTopic = scorePublicSiteIndexHitTopicOverlap(topIndex, topics);
  // Weak home/campaign pages must never clear the "strong index" bar.
  if (indexTopic < 4 || isWeakGeneralPublicSitePath(topIndex.pathname)) {
    return { faqRows, siteIndexHits };
  }

  const keptFaq = faqRows.filter((row) => {
    const score = row.score ?? 0;
    const overlap = faqQuestionHasContentOverlap(question, row);
    if (!overlap) return false;
    // Strong, sourced FAQ may still contribute alongside index.
    if (row.source_url && score >= 30) return true;
    // High-confidence FAQ with clear overlap may still win when richer than index hub noise.
    if (score >= 50 && overlap) return true;
    return false;
  });

  return { faqRows: keptFaq, siteIndexHits };
}

/** Footer and dictionary locales. Visitor FAQ content uses the 30-code registry. */
export const PUBLIC_COMPANION_ASK_LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
export type PublicCompanionAskLocale = FaqContentLanguageCode;

export const PUBLIC_COMPANION_ASK_MAX_QUESTION_LENGTH = 1000;
export const PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGES = 6;
export const PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGE_LENGTH = 500;

const ALLOWED_REQUEST_KEYS = new Set([
  "question",
  "locale",
  "messageLocale",
  "recentContext",
  "pageContext",
  "domain",
  "installId",
]);

export type PublicCompanionPageContext = WebsiteCompanionPageContext;

export type PublicCompanionRecentContextMessage = {
  role: "user" | "assistant";
  text: string;
};

export type PublicCompanionAskRequest = {
  question: string;
  locale?: string;
  messageLocale?: string;
  recentContext?: PublicCompanionRecentContextMessage[];
  pageContext?: PublicCompanionPageContext;
  domain?: string;
  installId?: string;
};

export type PublicCompanionAskOptions = {
  requestHost?: string | null;
  searchTenantVisitorKnowledge?: typeof searchPublicCompanionTenantFaq;
  searchTenantPublicSiteIndex?: typeof searchTenantPublicSiteIndex;
  groundedCompletion?: (input: {
    system: string;
    user: string;
  }) => Promise<KompisGroundedCompletionResult>;
  rawInstallConfig?: unknown;
  loadInstallConfig?: GetWebsiteKompisInstallConfigOptions["loadInstallConfig"];
  resolveLicensedAvailability?: (
    visitorContext: PublicCompanionVisitorContext,
  ) => Promise<WebsiteKompisLicensedAvailability> | WebsiteKompisLicensedAvailability;
};

export type PublicCompanionAskAction = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

export type PublicCompanionAskSource = {
  title: string;
  route: string;
};

export type PublicCompanionAskConfidence = {
  level: "high" | "medium" | "low";
  score: number | null;
};

export type PublicCompanionAskSupportEscalation = {
  offered: boolean;
  reason: "low_confidence" | "knowledge_gap" | null;
};

export type PublicCompanionAskResponse = {
  answer: {
    directAnswer: string;
    explanation: string | null;
    steps: string[];
  };
  actions: PublicCompanionAskAction[];
  sources: PublicCompanionAskSource[];
  confidence: PublicCompanionAskConfidence;
  supportEscalation: PublicCompanionAskSupportEscalation;
  locale: PublicCompanionAskLocale;
  /** Preview/test only — never required for visitor UI. */
  diagnostics?: Record<string, unknown>;
};

export class PublicCompanionAskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicCompanionAskValidationError";
  }
}

function publicAskDictionaryLocale(locale: string): Locale {
  return isPublicFooterEnabledLocale(locale) ? locale : DEFAULT_LOCALE;
}

function resolvePublicCompanionLocale(input: {
  messageLocale?: string;
  pageLocale?: string;
  requestLocale?: string;
  siteDefaultLocale?: string | null;
  embedVisitor: boolean;
}): PublicCompanionAskLocale {
  return proposePublicContentLocale({
    messageLocale: input.messageLocale,
    pageLocale: input.pageLocale?.trim() ? input.pageLocale : input.requestLocale,
    siteDefaultLocale: input.siteDefaultLocale,
    omittedFallback: input.embedVisitor ? "no" : "en",
  }).contentLocale;
}

function getSearchTermsArray(customerApp: Record<string, unknown>, key: string): string[] {
  const pathParts = key.replace(/^customerApp\./, "").split(".");
  let current: unknown = customerApp;
  for (const part of pathParts) {
    if (!current || typeof current !== "object") return [];
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === "string") {
    return current.split("|").map((entry) => entry.trim()).filter(Boolean);
  }
  return [];
}

export function isPublicPricingQuestion(question: string): boolean {
  const normalized = question.trim().toLowerCase().replace(/[?!.]+$/, "").replace(/\s+/g, " ");
  return /\b(kost|koster|pris\w*|price|pricing|cost|costs|abonnement)\b/.test(normalized);
}

function licenseLabelForLocale(locale: string): string {
  switch (locale) {
    case "en":
      return "licenses";
    case "da":
    case "sv":
      return "licenser";
    case "no":
    case "pl":
    case "uk":
    case "es":
      return "lisenser";
    default:
      return "licenses";
  }
}

export function enrichPublishedPricingSummary(
  locale: Locale | string,
  labels: PricingBridgeLabels,
): string {
  const summary = buildPublishedPricingSummary(locale, labels);
  const business = getPublicPlanCatalog().find((entry) => entry.key === "business");
  if (!business || business.limits.users === "custom") return summary;

  const users = formatLimitValue(business.limits.users, { custom: labels.custom });
  const planLabel = labels.planBusiness;
  const licenseLabel = licenseLabelForLocale(
    isPublicFooterEnabledLocale(String(locale)) ? (locale as PublicCompanionAskLocale) : DEFAULT_LOCALE,
  );

  return summary
    .split("\n")
    .map((line) => (line.startsWith(`${planLabel}:`) ? `${line}, ${users} ${licenseLabel}` : line))
    .join("\n");
}

async function buildPublicPricingCompanionResponse(
  locale: PublicCompanionAskLocale,
  t: Translator,
): Promise<PublicCompanionAskResponse> {
  const marketingDict = await getDictionary(publicAskDictionaryLocale(locale), ["marketing"]);
  const marketing = marketingDict.marketing as Record<string, Record<string, unknown>>;
  const pricingLabels = buildPricingLabels(t);
  const pricingPageLabels = (marketing.pricingPage as { pricingLabels?: { custom?: string; perMonth?: string } } | undefined)
    ?.pricingLabels;
  const bridgeLabels: PricingBridgeLabels = {
    ...pricingLabels,
    custom: pricingPageLabels?.custom ?? pricingLabels.custom,
    perMonth: pricingPageLabels?.perMonth ?? pricingLabels.perMonth,
  };
  const pricingSummary = enrichPublishedPricingSummary(locale, bridgeLabels);
  const pricingBreadcrumb = (marketing.pricingPage as { breadcrumbs?: { pricing?: string } } | undefined)
    ?.breadcrumbs?.pricing;
  const nav = marketing.nav as { contact?: string } | undefined;

  const directAnswer = `${t("customerApp.companionPlatformKnowledge.articles.subscriptionPricing.directAnswer")}\n\n${pricingSummary}`;
  const explanation = t("customerApp.companionPlatformKnowledge.articles.subscriptionPricing.explanation");

  return {
    answer: {
      directAnswer,
      explanation,
      steps: [],
    },
    actions: [
      {
        label: pricingBreadcrumb ?? t("customerApp.companionPlatformKnowledge.articles.subscriptionPricing.title"),
        href: "/pricing",
        variant: "primary",
      },
      {
        label: nav?.contact ?? t("customerApp.companionPlatformKnowledge.articles.contactSupport.title"),
        href: "/contact",
        variant: "secondary",
      },
    ],
    sources: [
      {
        title: t("customerApp.companionPlatformKnowledge.articles.subscriptionPricing.title"),
        route: getCanonicalPricingSource(),
      },
    ],
    confidence: { level: "high", score: 0.9 },
    supportEscalation: { offered: false, reason: null },
    locale,
  };
}

export function buildPublicPlatformSearchContext(locale: string): PlatformSearchContext {
  return {
    locale,
    userRole: "read_only",
  };
}

export function shouldRewritePublicRetrievalQuery(question: string): boolean {
  const normalized = question.trim().toLowerCase().replace(/[?!.]+$/, "").replace(/\s+/g, " ");

  return (
    /\b(kost|koster|pris\w*|price|pricing|abonnement)\b/.test(normalized) ||
    /\b(demo|demonstrasjon|demonstration|book)\b/.test(normalized) ||
    /\b(vise meg|show me)\b/.test(normalized) ||
    /\b(hvordan|how)\b.*\baipify\b.*\bfungerer\b/.test(normalized) ||
    /\b(business pack|business packs|forretningspak|bedriftspak|bedrifter)\b/.test(normalized) ||
    /\bpakkene?\b/.test(normalized) ||
    /\b(komme i gang|getting started|get started|komme igang|hjelp.*start)\b/.test(normalized) ||
    /\b(ny|new)\b.*\b(her|here)\b/.test(normalized) ||
    /\bbegynne\b/.test(normalized)
  );
}

export function buildPublicRetrievalQuery(question: string): string {
  const normalized = question.trim().toLowerCase().replace(/[?!.]+$/, "").replace(/\s+/g, " ");

  if (/\b(kost|koster|pris\w*|price|pricing|abonnement)\b/.test(normalized)) {
    return "Go to upgrade pricing";
  }

  if (
    /\b(business pack|business packs|forretningspak|bedriftspak|bedrifter)\b/.test(normalized) ||
    /\bpakkene?\b/.test(normalized)
  ) {
    return "Go to business packs";
  }

  if (
    /\b(demo|demonstrasjon|demonstration|book)\b/.test(normalized) ||
    /\b(vise meg|show me)\b/.test(normalized) ||
    /\b(hvordan|how)\b.*\baipify\b.*\bfungerer\b/.test(normalized)
  ) {
    return "Go to knowledge getting started";
  }

  if (
    /\b(komme i gang|getting started|get started|komme igang|hjelp.*start)\b/.test(normalized) ||
    /\b(ny|new)\b.*\b(her|here)\b/.test(normalized) ||
    /\bbegynne\b/.test(normalized)
  ) {
    return "Go to knowledge getting started";
  }

  return question.trim();
}

export function buildPublicCompanionQuery(
  question: string,
  recentContext?: PublicCompanionRecentContextMessage[],
): string {
  if (!recentContext?.length) return question;
  const contextLines = recentContext.map((entry) => `${entry.role}: ${entry.text}`);
  return [...contextLines, `user: ${question}`].join("\n");
}

/** True when the visitor turn alone has little retrieval signal. */
export function isLowSignalPublicCompanionFollowUp(question: string): boolean {
  return isLowSignalWebsiteKompisFollowUp(question);
}

/**
 * Retrieval query for FAQ/index.
 * Uses a bounded intent rewrite (synonyms + last user topic for low-signal/referential
 * follow-ups). Never dumps the full chat transcript as the search string.
 */
export function buildPublicCompanionRetrievalQuestion(
  question: string,
  recentContext?: PublicCompanionRecentContextMessage[],
): string {
  return rewriteWebsiteKompisRetrievalIntent({
    question,
    recentContext,
  }).retrievalQuery;
}

/** Intent metadata for tests / diagnostics — same rewrite as retrieval. */
export function resolvePublicCompanionRetrievalIntent(
  question: string,
  recentContext?: PublicCompanionRecentContextMessage[],
) {
  return rewriteWebsiteKompisRetrievalIntent({ question, recentContext });
}

function assertAllowedRequestKeys(body: Record<string, unknown>): void {
  for (const key of Object.keys(body)) {
    if (!ALLOWED_REQUEST_KEYS.has(key)) {
      throw new PublicCompanionAskValidationError("Invalid request field");
    }
  }
}

export function validatePublicCompanionAskRequest(body: unknown): PublicCompanionAskRequest {
  if (!body || typeof body !== "object") {
    throw new PublicCompanionAskValidationError("Invalid request body");
  }

  const record = body as Record<string, unknown>;
  assertAllowedRequestKeys(record);

  const question = typeof record.question === "string" ? record.question.trim() : "";
  if (!question) {
    throw new PublicCompanionAskValidationError("question required");
  }
  if (question.length > PUBLIC_COMPANION_ASK_MAX_QUESTION_LENGTH) {
    throw new PublicCompanionAskValidationError("question too long");
  }

  const recentContext = sanitizeRecentContext(record.recentContext);
  const pageContext = sanitizePageContext(record.pageContext);

  return {
    question,
    locale: typeof record.locale === "string" ? record.locale : undefined,
    messageLocale: typeof record.messageLocale === "string" ? record.messageLocale : undefined,
    recentContext,
    pageContext,
    domain: sanitizePublicCompanionDomain(record.domain) ?? undefined,
    installId: sanitizePublicCompanionInstallId(record.installId) ?? undefined,
  };
}

function sanitizePageContext(value: unknown): PublicCompanionPageContext | undefined {
  if (value == null) return undefined;
  try {
    return sanitizeWebsiteCompanionPageContext(value);
  } catch {
    throw new PublicCompanionAskValidationError("Invalid pageContext");
  }
}

function sanitizeRecentContext(value: unknown): PublicCompanionRecentContextMessage[] | undefined {
  if (value == null) return undefined;
  if (!Array.isArray(value)) {
    throw new PublicCompanionAskValidationError("recentContext must be an array");
  }
  if (value.length > PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGES) {
    throw new PublicCompanionAskValidationError("recentContext too long");
  }

  return value.map((entry) => {
    if (!entry || typeof entry !== "object") {
      throw new PublicCompanionAskValidationError("Invalid recentContext entry");
    }
    const row = entry as Record<string, unknown>;
    if (row.role !== "user" && row.role !== "assistant") {
      throw new PublicCompanionAskValidationError("Invalid recentContext role");
    }
    const text = typeof row.text === "string" ? row.text.trim() : "";
    if (!text) {
      throw new PublicCompanionAskValidationError("recentContext text required");
    }
    // Truncate overlong prior turns instead of failing the ask — embed threads
    // often carry extractive answers longer than the server context cap.
    const clipped =
      text.length > PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGE_LENGTH
        ? text.slice(0, PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGE_LENGTH)
        : text;
    return { role: row.role, text: clipped };
  });
}

function mapConfidenceLevel(level: PlatformKnowledgeAnswer["confidence"]): PublicCompanionAskConfidence["level"] {
  if (level === "moderate") return "medium";
  return level;
}

function mapConfidenceScore(level: PublicCompanionAskConfidence["level"]): number | null {
  switch (level) {
    case "high":
      return 0.9;
    case "medium":
      return 0.65;
    case "low":
      return 0.25;
    default:
      return null;
  }
}

function isUnsafeHref(href: string): boolean {
  const normalized = href.trim().toLowerCase();
  if (!normalized.startsWith("/") || normalized.startsWith("//")) return true;
  if (/^(javascript:|data:|vbscript:)/.test(normalized)) return true;
  if (/^https?:/.test(normalized)) return true;
  return false;
}

export function sanitizePublicCompanionActions(
  actions: PlatformKnowledgeAction[],
): PublicCompanionAskAction[] {
  const sanitized: PublicCompanionAskAction[] = [];

  for (const action of actions) {
    if (!action.label?.trim() || !action.href?.trim() || !action.routeKey?.trim()) continue;
    if (isUnsafeHref(action.href)) continue;

    const route = getPlatformRouteByKey(action.routeKey);
    if (!route || route.href !== action.href) continue;

    sanitized.push({
      label: action.label.trim(),
      href: action.href,
      variant: action.variant === "primary" ? "primary" : "secondary",
    });
  }

  return sanitized;
}

function mapSources(answer: PlatformKnowledgeAnswer): PublicCompanionAskSource[] {
  const mapped = answer.sources
    .map((source) => ({
      title: source.label?.trim() || source.id,
      route: source.id,
    }))
    .filter((source) => source.title.length > 0 && source.route.length > 0);

  if (mapped.length > 0) return mapped;

  if (answer.sourceId) {
    return [{ title: answer.title ?? answer.sourceId, route: answer.sourceId }];
  }

  return [];
}

function containsUnsafeMarkup(text: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(text) || /\[[^\]]+\]\([^)]+\)/.test(text);
}

function assertSafeTextFields(answer: PlatformKnowledgeAnswer): void {
  const fields = [answer.directAnswer, answer.explanation ?? "", ...answer.steps];
  for (const field of fields) {
    if (containsUnsafeMarkup(field)) {
      throw new Error("Unsafe answer markup");
    }
  }
}

function isKnowledgeGapAnswer(answer: PlatformKnowledgeAnswer): boolean {
  return answer.sourceId === "knowledge-gap" || answer.source === "fallback" && answer.confidence === "low" && answer.actions.length === 0;
}

function isCustomerContextAnswer(matchedArticleId?: string, answer?: PlatformKnowledgeAnswer): boolean {
  if (matchedArticleId) {
    const entry = getPlatformCorpusEntry(matchedArticleId as PlatformCorpusArticleId);
    if (entry?.requiresCustomerContext) return true;
  }
  return answer?.sourceId === "my-subscription";
}

function resolveSupportEscalation(
  answer: PlatformKnowledgeAnswer,
  confidence: PublicCompanionAskConfidence,
  forceGap: boolean,
): PublicCompanionAskSupportEscalation {
  if (forceGap || isKnowledgeGapAnswer(answer)) {
    return { offered: true, reason: "knowledge_gap" };
  }
  if (confidence.level === "low") {
    return { offered: true, reason: "low_confidence" };
  }
  if (answer.showSupportEscalation && confidence.level === "medium") {
    return { offered: true, reason: "low_confidence" };
  }
  return { offered: false, reason: null };
}

function mapPlatformAnswerToPublicResponse(
  answer: PlatformKnowledgeAnswer,
  locale: PublicCompanionAskLocale,
  matchedArticleId?: string,
): PublicCompanionAskResponse {
  const forceGap = isCustomerContextAnswer(matchedArticleId, answer);
  const confidence: PublicCompanionAskConfidence = forceGap
    ? { level: "low", score: mapConfidenceScore("low") }
    : {
        level: mapConfidenceLevel(answer.confidence),
        score: mapConfidenceScore(mapConfidenceLevel(answer.confidence)),
      };

  const supportEscalation = resolveSupportEscalation(answer, confidence, forceGap);

  assertSafeTextFields(answer);

  return {
    answer: {
      directAnswer: answer.directAnswer,
      explanation: answer.explanation ?? null,
      steps: answer.steps ?? [],
    },
    actions: sanitizePublicCompanionActions(answer.actions),
    sources: mapSources(answer),
    confidence,
    supportEscalation,
    locale,
  };
}

function slugSignificantTerms(slug: string): string[] {
  const stopWords = new Set(["what", "is", "a", "an", "the", "how", "with", "and", "for", "to"]);
  return slug
    .split("-")
    .map((term) => term.trim().toLowerCase())
    .filter((term) => term.length > 2 && !stopWords.has(term));
}

export function isPublicPageContextQuestion(
  question: string,
  article: Pick<PublicKnowledgeArticleMeta, "slug" | "searchIntents"> & { title: string },
  pageContext?: PublicCompanionPageContext,
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

  const titleSource = (pageContext?.title ?? article.title).toLowerCase();
  const titleTokens = titleSource.split(/\W+/).filter((token) => token.length > 3);
  const titleMatches = titleTokens.filter((token) => normalized.includes(token));
  if (titleMatches.length >= 2) {
    return true;
  }

  const slugTerms = slugSignificantTerms(article.slug);
  const slugMatches = slugTerms.filter((term) => normalized.includes(term));
  if (slugMatches.length >= 2) {
    return true;
  }

  for (const intent of article.searchIntents ?? []) {
    const intentNorm = intent.trim().toLowerCase();
    if (!intentNorm) continue;
    if (normalized.includes(intentNorm)) {
      return true;
    }
  }

  return false;
}

export function buildPublicPageContextRetrievalQuery(
  question: string,
  article: {
    title: string;
    metaDescription: string;
    introduction: string;
  },
  pageContext?: PublicCompanionPageContext,
): string {
  const title = pageContext?.title?.trim() || article.title.trim();
  const description = pageContext?.metaDescription?.trim() || article.metaDescription.trim();
  const introduction = article.introduction.trim().slice(0, 400);

  return [
    `Current page: ${title}`,
    description ? `Page summary: ${description}` : null,
    introduction ? `Page introduction: ${introduction}` : null,
    `User question: ${question.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function tryBuildPublicPageContextAnswer(
  question: string,
  pageContext: PublicCompanionPageContext | undefined,
  locale: PublicCompanionAskLocale,
): Promise<PublicCompanionAskResponse | null> {
  if (
    !pageContext?.pathname ||
    (pageContext.surface && pageContext.surface !== "public") ||
    isPlatformProductKnowledgeQuery(question)
  ) {
    return null;
  }

  const slug = resolvePublicKnowledgeArticleSlugFromPathname(pageContext.pathname);
  if (!slug) {
    return null;
  }

  const dict = await getDictionary(publicAskDictionaryLocale(locale), ["marketing"]);
  const article = getPublicKnowledgeArticle(dict.marketing as Record<string, unknown>, slug);
  if (!article || !isPublicPageContextQuestion(question, article, pageContext)) {
    return null;
  }

  const explanation = article.sections[0]?.body?.trim() || article.metaDescription.trim() || null;
  const steps = article.keyTakeaways.map((entry) => entry.trim()).filter(Boolean).slice(0, 3);

  return {
    answer: {
      directAnswer: article.introduction.trim(),
      explanation,
      steps,
    },
    actions: [
      {
        label: article.title,
        href: pageContext.pathname,
        variant: "primary",
      },
    ],
    sources: [
      {
        title: article.title,
        route: pageContext.pathname,
      },
    ],
    confidence: { level: "high", score: 0.9 },
    supportEscalation: { offered: false, reason: null },
    locale,
  };
}

async function tryBuildPublicSiteIndexAnswer(
  question: string,
  locale: PublicCompanionAskLocale,
  visitorContext: PublicCompanionVisitorContext,
  onCustomerWebsite: boolean,
  installConfig: WebsiteKompisInstallConfig,
  searchPublicSiteIndex: typeof searchTenantPublicSiteIndex,
  recentContext?: PublicCompanionAskRequest["recentContext"],
): Promise<PublicCompanionAskResponse | null> {
  if (!installConfig.sources.publicSiteIndex) {
    return null;
  }
  if (!onCustomerWebsite) {
    return null;
  }
  if (!hasPublicCompanionVisitorContext(visitorContext)) {
    return null;
  }
  if (shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite(question, recentContext)) {
    return null;
  }

  const retrievalQuestion = buildPublicCompanionRetrievalQuestion(question, recentContext);

  const hits: PublicSiteIndexHit[] = await searchPublicSiteIndex({
    installId: visitorContext.installId,
    domain: visitorContext.domain,
    locale,
    query: retrievalQuestion,
    limit: 5,
  });

  if (!isRelevantPublicSiteIndexResult(hits, retrievalQuestion)) {
    return null;
  }

  const built = buildPublicSiteIndexAnswer(
    hits,
    locale,
    visitorContext.domain,
    retrievalQuestion,
  );
  if (!built) {
    return null;
  }

  return built as PublicCompanionAskResponse;
}

async function collectCustomerWebsiteEvidence(input: {
  question: string;
  locale: PublicCompanionAskLocale;
  validated: PublicCompanionAskRequest;
  visitorContext: PublicCompanionVisitorContext;
  installConfig: WebsiteKompisInstallConfig;
  searchTenantVisitorKnowledge: typeof searchPublicCompanionTenantFaq;
  searchPublicSiteIndex: typeof searchTenantPublicSiteIndex;
}): Promise<{
  faqRows: PublicCompanionTenantFaqRow[];
  siteIndexHits: PublicSiteIndexHit[];
}> {
  const faqRows: PublicCompanionTenantFaqRow[] = [];
  const siteIndexHits: PublicSiteIndexHit[] = [];

  const allowPlatform = shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite(
    input.question,
    input.validated.recentContext,
  );

  if (
    input.installConfig.sources.faq &&
    hasPublicCompanionVisitorContext(input.visitorContext) &&
    !allowPlatform
  ) {
    const rows = await input.searchTenantVisitorKnowledge({
      installId: input.visitorContext.installId,
      domain: input.visitorContext.domain,
      locale: input.locale,
      query: input.question,
      pathname: input.validated.pageContext?.pathname ?? null,
      limit: 5,
    });
    if (isRelevantPublicCompanionTenantFaqResult(rows, input.question)) {
      faqRows.push(...filterWebsiteKompisSafeFaqRows(input.question, rows));
    }
  }

  if (
    input.installConfig.sources.publicSiteIndex &&
    hasPublicCompanionVisitorContext(input.visitorContext) &&
    !allowPlatform
  ) {
    const hits = await input.searchPublicSiteIndex({
      installId: input.visitorContext.installId,
      domain: input.visitorContext.domain,
      locale: input.locale,
      query: input.question,
      limit: 5,
    });
    if (isRelevantPublicSiteIndexResult(hits, input.question)) {
      siteIndexHits.push(...hits);
    }
  }

  return preferStrongSiteIndexOverSparseFaq({
    question: input.question,
    faqRows,
    siteIndexHits,
  });
}

async function tryBuildPublicTenantFaqAnswer(
  question: string,
  locale: PublicCompanionAskLocale,
  validated: PublicCompanionAskRequest,
  requestHost: string | null | undefined,
  searchTenantVisitorKnowledge: typeof searchPublicCompanionTenantFaq,
  visitorContext: PublicCompanionVisitorContext,
  onCustomerWebsite: boolean,
  installConfig: WebsiteKompisInstallConfig,
): Promise<PublicCompanionAskResponse | null> {
  if (!installConfig.sources.faq) {
    return null;
  }

  if (onCustomerWebsite) {
    if (shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite(question, validated.recentContext)) {
      return null;
    }
  } else if (isPlatformProductKnowledgeQuery(question)) {
    return null;
  }

  if (!hasPublicCompanionVisitorContext(visitorContext)) {
    return null;
  }

  const retrievalQuestion = buildPublicCompanionRetrievalQuestion(
    question,
    validated.recentContext,
  );

  const rows = await searchTenantVisitorKnowledge({
    installId: visitorContext.installId,
    domain: visitorContext.domain,
    locale,
    query: retrievalQuestion,
    pathname: validated.pageContext?.pathname ?? null,
    limit: 5,
  });

  if (!isRelevantPublicCompanionTenantFaqResult(rows, retrievalQuestion)) {
    return null;
  }

  const safeRows = filterWebsiteKompisSafeFaqRows(retrievalQuestion, rows);
  if (safeRows.length === 0) {
    return null;
  }

  return buildPublicCompanionTenantFaqResponse(
    safeRows,
    locale,
    visitorContext.domain,
  ) as PublicCompanionAskResponse;
}

function applyWebsiteKompisCustomerSiteTone(
  response: PublicCompanionAskResponse,
  input: {
    locale: string;
    fallbackTone: WebsiteKompisInstallConfig["fallbackTone"];
    source: WebsiteKompisVisitorAnswerSource;
    domain?: string | null;
  },
): PublicCompanionAskResponse {
  return {
    ...response,
    answer: presentWebsiteKompisCustomerSiteAnswer(response.answer, {
      locale: input.locale,
      fallbackTone: input.fallbackTone,
      source: input.source,
      domain: input.domain,
    }),
  };
}

/**
 * Deterministic extract/FAQ must satisfy the shared public answer policy.
 * Returns null so the ask chain can try the next evidence path (honest gap last).
 */
function applyCustomerSiteDeterministicPolicy(
  response: PublicCompanionAskResponse,
  question: string,
): PublicCompanionAskResponse | null {
  const policy = evaluateWebsiteKompisDeterministicAnswerPolicy({
    question,
    directAnswer: response.answer.directAnswer,
  });
  if (!policy.ok) {
    console.warn("[website-kompis-policy]", {
      event: "deterministic_answer_rejected",
      reason: policy.reason,
    });
    return null;
  }
  return response;
}

function tagCustomerSiteAnswerPath(
  response: PublicCompanionAskResponse,
  path: WebsiteKompisPublicAnswerPath,
  includeDiagnostics: boolean,
): PublicCompanionAskResponse {
  return withWebsiteKompisPublicAnswerPathDiagnostic(response, path, {
    includeDiagnostics,
  }) as PublicCompanionAskResponse;
}

/** Redacted server trace for owner correlation — never mutates answer behavior. */
function finishCustomerWebsiteAskWithTrace(
  response: PublicCompanionAskResponse,
  input: {
    correlationId: string;
    installValidated: boolean;
    installId: string | null;
    domain: string | null;
    pageContext: PublicCompanionPageContext | null | undefined;
    answerPath: WebsiteKompisPublicAnswerPath;
    pageSignalsUsed: string[];
    rejectReason?: string | null;
    status?: "ok" | "disabled" | "private_scope" | "rejected_chain";
    contextChars?: number;
  },
): PublicCompanionAskResponse {
  const pageContext = input.pageContext ?? null;
  logWebsiteKompisPublicAskTrace(
    buildWebsiteKompisPublicAskTracePayload({
      correlationId: input.correlationId,
      installValidated: input.installValidated,
      installId: input.installId,
      domain: input.domain,
      pagePathname: pageContext?.pathname ?? null,
      pageLocale: pageContext?.locale ?? null,
      titlePresent: Boolean(pageContext?.title?.trim()),
      pageContextPresent: Boolean(pageContext),
      pageSignalsAvailable: listAvailablePublicPageSignals(pageContext),
      pageSignalsUsed: input.pageSignalsUsed,
      sourceRoutes: response.sources.map((source) => source.route),
      contextChars:
        input.contextChars ?? estimatePublicPageContextChars(pageContext),
      answerPath: input.answerPath,
      rejectReason: input.rejectReason ?? null,
      status: input.status ?? "ok",
    }),
  );
  return response;
}

function buildWebsiteKompisCustomerSiteFallbackResponse(
  locale: string,
  domain: string | null | undefined,
  fallbackTone: WebsiteKompisInstallConfig["fallbackTone"],
): PublicCompanionAskResponse {
  return buildWebsiteKompisSafeFallbackResponse(locale, domain, {
    fallbackTone,
  }) as PublicCompanionAskResponse;
}

export async function askPublicPlatformCompanion(
  input: PublicCompanionAskRequest,
  options?: PublicCompanionAskOptions,
): Promise<PublicCompanionAskResponse> {
  const validated = validatePublicCompanionAskRequest(input);
  const searchTenantVisitorKnowledge =
    options?.searchTenantVisitorKnowledge ?? searchPublicCompanionTenantFaq;
  const searchPublicSiteIndex =
    options?.searchTenantPublicSiteIndex ?? searchTenantPublicSiteIndex;

  const visitorContext = resolvePublicCompanionVisitorContext({
    clientDomain: validated.domain,
    requestHost: options?.requestHost,
    installId: validated.installId,
  });
  const onCustomerWebsite = isCustomerWebsiteVisitorContext(visitorContext);
  const allowAipifyPlatformKnowledge =
    !onCustomerWebsite ||
    shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite(
      validated.question,
      validated.recentContext,
    );

  const installConfig = await getWebsiteKompisInstallConfigForPublicRequest(
    {
      installId: validated.installId,
      domain: validated.domain,
      requestHost: options?.requestHost,
      locale: validated.locale,
    },
    {
      rawInstallConfig: options?.rawInstallConfig,
      loadInstallConfig: options?.loadInstallConfig,
      requestLocale: validated.locale,
    },
  );
  const locale = resolvePublicCompanionLocale({
    messageLocale: validated.messageLocale,
    pageLocale: validated.pageContext?.locale,
    requestLocale: validated.locale,
    siteDefaultLocale: installConfig.explicitContentLocale,
    embedVisitor: hasPublicCompanionVisitorContext(visitorContext),
  });

  if (hasPublicCompanionVisitorContext(visitorContext)) {
    const resolveAvailability =
      options?.resolveLicensedAvailability ?? resolveWebsiteKompisPublicLicensedAvailability;
    const availability = await resolveAvailability(visitorContext);
    if (!availability.available) {
      return buildWebsiteKompisDisabledResponse(
        locale,
        visitorContext.domain,
      ) as PublicCompanionAskResponse;
    }
  }

  if (!installConfig.enabled) {
    return buildWebsiteKompisDisabledResponse(locale, visitorContext.domain) as PublicCompanionAskResponse;
  }

  // Private account / admin-console asks must never fall through to FAQ or paid grounding.
  if (
    onCustomerWebsite &&
    isOutOfScopePrivateMemberOrAdminQuestion(validated.question)
  ) {
    return buildWebsiteKompisPrivateScopeRefusalResponse(
      locale,
      visitorContext.domain,
    ) as PublicCompanionAskResponse;
  }

  const dict = await getCustomerAppDictionaryForSplits(publicAskDictionaryLocale(locale), [
    "companionPlatformKnowledge",
    "portalStructure",
  ]);
  const t = createTranslator(dict);

  // P1: Aipify Platform package ladder only on Aipify-owned assistants — never on
  // verified customer Website Kompis hosts (authoritative onCustomerWebsite context).
  if (
    !onCustomerWebsite &&
    isPublicPricingQuestion(validated.question) &&
    allowAipifyPlatformKnowledge
  ) {
    return buildPublicPricingCompanionResponse(locale, t);
  }

  if (onCustomerWebsite && !allowAipifyPlatformKnowledge) {
    const customerSiteTone = {
      locale,
      fallbackTone: installConfig.fallbackTone,
      domain: visitorContext.domain,
    };
    const askCorrelationId = createWebsiteKompisPublicAskCorrelationId();
    const installValidated = Boolean(visitorContext.installId);
    const activePageContext = installConfig.sources.currentPage
      ? validated.pageContext
      : null;
    const pageSignalsAvailable = listAvailablePublicPageSignals(activePageContext);
    const traceBase = {
      correlationId: askCorrelationId,
      installValidated,
      installId: visitorContext.installId,
      domain: visitorContext.domain,
      pageContext: activePageContext,
    };

    // Public embed must never expose a costControls bypass via query/body/browser.
    // Preview SSO is not a cost limit. Injected completion is test-harness only (NODE_ENV=test).
    const isPreviewEnv = process.env.VERCEL_ENV === "preview";

    const safetyPolicyAnswer = tryBuildWebsiteKompisSafetyPolicyAnswer(
      validated.question,
      publicAskDictionaryLocale(locale),
    );
    if (safetyPolicyAnswer) {
      return finishCustomerWebsiteAskWithTrace(
        tagCustomerSiteAnswerPath(
          applyWebsiteKompisCustomerSiteTone(safetyPolicyAnswer, {
            ...customerSiteTone,
            source: "faq",
          }),
          "safety_policy",
          isPreviewEnv,
        ),
        {
          ...traceBase,
          answerPath: "safety_policy",
          pageSignalsUsed: [],
        },
      );
    }

    const retrievalQuestion = buildPublicCompanionRetrievalQuestion(
      validated.question,
      validated.recentContext,
    );

    const { faqRows, siteIndexHits } = await collectCustomerWebsiteEvidence({
      question: retrievalQuestion,
      locale,
      validated,
      visitorContext,
      installConfig,
      searchTenantVisitorKnowledge,
      searchPublicSiteIndex,
    });

    const evidencePack = buildWebsiteKompisEvidencePack({
      question: validated.question,
      locale,
      recentContext: validated.recentContext,
      faqRows,
      siteIndexHits,
      pageContext: installConfig.sources.currentPage
        ? validated.pageContext
        : null,
      verifiedHost: visitorContext.domain,
    });

    console.warn("[website-kompis-grounded]", {
      event: "ask_evidence_ready",
      faqCount: faqRows.length,
      indexCount: siteIndexHits.length,
      evidenceCount: evidencePack.evidence.length,
    });

    // Injected completion is server-options only (never request body/query) — unit/testharness.
    const injectedCompletion = options?.groundedCompletion;
    const testHarnessCompletion = Boolean(injectedCompletion);

    let publicCostDecision: WebsiteKompisPublicAiCostDecision | null = null;
    if (!testHarnessCompletion) {
      publicCostDecision = await reserveWebsiteKompisPublicAiCostControls({
        visitorContext,
      });
      if (!publicCostDecision.allowed) {
        console.warn("[website-kompis-grounded]", {
          event: "public_ai_cost_denied",
          reason: publicCostDecision.reason,
          detail: publicCostDecision.detail ?? null,
          vercelEnv: process.env.VERCEL_ENV ?? null,
        });
      }
    }

    const canCallProvider =
      testHarnessCompletion || publicCostDecision?.allowed === true;

    const groundedResult = canCallProvider
      ? await synthesizeWebsiteKompisGroundedAnswer({
          pack: evidencePack,
          completion:
            injectedCompletion ??
            createDefaultWebsiteKompisGroundedCompletion({
              // Public reservation (or test harness) already owns metering.
              // Do not use operator auth.uid() APP RPCs on anonymous embed.
              costControls: "off",
            }),
          costControls: "off",
        })
      : {
          status: "failed" as const,
          reason: "provider" as const,
          detail:
            publicCostDecision && !publicCostDecision.allowed
              ? `public_cost_${publicCostDecision.reason}`
              : "public_cost_denied",
          evidenceCount: evidencePack.evidence.length,
        };

    if (publicCostDecision?.allowed) {
      await finalizeWebsiteKompisPublicAiCostControls({
        decision: publicCostDecision,
        result:
          groundedResult.status === "ok"
            ? "success"
            : groundedResult.status === "failed" && groundedResult.reason === "provider"
              ? "provider_error"
              : groundedResult.status === "failed"
                ? "fallback"
                : "skipped",
        safeErrorCode:
          groundedResult.status === "failed" && "detail" in groundedResult
            ? groundedResult.detail
            : null,
      });
    }

    let providerHonestGapRetry = false;
    let providerHonestGapResponse: PublicCompanionAskResponse | null = null;
    if (groundedResult.status === "ok") {
      const groundedAnswer = groundedResult.response;
      const groundedSource: WebsiteKompisVisitorAnswerSource =
        siteIndexHits.length > 0
          ? "public-site-index"
          : faqRows.length > 0
            ? "faq"
            : "current-page";
      const groundedResponse = tagCustomerSiteAnswerPath(
        applyWebsiteKompisCustomerSiteTone(
          {
            answer: groundedAnswer.answer,
            actions: groundedAnswer.actions,
            sources: groundedAnswer.sources,
            confidence: groundedAnswer.confidence,
            supportEscalation: groundedAnswer.supportEscalation,
            locale: groundedAnswer.locale as PublicCompanionAskLocale,
          },
          {
            ...customerSiteTone,
            source: groundedSource,
          },
        ),
        "provider_grounded",
        isPreviewEnv,
      );
      // Empty-source honest gaps must NOT skip page/index/FAQ composition —
      // sufficient published evidence can still answer via deterministic paths.
      // Partial gaps (covered=false with validated sources) keep provider wording
      // so extractive fallback cannot overwrite a clear missing-value statement.
      const keepProviderGrounded =
        !isWebsiteKompisProviderKnowledgeGapResponse(groundedAnswer) ||
        isWebsiteKompisProviderPartialKnowledgeGapResponse(groundedAnswer);
      if (keepProviderGrounded) {
        const groundedSignalsUsed =
          groundedSource === "current-page" ? pageSignalsAvailable : [];
        if (isPreviewEnv) {
          const existingDiagnostics =
            groundedResponse.diagnostics &&
            typeof groundedResponse.diagnostics === "object"
              ? (groundedResponse.diagnostics as Record<string, unknown>)
              : {};
          return finishCustomerWebsiteAskWithTrace(
            {
              ...groundedResponse,
              diagnostics: {
                ...existingDiagnostics,
                grounded: {
                  status: groundedResult.status,
                  evidenceCount: evidencePack.evidence.length,
                  faqCount: faqRows.length,
                  indexCount: siteIndexHits.length,
                  costControls: "public_required",
                  // No provider request IDs in public embed responses.
                  provider: null,
                },
              },
            } as PublicCompanionAskResponse,
            {
              ...traceBase,
              answerPath: "provider_grounded",
              pageSignalsUsed: groundedSignalsUsed,
              contextChars: evidencePack.evidence.reduce(
                (sum, item) => sum + (item.text?.length ?? 0),
                0,
              ),
            },
          );
        }
        return finishCustomerWebsiteAskWithTrace(groundedResponse, {
          ...traceBase,
          answerPath: "provider_grounded",
          pageSignalsUsed: groundedSignalsUsed,
          contextChars: evidencePack.evidence.reduce(
            (sum, item) => sum + (item.text?.length ?? 0),
            0,
          ),
        });
      }
      providerHonestGapRetry = true;
      providerHonestGapResponse = groundedResponse;
    }
    const previewGroundedDiagnostic = isPreviewEnv
      ? {
          grounded: {
            status: providerHonestGapRetry
              ? ("gap_retry_deterministic" as const)
              : groundedResult.status,
            reason: providerHonestGapRetry
              ? "knowledge_gap"
              : groundedResult.status === "ok"
                ? null
                : groundedResult.reason,
            detail:
              !providerHonestGapRetry && "detail" in groundedResult
                ? groundedResult.detail
                : null,
            evidenceCount: evidencePack.evidence.length,
            faqCount: faqRows.length,
            indexCount: siteIndexHits.length,
            costControls: "public_required",
            provider: null,
          },
        }
      : null;
    if (previewGroundedDiagnostic) {
      console.warn("[website-kompis-grounded]", {
        event: providerHonestGapRetry
          ? "provider_honest_gap_retry_deterministic"
          : "ask_grounded_not_used",
        status: previewGroundedDiagnostic.grounded.status,
        reason: previewGroundedDiagnostic.grounded.reason,
        detail: previewGroundedDiagnostic.grounded.detail,
        evidenceCount: previewGroundedDiagnostic.grounded.evidenceCount,
        costControls: "public_required",
      });
    }

    const withPreviewDiagnostic = <T extends PublicCompanionAskResponse>(
      response: T,
    ): T => {
      if (!previewGroundedDiagnostic) return response;
      return { ...response, diagnostics: previewGroundedDiagnostic } as T;
    };

    if (installConfig.sources.currentPage) {
      const currentPageAnswer = tryBuildWebsiteKompisCurrentPublicPageAnswer({
        question: validated.question,
        pageContext: validated.pageContext,
        locale,
        verifiedHost: visitorContext.domain,
      });
      if (currentPageAnswer) {
        const pageResponse = applyCustomerSiteDeterministicPolicy(
          applyWebsiteKompisCustomerSiteTone(
            {
              answer: currentPageAnswer.answer,
              actions: [],
              sources: currentPageAnswer.sources,
              confidence: {
                level: currentPageAnswer.confidence.level,
                score: currentPageAnswer.confidence.score,
              },
              supportEscalation: { offered: false, reason: null },
              locale,
            },
            { ...customerSiteTone, source: "current-page" },
          ),
          validated.question,
        );
        if (pageResponse) {
          return finishCustomerWebsiteAskWithTrace(
            withPreviewDiagnostic(
              tagCustomerSiteAnswerPath(pageResponse, "current_page", isPreviewEnv),
            ),
            {
              ...traceBase,
              answerPath: "current_page",
              pageSignalsUsed: pageSignalsAvailable,
            },
          );
        }
      }
    }

    // Empty grounded pack means collected index/FAQ candidates already failed the
    // visitor-question topic bar. A second loose search must not reintroduce them
    // as a fact-looking public_site_index answer (price-gap / membership dump).
    // Provider honest-gap retry may still re-search when the pack had evidence.
    const groundedPackEmpty = evidencePack.evidence.length === 0;
    let siteIndexAnswer: PublicCompanionAskResponse | null = null;
    if (groundedPackEmpty && !providerHonestGapRetry) {
      const topicalHits = filterSiteIndexHitsMatchingEvidenceTopic(
        siteIndexHits,
        validated.question,
      );
      if (topicalHits.length > 0) {
        const built = buildPublicSiteIndexAnswer(
          topicalHits,
          locale,
          visitorContext.domain,
          validated.question,
        );
        if (built) {
          siteIndexAnswer = built as PublicCompanionAskResponse;
        }
      }
    } else {
      siteIndexAnswer = await tryBuildPublicSiteIndexAnswer(
        validated.question,
        locale,
        visitorContext,
        onCustomerWebsite,
        installConfig,
        searchPublicSiteIndex,
        validated.recentContext,
      );
    }
    if (siteIndexAnswer) {
      const indexResponse = applyCustomerSiteDeterministicPolicy(
        applyWebsiteKompisCustomerSiteTone(siteIndexAnswer, {
          ...customerSiteTone,
          source: "public-site-index",
        }),
        validated.question,
      );
      if (indexResponse) {
        return finishCustomerWebsiteAskWithTrace(
          withPreviewDiagnostic(
            tagCustomerSiteAnswerPath(indexResponse, "public_site_index", isPreviewEnv),
          ),
          {
            ...traceBase,
            answerPath: "public_site_index",
            pageSignalsUsed: pageSignalsAvailable.includes("pathname")
              ? ["pathname"]
              : [],
          },
        );
      }
    }

    // Same rule for FAQ: empty pack → do not re-search a looser FAQ path.
    const customerFaqAnswer =
      groundedPackEmpty && !providerHonestGapRetry
        ? null
        : await tryBuildPublicTenantFaqAnswer(
            validated.question,
            locale,
            validated,
            options?.requestHost,
            searchTenantVisitorKnowledge,
            visitorContext,
            onCustomerWebsite,
            installConfig,
          );
    if (customerFaqAnswer) {
      const faqResponse = applyCustomerSiteDeterministicPolicy(
        applyWebsiteKompisCustomerSiteTone(customerFaqAnswer, {
          ...customerSiteTone,
          source: "faq",
        }),
        validated.question,
      );
      if (faqResponse) {
        return finishCustomerWebsiteAskWithTrace(
          withPreviewDiagnostic(
            tagCustomerSiteAnswerPath(faqResponse, "faq", isPreviewEnv),
          ),
          {
            ...traceBase,
            answerPath: "faq",
            pageSignalsUsed: [],
          },
        );
      }
    }

    if (providerHonestGapResponse) {
      return finishCustomerWebsiteAskWithTrace(
        withPreviewDiagnostic(providerHonestGapResponse),
        {
          ...traceBase,
          answerPath: "provider_grounded",
          pageSignalsUsed: [],
          rejectReason: "provider_knowledge_gap",
          status: "ok",
        },
      );
    }

    const costRejectReason =
      publicCostDecision && !publicCostDecision.allowed
        ? `public_cost_${publicCostDecision.reason}`
        : groundedResult.status === "failed"
          ? groundedResult.reason
          : null;

    return finishCustomerWebsiteAskWithTrace(
      withPreviewDiagnostic(
        tagCustomerSiteAnswerPath(
          buildWebsiteKompisCustomerSiteFallbackResponse(
            locale,
            visitorContext.domain,
            installConfig.fallbackTone,
          ),
          "safe_fallback",
          isPreviewEnv,
        ),
      ),
      {
        ...traceBase,
        answerPath: "safe_fallback",
        pageSignalsUsed: [],
        rejectReason: costRejectReason,
        status: "rejected_chain",
      },
    );
  }

  const tenantFaqAnswer = await tryBuildPublicTenantFaqAnswer(
    validated.question,
    locale,
    validated,
    options?.requestHost,
    searchTenantVisitorKnowledge,
    visitorContext,
    onCustomerWebsite,
    installConfig,
  );
  if (tenantFaqAnswer) {
    return tenantFaqAnswer;
  }

  if (!onCustomerWebsite) {
    const pageContextAnswer = await tryBuildPublicPageContextAnswer(
      validated.question,
      validated.pageContext,
      locale,
    );
    if (pageContextAnswer) {
      return pageContextAnswer;
    }
  }

  // Customer embeds: platform/Aipify knowledge only for explicit Aipify/Kompis
  // questions when sources.aipifyPublic is enabled. Generic site questions must
  // never fall through to searchPlatformKnowledge (even if aipifyPublic=true).
  if (onCustomerWebsite) {
    if (
      !installConfig.sources.aipifyPublic ||
      !shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite(
        validated.question,
        validated.recentContext,
      )
    ) {
      return buildWebsiteKompisCustomerSiteFallbackResponse(
        locale,
        visitorContext.domain,
        installConfig.fallbackTone,
      );
    }
  } else if (!installConfig.sources.aipifyPublic) {
    return buildWebsiteKompisCustomerSiteFallbackResponse(
      locale,
      visitorContext.domain,
      installConfig.fallbackTone,
    );
  }

  const contextualQuestion = buildPublicCompanionQuery(validated.question, validated.recentContext);
  const query = shouldRewritePublicRetrievalQuery(validated.question)
    ? buildPublicRetrievalQuery(validated.question)
    : contextualQuestion;

  const tenantContext = createEmptyCompanionTenantContext({
    locale: publicAskDictionaryLocale(locale),
  });

  const result = await searchPlatformKnowledge(query, {
    t,
    locale,
    ctx: buildPublicPlatformSearchContext(locale),
    getSearchTermsArray: (key) => getSearchTermsArray(dict.customerApp as Record<string, unknown>, key),
    companionSurface: false,
    tenantContext,
  });

  if (isCustomerContextAnswer(result.matchedArticleId, result.answer)) {
    const gap = buildHonestKnowledgeGapAnswer(t);
    return mapPlatformAnswerToPublicResponse(gap, locale, "knowledge-gap");
  }

  return mapPlatformAnswerToPublicResponse(result.answer, locale, result.matchedArticleId);
}
