import type { RpcClient } from "@/lib/core/rpc-client";
import type { CommandBarSearchResult } from "@/lib/command-bar/types";
import { parseOrganizationSearchResults } from "./parse";

export async function getOrganizationOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_organization_operating_system_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performOrganizationOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {}
) {
  const { data, error } = await supabase.rpc("perform_organization_operating_system_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchOrganizationOperatingSystem(
  supabase: RpcClient,
  query: string,
  limit = 20
) {
  const { data, error } = await supabase.rpc("search_organization_operating_system", {
    p_query: query,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionOrganizationAdvisorContext(
  supabase: RpcClient,
  query?: string
) {
  const { data, error } = await supabase.rpc("get_companion_organization_advisor_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyOrganizationSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_organization_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function mapOrganizationToCommandBarResults(
  data: Record<string, unknown>
): CommandBarSearchResult[] {
  return parseOrganizationSearchResults(data)
    .slice(0, 8)
    .map((r) => ({
      id: `org-${String(r.id ?? r.title)}`,
      label: String(r.title ?? ""),
      description: String(r.subtitle ?? "Organization"),
      href: "/app/organization",
      category: "Organization",
    }));
}

export async function searchOrganizationForCommandBar(
  supabase: RpcClient,
  query: string
): Promise<CommandBarSearchResult[]> {
  if (query.trim().length < 2) return [];
  try {
    const data = await searchOrganizationOperatingSystem(supabase, query, 8);
    if (data.found !== true) return [];
    return mapOrganizationToCommandBarResults(data);
  } catch {
    return [];
  }
}
