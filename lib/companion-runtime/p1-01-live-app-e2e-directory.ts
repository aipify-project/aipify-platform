import { getCustomerRelationshipCenter, getLeadManagementCenter } from "@/lib/customer-relationship";
import {
  getEmployeeAccessControl,
  getEmployeeDirectory,
  getEmployeeManagementInvitations,
} from "@/lib/employee-management";
import { getOrganizationManagementCenter } from "@/lib/organization-management";
import { getProcurementOperationsCenter } from "@/lib/procurement-operations";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  mapAppEmployeeDirectoryBundle,
  type AppEmployeeDirectoryBundle,
} from "@/lib/integration-intelligence/providers/app-employee-directory/app-employee-directory-contract";
import {
  mapCrmDirectoryBundle,
  type CrmDirectoryBundle,
} from "@/lib/integration-intelligence/providers/crm-customer-directory/crm-customer-directory-contract";
import {
  mapSupplierDirectoryBundle,
  type SupplierDirectoryBundle,
} from "@/lib/integration-intelligence/providers/supplier-vendor-directory/supplier-vendor-directory-contract";
import type { CompanionCoverageSourceClassification } from "./companion-foundation-coverage-types";

export type P1LiveDirectoryBundles = {
  employee: AppEmployeeDirectoryBundle;
  crm: CrmDirectoryBundle;
  supplier: SupplierDirectoryBundle;
  employeeAdapterConnected: boolean;
  crmAdapterConnected: boolean;
  supplierAdapterConnected: boolean;
};

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

export function classifyBundleSource(
  bundle: { source_exact: boolean; limitations: readonly string[] },
): CompanionCoverageSourceClassification {
  if (bundle.source_exact) return "source_exact";
  if (bundle.limitations.some((entry) => entry.toLowerCase().includes("partial"))) {
    return "source_partial";
  }
  if (bundle.limitations.length > 0) return "source_compatible";
  return "source_unknown";
}

export async function loadP1LiveDirectoryBundles(input: {
  supabase: SupabaseClient;
  organizationId: string;
  subscriptionStatus: string | null;
  hasOrganizationMembership: boolean;
}): Promise<P1LiveDirectoryBundles> {
  const appSuspended = isAppEntitlementBlocked(input.subscriptionStatus);

  let directoryData: unknown = null;
  let invitationsData: unknown = null;
  let organizationCenterData: unknown = null;
  let accessControlData: unknown = null;
  let relationshipCenterData: unknown = null;
  let leadCenterData: unknown = null;
  let procurementCenterData: unknown = null;

  if (!appSuspended && input.hasOrganizationMembership) {
    const [directory, invitations, orgCenter, accessControl, relationshipCenter, leadCenter, procurementCenter] =
      await Promise.all([
        getEmployeeDirectory(input.supabase).catch(() => null),
        getEmployeeManagementInvitations(input.supabase).catch(() => null),
        getOrganizationManagementCenter(input.supabase).catch(() => null),
        getEmployeeAccessControl(input.supabase).catch(() => null),
        getCustomerRelationshipCenter(input.supabase).catch(() => null),
        getLeadManagementCenter(input.supabase).catch(() => null),
        getProcurementOperationsCenter(input.supabase).catch(() => null),
      ]);

    directoryData = directory;
    invitationsData = invitations;
    organizationCenterData = orgCenter;
    accessControlData = accessControl;
    relationshipCenterData = relationshipCenter;
    leadCenterData = leadCenter;
    procurementCenterData = procurementCenter;
  }

  const employeeBundle = mapAppEmployeeDirectoryBundle({
    organizationId: input.organizationId,
    directoryData,
    invitationsData,
    organizationCenterData,
    accessControlData,
  });

  const crmBundle = mapCrmDirectoryBundle({
    organizationId: input.organizationId,
    relationshipCenterData,
    leadCenterData,
  });

  const supplierBundle = mapSupplierDirectoryBundle({
    organizationId: input.organizationId,
    procurementCenterData,
  });

  const employeeAdapterConnected =
    directoryData &&
    typeof directoryData === "object" &&
    (directoryData as Record<string, unknown>).found !== false;

  const crmAdapterConnected = Boolean(
    (relationshipCenterData &&
      typeof relationshipCenterData === "object" &&
      (relationshipCenterData as Record<string, unknown>).found !== false) ||
      (leadCenterData &&
        typeof leadCenterData === "object" &&
        (leadCenterData as Record<string, unknown>).found !== false),
  );

  const supplierAdapterConnected = Boolean(
    procurementCenterData &&
      typeof procurementCenterData === "object" &&
      (procurementCenterData as Record<string, unknown>).found !== false,
  );

  return {
    employee: employeeBundle,
    crm: crmBundle,
    supplier: supplierBundle,
    employeeAdapterConnected: Boolean(employeeAdapterConnected),
    crmAdapterConnected,
    supplierAdapterConnected,
  };
}
