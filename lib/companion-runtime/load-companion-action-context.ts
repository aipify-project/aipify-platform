import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createEmptyCompanionActionContext,
  normalizeCompanionActionContext,
  type CompanionActionContext,
} from "./companion-action-context";
import type { CompanionCreativeContext } from "./companion-creative-context";
import type { CompanionMediaContext } from "./companion-media-context";
import type { CompanionWorkspaceContext } from "./companion-workspace-context";
import type { CompanionCommerceContext } from "./companion-commerce-context";
import type { CompanionServicesContext } from "./companion-services-context";
import type { CompanionSupportContext } from "./companion-support-context";
import type { CompanionIndustryPackContext } from "./companion-industry-pack-context";
import type { CompanionHostsContext } from "./companion-hosts-context";
import type { CompanionHrContext } from "./companion-hr-context";
import type { CompanionWarehouseContext } from "./companion-warehouse-context";
import type { CompanionFinanceContext } from "./companion-finance-context";
import type { CompanionBusinessPackCollection } from "./companion-business-pack-context";
import type { CompanionSchemaCollection } from "./companion-schema-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

export async function loadCompanionActionContext(
  supabase: SupabaseClient,
  input: {
    schemaContext: CompanionSchemaCollection;
    businessPackContext: CompanionBusinessPackCollection;
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    creativeContext?: CompanionCreativeContext;
    mediaContext?: CompanionMediaContext;
    workspaceContext?: CompanionWorkspaceContext;
    commerceContext?: CompanionCommerceContext;
    servicesContext?: CompanionServicesContext;
    supportContext?: CompanionSupportContext;
    industryPackContext?: CompanionIndustryPackContext;
    hostsContext?: CompanionHostsContext;
    hrContext?: CompanionHrContext;
    warehouseContext?: CompanionWarehouseContext;
    financeContext?: CompanionFinanceContext;
  },
): Promise<{ actionContext: CompanionActionContext; writeActionsAvailable: boolean }> {
  const [companionResult, trustResult, approvalsResult] = await Promise.all([
    supabase.rpc("get_companion_action_center"),
    supabase.rpc("get_customer_trust_actions_center"),
    supabase.rpc("get_customer_approvals_center"),
  ]);

  let permissionDenied = false;
  if (companionResult.error && isPermissionDeniedMessage(companionResult.error.message)) {
    permissionDenied = true;
  }
  if (trustResult.error && isPermissionDeniedMessage(trustResult.error.message)) {
    permissionDenied = true;
  }

  const actionContext = normalizeCompanionActionContext({
    companionCenterRaw: companionResult.data,
    trustCenterRaw: trustResult.data,
    approvalsCenterRaw: approvalsResult.data,
    schemaContext: input.schemaContext,
    businessPackContext: input.businessPackContext,
    effectivePermissions: input.effectivePermissions,
    subscriptionStatus: input.subscriptionStatus,
    permissionDenied,
    creativeContext: input.creativeContext,
    mediaContext: input.mediaContext,
    workspaceContext: input.workspaceContext,
    commerceContext: input.commerceContext,
    servicesContext: input.servicesContext,
    supportContext: input.supportContext,
    industryPackContext: input.industryPackContext,
    hostsContext: input.hostsContext,
    hrContext: input.hrContext,
    warehouseContext: input.warehouseContext,
    financeContext: input.financeContext,
  });

  const writeActionsAvailable =
    !permissionDenied && actionContext.registry.enabledActions.length > 0;

  return { actionContext, writeActionsAvailable };
}

export { createEmptyCompanionActionContext };
