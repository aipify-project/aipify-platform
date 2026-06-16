/**
 * Aipify Hosts — Marketplace & Service Network (Phase Airbnb 09).
 * Authoritative enforcement lives in Supabase RPCs (_ahostmkt_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsMarketplaceDashboard(
  supabase: RpcClient,
  params?: { category?: string; query?: string },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_marketplace_dashboard", {
    p_category: params?.category ?? null,
    p_query: params?.query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsMarketplaceCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_marketplace_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function toggleAipifyHostsMarketplaceFavorite(
  supabase: RpcClient,
  providerId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("toggle_aipify_hosts_marketplace_favorite", {
    p_provider_id: providerId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsMarketplaceRequest(
  supabase: RpcClient,
  params: {
    provider_id: string;
    service_category: string;
    summary: string;
    property_id?: string;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_marketplace_request", {
    p_provider_id: params.provider_id,
    p_service_category: params.service_category,
    p_summary: params.summary,
    p_property_id: params.property_id ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsMarketplaceRequestStatus(
  supabase: RpcClient,
  params: {
    request_id: string;
    status: string;
    scheduled_at?: string;
    completion_evidence?: unknown;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_marketplace_request_status", {
    p_request_id: params.request_id,
    p_status: params.status,
    p_scheduled_at: params.scheduled_at ?? null,
    p_completion_evidence: params.completion_evidence ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
