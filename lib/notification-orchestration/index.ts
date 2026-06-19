import type { RpcClient } from "@/lib/core/rpc-client";

export async function getNotificationOrchestrationCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_notification_orchestration_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performNotificationOrchestrationAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_notification_orchestration_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionNotificationOrchestrationContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_notification_orchestration_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyNotificationOrchestrationSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_notification_orchestration_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildNotificationOrchestrationLabels } from "./labels";
export type { NotificationOrchestrationLabels } from "./labels";
