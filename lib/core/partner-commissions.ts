/**
 * Partner Commission Engine — Phase 333.
 */

import type { RpcClient } from "./rpc-client";
import type { PartnerCommissionsFilters } from "@/lib/partner-commissions/types";

export async function getPartnerCommissions(
  supabase: RpcClient,
  filters: PartnerCommissionsFilters = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_commissions", {
    p_customer: filters.customer ?? null,
    p_package: filters.package ?? null,
    p_status: filters.status ?? null,
    p_tier: filters.tier ?? null,
    p_date_from: filters.date_from ?? null,
    p_date_to: filters.date_to ?? null,
    p_amount_min: filters.amount_min ?? null,
    p_search: filters.search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerCommissionsSummary(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_commissions_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerCommissionsMilestones(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_commissions_milestones");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerCommissionsForecast(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_commissions_forecast");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function recalculatePartnerCommissions(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("recalculate_partner_commissions");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
