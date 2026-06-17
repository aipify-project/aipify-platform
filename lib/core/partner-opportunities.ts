/**
 * Partner Opportunity Center — Phase 337.
 */

import type { RpcClient } from "./rpc-client";
import type { PartnerOpportunitiesFilters } from "@/lib/partner-opportunities/types";

export async function getPartnerOpportunities(
  supabase: RpcClient,
  filters: PartnerOpportunitiesFilters = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_opportunities", {
    p_stage: filters.stage ?? null,
    p_country: filters.country ?? null,
    p_industry: filters.industry ?? null,
    p_value_min: filters.value_min ?? null,
    p_owner: filters.owner ?? null,
    p_status: filters.status ?? null,
    p_search: filters.search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerOpportunity(
  supabase: RpcClient,
  opportunityId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_opportunity", {
    p_opportunity_id: opportunityId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerOpportunitiesPipeline(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_opportunities_pipeline");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerOpportunitiesForecast(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_opportunities_forecast");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createPartnerOpportunity(
  supabase: RpcClient,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_partner_opportunity", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updatePartnerOpportunity(
  supabase: RpcClient,
  opportunityId: string,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_partner_opportunity", {
    p_opportunity_id: opportunityId,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
