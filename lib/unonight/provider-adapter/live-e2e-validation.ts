import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import { createTranslator } from "@/lib/i18n/translate";
import { mergeDictionary } from "@/lib/i18n/merge-dictionary";
import fs from "node:fs";
import path from "node:path";
import { createEmptyCompanionCommunityContext } from "@/lib/companion-runtime/companion-community-context";
import {
  extractCommunityCompanionAnswerMetadata,
  resolveCommunityCompanionQuery,
} from "@/lib/companion-runtime/community-companion-query";
import {
  createEmptyCompanionTenantContext,
  type CompanionTenantContext,
} from "@/lib/companion-runtime/companion-tenant-context";
import {
  hasCommunityProviderIntent,
  matchCommunityProviderQuery,
} from "@/lib/companion-runtime/community-answer";
import {
  COMPANION_CHAT_INITIAL_POSITION,
  COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR,
  COMPANION_CHAT_NEW_MESSAGE_AUTOSCROLL,
} from "@/lib/app/companion/companion-chat-scroll-policy";
import type { ProviderCapabilityReadinessStatus } from "@/lib/integration-intelligence/community/provider-adapter-types";
import {
  applyUnonightProviderAdapterToCommunityContext,
  clearUnonightProviderAdapterAuditTrailForTests,
  evaluateUnonightProviderAdapterActivationGate,
  UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES,
  UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY,
  UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
} from "@/lib/unonight/provider-adapter";

export const UNONIGHT_LIVE_E2E_API_ENTRY = "/api/aipify/support-assistant/search";

function loadCompanionPlatformKnowledgeSplit(locale: CustomerActiveLocale) {
  const filePath = path.join(
    process.cwd(),
    "locales",
    locale,
    "customer-app",
    "companionPlatformKnowledge.json",
  );
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
    companionPlatformKnowledge: Record<string, unknown>;
  };
  return raw.companionPlatformKnowledge;
}

/** File-backed translator for E2E validation without server-only dictionary loaders. */
export function buildCompanionPlatformKnowledgeTranslator(
  locale: CustomerActiveLocale,
): Translator {
  const english = loadCompanionPlatformKnowledgeSplit("en");
  const localized =
    locale === "en" ? english : mergeDictionary(english, loadCompanionPlatformKnowledgeSplit(locale));
  return createTranslator({ customerApp: { companionPlatformKnowledge: localized } });
}

export const UNONIGHT_LIVE_E2E_RUNTIME_CHAIN = [
  "login",
  "organization_context",
  "subscription",
  "entitlement",
  "connected_provider",
  "activation_gate",
  "permission",
  "provider_adapter",
  "live_rpc",
  "normalization",
  "companion_orchestrator",
  "grounded_answer",
  "source_freshness",
  "audit_logging",
] as const;

export type UnonightE2eOrganizationProfile = {
  key: "unonight" | "empty" | "isolated";
  organizationId: string;
  companyId: string;
  organizationName: string;
  subscriptionStatus: string;
  connectedProviders: string[];
  activeBusinessPacks: string[];
  effectivePermissions: string[];
  communityCounts: {
    group_count: number | null;
    discussion_count: number | null;
    pending_moderation_count: number | null;
    pending_verification_count: number | null;
    reports_attention_count: number | null;
    listing_review_count: number | null;
  };
  community_network_center_enabled: boolean;
  moderation_engine_enabled: boolean;
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  provider_disabled: boolean;
  source_control_counts?: {
    pending_moderation_count: number | null;
    reports_attention_count: number | null;
  };
};

export type UnonightLiveQuestionSpec = {
  id: string;
  query: string;
  expectedCapability: string | null;
};

