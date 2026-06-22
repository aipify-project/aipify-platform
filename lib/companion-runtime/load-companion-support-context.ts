import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listSupportProviderManifests } from "@/lib/integration-intelligence/support/registry";
import type { SupportProviderImplementationStatus } from "@/lib/integration-intelligence/support/types";
import {
  buildSupportCapabilityRuntimeRef,
  createEmptyCompanionSupportContext,
  type CompanionSupportContext,
  type SupportProviderRuntimeStatus,
} from "./companion-support-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function rpcEnabled(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  if (record.found === false) return false;
  if (record.has_access === false) return false;
  if (record.has_customer === false) return false;
  if (record.has_organization === false) return false;
  return true;
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: SupportProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): SupportProviderRuntimeStatus {
  const verified = input.connectedProviders.includes(input.providerKey);

  let implementationStatus = input.manifestStatus;
  if (verified && input.manifestStatus === "implemented_disconnected") {
    implementationStatus = "connected";
  } else if (!verified && input.manifestStatus === "connected") {
    implementationStatus = "implemented_disconnected";
  }

  return {
    provider_key: input.providerKey,
    implementation_status: implementationStatus,
    support_ai_enabled: input.engineEnabled,
    autonomous_support_enabled: input.engineEnabled,
    self_support_enabled: input.engineEnabled,
    app_portal_support_enabled: input.engineEnabled,
    proactive_support_enabled: input.engineEnabled,
    business_dna_knowledge_enabled: input.engineEnabled,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    supportAi: boolean;
    aso: boolean;
    selfSupport: boolean;
    appPortal: boolean;
    proactive: boolean;
    bde: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "support_ai_engine":
      return flags.supportAi;
    case "autonomous_support_operations":
      return flags.aso;
    case "self_support_engine":
      return flags.selfSupport;
    case "app_portal_support":
      return flags.appPortal;
    case "proactive_organization_support":
      return flags.proactive;
    case "business_dna_knowledge":
      return flags.bde;
    case "support_adapter":
      return false;
    default:
      return false;
  }
}

function extractAsoSettings(data: unknown): {
  autonomy_level: number | null;
  proactive_support_enabled: boolean;
  self_healing_enabled: boolean;
  knowledge_gap_detection_enabled: boolean;
  open_cases_count: number | null;
  pending_drafts_count: number | null;
} {
  if (!data || typeof data !== "object") {
    return {
      autonomy_level: null,
      proactive_support_enabled: false,
      self_healing_enabled: false,
      knowledge_gap_detection_enabled: false,
      open_cases_count: null,
      pending_drafts_count: null,
    };
  }

  const record = data as Record<string, unknown>;
  const settings =
    record.settings && typeof record.settings === "object"
      ? (record.settings as Record<string, unknown>)
      : {};
  const performance =
    record.performance && typeof record.performance === "object"
      ? (record.performance as Record<string, unknown>)
      : {};

  const approvalQueue = Array.isArray(record.approval_queue) ? record.approval_queue : [];

  return {
    autonomy_level:
      typeof settings.autonomy_level === "number" ? settings.autonomy_level : null,
    proactive_support_enabled: settings.proactive_support_enabled === true,
    self_healing_enabled: settings.self_healing_enabled === true,
    knowledge_gap_detection_enabled: settings.knowledge_gap_detection_enabled === true,
    open_cases_count:
      typeof performance.open_cases === "number" ? performance.open_cases : null,
    pending_drafts_count: approvalQueue.length > 0 ? approvalQueue.length : null,
  };
}

function extractSupportAiStats(data: unknown): {
  open_cases_count: number | null;
  pending_drafts_count: number | null;
} {
  if (!data || typeof data !== "object") {
    return { open_cases_count: null, pending_drafts_count: null };
  }

  const record = data as Record<string, unknown>;
  const openCases = Array.isArray(record.open_cases) ? record.open_cases : [];
  const pendingApprovals = Array.isArray(record.pending_approvals) ? record.pending_approvals : [];
  const stats =
    record.ai_statistics && typeof record.ai_statistics === "object"
      ? (record.ai_statistics as Record<string, unknown>)
      : {};

  return {
    open_cases_count:
      openCases.length > 0
        ? openCases.length
        : typeof stats.total_responses === "number"
          ? null
          : null,
    pending_drafts_count:
      pendingApprovals.length > 0
        ? pendingApprovals.length
        : typeof stats.drafts_pending === "number"
          ? Number(stats.drafts_pending)
          : null,
  };
}

