/**
 * Companion Workspace Intelligence Engine — Phase 344.
 */

import type { RpcClient } from "./rpc-client";

export async function getCompanionWorkspaceCenter(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_workspace_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionWorkspaceProjects(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_workspace_projects");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionWorkspaceInsights(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_workspace_insights");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionWorkspaceRelationships(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_workspace_relationships");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function saveCompanionWorkspaceWorkflow(
  supabase: RpcClient,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("save_companion_workspace_workflow", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchCompanionWorkspace(
  supabase: RpcClient,
  query: string,
  limit = 25,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("search_companion_workspace", {
    p_query: query,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateCompanionWorkspaceSettings(
  supabase: RpcClient,
  patch: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_companion_workspace_settings", {
    p_patch: patch,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