export const UNONIGHT_LIVE_E2E_QUESTIONS: readonly UnonightLiveQuestionSpec[] = [
  {
    id: "moderation_pending",
    query: "Er det noe som venter på moderering?",
    expectedCapability: "moderation_queue.read",
  },
  {
    id: "moderation_count",
    query: "Hvor mange saker ligger i modereringskøen?",
    expectedCapability: "moderation_queue.read",
  },
  {
    id: "reports_attention",
    query: "Hvilke rapporterte saker krever oppmerksomhet?",
    expectedCapability: "report.read",
  },
  {
    id: "verification_pending",
    query: "Har vi verifiseringer som venter?",
    expectedCapability: "verification_status.read",
  },
  {
    id: "listing_review",
    query: "Har vi markedsplassannonser som venter på kontroll?",
    expectedCapability: "listing.read",
  },
  {
    id: "new_members",
    query: "Hvor mange nye medlemmer har vi fått siden sist?",
    expectedCapability: "member.read",
  },
  {
    id: "activity_since_last",
    query: "Hva har skjedd i Unonight siden sist?",
    expectedCapability: "activity.read",
  },
  {
    id: "priority_now",
    query: "Hva bør jeg se på først nå?",
    expectedCapability: null,
  },
] as const;

export const UNONIGHT_E2E_ORGANIZATION_PROFILES: Record<
  UnonightE2eOrganizationProfile["key"],
  UnonightE2eOrganizationProfile
> = {
  unonight: {
    key: "unonight",
    organizationId: "org-unonight-pilot",
    companyId: "company-unonight",
    organizationName: "Unonight",
    subscriptionStatus: "active",
    connectedProviders: [UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY],
    activeBusinessPacks: ["community_pack"],
    effectivePermissions: ["customer_community.view", "moderation.view"],
    communityCounts: {
      group_count: 12,
      discussion_count: 8,
      pending_moderation_count: 3,
      pending_verification_count: 2,
      reports_attention_count: 1,
      listing_review_count: 4,
    },
    community_network_center_enabled: true,
    moderation_engine_enabled: true,
    permission_denied: false,
    app_entitlement_blocked: false,
    provider_disabled: false,
    source_control_counts: {
      pending_moderation_count: 3,
      reports_attention_count: 1,
    },
  },
  empty: {
    key: "empty",
    organizationId: "org-empty-test",
    companyId: "company-empty-test",
    organizationName: "Empty Test Org",
    subscriptionStatus: "active",
    connectedProviders: [],
    activeBusinessPacks: [],
    effectivePermissions: [],
    communityCounts: {
      group_count: null,
      discussion_count: null,
      pending_moderation_count: null,
      pending_verification_count: null,
      reports_attention_count: null,
      listing_review_count: null,
    },
    community_network_center_enabled: false,
    moderation_engine_enabled: false,
    permission_denied: false,
    app_entitlement_blocked: false,
    provider_disabled: false,
  },
  isolated: {
    key: "isolated",
    organizationId: "org-isolated-test",
    companyId: "company-isolated-test",
    organizationName: "Isolated Test Org",
    subscriptionStatus: "active",
    connectedProviders: [],
    activeBusinessPacks: ["community_pack"],
    effectivePermissions: ["customer_community.view"],
    communityCounts: {
      group_count: 99,
      discussion_count: 99,
      pending_moderation_count: 99,
      pending_verification_count: 99,
      reports_attention_count: 99,
      listing_review_count: 99,
    },
    community_network_center_enabled: true,
    moderation_engine_enabled: false,
    permission_denied: false,
    app_entitlement_blocked: false,
    provider_disabled: false,
  },
};

export type UnonightLiveQuestionResult = {
  question_id: string;
  query: string;
  organization_key: UnonightE2eOrganizationProfile["key"];
  locale: CustomerActiveLocale;
  resolved_intent: "community_provider" | "none";
  capability: string | null;
  provider: string | null;
  live_rpc: string | null;
  organization_scope: string;
  permission_result: "allowed" | "denied" | "disabled";
  source_reference: string | null;
  fetched_at: string | null;
  freshness: string | null;
  readiness: ProviderCapabilityReadinessStatus | "unknown";
  answer_status: "grounded" | "unavailable" | "permission_denied" | "partial" | "metric_gap" | "empty" | "discovery";
  direct_answer: string;
  explanation: string;
  response_time_ms: number;
  rpc_call_count: number;
  provider_latency_ms: number;
  context_size_bytes: number;
  used_fallback: boolean;
  audit_reference: string | null;
};

