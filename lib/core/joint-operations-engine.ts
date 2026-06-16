/**
 * Joint Operations Engine helpers (Phase 143).
 * Authoritative enforcement lives in Supabase RPCs (_cojo_*).
 */

import type { RpcClient } from "./rpc-client";

export const JOINT_OPERATIONS_PARTNER_TYPES = [
  "growth_partner",
  "organization",
  "consultant",
  "supplier",
  "advisory",
] as const;
export type JointOperationsPartnerType = (typeof JOINT_OPERATIONS_PARTNER_TYPES)[number];

export const JOINT_OPERATIONS_GOVERNANCE_TIERS = ["standard", "elevated", "executive"] as const;
export type JointOperationsGovernanceTier = (typeof JOINT_OPERATIONS_GOVERNANCE_TIERS)[number];

export const JOINT_OPERATIONS_PARTNERSHIP_STATUSES = [
  "pending",
  "proposed",
  "active",
  "paused",
  "ended",
  "rejected",
] as const;
export type JointOperationsPartnershipStatus = (typeof JOINT_OPERATIONS_PARTNERSHIP_STATUSES)[number];

export const JOINT_OPERATIONS_WORKSPACE_STATUSES = [
  "draft",
  "pending_approval",
  "active",
  "paused",
  "archived",
] as const;
export type JointOperationsWorkspaceStatus = (typeof JOINT_OPERATIONS_WORKSPACE_STATUSES)[number];

export async function getJointOperationsEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_joint_operations_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getJointOperationsEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_joint_operations_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createJointOperationsAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
