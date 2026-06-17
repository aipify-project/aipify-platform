/**
 * Companion Device & Environment Intelligence Engine — Phase 345.
 */

import type { RpcClient } from "./rpc-client";

export async function getCompanionDeviceEnvironmentCenter(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_device_environment_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionDeviceStorageHealth(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_device_storage_health");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionDeviceProjectLocationHealth(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_device_project_location_health");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionDeviceNetworkStatus(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_device_network_status");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionDeviceEnvironmentRecommendations(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_device_environment_recommendations");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function runCompanionDeviceEnvironmentScan(
  supabase: RpcClient,
  payload: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("run_companion_device_environment_scan", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateCompanionDeviceEnvironmentSettings(
  supabase: RpcClient,
  patch: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_companion_device_environment_settings", {
    p_patch: patch,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
