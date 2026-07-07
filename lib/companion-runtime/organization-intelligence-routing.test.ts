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
import {
  classifyCompanionTurnRoute,
  isCapabilityHelpQuery,
  resolveLightweightConversationalIntent,
} from "@/lib/companion-runtime/companion-turn-route";
import { resolveArticleIdForQuery } from "@/lib/companion-platform-knowledge/search-helpers";
import { classifyCompanionSubmitPath } from "@/lib/companion-runtime/companion-submit-path";
import { orchestrateCompanionSearch } from "@/lib/companion-runtime/orchestrator";
import { createEmptyCompanionTenantContext } from "@/lib/companion-runtime/companion-tenant-context";
import { createEmptyCompanionSupportContext } from "@/lib/companion-runtime/companion-support-context";
import { mapAsoDashboardToSupportBundle, mapSupportAiDashboardToSupportBundle, SUPPORT_AI_QUEUE_SOURCE_REFERENCE } from "@/lib/integration-intelligence/providers/support-operations/support-operations-contract";
import type { CommandBriefSignal } from "@/lib/integration-intelligence/command-brief/types";

function buildSupportAiPreviewCases(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `case-preview-${index + 1}`,
    subject: `Preview case ${index + 1}`,
    status: index === 0 ? "waiting_for_internal" : "open",
    priority: index === 0 ? "medium" : "low",
    channel: "admin_inbox",
    created_at: `2026-06-${String(Math.min(index + 1, 28)).padStart(2, "0")}T08:00:00.000Z`,
  }));
}

const SUPPORT_AI_QUEUE_SUMMARY_28_15 = {
  total_open: 28,
  unassigned: 15,
  preview_limit: 15,
} as const;

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
  assert.equal(supportQueueIntent?.provider_key, "support_ai_engine", inquiryQuery);
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

const supportBundle = mapSupportAiDashboardToSupportBundle({
  has_organization: true,
  queue_summary: { total_open: 2, unassigned: 2, preview_limit: 15 },
  open_cases: [
    {
      id: "a1e5c4d7-4055-4a47-9cbe-27cb57e27391",
      subject: "Canonical probe case",
      status: "waiting_for_internal",
      priority: "medium",
      channel: "admin_inbox",
      created_at: "2026-06-22T08:00:00.000Z",
    },
    {
      id: "case-2",
      subject: "Second open case",
      status: "open",
      priority: "low",
      channel: "email_support",
      created_at: "2026-06-23T08:00:00.000Z",
    },
  ],
});

const connectedQueueAnswer = buildSupportQueueAnswer({
  queue: supportBundle.queue,
  sourceReference: SUPPORT_AI_QUEUE_SOURCE_REFERENCE,
  sourceExact: true,
  generatedAt: supportBundle.queue?.generated_at ?? null,
  t,
  locale: "no",
});
assert.match(connectedQueueAnswer.directAnswer, /2/);
assert.equal(connectedQueueAnswer.sourceId, SUPPORT_AI_QUEUE_SOURCE_REFERENCE);
assert.doesNotMatch(connectedQueueAnswer.directAnswer, /Jeg er her med deg/i);

const aggregatePreviewCases = buildSupportAiPreviewCases(15);
const aggregateBundle = mapSupportAiDashboardToSupportBundle({
  has_organization: true,
  queue_summary: SUPPORT_AI_QUEUE_SUMMARY_28_15,
  open_cases: aggregatePreviewCases,
});
assert.equal(aggregateBundle.queue?.total_open, 28);
assert.equal(aggregateBundle.queue?.unassigned, 15);
assert.equal(aggregateBundle.cases.length, 15);
assert.equal(aggregateBundle.source_exact, true);
assert.notEqual(aggregateBundle.queue?.total_open, aggregateBundle.cases.length);

const aggregateQueueAnswer = buildSupportQueueAnswer({
  queue: aggregateBundle.queue,
  sourceReference: SUPPORT_AI_QUEUE_SOURCE_REFERENCE,
  sourceExact: true,
  generatedAt: aggregateBundle.queue?.generated_at ?? null,
  t,
  locale: "no",
});
assert.match(aggregateQueueAnswer.directAnswer, /28/);
assert.doesNotMatch(aggregateQueueAnswer.directAnswer, /\b15\b.*åpen|15 open/i);

