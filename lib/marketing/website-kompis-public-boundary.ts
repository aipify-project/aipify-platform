import type { WebsiteKompisFallbackTone } from "@/lib/marketing/website-kompis-install-config";
import { buildWebsiteKompisWarmSafeFallbackCopy } from "@/lib/marketing/website-kompis-visitor-tone";
import type { PublicCompanionVisitorContext } from "@/lib/marketing/public-companion-tenant-faq";
import { hasPublicCompanionVisitorContext } from "@/lib/marketing/public-companion-tenant-faq";

export const WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE = "website-kompis-safe-fallback" as const;

const AIPIFY_MARKETING_DOMAINS = new Set(["aipify.ai", "www.aipify.ai"]);

const EXPLICIT_AIPIFY_KOMPIS_PATTERNS: RegExp[] = [
  /\baipify\b/i,
  /\babos\b/i,
  /\bwebsite kompis\b/i,
  /\bwebsite-kompis\b/i,
  /\baipify kompis\b/i,
  /\bkompis-widget(?:en)?\b/i,
  /\bdenne widgeten\b/i,
  /\bdenne assistenten\b/i,
  /\bdette widgetet\b/i,
  /\bhvem leverer dette\b/i,
  /\bhvordan fungerer denne (?:widgeten|assistenten|kompis(?:en)?)\b/i,
  /\bwhat is aipify\b/i,
  /\bwhat is (?:the )?website kompis\b/i,
  /\bhow does (?:this|the) (?:widget|assistant|kompis)\b/i,
];

/** Customer embed / tenant website — not Aipify marketing site. */
export function isCustomerWebsiteVisitorContext(
  context: PublicCompanionVisitorContext,
): boolean {
  if (!hasPublicCompanionVisitorContext(context)) {
    return false;
  }

  const domain = context.domain?.trim().toLowerCase() ?? null;
  if (!domain) {
    return Boolean(context.installId);
  }

  return !AIPIFY_MARKETING_DOMAINS.has(domain);
}

export const AIPIFY_PUBLIC_KNOWLEDGE_SOURCE_PREFIX = "aipify" as const;

/** Explicit questions about Aipify, Website Kompis, or the widget/system — not generic site questions. */
export function isExplicitAipifyOrKompisQuestion(question: string): boolean {
  const normalized = question
    .trim()
    .toLowerCase()
    .replace(/[?!.]+$/, "")
    .replace(/\s+/g, " ");

  if (!normalized) return false;

  if (EXPLICIT_AIPIFY_KOMPIS_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  if (
    /\bkompis\b/.test(normalized) &&
    /\b(hva er|what is|hvordan fungerer|how does)\b/.test(normalized)
  ) {
    return true;
  }

  return false;
}

function normalizeVisitorQuestion(question: string): string {
  return question
    .trim()
    .toLowerCase()
    .replace(/[?!.]+$/, "")
    .replace(/\s+/g, " ");
}

/** Aipify product pricing on a customer domain — not the customer's own prices. */
export function isExplicitAipifyPricingQuestion(question: string): boolean {
  const normalized = normalizeVisitorQuestion(question);
  if (!normalized) return false;

  const mentionsPricing = /\b(kost|koster|pris\w*|price|pricing|cost|costs|abonnement)\b/.test(
    normalized,
  );
  const mentionsAipify = /\b(aipify|abos|website kompis|website-kompis)\b/.test(normalized);

  return mentionsPricing && mentionsAipify;
}

/** Aipify support/contact on a customer domain — not the customer's own support. */
export function isExplicitAipifySupportQuestion(question: string): boolean {
  const normalized = normalizeVisitorQuestion(question);
  if (!normalized) return false;

  const mentionsAipify = /\b(aipify|abos|website kompis|website-kompis)\b/.test(normalized);
  if (!mentionsAipify) return false;

  return /\b(support|hjelp|help|kontakt aipify|contact aipify|kundeservice)\b/.test(normalized);
}

/**
 * Platform/Aipify knowledge is allowed on a customer public domain only for explicit
 * Aipify, Website Kompis, pricing, product, or support questions.
 */
export function shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite(question: string): boolean {
  return (
    isExplicitAipifyOrKompisQuestion(question) ||
    isExplicitAipifyPricingQuestion(question) ||
    isExplicitAipifySupportQuestion(question)
  );
}

function siteLabelFromDomain(domain: string | null | undefined): string | null {
  if (!domain) return null;
  const label = domain.split(".")[0]?.trim();
  if (!label) return null;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function safeFallbackCopy(
  locale: string,
  siteLabel: string | null,
  fallbackTone: WebsiteKompisFallbackTone = "professional-friendly",
): string {
  return buildWebsiteKompisWarmSafeFallbackCopy(locale, siteLabel, fallbackTone);
}

export function buildWebsiteKompisSafeFallbackResponse(
  locale: string,
  domain: string | null | undefined,
  options?: { fallbackTone?: WebsiteKompisFallbackTone },
) {
  const siteLabel = siteLabelFromDomain(domain ?? null);
  const fallbackTone = options?.fallbackTone ?? "professional-friendly";

  return {
    answer: {
      directAnswer: safeFallbackCopy(locale, siteLabel, fallbackTone),
      explanation: null,
      steps: [],
    },
    actions: [],
    sources: [{ title: siteLabel ?? "Website Kompis", route: WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE }],
    confidence: { level: "low" as const, score: 0.2 },
    supportEscalation: { offered: true as const, reason: "knowledge_gap" as const },
    locale,
  };
}
