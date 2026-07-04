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

export const PUBLIC_COMPANION_ASK_LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
export type PublicCompanionAskLocale = (typeof PUBLIC_COMPANION_ASK_LOCALES)[number];

export const PUBLIC_COMPANION_ASK_MAX_QUESTION_LENGTH = 1000;
export const PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGES = 6;
export const PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGE_LENGTH = 500;

const ALLOWED_REQUEST_KEYS = new Set(["question", "locale", "messageLocale", "recentContext", "pageContext"]);

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
};

export class PublicCompanionAskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicCompanionAskValidationError";
  }
}

function resolvePublicCompanionLocale(
  locale?: string,
  messageLocale?: string,
): PublicCompanionAskLocale {
  const preferred = messageLocale?.trim() || locale?.trim();
  if (preferred && isPublicFooterEnabledLocale(preferred)) {
    return preferred;
  }
  return DEFAULT_LOCALE;
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

function licenseLabelForLocale(locale: PublicCompanionAskLocale): string {
  switch (locale) {
    case "en":
      return "licenses";
    case "da":
    case "sv":
      return "licenser";
    default:
      return "lisenser";
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
  const marketingDict = await getDictionary(locale as Locale, ["marketing"]);
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
    if (text.length > PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGE_LENGTH) {
      throw new PublicCompanionAskValidationError("recentContext text too long");
    }
    return { role: row.role, text };
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
  if (!pageContext?.pathname || isPlatformProductKnowledgeQuery(question)) {
    return null;
  }

  const slug = resolvePublicKnowledgeArticleSlugFromPathname(pageContext.pathname);
  if (!slug) {
    return null;
  }

  const dict = await getDictionary(locale as Locale, ["marketing"]);
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

export async function askPublicPlatformCompanion(
  input: PublicCompanionAskRequest,
): Promise<PublicCompanionAskResponse> {
  const validated = validatePublicCompanionAskRequest(input);
  const locale = resolvePublicCompanionLocale(validated.locale, validated.messageLocale);

  const dict = await getCustomerAppDictionaryForSplits(locale as Locale, [
    "companionPlatformKnowledge",
    "portalStructure",
  ]);
  const t = createTranslator(dict);

  if (isPublicPricingQuestion(validated.question)) {
    return buildPublicPricingCompanionResponse(locale, t);
  }

  const pageContextAnswer = await tryBuildPublicPageContextAnswer(
    validated.question,
    validated.pageContext,
    locale,
  );
  if (pageContextAnswer) {
    return pageContextAnswer;
  }

  const contextualQuestion = buildPublicCompanionQuery(validated.question, validated.recentContext);
  const query = shouldRewritePublicRetrievalQuery(validated.question)
    ? buildPublicRetrievalQuery(validated.question)
    : contextualQuestion;

  const tenantContext = createEmptyCompanionTenantContext({ locale });

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