const emptyQueueBundle = mapSupportAiDashboardToSupportBundle({
  has_organization: true,
  queue_summary: { total_open: 0, unassigned: 0, preview_limit: 15 },
  open_cases: [],
});
assert.equal(emptyQueueBundle.queue?.total_open, 0);
assert.equal(emptyQueueBundle.cases.length, 0);
assert.equal(emptyQueueBundle.source_exact, true);
const emptyQueueAnswer = buildSupportQueueAnswer({
  queue: emptyQueueBundle.queue,
  sourceReference: SUPPORT_AI_QUEUE_SOURCE_REFERENCE,
  sourceExact: true,
  generatedAt: emptyQueueBundle.queue?.generated_at ?? null,
  t,
  locale: "no",
});
assert.match(emptyQueueAnswer.directAnswer, /0|ingen|empty|tom/i);

assert.equal(
  mapSupportAiDashboardToSupportBundle({ has_organization: true, open_cases: [] }).source_exact,
  false,
  "missing queue_summary must fail-closed",
);
assert.equal(
  mapSupportAiDashboardToSupportBundle({
    has_organization: true,
    queue_summary: { total_open: -1, unassigned: 0, preview_limit: 15 },
    open_cases: [],
  }).source_exact,
  false,
  "negative total_open must fail-closed",
);
assert.equal(
  mapSupportAiDashboardToSupportBundle({
    has_organization: true,
    queue_summary: { total_open: 1.5, unassigned: 0, preview_limit: 15 },
    open_cases: [],
  }).source_exact,
  false,
  "decimal total_open must fail-closed",
);
assert.equal(
  mapSupportAiDashboardToSupportBundle({
    has_organization: true,
    queue_summary: { total_open: 2, unassigned: 5, preview_limit: 15 },
    open_cases: [],
  }).source_exact,
  false,
  "unassigned > total_open must fail-closed",
);
assert.equal(
  mapSupportAiDashboardToSupportBundle({
    has_organization: true,
    queue_summary: { total_open: 28, unassigned: 15, preview_limit: 15 },
    open_cases: buildSupportAiPreviewCases(16),
  }).source_exact,
  false,
  "preview longer than preview_limit must fail-closed",
);

const unavailableGapAnswer = buildOrganizationIntelligenceGapAnswer(t, "source_unavailable", {
  sourceReference: "get_support_ai_engine_dashboard",
  capabilityKey: "support_queue.read",
});
assert.match(unavailableGapAnswer.directAnswer, /live data|live-data|returnerte ikke/i);
assert.doesNotMatch(unavailableGapAnswer.directAnswer, /Jeg er her med deg/i);

