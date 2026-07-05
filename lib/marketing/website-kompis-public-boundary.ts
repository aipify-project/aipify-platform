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

function siteLabelFromDomain(domain: string | null | undefined): string | null {
  if (!domain) return null;
  const label = domain.split(".")[0]?.trim();
  if (!label) return null;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function safeFallbackCopy(locale: string, siteLabel: string | null): string {
  const named = siteLabel?.trim() || null;

  switch (locale) {
    case "no":
      return named
        ? `Jeg har ikke nok publisert informasjon om ${named} til å svare sikkert på dette ennå. Kontakt ${named} for mer informasjon.`
        : "Jeg har ikke nok publisert informasjon til å svare sikkert på dette ennå. Kontakt virksomheten for mer informasjon.";
    case "sv":
      return named
        ? `Jag har inte tillräckligt publicerad information om ${named} för att svara säkert på detta ännu. Kontakta ${named} för mer information.`
        : "Jag har inte tillräckligt publicerad information för att svara säkert på detta ännu. Kontakta verksamheten för mer information.";
    case "da":
      return named
        ? `Jeg har ikke nok offentliggjort information om ${named} til at svare sikkert på dette endnu. Kontakt ${named} for mere information.`
        : "Jeg har ikke nok offentliggjort information til at svare sikkert på dette endnu. Kontakt virksomheden for mere information.";
    case "en":
    default:
      return named
        ? `I do not have enough published information about ${named} to answer this safely yet. Contact ${named} for more information.`
        : "I do not have enough published information to answer this safely yet. Contact the business for more information.";
  }
}

export function buildWebsiteKompisSafeFallbackResponse(
  locale: string,
  domain: string | null | undefined,
) {
  const siteLabel = siteLabelFromDomain(domain ?? null);

  return {
    answer: {
      directAnswer: safeFallbackCopy(locale, siteLabel),
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
