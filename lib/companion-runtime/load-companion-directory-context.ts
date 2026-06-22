import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getEmployeeAccessControl,
  getEmployeeDirectory,
  getEmployeeManagementInvitations,
} from "@/lib/employee-management";
import { getOrganizationManagementCenter } from "@/lib/organization-management";
import { DIRECTORY_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/directory/manifests";
import {
  APP_EMPLOYEE_DIRECTORY_PROVIDER_KEY,
  mapAppEmployeeDirectoryBundle,
} from "@/lib/integration-intelligence/providers/app-employee-directory/app-employee-directory-contract";
import {
  buildAppEmployeePermissionContext,
} from "@/lib/integration-intelligence/providers/app-employee-directory/permissions";
import { buildAppEmployeeCommandBriefSignals } from "./app-employee-read-orchestrator";
import {
  buildCompanionDirectoryContextFromManifests,
  type CompanionDirectoryContext,
} from "./companion-directory-context";

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

export async function loadCompanionDirectoryContext(input: {
  supabase: SupabaseClient;
  organization_id: string;
  tenant_id: string;
  user_role: string;
  has_organization_membership?: boolean;
  subscription_status?: string | null;
}): Promise<CompanionDirectoryContext> {
  const appSuspended = isAppEntitlementBlocked(input.subscription_status ?? null);
  const hasMembership = input.has_organization_membership ?? true;

  let directoryData: unknown = null;
  let invitationsData: unknown = null;
  let organizationCenterData: unknown = null;
  let accessControlData: unknown = null;
  let permissionDenied = false;
  let adapterConnected = false;

  if (!appSuspended && hasMembership) {
    try {
      const [directory, invitations, orgCenter, accessControl] = await Promise.all([
        getEmployeeDirectory(input.supabase),
        getEmployeeManagementInvitations(input.supabase),
        getOrganizationManagementCenter(input.supabase).catch(() => null),
        getEmployeeAccessControl(input.supabase).catch(() => null),
      ]);
      directoryData = directory;
      invitationsData = invitations;
      organizationCenterData = orgCenter;
      accessControlData = accessControl;
      adapterConnected =
        directory &&
        typeof directory === "object" &&
        (directory as Record<string, unknown>).found !== false;
    } catch (error) {
      if (error instanceof Error && isPermissionDeniedMessage(error.message)) {
        permissionDenied = true;
      }
    }
  }

  const bundle = mapAppEmployeeDirectoryBundle({
    organizationId: input.organization_id,
    directoryData,
    invitationsData,
    organizationCenterData,
    accessControlData,
  });

  const permission = buildAppEmployeePermissionContext({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    app_suspended: appSuspended,
    provider_active: adapterConnected,
    has_organization_membership: hasMembership,
  });

  const connectedProviders = adapterConnected ? [APP_EMPLOYEE_DIRECTORY_PROVIDER_KEY] : [];
  const context = buildCompanionDirectoryContextFromManifests({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    manifests: DIRECTORY_PROVIDER_MANIFESTS,
    connectedProviders,
  });

  return {
    ...context,
    permission_denied: permissionDenied || !permission.can_view_employees,
    app_entitlement_blocked: appSuspended,
    app_employee_adapter_connected: adapterConnected,
    app_employee_source_exact: bundle.source_exact,
    employee_candidate_count: bundle.candidates.length,
    command_brief_signals: buildAppEmployeeCommandBriefSignals({
      bundle,
      source_exact: bundle.source_exact,
    }),
    employee_directory_limitations: bundle.limitations,
  };
}