async function runSupportQueueRoutingTests() {
  const rpcCalls: string[] = [];

  const connectedSupabaseStub = {
    rpc: async (name: string) => {
      rpcCalls.push(name);
      if (name === "has_active_organization_provider_scopes") {
        return { data: false, error: null };
      }
      if (name === "get_support_ai_engine_dashboard") {
        return {
          data: {
            has_organization: true,
            queue_summary: { total_open: 2, unassigned: 2, preview_limit: 15 },
            open_cases: [
              {
                id: "a1e5c4d7-4055-4a47-9cbe-27cb57e27391",
                subject: "Canonical probe case",
                status: "waiting_for_internal",
                priority: "medium",
                channel: "admin_inbox",
                created_at: "2026-06-22T08:00:00.000Z",
              },
              {
                id: "case-2",
                subject: "Second open case",
                status: "open",
                priority: "low",
                channel: "email_support",
                created_at: "2026-06-23T08:00:00.000Z",
              },
            ],
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
      if (name === "get_support_ai_engine_dashboard") {
        return { data: { has_organization: false }, error: null };
      }
      return { data: null, error: { message: "offline" } };
    },
  } as never;

  const tenantContext = createEmptyCompanionTenantContext({
    organizationId: "org-queue-read",
    companyId: "org-queue-read",
    organizationRole: "organization_owner",
    effectivePermissions: ["support.view"],
    supportContext: createEmptyCompanionSupportContext({
      support_ai_enabled: true,
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
  assert.match(connected.answer.directAnswer, /2/);
  assert.equal(connected.answer.sourceId, SUPPORT_AI_QUEUE_SOURCE_REFERENCE);
  assert.doesNotMatch(connected.answer.directAnswer, /Jeg er her med deg/i);
  assert.ok(
    rpcCalls.includes("get_support_ai_engine_dashboard"),
    "support queue read must call Support AI dashboard RPC",
  );
  assert.equal(
    rpcCalls.filter((name) => name === "get_customer_support_operations_center").length,
    0,
    "support queue read must never call ASO RPC",
  );
  assert.notEqual(
    connected.answer.sourceId,
    "organization-access-approver-direct",
    "support queue read must not create organization access approval CTA",
  );
  assert.notEqual(connected.answer.sourceId, "organization-access-offer");

  const deniedPermission = await resolveOrganizationIntelligenceAnswer("Er det noen nye henvendelser?", {
    t,
    activeLocale: "no",
    supabase: connectedSupabaseStub,
    tenantContext: createEmptyCompanionTenantContext({
      organizationId: "org-queue-read",
      companyId: "org-queue-read",
      organizationRole: "organization_owner",
      effectivePermissions: [],
      supportContext: createEmptyCompanionSupportContext({
        support_ai_enabled: true,
      }),
    }),
  });
  assert.ok(deniedPermission?.answer, "expected permission-denied queue answer");
  assert.match(deniedPermission.answer.directAnswer, /0|ingen|empty|tom/i);

  const unavailable = await resolveOrganizationIntelligenceAnswer("Er det noen nye henvendelser?", {
    t,
    activeLocale: "no",
    supabase: unavailableSupabaseStub,
    tenantContext: createEmptyCompanionTenantContext({
      organizationId: "org-queue-read",
      companyId: "org-queue-read",
      organizationRole: "organization_owner",
      effectivePermissions: ["support.view"],
      supportContext: createEmptyCompanionSupportContext({
        support_ai_enabled: false,
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

const MEMBER_DIRECTORY_RPC_PAYLOAD = {
  found: true,
  members: [
    {
      member_id: "member-1",
      username: "kari",
      display_name: "Kari Nordmann",
      membership_status: "active",
      membership_level: "standard",
      verification_status: "verified",
      profile_reference: "profile_ref_001",
      email_masked: "k***@example.com",
      phone_masked: null,
    },
  ],
  total_member_count: 1,
  completeness: "complete",
  data_classification: "live",
  source_verified: true,
} as const;

function createMemberDirectorySupabaseStub(input: {
  scopeActive: boolean;
  members?: Record<string, unknown>;
  scopeCalls?: Array<Record<string, unknown>>;
}) {
  const membersPayload = input.members ?? MEMBER_DIRECTORY_RPC_PAYLOAD;
  return {
    rpc: async (name: string, params?: Record<string, unknown>) => {
      if (name === "has_active_organization_provider_scopes") {
        input.scopeCalls?.push(params ?? {});
        return { data: input.scopeActive, error: null };
      }
      if (name === "get_customer_member_directory_center") {
        return { data: membersPayload, error: null };
      }
      return { data: null, error: { message: "offline" } };
    },
  } as never;
}

async function runMemberDirectoryAccessTests() {
  const t = createTranslator("no");
  const orgId = "org-member-directory";
  const tenantBase = {
    organizationId: orgId,
    companyId: orgId,
    organizationRole: "organization_owner" as const,
    effectivePermissions: ["customer_community.view"],
  };

  const scopeCalls: Array<Record<string, unknown>> = [];
  const authorized = await resolveOrganizationIntelligenceAnswer("Hvilke medlemmer har vi?", {
    t,
    activeLocale: "no",
    supabase: createMemberDirectorySupabaseStub({ scopeActive: true, scopeCalls }),
    tenantContext: createEmptyCompanionTenantContext(tenantBase),
  });
  assert.ok(authorized?.answer, "expected authorized member list answer");
  assert.match(authorized.answer.directAnswer, /Kari Nordmann|kari/i);
  assert.notEqual(authorized.answer.sourceId, "organization-access-offer");
  assert.equal(
    scopeCalls[0]?.p_organization_id,
    orgId,
    "member directory gate must pass active organization id to scope probe",
  );

  const blocked = await resolveOrganizationIntelligenceAnswer("Hvilke medlemmer har vi?", {
    t,
    activeLocale: "no",
    supabase: createMemberDirectorySupabaseStub({ scopeActive: false }),
    tenantContext: createEmptyCompanionTenantContext({
      ...tenantBase,
      organizationRole: "organization_member",
      effectivePermissions: ["customer_community.view"],
    }),
  });
  assert.ok(blocked?.answer, "expected blocked member list answer");
  assert.equal(blocked.answer.sourceId, "organization-access-offer");

  const emptyMembers = await resolveOrganizationIntelligenceAnswer("Hvilke medlemmer har vi?", {
    t,
    activeLocale: "no",
    supabase: createMemberDirectorySupabaseStub({
      scopeActive: true,
      members: {
        found: true,
        members: [],
        total_member_count: 0,
        completeness: "complete",
      },
    }),
    tenantContext: createEmptyCompanionTenantContext(tenantBase),
  });
  assert.ok(emptyMembers?.answer, "expected empty member list answer");
  assert.match(
    emptyMembers.answer.directAnswer,
    /Ingen medlemmer ble returnert|ingen medlemmer/i,
    "empty directory must report no results, not access denial",
  );
  assert.notEqual(emptyMembers.answer.sourceId, "organization-access-offer");
  assert.notEqual(emptyMembers.answer.sourceId, "organization-access-user-role-denied");
}

runSupportQueueRoutingTests()
  .then(() => runMemberDirectoryAccessTests())
  .then(async () => {
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

    const capabilityHelpCases = [
      { query: "Hva kan Aipify hjelpe meg med?", locale: "no" as const },
      {
        query: "Hva kan Aipify Companion hjelpe Nordic Example AS med?",
        locale: "no" as const,
      },
      { query: "What can Aipify help me with?", locale: "en" as const },
      { query: "How can Aipify Companion help Acme?", locale: "en" as const },
    ] as const;

    for (const { query, locale } of capabilityHelpCases) {
      assert.equal(isCapabilityHelpQuery(query), true, query);
      assert.notEqual(
        classifyCompanionTurnRoute(query, locale),
        "lightweight",
        `capability help must not route lightweight: ${query}`,
      );
      assert.equal(
        classifyCompanionTurnRoute(query, locale),
        "full",
        `capability help must route full: ${query}`,
      );
      assert.equal(
        resolveArticleIdForQuery(query),
        "aipify-capabilities",
        `capability help must resolve aipify-capabilities: ${query}`,
      );
    }

    assert.equal(classifyCompanionTurnRoute("Hei!", "no"), "lightweight");
    assert.equal(classifyCompanionTurnRoute("Kan du le?", "no"), "lightweight");
    assert.equal(resolveLightweightConversationalIntent("Takk!"), "thanks");
    assert.equal(classifyCompanionTurnRoute("hva sier Aipify", "no"), "lightweight");
    assert.equal(classifyCompanionTurnRoute("Vis aktive medlemmer", "no"), "exact_source");
    assert.equal(classifyCompanionTurnRoute("Er det noen nye henvendelser?", "no"), "exact_source");
    assert.equal(isCapabilityHelpQuery("Hei, hva kan du gjøre?"), false);

    const solutionsQuery = "Hvilken løsninger har dere?";
    assert.notEqual(
      classifyCompanionTurnRoute(solutionsQuery, "no"),
      "exact_source",
      "product solutions query must not bypass Core via exact_source",
    );
    assert.equal(
      classifyCompanionTurnRoute(solutionsQuery, "no"),
      "lightweight",
      "product solutions query must route to orchestrator/Core path",
    );

    assert.equal(
      classifyCompanionSubmitPath(solutionsQuery, "no"),
      "direct",
      "product solutions query must use direct orchestrator path",
    );

    const tenantContext = createEmptyCompanionTenantContext({ locale: "no" });
    const orchestratorResult = await orchestrateCompanionSearch(
      solutionsQuery,
      {
        t,
        locale: "no",
        ctx: { locale: "no", userRole: "owner", enabledFeatures: [] },
        getSearchTermsArray: () => [],
        tenantContext,
        companionSurface: true,
      },
      tenantContext,
    );

    assert.notEqual(
      orchestratorResult.answer.sourceId,
      "organization-intelligence-gap",
      "product solutions query must not end in organization-intelligence-gap",
    );
    assert.equal(
      orchestratorResult.answer.source,
      "platform_corpus",
      "product solutions query must answer from Core/platform corpus",
    );
    assert.equal(
      orchestratorResult.matchedArticleId,
      "aipify-capabilities",
      "product solutions query must match capabilities corpus article",
    );

    console.log("organization-intelligence-routing.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
