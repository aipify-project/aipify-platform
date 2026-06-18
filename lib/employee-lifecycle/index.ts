import type { RpcClient } from "@/lib/core/rpc-client";

export async function getEmployeeLifecycleCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_employee_lifecycle_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOnboardingCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_onboarding_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOffboardingCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_offboarding_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performEmployeeLifecycleAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_employee_lifecycle_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionEmployeeLifecycleContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_employee_lifecycle_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyEmployeeLifecycleSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_employee_lifecycle_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildEmployeeLifecycleLabels } from "./labels";
export type { EmployeeLifecycleLabels } from "./labels";
