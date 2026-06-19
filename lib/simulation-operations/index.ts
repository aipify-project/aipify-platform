import type { RpcClient } from "@/lib/core/rpc-client";
import type { CommandBarSearchResult } from "@/lib/command-bar/types";
import { parseSimulationSearchResults } from "./parse";

export async function getSimulationOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_simulation_operations_center", { p_section: section ?? null });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performSimulationOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_simulation_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchSimulationScenarios(supabase: RpcClient, query: string, limit = 20) {
  const { data, error } = await supabase.rpc("search_simulation_scenarios", { p_query: query, p_limit: limit });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionSimulationContext(
  supabase: RpcClient,
  query?: string,
  scenarioId?: string,
) {
  const { data, error } = await supabase.rpc("get_companion_simulation_context", {
    p_query: query ?? null,
    p_scenario_id: scenarioId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMySimulationSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_simulation_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function mapSimulationToCommandBarResults(data: Record<string, unknown>): CommandBarSearchResult[] {
  return parseSimulationSearchResults(data).slice(0, 8).map((s) => ({
    id: `sim-${s.id}`,
    label: s.title,
    description: `${s.simulation_category ?? s.scenario_type}${s.status ? ` · ${s.status}` : ""}`,
    href: "/app/simulation/scenarios",
    category: "Simulation",
  }));
}

export async function searchSimulationForCommandBar(supabase: RpcClient, query: string): Promise<CommandBarSearchResult[]> {
  if (query.trim().length < 2) return [];
  try {
    const data = await searchSimulationScenarios(supabase, query, 8);
    if (data.found !== true) return [];
    return mapSimulationToCommandBarResults(data);
  } catch {
    return [];
  }
}

export * from "./types";
export * from "./parse";
export { buildSimulationOperationsLabels } from "./labels";
export type { SimulationOperationsLabels } from "./labels";
