import type { SupabaseClient } from "@supabase/supabase-js";
import { AsyncTimeoutError, withAsyncTimeout } from "@/lib/core/async-with-timeout";
import { COMPANION_QUEUE_RPC_TIMEOUT_MS } from "@/lib/app/companion/chat-queue/worker-config";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformSearchResult } from "@/lib/companion-platform-knowledge/types";
import { isCommunityMemberDirectoryReadSourceConnected } from "@/lib/integration-intelligence/providers/community-member-directory/community-member-directory-source-map";
import { buildCommunityMemberDirectoryPermissionContext } from "@/lib/integration-intelligence/providers/community-member-directory/permissions";
import { isMemberVerificationReadSourceConnected } from "@/lib/integration-intelligence/providers/member-verification/member-verification-source-map";
import {
  mapAsoDashboardToSupportBundle,
  mapSupportAiDashboardToSupportBundle,
  SUPPORT_AI_QUEUE_SOURCE_REFERENCE,
} from "@/lib/integration-intelligence/providers/support-operations/support-operations-contract";
import type { SupportPermissionContext } from "@/lib/integration-intelligence/support/permissions";
import type { VerificationPermissionContext } from "@/lib/integration-intelligence/verification/permissions";
import { createCommunityMemberDirectoryReadProviderBridge } from "./community-member-directory-read-provider-bridge";
import { executeCommunityMemberDirectorySearch } from "./community-member-directory-read-orchestrator";
import {
  buildMemberActiveListAnswer,
  buildMemberDetailListAnswer,
  buildMemberPendingVerificationAnswer,
  buildMemberVerificationStatusAnswer,
  buildOrganizationIntelligenceGapAnswer,
  buildMemberCountFromProviderResult,
  buildPrioritizeTodayAnswer,
  buildSupportSlaAnswer,
  buildSupportQueueAnswer,
} from "./organization-intelligence-answer";
import {
  resolveOrganizationMemberCount,
  resolveMemberCountGapReason,
} from "@/lib/integration-intelligence/providers/organization-member-count/resolve";
import { isPresentableMemberCountResult } from "@/lib/integration-intelligence/providers/organization-member-count/types";
import {
  assessOrganizationCapabilityReadiness,
  resolveOrganizationCapabilityRoute,
} from "./organization-capability-resolution";
import {
  resolveOrganizationIntelligenceIntent,
  type OrganizationIntelligenceIntent,
} from "./organization-intelligence-intent";
import { executeSupportQueueRead, type SupportProviderReader } from "./support-read-orchestrator";
import { executeVerificationQueueRead } from "./verification-read-orchestrator";
import { createVerificationReadProviderBridge } from "./verification-read-provider-bridge";
import type { CompanionTenantContext } from "./companion-tenant-context";
import {
  resolveAccessOfferFromCapability,
} from "./organization-access-approval-bridge";
import { resolveOrganizationAccessGate } from "./organization-access-gate";
import { resolveAuthorizationTargetCompanionAnswer } from "./authorization-target-routing";

const PENDING_VERIFICATION_STATUSES = new Set([
  "pending",
  "in_review",
  "needs_information",
]);