export async function loadCompanionSupportContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
  },
): Promise<CompanionSupportContext> {
  const [
    supportAiResult,
    asoResult,
    selfSupportResult,
    appPortalListResult,
    proactiveResult,
    bdeResult,
  ] = await Promise.all([
    supabase.rpc("get_support_ai_engine_dashboard"),
    supabase.rpc("get_customer_support_operations_center"),
    supabase.rpc("get_self_support_engine_dashboard"),
    supabase.rpc("list_app_portal_support_requests"),
    supabase.rpc("get_proactive_organization_engine_dashboard"),
    supabase.rpc("get_customer_business_dna_center"),
  ]);

  const permissionDenied = [supportAiResult, selfSupportResult].some(
    (result) => result.error && isPermissionDeniedMessage(result.error.message),
  );

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);
  const businessPackActive = input.activeBusinessPacks.includes("support_operations");

  if (permissionDenied) {
    return createEmptyCompanionSupportContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const supportAiEnabled = rpcEnabled(supportAiResult.data);
  const asoEnabled = rpcEnabled(asoResult.data);
  const selfSupportEnabled = rpcEnabled(selfSupportResult.data);
  const appPortalEnabled = rpcEnabled(appPortalListResult.data);
  const proactiveEnabled = rpcEnabled(proactiveResult.data);
  const bdeEnabled = rpcEnabled(bdeResult.data);

  const asoSettings = extractAsoSettings(asoResult.data);
  const supportAiStats = extractSupportAiStats(supportAiResult.data);

  const engineFlags = {
    supportAi: supportAiEnabled,
    aso: asoEnabled,
    selfSupport: selfSupportEnabled,
    appPortal: appPortalEnabled,
    proactive: proactiveEnabled,
    bde: bdeEnabled,
  };

  const providers: SupportProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listSupportProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: engineEnabledForProvider,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive:
        !manifest.business_pack_key || input.activeBusinessPacks.includes(manifest.business_pack_key),
    });

    providerStatus.support_ai_enabled =
      engineFlags.supportAi && manifest.source_engine === "support_ai_engine";
    providerStatus.autonomous_support_enabled =
      engineFlags.aso && manifest.source_engine === "autonomous_support_operations";
    providerStatus.self_support_enabled =
      engineFlags.selfSupport && manifest.source_engine === "self_support_engine";
    providerStatus.app_portal_support_enabled =
      engineFlags.appPortal && manifest.source_engine === "app_portal_support";
    providerStatus.proactive_support_enabled =
      engineFlags.proactive && manifest.source_engine === "proactive_organization_support";
    providerStatus.business_dna_knowledge_enabled =
      engineFlags.bde && manifest.source_engine === "business_dna_knowledge";

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildSupportCapabilityRuntimeRef({
        manifest,
        providerStatus,
        capability,
        hasPermission,
      });

      if (runtimeRef) {
        capabilities.push(runtimeRef);
      }
    }
  }

  return createEmptyCompanionSupportContext({
    support_ai_enabled: supportAiEnabled,
    autonomous_support_enabled: asoEnabled,
    self_support_enabled: selfSupportEnabled,
    app_portal_support_enabled: appPortalEnabled,
    proactive_support_enabled: proactiveEnabled,
    business_dna_knowledge_enabled: bdeEnabled,
    human_oversight_required: true,
    draft_only_mode: true,
    auto_send_blocked: true,
    case_close_blocked: true,
    autonomy_level: asoSettings.autonomy_level,
    proactive_support_flag: asoSettings.proactive_support_enabled,
    self_healing_enabled: asoSettings.self_healing_enabled,
    knowledge_gap_detection_enabled: asoSettings.knowledge_gap_detection_enabled,
    open_cases_count: asoSettings.open_cases_count ?? supportAiStats.open_cases_count,
    pending_drafts_count: asoSettings.pending_drafts_count ?? supportAiStats.pending_drafts_count,
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
  });
}
