/**
 * Partner Settlement & Self-Billing Engine — Phase 334.
 */

import type { RpcClient } from "./rpc-client";

export async function getPartnerSettlements(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_settlements");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerSettlementsHistory(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_settlements_history");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerSettlement(
  supabase: RpcClient,
  settlementId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_settlement", {
    p_settlement_id: settlementId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function preparePartnerMonthlySettlement(
  supabase: RpcClient,
  period?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("prepare_partner_monthly_settlement", {
    p_period: period ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function acceptPartnerSelfBillingAgreement(
  supabase: RpcClient,
  statement?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("accept_partner_self_billing_agreement", {
    p_statement: statement ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function approvePartnerSettlement(
  supabase: RpcClient,
  settlementId: string,
  approvalStatement: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("approve_partner_settlement", {
    p_settlement_id: settlementId,
    p_approval_statement: approvalStatement,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