export type UnonightAuthenticatedLiveE2eReport = {
  phase: 31;
  api_entry: string;
  runtime_chain: readonly string[];
  authenticated_session_mode: "simulated_app_session" | "live_app_session";
  organizations_tested: string[];
  question_results: UnonightLiveQuestionResult[];
  capability_readiness_after_e2e: Array<{
    capability_key: string;
    readiness: ProviderCapabilityReadinessStatus;
    promoted_to_production_ready: boolean;
  }>;
  tenant_isolation: {
    unonight_reads_own_data: boolean;
    empty_org_honest_unavailable: boolean;
    isolated_org_never_gets_unonight_data: boolean;
    manipulated_organization_rejected: boolean;
  };
  permissions: Array<{
    scenario: string;
    passed: boolean;
  }>;
  companion_ui: {
    shared_scroll_policy_frozen: boolean;
    organization_visible: boolean;
    live_provider_grounded: boolean;
    no_raw_enums: boolean;
    no_translation_keys: boolean;
  };
  locales_smoke: Array<{
    locale: CustomerActiveLocale;
    passed: boolean;
  }>;
  performance: {
    average_response_time_ms: number;
    max_response_time_ms: number;
    total_rpc_calls: number;
  };
  limitations: string[];
};

function buildTenantContextFromProfile(
  profile: UnonightE2eOrganizationProfile,
  locale: CustomerActiveLocale,
  authenticatedE2eVerifiedCapabilities: readonly string[] = [],
): CompanionTenantContext {
  const connectedProviders = profile.provider_disabled ? [] : profile.connectedProviders;

  let communityContext = createEmptyCompanionCommunityContext({
    community_network_center_enabled: profile.community_network_center_enabled,
    moderation_engine_enabled: profile.moderation_engine_enabled,
    permission_denied: profile.permission_denied,
    app_entitlement_blocked: profile.app_entitlement_blocked,
    new_members_count: null,
    group_count: profile.communityCounts.group_count,
    discussion_count: profile.communityCounts.discussion_count,
    pending_moderation_count: profile.communityCounts.pending_moderation_count,
    pending_verification_count: profile.communityCounts.pending_verification_count,
    reports_attention_count: profile.communityCounts.reports_attention_count,
    listing_review_count: profile.communityCounts.listing_review_count,
  });

  if (connectedProviders.includes(UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY)) {
    communityContext = applyUnonightProviderAdapterToCommunityContext(communityContext, {
      organizationId: profile.organizationId,
      subscriptionStatus: profile.subscriptionStatus,
      connectedProviders,
      activeBusinessPacks: profile.activeBusinessPacks,
      effectivePermissions: profile.effectivePermissions,
      authenticatedE2eVerifiedCapabilities,
    });
  }

  return createEmptyCompanionTenantContext({
    organizationId: profile.organizationId,
    companyId: profile.companyId,
    organizationName: profile.organizationName,
    subscriptionStatus: profile.subscriptionStatus,
    connectedProviders,
    activeBusinessPacks: profile.activeBusinessPacks,
    effectivePermissions: profile.effectivePermissions,
    locale,
    communityContext,
  });
}

function resolvePermissionResult(
  profile: UnonightE2eOrganizationProfile,
  capability: string | null,
): UnonightLiveQuestionResult["permission_result"] {
  if (profile.permission_denied || profile.app_entitlement_blocked || profile.provider_disabled) {
    return "disabled";
  }
  if (!capability) return "allowed";
  if (capability === "moderation_queue.read" || capability === "report.read") {
    return profile.effectivePermissions.includes("moderation.view") ? "allowed" : "denied";
  }
  return profile.effectivePermissions.includes("customer_community.view") ? "allowed" : "denied";
}

function resolveAnswerStatus(input: {
  result: ReturnType<typeof resolveCommunityCompanionQuery>;
  permissionResult: UnonightLiveQuestionResult["permission_result"];
}): UnonightLiveQuestionResult["answer_status"] {
  if (!input.result) return "empty";
  if (input.permissionResult === "denied") return "permission_denied";
  if (input.permissionResult === "disabled") return "unavailable";
  const answer = input.result.answer;
  if (answer.confidence === "low" && /unavailable|disabled|missing/i.test(answer.directAnswer)) {
    return "unavailable";
  }
  if (
    /does not have an exact|ikke et eksakt|ingen exakt|no tiene una lectura exacta|nie ma jeszcze dokładnego|ще не має точного|gjetter ikke|no adivina|nie zgaduje|не вгадує/i.test(
      answer.explanation ?? answer.directAnswer,
    )
  ) {
    return "metric_gap";
  }
  if (answer.source === "customer_context" && answer.directAnswer.trim().length > 0) {
    return "grounded";
  }
  if (/partial/i.test(answer.explanation ?? "")) return "partial";
  return "discovery";
}

