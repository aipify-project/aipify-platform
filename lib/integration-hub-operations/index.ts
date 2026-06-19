import type { RpcClient } from "@/lib/core/rpc-client";
import type { CommandBarSearchResult } from "@/lib/command-bar/types";
import { parseIntegrationHubSearchResults } from "./parse";

export async function getIntegrationHubCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_integration_hub_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performIntegrationHubAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_integration_hub_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchIntegrationHubConnectors(supabase: RpcClient, query: string, limit = 20) {
  const { data, error } = await supabase.rpc("search_integration_hub_connectors", {
    p_query: query,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionIntegrationHubContext(
  supabase: RpcClient,
  query?: string,
  connectorId?: string,
) {
  const { data, error } = await supabase.rpc("get_companion_integration_hub_context", {
    p_query: query ?? null,
    p_connector_id: connectorId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyIntegrationHubSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_integration_hub_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function mapIntegrationHubToCommandBarResults(data: Record<string, unknown>): CommandBarSearchResult[] {
  return parseIntegrationHubSearchResults(data).slice(0, 8).map((connector) => ({
    id: `inthub-${connector.id}`,
    label: connector.connector_name,
    description: `${connector.provider ?? connector.category ?? "connector"}${connector.status ? ` · ${connector.status.replace(/_/g, " ")}` : ""}${connector.health_status ? ` · ${connector.health_status}` : ""}`,
    href: connector.record_href ?? "/app/integrations",
    category: "Integrations",
  }));
}

export async function searchIntegrationHubForCommandBar(
  supabase: RpcClient,
  query: string,
): Promise<CommandBarSearchResult[]> {
  if (query.trim().length < 2) return [];
  try {
    const data = await searchIntegrationHubConnectors(supabase, query, 8);
    if (data.found !== true) return [];
    return mapIntegrationHubToCommandBarResults(data);
  } catch {
    return [];
  }
}

export * from "./types";
export * from "./parse";
export { buildIntegrationHubLabels } from "./labels";
export type { IntegrationHubLabels } from "./labels";
