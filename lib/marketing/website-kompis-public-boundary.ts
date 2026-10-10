import type { WebsiteKompisFallbackTone } from "@/lib/marketing/website-kompis-install-config";
import { buildWebsiteKompisWarmSafeFallbackCopy } from "@/lib/marketing/website-kompis-visitor-tone";
import type { PublicCompanionVisitorContext } from "@/lib/marketing/public-companion-tenant-faq";
import { hasPublicCompanionVisitorContext } from "@/lib/marketing/public-companion-tenant-faq";

export const WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE = "website-kompis-safe-fallback" as const;
export const WEBSITE_KOMPIS_PRIVATE_SCOPE_SOURCE = "website-kompis-private-scope" as const;

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

/**
 * Public Website Kompis cannot answer private account data or admin-console access.
 * Distinguishes those from ordinary public login/membership help covered by site guides.
 */
export function isOutOfScopePrivateMemberOrAdminQuestion(question: string): boolean {
  const normalized = normalizeVisitorQuestion(question);
  if (!normalized) return false;

  const mentionsAdminPanel =
    /\b(adminpanel|admin-panel|admin\s*panel|kontrollpanel|control\s*panel|backoffice|back-office)\b/.test(
      normalized,
    ) ||
    (/\badmin\b/.test(normalized) &&
      /\b(panel|område|area|portal|tilgang|access|innlogging|login)\b/.test(normalized));

  const mentionsPrivateAccount =
    /\b(privat(?:e)?\s+medlemskonto|private\s+(?:member\s+)?account|min\s+private\s+konto|privat\s+kontostatus|private\s+account\s+status|min\s+kontosaldo|private\s+(?:account\s+)?balance)\b/.test(
      normalized,
    ) ||
    (/\b(privat|private)\b/.test(normalized) &&
      /\b(konto|account|kontostatus|saldo|inbox|meldinger|messages|dashboard)\b/.test(normalized) &&
      /\b(min|my|meg|me|vår|our)\b/.test(normalized));

  const privateLoginPlusAdmin =
    /\b(min|my)\b/.test(normalized) &&
    /\b(privat|private)\b/.test(normalized) &&
    /\b(konto|account|medlemskonto)\b/.test(normalized) &&
    /\b(logg\w*|login|sign\s*in|innlogging)\b/.test(normalized) &&
    mentionsAdminPanel;

  return mentionsAdminPanel || mentionsPrivateAccount || privateLoginPlusAdmin;
}

function privateScopeRefusalCopy(locale: string, siteLabel: string | null): {
  directAnswer: string;
  explanation: string | null;
} {
  const site = siteLabel ?? "this website";
  switch (locale) {
    case "en":
      return {
        directAnswer: `I can only help with what is published publicly on ${site}. I cannot access private member accounts or admin areas. Use the site's own sign-in if you need your account, or contact ${site} support for help with private access.`,
        explanation: "Private account and admin access stay outside the public Website Kompis.",
      };
    case "sv":
      return {
        directAnswer: `Jag kan bara hjälpa med det som är publikt publicerat på ${site}. Jag har inte tillgång till privata medlemskonton eller adminytor. Använd webbplatsens egen inloggning för ditt konto, eller kontakta ${site} om du behöver hjälp med privat åtkomst.`,
        explanation: "Privata konton och adminåtkomst ligger utanför den publika Website Kompis.",
      };
    case "da":
      return {
        directAnswer: `Jeg kan kun hjælpe med det, der er offentliggjort på ${site}. Jeg har ikke adgang til private medlemskonti eller adminområder. Brug sidens egen login til din konto, eller kontakt ${site}, hvis du har brug for hjælp til privat adgang.`,
        explanation: "Private konti og adminadgang ligger uden for den offentlige Website Kompis.",
      };
    case "pl":
      return {
        directAnswer: `Mogę pomóc tylko w zakresie treści publicznie opublikowanych na ${site}. Nie mam dostępu do prywatnych kont członkowskich ani panelu admina. Użyj logowania na stronie albo skontaktuj się z ${site} w sprawie prywatnego dostępu.`,
        explanation: "Prywatne konta i dostęp administracyjny są poza publicznym Website Kompis.",
      };
    case "uk":
      return {
        directAnswer: `Я можу допомогти лише з тим, що опубліковано публічно на ${site}. Я не маю доступу до приватних облікових записів чи адмін-панелі. Скористайтеся входом на сайті або зверніться до ${site} щодо приватного доступу.`,
        explanation: "Приватні облікові записи та адмін-доступ поза публічним Website Kompis.",
      };
    default:
      return {
        directAnswer: `Jeg kan bare hjelpe med det som er publisert offentlig på ${site}. Jeg har ikke tilgang til private medlemskontoer eller adminområder. Bruk nettstedets egen innlogging for kontoen din, eller kontakt ${site} hvis du trenger hjelp med privat tilgang.`,
        explanation: "Private kontoer og admintilgang ligger utenfor den offentlige Website Kompis.",
      };
  }
}

export function buildWebsiteKompisPrivateScopeRefusalResponse(
  locale: string,
  domain: string | null | undefined,
) {
  const siteLabel = siteLabelFromDomain(domain ?? null);
  const copy = privateScopeRefusalCopy(locale, siteLabel);

  return {
    answer: {
      directAnswer: copy.directAnswer,
      explanation: copy.explanation,
      steps: [] as [],
    },
    actions: [] as [],
    sources: [] as Array<{ title: string; route: string }>,
    confidence: { level: "low" as const, score: 0.15 },
    supportEscalation: { offered: true as const, reason: "knowledge_gap" as const },
    locale,
  };
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
