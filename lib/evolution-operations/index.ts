import type { RpcClient } from "@/lib/core/rpc-client";
import type { CommandBarSearchResult } from "@/lib/command-bar/types";
import { parseEvolutionSearchResults } from "./parse";

export async function getEvolutionOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_evolution_operations_center", { p_section: section ?? null });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performEvolutionOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_evolution_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchEvolutionRecommendations(supabase: RpcClient, query: string, limit = 20) {
  const { data, error } = await supabase.rpc("search_evolution_recommendations", { p_query: query, p_limit: limit });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionEvolutionContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_evolution_context", { p_query: query ?? null });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyEvolutionSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_evolution_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function mapEvolutionToCommandBarResults(data: Record<string, unknown>): CommandBarSearchResult[] {
  return parseEvolutionSearchResults(data).slice(0, 8).map((r) => ({
    id: `evo-${r.id}`,
    label: r.title,
    description: `${r.recommendation_type ?? "recommendation"}${r.department ? ` · ${r.department}` : ""}`,
    href: "/app/evolution",
    category: "Evolution",
  }));
}

export async function searchEvolutionForCommandBar(supabase: RpcClient, query: string): Promise<CommandBarSearchResult[]> {
  if (query.trim().length < 2) return [];
  try {
    const data = await searchEvolutionRecommendations(supabase, query, 8);
    if (data.found !== true) return [];
    return mapEvolutionToCommandBarResults(data);
  } catch {
    return [];
  }
}

export * from "./types";
export * from "./parse";
export { buildEvolutionOperationsLabels } from "./labels";
export type { EvolutionOperationsLabels } from "./labels";
