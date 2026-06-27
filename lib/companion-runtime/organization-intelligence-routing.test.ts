import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import { CORE_LOCALES } from "@/lib/i18n/config";
import {
  buildMemberCountAnswer,
  buildPrioritizeTodayAnswer,
  buildSupportQueueAnswer,
  buildOrganizationIntelligenceGapAnswer,
  filterCompanionSelfNavigationActions,
} from "@/lib/companion-runtime/organization-intelligence-answer";
import {
  isOrganizationIntelligenceQuery,
  resolveOrganizationIntelligenceIntent,
} from "@/lib/companion-runtime/organization-intelligence-intent";
import {
  shouldBypassGenericNavigationForOrganizationQuery,
  resolveOrganizationIntelligenceAnswer,
} from "@/lib/companion-runtime/organization-intelligence-routing";
import { createEmptyCompanionTenantContext } from "@/lib/companion-runtime/companion-tenant-context";
import { createEmptyCompanionSupportContext } from "@/lib/companion-runtime/companion-support-context";
import { mapAsoDashboardToSupportBundle } from "@/lib/integration-intelligence/providers/support-operations/support-operations-contract";
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

for (const inquiryQuery of [
  "Er det noen nye henvendelser?",
  "Er det noen ny henvendelse?",
]) {
  const supportQueueIntent = resolveOrganizationIntelligenceIntent(inquiryQuery, "no");
  assert.equal(supportQueueIntent?.kind, "support_queue", inquiryQuery);
  assert.equal(supportQueueIntent?.capability_key, "support_queue.read", inquiryQuery);
}

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

const supportBundle = mapAsoDashboardToSupportBundle({
  has_customer: true,
  performance: { open_cases: 4 },
  open_cases: [],
  high_risk_cases: [],
  approval_queue: [],
});

const connectedQueueAnswer = buildSupportQueueAnswer({
  queue: supportBundle.queue,
  sourceReference: "get_customer_support_operations_center",
  sourceExact: true,
  generatedAt: supportBundle.queue?.generated_at ?? null,
  t,
  locale: "no",
});
assert.match(connectedQueueAnswer.directAnswer, /4/);
assert.doesNotMatch(connectedQueueAnswer.directAnswer, /Jeg er her med deg/i);

const unavailableGapAnswer = buildOrganizationIntelligenceGapAnswer(t, "source_unavailable", {
  sourceReference: "get_customer_support_operations_center",
  capabilityKey: "support_queue.read",
});
assert.match(unavailableGapAnswer.directAnswer, /live data|live-data|returnerte ikke/i);
assert.doesNotMatch(unavailableGapAnswer.directAnswer, /Jeg er her med deg/i);

async function runSupportQueueRoutingTests() {
  const connectedSupabaseStub = {
    rpc: async (name: string) => {
      if (name === "has_active_organization_provider_scopes") {
        return { data: false, error: null };
      }
      if (name === "get_customer_support_operations_center") {
        return {
          data: {
            has_customer: true,
            performance: { open_cases: 4 },
            open_cases: [],
            high_risk_cases: [],
            approval_queue: [],
          },
          error: null,
        };
      }
      return { data: null, error: { message: "offline" } };
    },
  } as never;

  const unavailableSupabaseStub = {
    rpc: async (name: string) => {
      if (name === "has_active_organization_provider_scopes") {
        return { data: false, error: null };
      }
      return { data: null, error: { message: "offline" } };
    },
  } as never;

  const tenantContext = createEmptyCompanionTenantContext({
    organizationId: "org-queue-read",
    companyId: "org-queue-read",
    organizationRole: "organization_owner",
    effectivePermissions: ["support.view_metrics"],
    supportContext: createEmptyCompanionSupportContext({
      autonomous_support_enabled: true,
      support_source_exact: true,
      queue_summary: supportBundle.queue,
      case_summaries: supportBundle.cases,
    }),
  });

  const connected = await resolveOrganizationIntelligenceAnswer("Er det noen nye henvendelser?", {
    t,
    activeLocale: "no",
    supabase: connectedSupabaseStub,
    tenantContext,
  });
  assert.ok(connected?.answer, "expected connected support queue answer");
  assert.match(connected.answer.directAnswer, /4/);
  assert.doesNotMatch(connected.answer.directAnswer, /Jeg er her med deg/i);
  assert.notEqual(
    connected.answer.sourceId,
    "organization-access-approver-direct",
    "support queue read must not create organization access approval CTA",
  );
  assert.notEqual(connected.answer.sourceId, "organization-access-offer");

  const unavailable = await resolveOrganizationIntelligenceAnswer("Er det noen nye henvendelser?", {
    t,
    activeLocale: "no",
    supabase: unavailableSupabaseStub,
    tenantContext: createEmptyCompanionTenantContext({
      organizationId: "org-queue-read",
      companyId: "org-queue-read",
      organizationRole: "organization_owner",
      effectivePermissions: ["support.view_metrics"],
      supportContext: createEmptyCompanionSupportContext({
        autonomous_support_enabled: false,
        support_source_exact: false,
      }),
    }),
  });
  assert.ok(unavailable?.answer, "expected unavailable gap answer");
  assert.match(
    unavailable.answer.directAnswer,
    /live data|live-data|returnerte ikke|tilkoblede kilden/i,
  );
  assert.doesNotMatch(unavailable.answer.directAnswer, /Jeg er her med deg/i);
}

runSupportQueueRoutingTests()
  .then(() => {
    for (const locale of COMPANION_COVERAGE_LOCALES) {
      const dict = loadJson(`locales/${locale}/customer-app/companionPlatformKnowledge.json`);
      const section = (dict.companionPlatformKnowledge as Record<string, unknown>)
        .organizationIntelligence as Record<string, string> | undefined;
      assert.ok(section, `${locale} organizationIntelligence section`);
      assert.ok(section!.memberCountLead?.includes("{count}"), `${locale} memberCountLead`);
      assert.ok(section!.prioritizeLead, `${locale} prioritizeLead`);
    }

    for (const locale of CORE_LOCALES) {
      const dict = loadJson(`locales/${locale}/customer-app/companionPlatformKnowledge.json`);
      const section = (dict.companionPlatformKnowledge as Record<string, unknown>)
        .organizationIntelligence as Record<string, string> | undefined;
      assert.ok(
        section!.supportQueueOpenLead?.includes("{count}"),
        `${locale} supportQueueOpenLead`,
      );
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
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
