import type { RpcClient } from "@/lib/core/rpc-client";
import type { CommandBarSearchResult } from "@/lib/command-bar/types";
import { parseActivitySearchResult } from "./parse";

export async function getActivityOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_activity_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performActivityOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_activity_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchActivityOperations(supabase: RpcClient, query: string, limit = 20) {
  const { data, error } = await supabase.rpc("search_activity_operations", {
    p_query: query,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionActivityOperationsContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_activity_operations_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyActivityOperationsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_activity_operations_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

const PRIORITY_LABELS: Record<string, string> = {
  information: "Information",
  attention_required: "Attention",
  critical: "Critical",
  security: "Security",
  completed: "Completed",
  pending: "Pending",
};

export function mapActivitySearchToCommandBarResults(data: Record<string, unknown>): CommandBarSearchResult[] {
  const events = parseActivitySearchResult(data);
  return events.slice(0, 10).map((event) => ({
    id: `activity-${event.id}`,
    label: event.title,
    description: `${PRIORITY_LABELS[event.priority] ?? event.priority}${event.summary ? ` · ${event.summary}` : ""}`,
    href: event.record_href ?? "/app/activity",
    category: "Activity",
  }));
}

export async function searchActivityForCommandBar(
  supabase: RpcClient,
  query: string,
): Promise<CommandBarSearchResult[]> {
  if (query.trim().length < 2) return [];
  try {
    const data = await searchActivityOperations(supabase, query, 10);
    if (data.found !== true) return [];
    return mapActivitySearchToCommandBarResults(data);
  } catch {
    return [];
  }
}

export * from "./types";
export * from "./parse";
export { buildActivityOperationsLabels } from "./labels";
export type { ActivityOperationsLabels } from "./labels";
