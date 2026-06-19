import type { RpcClient } from "@/lib/core/rpc-client";
import type { CommandBarSearchResult } from "@/lib/command-bar/types";
import { parseKnowledgeGraphSearchResults } from "./parse";

export async function getKnowledgeGraphCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_knowledge_graph_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performKnowledgeGraphAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_knowledge_graph_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchKnowledgeGraphEntities(supabase: RpcClient, query: string, limit = 20) {
  const { data, error } = await supabase.rpc("search_knowledge_graph_entities", {
    p_query: query,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionKnowledgeGraphContext(
  supabase: RpcClient,
  query?: string,
  entityId?: string,
) {
  const { data, error } = await supabase.rpc("get_companion_knowledge_graph_context", {
    p_query: query ?? null,
    p_entity_id: entityId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyKnowledgeGraphSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_knowledge_graph_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function mapKnowledgeGraphToCommandBarResults(data: Record<string, unknown>): CommandBarSearchResult[] {
  return parseKnowledgeGraphSearchResults(data).slice(0, 8).map((entity) => ({
    id: `kgraph-${entity.id}`,
    label: entity.title,
    description: `${entity.entity_type.replace(/_/g, " ")}${entity.summary ? ` · ${entity.summary}` : ""}${entity.connection_count ? ` · ${entity.connection_count} connections` : ""}`,
    href: entity.record_href ?? "/app/knowledge-graph",
    category: "Knowledge Graph",
  }));
}

export async function searchKnowledgeGraphForCommandBar(
  supabase: RpcClient,
  query: string,
): Promise<CommandBarSearchResult[]> {
  if (query.trim().length < 2) return [];
  try {
    const data = await searchKnowledgeGraphEntities(supabase, query, 8);
    if (data.found !== true) return [];
    return mapKnowledgeGraphToCommandBarResults(data);
  } catch {
    return [];
  }
}

export * from "./types";
export * from "./parse";
export { buildKnowledgeGraphLabels } from "./labels";
export type { KnowledgeGraphLabels } from "./labels";