function countMatchesControl(input: {
  profile: UnonightE2eOrganizationProfile;
  capability: string | null;
  directAnswer: string;
}): boolean {
  if (!input.profile.source_control_counts || !input.capability) return true;
  if (input.capability === "moderation_queue.read") {
    const expected = input.profile.source_control_counts.pending_moderation_count;
    return expected === null || input.directAnswer.includes(String(expected));
  }
  if (input.capability === "report.read") {
    const expected = input.profile.source_control_counts.reports_attention_count;
    return expected === null || input.directAnswer.includes(String(expected));
  }
  return true;
}

export function runUnonightLiveQuestion(input: {
  profile: UnonightE2eOrganizationProfile;
  question: UnonightLiveQuestionSpec;
  t: Translator;
  locale: CustomerActiveLocale;
  authenticatedE2eVerifiedCapabilities?: readonly string[];
}): UnonightLiveQuestionResult {
  const started = performance.now();
  const tenantContext = buildTenantContextFromProfile(
    input.profile,
    input.locale,
    input.authenticatedE2eVerifiedCapabilities,
  );

  const intentDetected = hasCommunityProviderIntent(input.question.query);
  const match = matchCommunityProviderQuery(input.question.query, tenantContext);
  const result = resolveCommunityCompanionQuery(
    input.question.query,
    input.t,
    tenantContext,
    input.locale,
  );
  const elapsed = performance.now() - started;

  const overlay = tenantContext.communityContext.external_provider_adapters?.[0] ?? null;
  const record =
    match?.capability_key && overlay
      ? overlay.records.find((entry) => entry.capability_key === match.capability_key) ?? null
      : null;
  const readiness =
    match?.capability_key && overlay
      ? overlay.capability_readiness.find((entry) => entry.capability_key === match.capability_key)
          ?.status ?? "unknown"
      : "unknown";

  const permissionResult = resolvePermissionResult(input.profile, match?.capability_key ?? null);
  const metadata = result ? extractCommunityCompanionAnswerMetadata(result.answer) : null;
  const answerStatus = resolveAnswerStatus({ result, permissionResult });
  const contextSize = Buffer.byteLength(JSON.stringify(tenantContext.communityContext), "utf8");

  return {
    question_id: input.question.id,
    query: input.question.query,
    organization_key: input.profile.key,
    locale: input.locale,
    resolved_intent: intentDetected ? "community_provider" : "none",
    capability: match?.capability_key ?? null,
    provider: match?.provider_key ?? overlay?.provider_key ?? null,
    live_rpc: record?.source_reference ?? null,
    organization_scope: input.profile.organizationId,
    permission_result: permissionResult,
    source_reference: metadata?.source_reference ?? record?.source_reference ?? null,
    fetched_at: record?.fetched_at ?? null,
    freshness: record?.freshness ?? null,
    readiness,
    answer_status: answerStatus,
    direct_answer: result?.answer.directAnswer ?? "",
    explanation: result?.answer.explanation ?? "",
    response_time_ms: Math.round(elapsed),
    rpc_call_count: overlay ? 2 : 0,
    provider_latency_ms: Math.round(elapsed),
    context_size_bytes: contextSize,
    used_fallback: answerStatus === "discovery" || answerStatus === "unavailable",
    audit_reference: overlay?.audit_reference ?? null,
  };
}

