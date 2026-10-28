/**
 * APP FAQ visibility diagnostic — eligibility mirrors Path A filters in
 * search_tenant_public_visitor_knowledge (published, public_safe, validity,
 * install/domain, locale IN (visitor, en)). Does not claim indexing or citation.
 */

import type { WebsiteKompisFaqItem } from "@/lib/website-kompis-faq/types";

/** Path A dry-run visitor locales — exact match + English fallback only (no Nordic equivalence). */
export const FAQ_VISIBILITY_VISITOR_LOCALES = ["no", "en", "da", "sv"] as const;
export type FaqVisibilityVisitorLocale = (typeof FAQ_VISIBILITY_VISITOR_LOCALES)[number];

export type FaqVisibilityBlockReason =
  | "draft"
  | "archived"
  | "not_public_safe"
  | "not_yet_valid"
  | "expired"
  | "wrong_install"
  | "wrong_domain"
  | "legacy_install_unresolved"
  | "faq_source_disabled"
  | "missing_visitor_context"
  | "locale_not_in_visitor_set";

export type FaqSourceEnablement = "enabled" | "disabled" | "unknown";

export type FaqVisibilityFacts = {
  itemId: string;
  status: WebsiteKompisFaqItem["status"];
  publicSafe: boolean;
  faqLocale: string;
  installId: string | null;
  domain: string | null;
  publishedAt: string | null;
  validFrom: string | null;
  validUntil: string | null;
  selectedInstallId: string | null;
  selectedDomain: string | null;
  faqSource: FaqSourceEnablement;
};

export type FaqEligibilityResult = {
  eligibleForPathA: boolean;
  reasons: FaqVisibilityBlockReason[];
  /** Locale-independent blockers (status, safety, dates, install/domain, source). */
  structuralReasons: FaqVisibilityBlockReason[];
};

export type FaqLocaleDryRunResult = {
  visitorLocale: FaqVisibilityVisitorLocale;
  localeEligible: boolean;
  localeReasons: FaqVisibilityBlockReason[];
  /** True when the FAQ item_id appeared in the Path A RPC candidate set. */
  sqlCandidateMatch: boolean;
  /** True when candidates passed the APP relevance gate and this item ranked first. */
  wouldBeSelectedAnswer: boolean;
  /** Candidate hit does not guarantee Kompis cites this FAQ. */
  citationNotGuaranteed: true;
  topMatchedItemId: string | null;
  topScore: number | null;
  dryRunSkipped: boolean;
  skipReason: "ineligible" | "missing_context" | "rpc_unavailable" | null;
};

export type FaqVisibilityDiagnosticReport = {
  facts: FaqVisibilityFacts;
  eligibility: FaqEligibilityResult;
  dryRuns: FaqLocaleDryRunResult[];
  notes: {
    notIndexedPath: true;
    appUiLocaleDoesNotControlVisitor: true;
  };
};

