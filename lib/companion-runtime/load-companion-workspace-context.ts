import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listWorkspaceProviderManifests } from "@/lib/integration-intelligence/workspace/registry";
import type { WorkspaceProviderImplementationStatus } from "@/lib/integration-intelligence/workspace/types";
import {
  buildWorkspaceCapabilityRuntimeRef,
  createEmptyCompanionWorkspaceContext,
  type CompanionWorkspaceContext,
  type WorkspaceProviderRuntimeStatus,
} from "./companion-workspace-context";

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
  if (record.has_organization === false) return false;
  if (record.has_access === false) return false;
  return true;
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: WorkspaceProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
}): WorkspaceProviderRuntimeStatus {
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
    calendar_enabled: input.engineEnabled && input.providerKey === "organization_calendar",
    context_calendar_enabled: input.engineEnabled && input.providerKey === "context_engine_calendar",
    tasks_enabled: input.engineEnabled && input.providerKey === "organization_tasks",
    documents_enabled: input.engineEnabled && input.providerKey === "organization_documents",
    search_enabled: input.engineEnabled && input.providerKey === "universal_search",
    notifications_enabled: input.engineEnabled && input.providerKey === "organization_notifications",
    print_enabled: input.engineEnabled && input.providerKey === "print_output",
    support_email_enabled: input.engineEnabled && input.providerKey === "support_email_drafts",
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    calendar: boolean;
    contextCalendar: boolean;
    tasks: boolean;
    documents: boolean;
    search: boolean;
    notifications: boolean;
    print: boolean;
    supportEmail: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "organization_calendar":
      return flags.calendar;
    case "context_engine_calendar":
      return flags.contextCalendar;
    case "organization_tasks":
      return flags.tasks;
    case "organization_documents":
      return flags.documents;
    case "universal_search":
      return flags.search;
    case "organization_notifications":
      return flags.notifications;
    case "print_output":
      return flags.print;
    case "support_email_drafts":
      return flags.supportEmail;
    default:
      return false;
  }
}

export async function loadCompanionWorkspaceContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
  },
): Promise<CompanionWorkspaceContext> {
  const [
    calendarResult,
    contextCalendarResult,
    taskResult,
    documentResult,
    searchResult,
    notificationResult,
    printResult,
  ] = await Promise.all([
    supabase.rpc("get_companion_calendar_context"),
    supabase.rpc("get_customer_calendar_center"),
    supabase.rpc("get_companion_task_context"),
    supabase.rpc("get_companion_knowledge_context", { p_query: null }),
    supabase.rpc("get_companion_universal_search_context", { p_query: null }),
    supabase.rpc("get_notification_management_center"),
    supabase.rpc("get_aipify_print_output_center"),
  ]);

  const permissionDenied = [
    calendarResult,
    contextCalendarResult,
    taskResult,
    documentResult,
    searchResult,
    notificationResult,
    printResult,
  ].some((result) => result.error && isPermissionDeniedMessage(result.error.message));

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (permissionDenied) {
    return createEmptyCompanionWorkspaceContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const engineFlags = {
    calendar: rpcEnabled(calendarResult.data),
    contextCalendar: rpcEnabled(contextCalendarResult.data),
    tasks: rpcEnabled(taskResult.data),
    documents: rpcEnabled(documentResult.data),
    search: rpcEnabled(searchResult.data),
    notifications: rpcEnabled(notificationResult.data),
    print: rpcEnabled(printResult.data),
    supportEmail: input.effectivePermissions.length > 0,
  };

  const providers: WorkspaceProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listWorkspaceProviderManifests()) {
    const engineEnabled = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
    });

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      capabilities.push(
        buildWorkspaceCapabilityRuntimeRef({
          manifest,
          providerStatus,
          capability,
          hasPermission,
        }),
      );
    }
  }

  return createEmptyCompanionWorkspaceContext({
    calendar_enabled: engineFlags.calendar,
    context_calendar_enabled: engineFlags.contextCalendar,
    tasks_enabled: engineFlags.tasks,
    documents_enabled: engineFlags.documents,
    search_enabled: engineFlags.search,
    notifications_enabled: engineFlags.notifications,
    print_enabled: engineFlags.print,
    support_email_enabled: engineFlags.supportEmail,
    human_oversight_required: true,
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
    privacy_filtered: capabilities.some((capability) => capability.privacy_sensitive),
  });
}

export { createEmptyCompanionWorkspaceContext };