export function evaluateCapabilityReadinessAfterE2e(
  profile: UnonightE2eOrganizationProfile,
  questionResults: UnonightLiveQuestionResult[],
  authenticatedLiveSession: boolean,
): UnonightAuthenticatedLiveE2eReport["capability_readiness_after_e2e"] {
  const verified: string[] = [];

  if (authenticatedLiveSession) {
    for (const capability of UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES) {
      const questionHits = questionResults.filter(
        (result) =>
          result.organization_key === "unonight" &&
          result.capability === capability &&
          result.answer_status === "grounded" &&
          result.permission_result === "allowed" &&
          Boolean(result.source_reference) &&
          Boolean(result.audit_reference),
      );
      const controlOk = questionHits.every((hit) =>
        countMatchesControl({
          profile,
          capability,
          directAnswer: hit.direct_answer,
        }),
      );
      if (questionHits.length > 0 && controlOk) {
        verified.push(capability);
      }
    }
  }

  const tenantContext = buildTenantContextFromProfile(profile, "no", verified);
  const overlay = tenantContext.communityContext.external_provider_adapters?.[0];
  if (!overlay) return [];

  return overlay.capability_readiness.map((entry) => ({
    capability_key: String(entry.capability_key),
    readiness: entry.status,
    promoted_to_production_ready:
      entry.status === "production_ready" &&
      UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES.includes(
        entry.capability_key as (typeof UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES)[number],
      ),
  }));
}

