import type { RpcClient } from "@/lib/core/rpc-client";

export async function getCommunicationManagementCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_communication_management_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getNotificationManagementCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_notification_management_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getActivityFeedCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_activity_feed_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getUnifiedApprovalCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_unified_approval_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performCommunicationManagementAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_communication_management_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchCommunications(supabase: RpcClient, query: string) {
  const { data, error } = await supabase.rpc("search_communications", { p_query: query, p_filters: {} });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionCommunicationContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_communication_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export {
  buildCommunicationManagementLabels,
  buildNotificationManagementLabels,
  buildActivityFeedLabels,
} from "./labels";
export type {
  CommunicationManagementLabels,
  NotificationManagementLabels,
  ActivityFeedLabels,
} from "./labels";
