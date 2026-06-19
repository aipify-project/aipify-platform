import type { RpcClient } from "@/lib/core/rpc-client";

export async function getDynamicAppNavigation(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_dynamic_app_navigation");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getDynamicPlatformNavigation(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_dynamic_platform_navigation");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getDynamicSuperAdminNavigation(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_dynamic_super_admin_navigation");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionNavigationContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_navigation_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getVisibleNavigationSearch(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_visible_navigation_search", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getNavigationPreferencesCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_navigation_preferences_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performNavigationPreferenceAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_navigation_preference_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export * from "./build-app-nav";
export { buildDynamicNavigationLabels } from "./labels";
export type { DynamicNavigationLabels } from "./labels";
