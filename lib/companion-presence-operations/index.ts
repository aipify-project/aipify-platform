import type { RpcClient } from "@/lib/core/rpc-client";
import type { CommandBarSearchResult } from "@/lib/command-bar/types";
import { parseCompanionPresenceSearchResults } from "./parse";

export async function getCompanionPresenceOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_companion_presence_operations_center", { p_section: section ?? null });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performCompanionPresenceOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_companion_presence_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchCompanionPresenceDevices(supabase: RpcClient, query: string, limit = 20) {
  const { data, error } = await supabase.rpc("search_companion_presence_devices", { p_query: query, p_limit: limit });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionPresenceContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_presence_context", { p_query: query ?? null });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyCompanionPresenceSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_companion_presence_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function mapCompanionPresenceToCommandBarResults(data: Record<string, unknown>): CommandBarSearchResult[] {
  return parseCompanionPresenceSearchResults(data).slice(0, 8).map((d) => ({
    id: `cp-${d.id}`,
    label: d.device_label,
    description: `${d.device_type ?? "device"} · ${d.platform ?? ""}${d.device_status ? ` · ${d.device_status}` : ""}`,
    href: "/app/companion/devices",
    category: "Companion",
  }));
}

export async function searchCompanionPresenceForCommandBar(supabase: RpcClient, query: string): Promise<CommandBarSearchResult[]> {
  if (query.trim().length < 2) return [];
  try {
    const data = await searchCompanionPresenceDevices(supabase, query, 8);
    if (data.found !== true) return [];
    return mapCompanionPresenceToCommandBarResults(data);
  } catch {
    return [];
  }
}

export * from "./types";
export * from "./parse";
export { buildCompanionPresenceOperationsLabels } from "./labels";
export type { CompanionPresenceOperationsLabels } from "./labels";
