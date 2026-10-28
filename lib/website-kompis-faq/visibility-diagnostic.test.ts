import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildWebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";
import type { WebsiteKompisFaqItem } from "@/lib/website-kompis-faq/types";
import {
  buildFaqLocaleDryRunResult,
  buildFaqVisibilityDiagnosticReport,
  evaluateFaqVisibilityEligibility,
  faqLocaleMatchesVisitorLocale,
  resolveFaqVisibilityProbeQuery,
} from "@/lib/website-kompis-faq/visibility-diagnostic";

const INSTALL_A = "11111111-1111-4111-8111-111111111111";
const INSTALL_B = "22222222-2222-4222-8222-222222222222";
const NOW = Date.parse("2026-10-28T12:00:00.000Z");

function item(overrides: Partial<WebsiteKompisFaqItem> = {}): WebsiteKompisFaqItem {
  return {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    installId: INSTALL_A,
    domain: "customer.example",
    locale: "no",
    title: "Hva koster medlemskap?",
    question: "Hva koster medlemskap?",
    answer: "Medlemskap koster 99 kroner per måned.",
    category: "pricing",
    contentType: "faq",
    status: "published",
    publicSafe: true,
    priority: 100,
    tags: ["pris"],
    sourceUrl: null,
    validFrom: null,
    validUntil: null,
    lastReviewedAt: null,
    publishedAt: "2026-10-28T10:00:00.000Z",
    createdAt: "2026-10-27T10:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
    ...overrides,
  };
}

const published = evaluateFaqVisibilityEligibility(item(), {
  selectedInstallId: INSTALL_A,
  selectedDomain: "customer.example",
  faqSource: "enabled",
  nowMs: NOW,
});
assert.equal(published.eligibleForPathA, true);
assert.deepEqual(published.reasons, []);

const draft = evaluateFaqVisibilityEligibility(item({ status: "draft" }), {
  selectedInstallId: INSTALL_A,
  faqSource: "enabled",
  nowMs: NOW,
});
assert.ok(draft.reasons.includes("draft"));

const notSafe = evaluateFaqVisibilityEligibility(item({ publicSafe: false }), {
  selectedInstallId: INSTALL_A,
  faqSource: "enabled",
  nowMs: NOW,
});
assert.ok(notSafe.reasons.includes("not_public_safe"));

const wrongInstall = evaluateFaqVisibilityEligibility(item(), {
  selectedInstallId: INSTALL_B,
  selectedDomain: "customer.example",
  faqSource: "enabled",
  nowMs: NOW,
});
assert.ok(wrongInstall.reasons.includes("wrong_install"));

const wrongDomain = evaluateFaqVisibilityEligibility(item(), {
  selectedInstallId: INSTALL_A,
  selectedDomain: "other.example",
  faqSource: "enabled",
  nowMs: NOW,
});
assert.ok(wrongDomain.reasons.includes("wrong_domain"));

const expired = evaluateFaqVisibilityEligibility(
  item({ validUntil: "2026-10-01T00:00:00.000Z" }),
  {
    selectedInstallId: INSTALL_A,
    faqSource: "enabled",
    nowMs: NOW,
  },
);
assert.ok(expired.reasons.includes("expired"));

assert.equal(faqLocaleMatchesVisitorLocale("no", "en"), false);
assert.equal(faqLocaleMatchesVisitorLocale("no", "no"), true);
assert.equal(faqLocaleMatchesVisitorLocale("en", "no"), true);

const enVisitor = evaluateFaqVisibilityEligibility(item({ locale: "no" }), {
  selectedInstallId: INSTALL_A,
  faqSource: "enabled",
  nowMs: NOW,
  visitorLocale: "en",
});
assert.ok(enVisitor.reasons.includes("locale_not_in_visitor_set"));

const englishFallback = evaluateFaqVisibilityEligibility(item({ locale: "en" }), {
  selectedInstallId: INSTALL_A,
  faqSource: "enabled",
  nowMs: NOW,
  visitorLocale: "no",
});
assert.equal(englishFallback.eligibleForPathA, true);

const disabled = evaluateFaqVisibilityEligibility(item(), {
  selectedInstallId: INSTALL_A,
  faqSource: "disabled",
  nowMs: NOW,
});
assert.ok(disabled.reasons.includes("faq_source_disabled"));

