import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getCustomerRelationshipCenter,
  getLeadManagementCenter,
} from "@/lib/customer-relationship";
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
import { buildAppEmployeePermissionContext } from "@/lib/integration-intelligence/providers/app-employee-directory/permissions";
import {
  CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY,
  mapCrmDirectoryBundle,
} from "@/lib/integration-intelligence/providers/crm-customer-directory/crm-customer-directory-contract";
import { buildCrmDirectoryPermissionContext } from "@/lib/integration-intelligence/providers/crm-customer-directory/permissions";
import { buildAppEmployeeCommandBriefSignals } from "./app-employee-read-orchestrator";
import { buildCrmDirectoryCommandBriefSignals } from "./crm-customer-read-orchestrator";
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
  has_crm_entitlement?: boolean;
  subscription_status?: string | null;
}): Promise<CompanionDirectoryContext> {
  const appSuspended = isAppEntitlementBlocked(input.subscription_status ?? null);
  const hasMembership = input.has_organization_membership ?? true;
  const hasCrmEntitlement = input.has_crm_entitlement ?? true;

  let directoryData: unknown = null;
  let invitationsData: unknown = null;
  let organizationCenterData: unknown = null;
  let accessControlData: unknown = null;
  let relationshipCenterData: unknown = null;
  let leadCenterData: unknown = null;

  let employeeAdapterConnected = false;
  let crmAdapterConnected = false;
  let permissionDenied = false;

  if (!appSuspended && hasMembership) {
    try {
      const [directory, invitations, orgCenter, accessControl, relationshipCenter, leadCenter] =
        await Promise.all([
          getEmployeeDirectory(input.supabase),
          getEmployeeManagementInvitations(input.supabase),
          getOrganizationManagementCenter(input.supabase).catch(() => null),
          getEmployeeAccessControl(input.supabase).catch(() => null),
          hasCrmEntitlement
            ? getCustomerRelationshipCenter(input.supabase).catch(() => null)
            : Promise.resolve(null),
          hasCrmEntitlement
            ? getLeadManagementCenter(input.supabase).catch(() => null)
            : Promise.resolve(null),
        ]);
      directoryData = directory;
      invitationsData = invitations;
      organizationCenterData = orgCenter;
      accessControlData = accessControl;
      relationshipCenterData = relationshipCenter;
      leadCenterData = leadCenter;
      employeeAdapterConnected =
        directory &&
        typeof directory === "object" &&
        (directory as Record<string, unknown>).found !== false;
      crmAdapterConnected = Boolean(
        (relationshipCenter &&
          typeof relationshipCenter === "object" &&
          (relationshipCenter as Record<string, unknown>).found !== false) ||
          (leadCenter &&
            typeof leadCenter === "object" &&
            (leadCenter as Record<string, unknown>).found !== false),
      );
    } catch (error) {
      if (error instanceof Error && isPermissionDeniedMessage(error.message)) {
        permissionDenied = true;
      }
    }
  }

  const employeeBundle = mapAppEmployeeDirectoryBundle({
    organizationId: input.organization_id,
    directoryData,
    invitationsData,
    organizationCenterData,
    accessControlData,
  });

  const crmBundle = mapCrmDirectoryBundle({
    organizationId: input.organization_id,
    relationshipCenterData,
    leadCenterData,
  });

  const employeePermission = buildAppEmployeePermissionContext({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    app_suspended: appSuspended,
    provider_active: employeeAdapterConnected,
    has_organization_membership: hasMembership,
  });

  const crmPermission = buildCrmDirectoryPermissionContext({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    app_suspended: appSuspended,
    provider_active: crmAdapterConnected,
    has_crm_entitlement: hasCrmEntitlement,
  });

  const connectedProviders = [
    ...(employeeAdapterConnected ? [APP_EMPLOYEE_DIRECTORY_PROVIDER_KEY] : []),
    ...(crmAdapterConnected ? [CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY] : []),
  ];

  const context = buildCompanionDirectoryContextFromManifests({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    manifests: DIRECTORY_PROVIDER_MANIFESTS,
    connectedProviders,
  });

  const employeeBriefSignals = buildAppEmployeeCommandBriefSignals({
    bundle: employeeBundle,
    source_exact: employeeBundle.source_exact,
  });
  const crmBriefSignals = buildCrmDirectoryCommandBriefSignals({
    bundle: crmBundle,
    source_exact: crmBundle.source_exact,
  });

  return {
    ...context,
    permission_denied:
      permissionDenied || (!employeePermission.can_view_employees && !crmPermission.can_view_customers),
    app_entitlement_blocked: appSuspended,
    app_employee_adapter_connected: employeeAdapterConnected,
    app_employee_source_exact: employeeBundle.source_exact,
    employee_candidate_count: employeeBundle.candidates.length,
    command_brief_signals: employeeBriefSignals,
    employee_directory_limitations: employeeBundle.limitations,
    crm_adapter_connected: crmAdapterConnected,
    crm_source_exact: crmBundle.source_exact,
    crm_candidate_count: crmBundle.candidates.length,
    crm_command_brief_signals: crmBriefSignals,
    crm_directory_limitations: crmBundle.limitations,
  };
}
