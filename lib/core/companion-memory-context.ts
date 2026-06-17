/**
 * Companion Memory & Context Engine — Phase 343.
 */

import type { RpcClient } from "./rpc-client";

export async function getCompanionUserMemory(
  supabase: RpcClient,
  search?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_user_memory", {
    p_search: search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createCompanionUserMemory(
  supabase: RpcClient,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_companion_user_memory", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateCompanionUserMemory(
  supabase: RpcClient,
  memoryId: string,
  patch: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_companion_user_memory", {
    p_memory_id: memoryId,
    p_patch: patch,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function deleteCompanionUserMemory(
  supabase: RpcClient,
  memoryId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("delete_companion_user_memory", {
    p_memory_id: memoryId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function exportCompanionUserMemory(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("export_companion_user_memory");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionUserContext(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_user_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateCompanionUserMemorySettings(
  supabase: RpcClient,
  patch: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_companion_user_memory_settings", {
    p_patch: patch,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionProjectRelationships(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_project_relationships");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