function normalizeLocale(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function parseInstant(value: string | null | undefined): number | null {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : ms;
}

/** Mirrors RPC: f.locale in (v_locale, 'en'). */
export function faqLocaleMatchesVisitorLocale(
  faqLocale: string,
  visitorLocale: string,
): boolean {
  const faq = normalizeLocale(faqLocale);
  const visitor = normalizeLocale(visitorLocale) || "no";
  if (!faq) return false;
  return faq === visitor || faq === "en";
}

export function evaluateFaqVisibilityEligibility(
  item: Pick<
    WebsiteKompisFaqItem,
    | "status"
    | "publicSafe"
    | "locale"
    | "installId"
    | "domain"
    | "validFrom"
    | "validUntil"
  >,
  context: {
    selectedInstallId?: string | null;
    selectedDomain?: string | null;
    faqSource?: FaqSourceEnablement;
    nowMs?: number;
    visitorLocale?: string | null;
  } = {},
): FaqEligibilityResult {
  const structuralReasons: FaqVisibilityBlockReason[] = [];
  const now = context.nowMs ?? Date.now();

  if (item.status === "draft") structuralReasons.push("draft");
  else if (item.status === "archived") structuralReasons.push("archived");
  else if (item.status !== "published") structuralReasons.push("draft");

  if (!item.publicSafe) structuralReasons.push("not_public_safe");

  const validFrom = parseInstant(item.validFrom);
  const validUntil = parseInstant(item.validUntil);
  if (validFrom != null && validFrom > now) structuralReasons.push("not_yet_valid");
  if (validUntil != null && validUntil < now) structuralReasons.push("expired");

  const selectedInstall = context.selectedInstallId?.trim() || null;
  const itemInstall = item.installId?.trim() || null;
  if (!itemInstall) {
    structuralReasons.push("legacy_install_unresolved");
  } else if (selectedInstall && itemInstall !== selectedInstall) {
    structuralReasons.push("wrong_install");
  }

  const selectedDomain = context.selectedDomain?.trim().toLowerCase() || null;
  const itemDomain = item.domain?.trim().toLowerCase() || null;
  if (itemDomain && selectedDomain && itemDomain !== selectedDomain) {
    structuralReasons.push("wrong_domain");
  }

  if (!itemInstall && !selectedInstall) {
    structuralReasons.push("missing_visitor_context");
  }

  if (context.faqSource === "disabled") {
    structuralReasons.push("faq_source_disabled");
  }

  const localeReasons: FaqVisibilityBlockReason[] = [];
  if (context.visitorLocale != null) {
    if (!faqLocaleMatchesVisitorLocale(item.locale, context.visitorLocale)) {
      localeReasons.push("locale_not_in_visitor_set");
    }
  }

  const reasons = [...structuralReasons, ...localeReasons];
  return {
    eligibleForPathA: reasons.length === 0,
    reasons,
    structuralReasons,
  };
}

export function buildFaqVisibilityFacts(
  item: WebsiteKompisFaqItem,
  context: {
    selectedInstallId?: string | null;
    selectedDomain?: string | null;
    faqSource?: FaqSourceEnablement;
  },
): FaqVisibilityFacts {
  return {
    itemId: item.id,
    status: item.status,
    publicSafe: item.publicSafe,
    faqLocale: item.locale,
    installId: item.installId,
    domain: item.domain,
    publishedAt: item.publishedAt,
    validFrom: item.validFrom,
    validUntil: item.validUntil,
    selectedInstallId: context.selectedInstallId ?? null,
    selectedDomain: context.selectedDomain ?? null,
    faqSource: context.faqSource ?? "unknown",
  };
}

export function resolveFaqVisibilityProbeQuery(
  item: Pick<WebsiteKompisFaqItem, "title" | "question">,
): string {
  const question = item.question?.trim() ?? "";
  if (question.length >= 2) return question;
  return item.title.trim();
}

export function buildFaqLocaleDryRunResult(input: {
  visitorLocale: FaqVisibilityVisitorLocale;
  eligibility: FaqEligibilityResult;
  sqlCandidateMatch?: boolean;
  wouldBeSelectedAnswer?: boolean;
  topMatchedItemId?: string | null;
  topScore?: number | null;
  dryRunSkipped?: boolean;
  skipReason?: FaqLocaleDryRunResult["skipReason"];
}): FaqLocaleDryRunResult {
  const localeEligible = !input.eligibility.reasons.includes("locale_not_in_visitor_set");
  const structuralOk = input.eligibility.structuralReasons.length === 0;

  if (input.dryRunSkipped || !structuralOk || !localeEligible) {
    return {
      visitorLocale: input.visitorLocale,
      localeEligible,
      localeReasons: input.eligibility.reasons,
      sqlCandidateMatch: false,
      wouldBeSelectedAnswer: false,
      citationNotGuaranteed: true,
      topMatchedItemId: null,
      topScore: null,
      dryRunSkipped: true,
      skipReason:
        input.skipReason ??
        (!structuralOk || !localeEligible ? "ineligible" : "rpc_unavailable"),
    };
  }

  return {
    visitorLocale: input.visitorLocale,
    localeEligible: true,
    localeReasons: [],
    sqlCandidateMatch: input.sqlCandidateMatch === true,
    wouldBeSelectedAnswer: input.wouldBeSelectedAnswer === true,
    citationNotGuaranteed: true,
    topMatchedItemId: input.topMatchedItemId ?? null,
    topScore: input.topScore ?? null,
    dryRunSkipped: false,
    skipReason: null,
  };
}

export function buildFaqVisibilityDiagnosticReport(input: {
  item: WebsiteKompisFaqItem;
  selectedInstallId?: string | null;
  selectedDomain?: string | null;
  faqSource?: FaqSourceEnablement;
  nowMs?: number;
  dryRuns: FaqLocaleDryRunResult[];
}): FaqVisibilityDiagnosticReport {
  const facts = buildFaqVisibilityFacts(input.item, {
    selectedInstallId: input.selectedInstallId,
    selectedDomain: input.selectedDomain,
    faqSource: input.faqSource,
  });
  const eligibility = evaluateFaqVisibilityEligibility(input.item, {
    selectedInstallId: input.selectedInstallId,
    selectedDomain: input.selectedDomain,
    faqSource: input.faqSource,
    nowMs: input.nowMs,
  });

  return {
    facts,
    eligibility,
    dryRuns: input.dryRuns,
    notes: {
      notIndexedPath: true,
      appUiLocaleDoesNotControlVisitor: true,
    },
  };
}
