import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createEmptyCompanionActionContext,
  normalizeCompanionActionContext,
  type CompanionActionContext,
} from "./companion-action-context";
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
  });

  const writeActionsAvailable =
    !permissionDenied && actionContext.registry.enabledActions.length > 0;

  return { actionContext, writeActionsAvailable };
}

export { createEmptyCompanionActionContext };
