import type { RpcClient } from "@/lib/core/rpc-client";
import type { CommandBarSearchResult } from "@/lib/command-bar/types";
import { parseExecutionSearchResults } from "./parse";

export async function getExecutionOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_execution_operations_center", { p_section: section ?? null });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performExecutionOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_execution_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchExecutionActions(supabase: RpcClient, query: string, limit = 20) {
  const { data, error } = await supabase.rpc("search_execution_actions", { p_query: query, p_limit: limit });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionExecutionContext(
  supabase: RpcClient,
  query?: string,
  requestId?: string,
) {
  const { data, error } = await supabase.rpc("get_companion_execution_context", {
    p_query: query ?? null,
    p_request_id: requestId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyExecutionSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_execution_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function mapExecutionToCommandBarResults(data: Record<string, unknown>): CommandBarSearchResult[] {
  return parseExecutionSearchResults(data).slice(0, 8).map((a) => ({
    id: `exec-${a.id}`,
    label: a.title,
    description: `${a.action_category ?? a.action_type}${a.risk_level ? ` · ${a.risk_level}` : ""}`,
    href: "/app/execution/actions",
    category: "Execution",
  }));
}

export async function searchExecutionForCommandBar(supabase: RpcClient, query: string): Promise<CommandBarSearchResult[]> {
  if (query.trim().length < 2) return [];
  try {
    const data = await searchExecutionActions(supabase, query, 8);
    if (data.found !== true) return [];
    return mapExecutionToCommandBarResults(data);
  } catch {
    return [];
  }
}

export * from "./types";
export * from "./parse";
export { buildExecutionOperationsLabels } from "./labels";
export type { ExecutionOperationsLabels } from "./labels";
