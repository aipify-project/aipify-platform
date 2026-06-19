import type { RpcClient } from "@/lib/core/rpc-client";
import type { CommandBarSearchResult } from "@/lib/command-bar/types";

export async function getUniversalSearchCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_universal_search_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performUniversalSearchQuery(
  supabase: RpcClient,
  query: string,
  filters: Record<string, unknown> = {},
  mode = "global",
  limit = 40,
) {
  const { data, error } = await supabase.rpc("perform_universal_search_query", {
    p_query: query,
    p_filters: filters,
    p_mode: mode,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performUniversalSearchAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_universal_search_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionUniversalSearchContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_universal_search_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyUniversalSearchSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_universal_search_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

const ENTITY_CATEGORY_LABELS: Record<string, string> = {
  people: "People",
  customer: "Customers",
  partner: "Partners",
  project: "Projects",
  task: "Tasks",
  document: "Documents",
  knowledge: "Knowledge",
  asset: "Assets",
  inventory: "Inventory",
  contract: "Contracts",
  invoice: "Invoices",
  domain: "Domains",
  business_pack: "Business Packs",
  workflow: "Workflows",
  meeting: "Meetings",
  approval: "Approvals",
  report: "Reports",
  notification: "Notifications",
  module: "Modules",
};

export function mapUniversalSearchToCommandBarResults(
  data: Record<string, unknown>,
): CommandBarSearchResult[] {
  const results = data.results;
  if (!Array.isArray(results)) return [];

  return results.slice(0, 12).map((row) => {
    const r = row as Record<string, unknown>;
    const entityType = String(r.entity_type ?? "module");
    const href = String(r.record_href ?? "/app/search");
    const id = String(r.id ?? `${entityType}-${r.entity_id ?? r.title}`);
    return {
      id: `universal-${id}`,
      label: String(r.title ?? ""),
      description: `${ENTITY_CATEGORY_LABELS[entityType] ?? entityType}${r.summary ? ` · ${r.summary}` : ""}`,
      href: href.includes("?") ? href : `${href}${href.includes("/app/search") ? "" : ""}`,
      category: ENTITY_CATEGORY_LABELS[entityType] ?? entityType,
    };
  });
}

export async function searchUniversalForCommandBar(
  supabase: RpcClient,
  query: string,
): Promise<CommandBarSearchResult[]> {
  if (query.trim().length < 2) return [];
  try {
    const data = await performUniversalSearchQuery(supabase, query, {}, "global", 12);
    if (data.found !== true) return [];
    return mapUniversalSearchToCommandBarResults(data);
  } catch {
    return [];
  }
}

export * from "./types";
export * from "./parse";
export { buildUniversalSearchLabels } from "./labels";
export type { UniversalSearchLabels } from "./labels";
