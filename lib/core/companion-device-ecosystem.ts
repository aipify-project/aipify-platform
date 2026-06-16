/**
 * Companion Device Ecosystem Engine helpers (Phase A.96).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const COMPANION_DEVICE_ECOSYSTEM_PERMISSION_KEYS = [
  "companion_device_ecosystem.view",
  "companion_device_ecosystem.manage",
] as const;
export type CompanionDeviceEcosystemPermissionKey =
  (typeof COMPANION_DEVICE_ECOSYSTEM_PERMISSION_KEYS)[number];

export const COMPANION_DEVICE_ECOSYSTEM_MODULE_KEY = "companion_device_ecosystem_engine" as const;

export const DEVICE_ROADMAP_STATUSES = ["active", "mobile_ready", "scaffold", "future"] as const;
export type DeviceRoadmapStatus = (typeof DEVICE_ROADMAP_STATUSES)[number];

export async function getCompanionDeviceEcosystemDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_device_ecosystem_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionDeviceEcosystemCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_device_ecosystem_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCompanionDeviceEcosystemAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