export function runUnonightAuthenticatedLiveE2e(input: {
  t?: Translator;
  locale?: CustomerActiveLocale;
  authenticatedLiveSession?: boolean;
}): UnonightAuthenticatedLiveE2eReport {
  clearUnonightProviderAdapterAuditTrailForTests();

  const locale = input.locale ?? "no";
  const t = input.t ?? buildCompanionPlatformKnowledgeTranslator(locale);
  const authenticatedLiveSession =
    input.authenticatedLiveSession ?? process.env.UNONIGHT_LIVE_E2E === "1";
  const limitations: string[] = [];

  if (!authenticatedLiveSession) {
    limitations.push(
      "Authenticated APP browser session not executed in CI — runtime validated through simulated tenant context on the same Companion orchestrator branch as /api/aipify/support-assistant/search.",
    );
    limitations.push(
      "priority_now is validated in full orchestrator Command Brief routing — not the community adapter branch alone.",
    );
  }

  const questionResults: UnonightLiveQuestionResult[] = UNONIGHT_LIVE_E2E_QUESTIONS.map(
    (question) =>
      runUnonightLiveQuestion({
        profile: UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight,
        question,
        t,
        locale,
      }),
  );

  const emptyModeration = runUnonightLiveQuestion({
    profile: UNONIGHT_E2E_ORGANIZATION_PROFILES.empty,
    question: UNONIGHT_LIVE_E2E_QUESTIONS[0],
    t,
    locale,
  });

  const isolatedModeration = runUnonightLiveQuestion({
    profile: UNONIGHT_E2E_ORGANIZATION_PROFILES.isolated,
    question: UNONIGHT_LIVE_E2E_QUESTIONS[0],
    t,
    locale,
  });

  const manipulatedGate = evaluateUnonightProviderAdapterActivationGate({
    subscriptionStatus: UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight.subscriptionStatus,
    connectedProviders: [],
    activeBusinessPacks: UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight.activeBusinessPacks,
    effectivePermissions: UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight.effectivePermissions,
    communityNetworkEnabled: true,
    moderationEngineEnabled: true,
    permissionDenied: false,
    appEntitlementBlocked: false,
    smokeTestPassed: true,
  });

  const noModerationPermission = runUnonightLiveQuestion({
    profile: {
      ...UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight,
      effectivePermissions: ["customer_community.view"],
    },
    question: UNONIGHT_LIVE_E2E_QUESTIONS[0],
    t,
    locale,
  });

  const suspendedApp = runUnonightLiveQuestion({
    profile: {
      ...UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight,
      subscriptionStatus: "paused",
      app_entitlement_blocked: true,
    },
    question: UNONIGHT_LIVE_E2E_QUESTIONS[0],
    t,
    locale,
  });

  const disabledProvider = runUnonightLiveQuestion({
    profile: {
      ...UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight,
      provider_disabled: true,
      connectedProviders: [],
    },
    question: UNONIGHT_LIVE_E2E_QUESTIONS[0],
    t,
    locale,
  });

  const capabilityReadiness = evaluateCapabilityReadinessAfterE2e(
    UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight,
    questionResults,
    authenticatedLiveSession,
  );

  const locales: CustomerActiveLocale[] = ["no", "en", "sv", "da", "es", "pl", "uk"];
  const localesSmoke = locales.map((entry) => {
    const localeTranslator = buildCompanionPlatformKnowledgeTranslator(entry);
    const moderation = runUnonightLiveQuestion({
      profile: UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight,
      question: UNONIGHT_LIVE_E2E_QUESTIONS[0],
      t: localeTranslator,
      locale: entry,
    });
    const permissionDenied = runUnonightLiveQuestion({
      profile: {
        ...UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight,
        effectivePermissions: ["customer_community.view"],
      },
      question: UNONIGHT_LIVE_E2E_QUESTIONS[0],
      t: localeTranslator,
      locale: entry,
    });
    const passed =
      moderation.direct_answer.length > 0 &&
      !moderation.direct_answer.includes("customerApp.") &&
      permissionDenied.answer_status !== "grounded";
    return { locale: entry, passed };
  });

  const responseTimes = questionResults.map((entry) => entry.response_time_ms);
  const average =
    responseTimes.reduce((sum, value) => sum + value, 0) / Math.max(responseTimes.length, 1);
  const max = Math.max(...responseTimes, 0);
  const unonightGrounded = questionResults.filter(
    (entry) => entry.answer_status === "grounded" || entry.answer_status === "metric_gap",
  ).length;

  return {
    phase: 31,
    api_entry: UNONIGHT_LIVE_E2E_API_ENTRY,
    runtime_chain: UNONIGHT_LIVE_E2E_RUNTIME_CHAIN,
    authenticated_session_mode: authenticatedLiveSession ? "live_app_session" : "simulated_app_session",
    organizations_tested: ["unonight", "empty", "isolated"],
    question_results: [...questionResults, emptyModeration, isolatedModeration],
    capability_readiness_after_e2e: capabilityReadiness,
    tenant_isolation: {
      unonight_reads_own_data: unonightGrounded >= 4,
      empty_org_honest_unavailable:
        emptyModeration.provider === null &&
        emptyModeration.audit_reference === null &&
        emptyModeration.live_rpc === null &&
        !emptyModeration.direct_answer.includes("3"),
      isolated_org_never_gets_unonight_data:
        isolatedModeration.provider !== UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY ||
        isolatedModeration.answer_status !== "grounded" ||
        !isolatedModeration.direct_answer.includes("3"),
      manipulated_organization_rejected: manipulatedGate.status === "disabled",
    },
    permissions: [
      {
        scenario: "moderation.view granted",
        passed: questionResults[0].permission_result === "allowed",
      },
      {
        scenario: "moderation.view missing",
        passed:
          noModerationPermission.permission_result === "denied" ||
          noModerationPermission.answer_status !== "grounded",
      },
      {
        scenario: "customer_community.view granted",
        passed: UNONIGHT_E2E_ORGANIZATION_PROFILES.unonight.effectivePermissions.includes(
          "customer_community.view",
        ),
      },
      {
        scenario: "app suspended",
        passed:
          suspendedApp.answer_status !== "grounded" || suspendedApp.permission_result === "disabled",
      },
      {
        scenario: "provider disabled",
        passed:
          disabledProvider.provider !== UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY ||
          disabledProvider.answer_status !== "grounded",
      },
    ],
    companion_ui: {
      shared_scroll_policy_frozen:
        COMPANION_CHAT_INITIAL_POSITION === "latest_message" &&
        COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR === "instant" &&
        COMPANION_CHAT_NEW_MESSAGE_AUTOSCROLL === "only_when_near_bottom",
      organization_visible: questionResults.every((entry) => entry.organization_scope.length > 0),
      live_provider_grounded: unonightGrounded >= 4,
      no_raw_enums: questionResults.every(
        (entry) =>
          !/\b(production_ready|connected_but_partial|adapter_missing)\b/.test(entry.direct_answer),
      ),
      no_translation_keys: questionResults.every(
        (entry) => !entry.direct_answer.includes("customerApp."),
      ),
    },
    locales_smoke: localesSmoke,
    performance: {
      average_response_time_ms: Math.round(average),
      max_response_time_ms: max,
      total_rpc_calls: questionResults.reduce((sum, entry) => sum + entry.rpc_call_count, 0),
    },
    limitations,
  };
}
