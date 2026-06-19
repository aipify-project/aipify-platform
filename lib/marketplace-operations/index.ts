import type { RpcClient } from "@/lib/core/rpc-client";
import type { CommandBarSearchResult } from "@/lib/command-bar/types";
import { parseMarketplaceSearchResults } from "./parse";

export async function getMarketplaceOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_marketplace_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performMarketplaceOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_marketplace_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchMarketplacePacks(supabase: RpcClient, query: string, limit = 20) {
  const { data, error } = await supabase.rpc("search_marketplace_packs", {
    p_query: query,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionMarketplaceContext(
  supabase: RpcClient,
  query?: string,
  packKey?: string,
) {
  const { data, error } = await supabase.rpc("get_companion_marketplace_context", {
    p_query: query ?? null,
    p_pack_key: packKey ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyMarketplaceSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_marketplace_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function mapMarketplaceToCommandBarResults(data: Record<string, unknown>): CommandBarSearchResult[] {
  return parseMarketplaceSearchResults(data).slice(0, 8).map((pack) => ({
    id: `mkt-${pack.pack_key}`,
    label: pack.pack_name,
    description: `${pack.category ?? "pack"}${pack.status ? ` · ${pack.status.replace(/_/g, " ")}` : ""}${pack.starting_price_monthly ? ` · from ${pack.starting_price_monthly}/mo` : ""}`,
    href: pack.detail_href ?? `/app/marketplace/packs/${pack.pack_key}`,
    category: "Marketplace",
  }));
}

export async function searchMarketplaceForCommandBar(
  supabase: RpcClient,
  query: string,
): Promise<CommandBarSearchResult[]> {
  if (query.trim().length < 2) return [];
  try {
    const data = await searchMarketplacePacks(supabase, query, 8);
    if (data.found !== true) return [];
    return mapMarketplaceToCommandBarResults(data);
  } catch {
    return [];
  }
}

export * from "./types";
export * from "./parse";
export { buildMarketplaceOperationsLabels } from "./labels";
export type { MarketplaceOperationsLabels } from "./labels";