const legacy = evaluateFaqVisibilityEligibility(item({ installId: null }), {
  selectedInstallId: INSTALL_A,
  faqSource: "enabled",
  nowMs: NOW,
});
assert.ok(legacy.reasons.includes("legacy_install_unresolved"));

const eligible = evaluateFaqVisibilityEligibility(item(), {
  selectedInstallId: INSTALL_A,
  faqSource: "enabled",
  nowMs: NOW,
  visitorLocale: "no",
});
const selected = buildFaqLocaleDryRunResult({
  visitorLocale: "no",
  eligibility: eligible,
  sqlCandidateMatch: true,
  wouldBeSelectedAnswer: true,
  topMatchedItemId: item().id,
  topScore: 40,
});
assert.equal(selected.sqlCandidateMatch, true);
assert.equal(selected.wouldBeSelectedAnswer, true);
assert.equal(selected.citationNotGuaranteed, true);

const candidateOnly = buildFaqLocaleDryRunResult({
  visitorLocale: "no",
  eligibility: eligible,
  sqlCandidateMatch: true,
  wouldBeSelectedAnswer: false,
  topMatchedItemId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  topScore: 50,
});
assert.equal(candidateOnly.sqlCandidateMatch, true);
assert.equal(candidateOnly.wouldBeSelectedAnswer, false);

const skipped = buildFaqLocaleDryRunResult({
  visitorLocale: "en",
  eligibility: enVisitor,
});
assert.equal(skipped.dryRunSkipped, true);
assert.equal(skipped.skipReason, "ineligible");

assert.equal(
  resolveFaqVisibilityProbeQuery({ title: "Title", question: "Full question?" }),
  "Full question?",
);
assert.equal(resolveFaqVisibilityProbeQuery({ title: "Title only", question: "" }), "Title only");

const report = buildFaqVisibilityDiagnosticReport({
  item: item(),
  selectedInstallId: INSTALL_A,
  selectedDomain: "customer.example",
  faqSource: "enabled",
  nowMs: NOW,
  dryRuns: [],
});
assert.equal(report.notes.notIndexedPath, true);
assert.equal(report.notes.appUiLocaleDoesNotControlVisitor, true);

const route = readFileSync("app/api/website-kompis/faq/[id]/visibility/route.ts", "utf8");
assert.match(route, /buildFaqVisibilityDiagnosticForItem/);
assert.match(route, /Unauthorized/);
assert.match(route, /not_found/);
assert.doesNotMatch(route, /askPublicPlatformCompanion/);

const panel = readFileSync(
  "components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx",
  "utf8",
);
assert.match(panel, /WebsiteKompisFaqVisibilityDiagnostic/);

const ui = readFileSync(
  "components/app/website-kompis/WebsiteKompisFaqVisibilityDiagnostic.tsx",
  "utf8",
);
assert.match(ui, /appLocaleNote/);
assert.match(ui, /citationCaveat/);

const server = readFileSync("lib/website-kompis-faq/visibility-diagnostic-server.ts", "utf8");
assert.match(server, /searchPublicCompanionTenantFaq/);
assert.match(server, /isRelevantPublicCompanionTenantFaqResult/);
assert.match(server, /tenant_public_companion_faq_items/);

const labels = buildWebsiteKompisFaqLabels((key) => key);
assert.equal(labels.visibility.title, "customerApp.websiteKompisFaq.visibility.title");
assert.equal(
  labels.visibility.reasons.locale_not_in_visitor_set,
  "customerApp.websiteKompisFaq.visibility.reasons.locale_not_in_visitor_set",
);

for (const locale of ["en", "no", "sv", "da", "pl", "uk"]) {
  const dict = JSON.parse(
    readFileSync(`locales/${locale}/customer-app/core.json`, "utf8"),
  ) as {
    websiteKompisFaq: { visibility: { title: string; reasons: Record<string, string> } };
  };
  assert.ok(dict.websiteKompisFaq.visibility.title.length > 0);
  assert.ok(dict.websiteKompisFaq.visibility.reasons.draft);
  assert.ok(dict.websiteKompisFaq.visibility.reasons.not_public_safe);
  assert.ok(dict.websiteKompisFaq.visibility.reasons.locale_not_in_visitor_set);
}

console.log("website-kompis-faq-visibility-diagnostic.test.ts: all assertions passed");