function isAppSuspended(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function buildMemberDirectoryPermission(
  tenantContext: CompanionTenantContext,
  providerActive: boolean,
) {
  return buildCommunityMemberDirectoryPermissionContext({
    organization_id: tenantContext.organizationId!,
    tenant_id: tenantContext.companyId ?? tenantContext.organizationId!,
    user_role: tenantContext.organizationRole ?? "staff",
    app_suspended: isAppSuspended(tenantContext.subscriptionStatus),
    provider_active: providerActive,
    can_view_community: tenantContext.effectivePermissions.includes("customer_community.view"),
  });
}

function buildVerificationPermission(
  tenantContext: CompanionTenantContext,
  providerActive: boolean,
): VerificationPermissionContext {
  return {
    organization_id: tenantContext.organizationId!,
    tenant_id: tenantContext.companyId ?? tenantContext.organizationId!,
    user_role: tenantContext.organizationRole ?? "staff",
    app_suspended: isAppSuspended(tenantContext.subscriptionStatus),
    provider_active: providerActive,
    can_view_queue: true,
    can_view_case: true,
    rate_limit_ok: true,
  };
}

function buildSupportQueuePermission(
  tenantContext: CompanionTenantContext,
  providerActive: boolean,
): SupportPermissionContext {
  return {
    organization_id: tenantContext.organizationId!,
    tenant_id: tenantContext.companyId ?? tenantContext.organizationId!,
    user_role: tenantContext.organizationRole ?? "staff",
    app_suspended: isAppSuspended(tenantContext.subscriptionStatus),
    provider_active: providerActive,
    can_read_queue: tenantContext.effectivePermissions.includes("support.view"),
    can_read_cases: tenantContext.effectivePermissions.includes("support.view"),
    can_read_sla: false,
    can_draft_response: false,
    can_assign_case: false,
    can_escalate_case: false,
    rate_limit_ok: true,
  };
}

function buildSupportPermission(
  tenantContext: CompanionTenantContext,
  providerActive: boolean,
): SupportPermissionContext {
  return {
    organization_id: tenantContext.organizationId!,
    tenant_id: tenantContext.companyId ?? tenantContext.organizationId!,
    user_role: tenantContext.organizationRole ?? "staff",
    app_suspended: isAppSuspended(tenantContext.subscriptionStatus),
    provider_active: providerActive,
    can_read_queue: tenantContext.effectivePermissions.includes("support.view_metrics"),
    can_read_cases: tenantContext.effectivePermissions.includes("support.view_metrics"),
    can_read_sla: tenantContext.effectivePermissions.includes("support.view_metrics"),
    can_draft_response: false,
    can_assign_case: false,
    can_escalate_case: false,
    rate_limit_ok: true,
  };
}

function buildSupportProviderFromContext(
  tenantContext: CompanionTenantContext,
): SupportProviderReader | null {
  const { supportContext } = tenantContext;
  if (!supportContext.autonomous_support_enabled && !supportContext.support_source_exact) {
    return null;
  }

  return {
    provider_key: "autonomous_support_operations",
    active: supportContext.support_source_exact || supportContext.autonomous_support_enabled,
    read_queue: async () => ({
      queue: supportContext.queue_summary,
      cases: supportContext.case_summaries,
      source_exact: supportContext.support_source_exact,
      limitations: [],
    }),
    read_case: async () => ({
      case_detail: null,
      limitations: [],
    }),
  };
}

async function fetchSupportAiQueueBundleFromRpc(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_support_ai_engine_dashboard");
  if (error || !data) return null;
  return mapSupportAiDashboardToSupportBundle(data);
}

async function fetchAsoSupportBundleFromRpc(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_customer_support_operations_center");
  if (error || !data) return null;
  return mapAsoDashboardToSupportBundle(data);
}

async function resolveMemberDirectoryAnswer(
  intent: OrganizationIntelligenceIntent,
  input: {
    supabase: SupabaseClient;
    tenantContext: CompanionTenantContext;
    t: Translator;
    locale: CustomerActiveLocale;
    userMessageId?: string | null;
  },
): Promise<PlatformSearchResult | null> {
  const readiness = assessOrganizationCapabilityReadiness(intent);

  let providerReady = readiness.provider_active;
  if (intent.kind === "member_count" && input.tenantContext.organizationId) {
    const countProbe = await resolveOrganizationMemberCount({
      supabase: input.supabase,
      organizationId: input.tenantContext.organizationId,
      tenantId: input.tenantContext.companyId ?? input.tenantContext.organizationId,
    });
    if (!isPresentableMemberCountResult(countProbe)) {
      providerReady =
        readiness.provider_active &&
        resolveMemberCountGapReason(countProbe) !== "registry_not_connected";
    }
  }

  const offer = resolveAccessOfferFromCapability({
    provider_key: intent.provider_key,
    capability_key: intent.capability_key,
    execution_kind: intent.kind,
  });

  const { gate } = await resolveOrganizationAccessGate({
    supabase: input.supabase,
    t: input.t,
    offer,
    providerReady,
    effectivePermissions: input.tenantContext.effectivePermissions,
    capabilityKey: intent.capability_key,
    sourceReference: readiness.source_reference,
    organizationRole: input.tenantContext.organizationRole,
    organizationId: input.tenantContext.organizationId,
    userMessageId: input.userMessageId ?? null,
  });

  if (gate) return gate;

  const permission = buildMemberDirectoryPermission(input.tenantContext, providerReady);

  const bridge = createCommunityMemberDirectoryReadProviderBridge(input.supabase);

  if (intent.kind === "member_count") {
    const result = await resolveOrganizationMemberCount({
      supabase: input.supabase,
      organizationId: input.tenantContext.organizationId!,
      tenantId: input.tenantContext.companyId ?? input.tenantContext.organizationId!,
    });

    if (isPresentableMemberCountResult(result)) {
      return {
        answer: buildMemberCountFromProviderResult({
          result,
          t: input.t,
          locale: input.locale,
        }),
      };
    }

    return {
      answer: buildOrganizationIntelligenceGapAnswer(
        input.t,
        resolveMemberCountGapReason(result),
        {
          sourceReference: result.source_reference,
          capabilityKey: "organization.member_count",
        },
      ),
    };
  }

  let bundle;
  try {
    bundle = await withAsyncTimeout(
      bridge.fetchDirectory(),
      COMPANION_QUEUE_RPC_TIMEOUT_MS,
      "member_directory_fetch",
    );
  } catch (error) {
    if (error instanceof AsyncTimeoutError) {
      return {
        answer: buildOrganizationIntelligenceGapAnswer(input.t, "source_unavailable", {
          sourceReference: readiness.source_reference,
          capabilityKey: intent.capability_key,
        }),
      };
    }
    throw error;
  }

  if (!bundle.source_exact) {
    if (intent.kind === "member_verification_status" && !intent.member_reference) {
      return {
        answer: buildOrganizationIntelligenceGapAnswer(input.t, "missing_data", {
          sourceReference: bundle.source_reference,
          capabilityKey: intent.capability_key,
        }),
      };
    }
    return {
      answer: buildOrganizationIntelligenceGapAnswer(input.t, "source_unavailable", {
        sourceReference: bundle.source_reference,
        capabilityKey: intent.capability_key,
      }),
    };
  }

  switch (intent.kind) {
    case "member_active_list":
      return {
        answer: buildMemberActiveListAnswer({ bundle, t: input.t, locale: input.locale }),
      };
    case "member_detail_list":
      return {
        answer: buildMemberDetailListAnswer({ bundle, t: input.t, locale: input.locale }),
      };
    case "member_pending_verification": {
      const pendingFromDirectory = bundle.members
        .filter((member) => PENDING_VERIFICATION_STATUSES.has(String(member.verification_status).toLowerCase()))
        .map((member) => member.display_name || member.username);

      if (pendingFromDirectory.length > 0) {
        return {
          answer: buildMemberPendingVerificationAnswer({
            bundle,
            pendingReferences: pendingFromDirectory,
            t: input.t,
            locale: input.locale,
          }),
        };
      }

      if (isMemberVerificationReadSourceConnected("verification_queue.read")) {
        const verificationBridge = createVerificationReadProviderBridge(input.supabase);
        const queueBundle = await verificationBridge.fetchQueue();
        const provider = verificationBridge.buildProviderReader(queueBundle);
        const queueResult = await executeVerificationQueueRead({
          organization_id: input.tenantContext.organizationId!,
          tenant_id: input.tenantContext.companyId ?? input.tenantContext.organizationId!,
          user_role: input.tenantContext.organizationRole ?? "staff",
          permission: buildVerificationPermission(input.tenantContext, queueBundle.source_exact),
          providers: [provider],
        });

        const pendingReferences = queueResult.cases
          .filter((entry) => PENDING_VERIFICATION_STATUSES.has(entry.status))
          .map((entry) => entry.subject_reference);

        return {
          answer: buildMemberPendingVerificationAnswer({
            bundle,
            pendingReferences,
            t: input.t,
            locale: input.locale,
          }),
        };
      }

      return {
        answer: buildMemberPendingVerificationAnswer({
          bundle,
          pendingReferences: [],
          t: input.t,
          locale: input.locale,
        }),
      };
    }
    case "member_verification_status": {
      const reference = intent.member_reference?.trim();
      if (!reference) {
        return {
          answer: buildOrganizationIntelligenceGapAnswer(input.t, "missing_data", {
            sourceReference: bundle.source_reference,
            capabilityKey: intent.capability_key,
          }),
        };
      }

      const searchResult = await executeCommunityMemberDirectorySearch({
        query: {
          organization_id: input.tenantContext.organizationId!,
          tenant_id: input.tenantContext.companyId ?? input.tenantContext.organizationId!,
          entity_type: "person",
          relationship_type: "member",
          search_field: "name",
          search_value: reference,
          filters: {},
          requested_fields: ["name", "status"],
          requested_detail_level: "summary",
          permission_scope: "basic",
          capability_candidates: ["member.search"],
          locale: input.locale,
        },
        permission,
        user_role: input.tenantContext.organizationRole ?? "staff",
        bundle,
      });

      const matchedMember = bundle.members.find((member) => {
        const haystack = [member.display_name, member.username]
          .filter(Boolean)
          .map((value) => String(value).toLowerCase());
        const needle = reference.toLowerCase();
        return haystack.some((value) => value.includes(needle));
      });

      const record = matchedMember ?? null;
      if (!record && searchResult.records.length === 0) {
        return {
          answer: buildOrganizationIntelligenceGapAnswer(input.t, "missing_data", {
            sourceReference: bundle.source_reference,
            capabilityKey: intent.capability_key,
          }),
        };
      }

      const verificationStatus =
        record?.verification_status ??
        bundle.members.find((member) => member.member_id === searchResult.records[0]?.entity_id)
          ?.verification_status ??
        null;

      return {
        answer: buildMemberVerificationStatusAnswer({
          reference,
          verificationStatus,
          sourceReference: bundle.source_reference,
          sourceExact: bundle.source_exact,
          freshness: bundle.freshness,
          t: input.t,
          locale: input.locale,
        }),
      };
    }
    default:
      return null;
  }
}

async function resolveSupportQueueAnswer(
  intent: OrganizationIntelligenceIntent,
  input: {
    supabase: SupabaseClient;
    tenantContext: CompanionTenantContext;
    t: Translator;
    locale: CustomerActiveLocale;
    userMessageId?: string | null;
  },
): Promise<PlatformSearchResult> {
  const readiness = assessOrganizationCapabilityReadiness(intent);
  if (readiness.status === "adapter_missing") {
    return {
      answer: buildOrganizationIntelligenceGapAnswer(input.t, "adapter_missing", {
        sourceReference: readiness.source_reference,
        capabilityKey: intent.capability_key,
      }),
    };
  }

  const rpcBundle = await fetchSupportAiQueueBundleFromRpc(input.supabase);

  if (!rpcBundle || !rpcBundle.source_exact) {
    return {
      answer: buildOrganizationIntelligenceGapAnswer(input.t, "source_unavailable", {
        sourceReference: readiness.source_reference,
        capabilityKey: intent.capability_key,
      }),
    };
  }

  const provider: SupportProviderReader = {
    provider_key: "support_ai_engine",
    active: true,
    read_queue: async () => ({
      queue: rpcBundle.queue,
      cases: rpcBundle.cases,
      source_exact: rpcBundle.source_exact,
      limitations: rpcBundle.limitations,
    }),
    read_case: async () => ({
      case_detail: null,
      limitations: rpcBundle.limitations,
    }),
  };

  const offer = resolveAccessOfferFromCapability({
    provider_key: intent.provider_key,
    capability_key: intent.capability_key,
    execution_kind: intent.kind,
  });

  const { gate } = await resolveOrganizationAccessGate({
    supabase: input.supabase,
    t: input.t,
    offer,
    providerReady: readiness.provider_active && rpcBundle.source_exact,
    effectivePermissions: input.tenantContext.effectivePermissions,
    capabilityKey: intent.capability_key,
    sourceReference: readiness.source_reference,
    organizationRole: input.tenantContext.organizationRole,
    organizationId: input.tenantContext.organizationId,
    userMessageId: input.userMessageId ?? null,
  });

  if (gate) return gate;

  const supportPermission = buildSupportQueuePermission(input.tenantContext, rpcBundle.source_exact);

  const queueResult = await executeSupportQueueRead({
    organization_id: input.tenantContext.organizationId!,
    tenant_id: input.tenantContext.companyId ?? input.tenantContext.organizationId!,
    user_role: input.tenantContext.organizationRole ?? "staff",
    permission: supportPermission,
    providers: [provider],
  });

  return {
    answer: buildSupportQueueAnswer({
      queue: queueResult.queue,
      sourceReference: rpcBundle.queue?.source_reference ?? SUPPORT_AI_QUEUE_SOURCE_REFERENCE,
      sourceExact: rpcBundle.source_exact,
      generatedAt: rpcBundle.queue?.generated_at ?? null,
      t: input.t,
      locale: input.locale,
    }),
  };
}

async function resolveSupportSlaAnswer(
  intent: OrganizationIntelligenceIntent,
  input: {
    supabase: SupabaseClient;
    tenantContext: CompanionTenantContext;
    t: Translator;
    locale: CustomerActiveLocale;
    userMessageId?: string | null;
  },
): Promise<PlatformSearchResult> {
  const readiness = assessOrganizationCapabilityReadiness(intent);
  if (readiness.status === "adapter_missing") {
    return {
      answer: buildOrganizationIntelligenceGapAnswer(input.t, "adapter_missing", {
        sourceReference: readiness.source_reference,
        capabilityKey: intent.capability_key,
      }),
    };
  }

  const rpcBundle = await fetchAsoSupportBundleFromRpc(input.supabase);
  const contextProvider = buildSupportProviderFromContext(input.tenantContext);

  const bundle = rpcBundle ?? {
    queue: input.tenantContext.supportContext.queue_summary,
    cases: input.tenantContext.supportContext.case_summaries,
    source_exact: input.tenantContext.supportContext.support_source_exact,
    sla_source_exact: false,
    limitations: [] as readonly string[],
  };

  const provider: SupportProviderReader | null = rpcBundle
    ? {
        provider_key: "autonomous_support_operations",
        active: rpcBundle.source_exact,
        read_queue: async () => ({
          queue: rpcBundle.queue,
          cases: rpcBundle.cases,
          source_exact: rpcBundle.source_exact,
          limitations: rpcBundle.limitations,
        }),
        read_case: async () => ({
          case_detail: null,
          limitations: rpcBundle.limitations,
        }),
      }
    : contextProvider;

  if (!provider || !bundle.source_exact) {
    return {
      answer: buildOrganizationIntelligenceGapAnswer(input.t, "source_unavailable", {
        sourceReference: readiness.source_reference,
        capabilityKey: intent.capability_key,
      }),
    };
  }

  const offer = resolveAccessOfferFromCapability({
    provider_key: intent.provider_key,
    capability_key: intent.capability_key,
    execution_kind: intent.kind,
  });

  const { gate } = await resolveOrganizationAccessGate({
    supabase: input.supabase,
    t: input.t,
    offer,
    providerReady: readiness.provider_active && bundle.source_exact,
    effectivePermissions: input.tenantContext.effectivePermissions,
    capabilityKey: intent.capability_key,
    sourceReference: readiness.source_reference,
    organizationRole: input.tenantContext.organizationRole,
    organizationId: input.tenantContext.organizationId,
    userMessageId: input.userMessageId ?? null,
  });

  if (gate) return gate;

  const supportPermission = buildSupportPermission(input.tenantContext, bundle.source_exact);

  const queueResult = await executeSupportQueueRead({
    organization_id: input.tenantContext.organizationId!,
    tenant_id: input.tenantContext.companyId ?? input.tenantContext.organizationId!,
    user_role: input.tenantContext.organizationRole ?? "staff",
    permission: supportPermission,
    providers: [provider],
  });

  return {
    answer: buildSupportSlaAnswer({
      cases: queueResult.cases,
      sourceReference: bundle.queue?.source_reference ?? "get_customer_support_operations_center",
      sourceExact: bundle.source_exact,
      slaSourceExact: rpcBundle?.sla_source_exact ?? false,
      generatedAt: bundle.queue?.generated_at ?? null,
      t: input.t,
      locale: input.locale,
    }),
  };
}

function resolvePrioritizeTodayAnswer(input: {
  tenantContext: CompanionTenantContext;
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformSearchResult {
  const bundle = input.tenantContext.commandBriefBundle;
  const attentionFromOperational = input.tenantContext.operationalContext.attention_items.map(
    (item, index) => ({
      signal_id: `operational-attention-${item.id}`,
      signal_type: "attention" as const,
      category: item.category,
      title_key: item.title,
      summary_key: item.summary ?? item.title,
      severity: "high" as const,
      priority: 100 - index,
      status: "unresolved" as const,
      source_module: item.source_module ?? "operational",
      source_provider: "command_brief",
      source_reference: item.id,
      source_tier: "exact_live" as const,
      detected_at: item.occurred_at ?? null,
      relevant_since: item.occurred_at ?? null,
      freshness: input.tenantContext.operationalContext.freshness,
      completeness: input.tenantContext.operationalContext.completeness === "complete" ? "complete" as const : "partial" as const,
      confidence: "high" as const,
      required_permission: null,
      required_entitlement: null,
      related_capability: null,
      related_action: null,
      organization_id: input.tenantContext.organizationId ?? "",
      dedupe_key: `operational:${item.id}`,
      warnings: [],
      count: null,
      panel: "app" as const,
      since_last_bucket: "none" as const,
    }),
  );

  const mergedSignals = [...bundle.prioritized_signals, ...attentionFromOperational]
    .filter((signal) => signal.source_tier === "exact_live" || signal.source_tier === "compatible_live")
    .sort((left, right) => right.priority - left.priority);

  return {
    answer: buildPrioritizeTodayAnswer({
      signals: mergedSignals,
      generatedAt: bundle.generated_at ?? input.tenantContext.operationalContext.generated_at,
      t: input.t,
      locale: input.locale,
    }),
  };
}

/** Routes organization-specific Companion questions to exact live sources before generic fallbacks. */
export async function resolveOrganizationIntelligenceAnswer(
  query: string,
  input: {
    t: Translator;
    tenantContext: CompanionTenantContext;
    supabase: SupabaseClient | null | undefined;
    activeLocale: CustomerActiveLocale;
    companionSurface?: boolean;
    userMessageId?: string | null;
  },
): Promise<PlatformSearchResult | null> {
  const authorizationTargetAnswer = resolveAuthorizationTargetCompanionAnswer(query, {
    t: input.t,
    locale: input.activeLocale,
    userMessageId: input.userMessageId ?? null,
    organizationId: input.tenantContext.organizationId ?? null,
  });
  if (authorizationTargetAnswer) return authorizationTargetAnswer;

  const intent = resolveOrganizationIntelligenceIntent(query, input.activeLocale);
  if (!intent) return null;

  const readiness = assessOrganizationCapabilityReadiness(intent);
  if (readiness.status === "adapter_missing") {
    return {
      answer: buildOrganizationIntelligenceGapAnswer(input.t, "adapter_missing", {
        sourceReference: readiness.source_reference,
        capabilityKey: intent.capability_key,
      }),
    };
  }

  if (!input.tenantContext.organizationId || !input.supabase) {
    return {
      answer: buildOrganizationIntelligenceGapAnswer(input.t, "source_unavailable", {
        sourceReference: readiness.source_reference,
        capabilityKey: intent.capability_key,
      }),
    };
  }

  if (intent.kind === "prioritize_today") {
    return resolvePrioritizeTodayAnswer({
      tenantContext: input.tenantContext,
      t: input.t,
      locale: input.activeLocale,
    });
  }

  if (intent.kind === "support_sla") {
    return resolveSupportSlaAnswer(intent, {
      supabase: input.supabase,
      tenantContext: input.tenantContext,
      t: input.t,
      locale: input.activeLocale,
      userMessageId: input.userMessageId ?? null,
    });
  }

  if (intent.kind === "support_queue") {
    return resolveSupportQueueAnswer(intent, {
      supabase: input.supabase,
      tenantContext: input.tenantContext,
      t: input.t,
      locale: input.activeLocale,
      userMessageId: input.userMessageId ?? null,
    });
  }

  return resolveMemberDirectoryAnswer(intent, {
    supabase: input.supabase,
    tenantContext: input.tenantContext,
    t: input.t,
    locale: input.activeLocale,
    userMessageId: input.userMessageId ?? null,
  });
}

export function shouldBypassGenericNavigationForOrganizationQuery(
  query: string,
  locale: CustomerActiveLocale = "en",
): boolean {
  return resolveOrganizationCapabilityRoute(query, locale) !== null;
}
