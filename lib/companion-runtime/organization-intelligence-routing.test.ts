import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import {
  buildMemberCountAnswer,
  buildPrioritizeTodayAnswer,
  filterCompanionSelfNavigationActions,
} from "@/lib/companion-runtime/organization-intelligence-answer";
import {
  isOrganizationIntelligenceQuery,
  resolveOrganizationIntelligenceIntent,
} from "@/lib/companion-runtime/organization-intelligence-intent";
import { shouldBypassGenericNavigationForOrganizationQuery } from "@/lib/companion-runtime/organization-intelligence-routing";
import type { CommandBriefSignal } from "@/lib/integration-intelligence/command-brief/types";

const repoRoot = path.join(import.meta.dirname, "..", "..");

const E2E_QUESTIONS = [
  "Hvor mange medlemmer er registrert?",
  "Vis aktive medlemmer",
  "Vis medlemmer med brukernavn, medlems-ID og status.",
  "Hvilke medlemmer venter på verifisering?",
  "Er medlem [TESTBRUKER] verifisert?",
  "Hvilke supportsaker nærmer seg eller har brutt SLA?",
  "Hva bør jeg prioritere i dag?",
] as const;

function loadJson(relativePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8")) as Record<
    string,
    unknown
  >;
}

function createTranslator(locale: string) {
  const platformKnowledge = loadJson(`locales/${locale}/customer-app/companionPlatformKnowledge.json`);
  const enPlatform = locale === "en" ? platformKnowledge : loadJson("locales/en/customer-app/companionPlatformKnowledge.json");

  return (key: string): string => {
    const parts = key.split(".");
    const rest = parts.slice(2).join(".");
    const root = platformKnowledge.companionPlatformKnowledge as Record<string, unknown>;
    const enRoot = enPlatform.companionPlatformKnowledge as Record<string, unknown>;

    const walk = (node: Record<string, unknown>, dotted: string): unknown =>
      dotted.split(".").reduce<unknown>((acc, part) => {
        if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
          return (acc as Record<string, unknown>)[part];
        }
        return undefined;
      }, node);

    const value = walk(root, rest) ?? walk(enRoot, rest);
    return typeof value === "string" ? value : key;
  };
}

for (const question of E2E_QUESTIONS) {
  assert.equal(
    isOrganizationIntelligenceQuery(question),
    true,
    `expected organization intelligence intent for: ${question}`,
  );
  assert.equal(
    shouldBypassGenericNavigationForOrganizationQuery(question),
    true,
    `expected navigation bypass for: ${question}`,
  );
}

const memberCountIntent = resolveOrganizationIntelligenceIntent("Hvor mange medlemmer er registrert?");
assert.equal(memberCountIntent?.kind, "member_count");

const memberDetailIntent = resolveOrganizationIntelligenceIntent(
  "Vis medlemmer med brukernavn, medlems-ID og status.",
);
assert.equal(memberDetailIntent?.kind, "member_detail_list");

const verificationIntent = resolveOrganizationIntelligenceIntent("Er medlem [TESTBRUKER] verifisert?");
assert.equal(verificationIntent?.kind, "member_verification_status");
assert.equal(verificationIntent?.member_reference, "TESTBRUKER");

const prioritizeIntent = resolveOrganizationIntelligenceIntent("Hva bør jeg prioritere i dag?");
assert.equal(prioritizeIntent?.kind, "prioritize_today");

const genericNavQuestion = "Hvor finner jeg medlemsoversikten i appen?";
assert.equal(isOrganizationIntelligenceQuery(genericNavQuestion), false);

const t = createTranslator("no");
const countAnswer = buildMemberCountAnswer({
  intent: memberCountIntent!,
  bundle: {
    source_exact: true,
    source_reference: "get_customer_member_directory_center",
    members: [],
    candidates: [],
    total_member_count: 128,
    match_count: 0,
    search_field: null,
    search_term: null,
    freshness: "fresh",
    completeness: "complete",
    limitations: [],
  },
  t,
  locale: "no",
});

assert.match(countAnswer.directAnswer, /128/);
assert.match(countAnswer.explanation ?? "", /Kilde:|Source:/i);
assert.ok(countAnswer.sources.length > 0, "grounded answers must include sources");
assert.equal(countAnswer.liveIntegrationToolUsed, true);
assert.equal(
  filterCompanionSelfNavigationActions([
    {
      labelKey: "customerApp.companionPlatformKnowledge.actions.aipifyCompanion",
      label: "Åpne Aipify Companion",
      href: "/app/companion",
      routeKey: "aipifyCompanion",
    },
    {
      labelKey: "customerApp.companionPlatformKnowledge.actions.commandBrief",
      label: "Åpne Command Brief",
      href: "/app/command-center",
      routeKey: "commandBrief",
    },
  ]).length,
  1,
);

const sampleSignal: CommandBriefSignal = {
  signal_id: "signal-1",
  signal_type: "attention",
  category: "support",
  title_key: "customerApp.companionPlatformKnowledge.support.commandBrief.unresolvedSupportCase",
  summary_key: "customerApp.companionPlatformKnowledge.support.commandBrief.unresolvedSupportCase",
  severity: "high",
  priority: 90,
  status: "unresolved",
  source_module: "support",
  source_provider: "autonomous_support_operations",
  source_reference: "aso:queue",
  source_tier: "exact_live",
  detected_at: "2026-06-22T08:00:00.000Z",
  relevant_since: "2026-06-22T08:00:00.000Z",
  freshness: "fresh",
  completeness: "complete",
  confidence: "high",
  required_permission: null,
  required_entitlement: null,
  related_capability: null,
  related_action: null,
  organization_id: "org-test",
  dedupe_key: "support:unresolved",
  warnings: [],
  count: 2,
  panel: "app",
  since_last_bucket: "still_unresolved",
};

const prioritizeAnswer = buildPrioritizeTodayAnswer({
  signals: [sampleSignal],
  generatedAt: "2026-06-22T08:00:00.000Z",
  t,
  locale: "no",
});

assert.match(prioritizeAnswer.directAnswer, /1\./);
assert.doesNotMatch(prioritizeAnswer.directAnswer, /Open Aipify Companion|Åpne Aipify Companion/i);

for (const locale of COMPANION_COVERAGE_LOCALES) {
  const dict = loadJson(`locales/${locale}/customer-app/companionPlatformKnowledge.json`);
  const section = (dict.companionPlatformKnowledge as Record<string, unknown>)
    .organizationIntelligence as Record<string, string> | undefined;
  assert.ok(section, `${locale} organizationIntelligence section`);
  assert.ok(section!.memberCountLead?.includes("{count}"), `${locale} memberCountLead`);
  assert.ok(section!.prioritizeLead, `${locale} prioritizeLead`);
}

const orchestratorSource = fs.readFileSync(
  path.join(repoRoot, "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(
  orchestratorSource.includes("resolveOrganizationIntelligenceAnswer"),
  "orchestrator must call organization intelligence routing before community fallback",
);
const orgIntelIndex = orchestratorSource.indexOf("resolveOrganizationIntelligenceAnswer");
const communityIndex = orchestratorSource.indexOf("resolveCommunityProviderAnswer");
assert.ok(orgIntelIndex > 0 && orgIntelIndex < communityIndex);

console.log("organization-intelligence-routing.test.ts: all assertions passed");
