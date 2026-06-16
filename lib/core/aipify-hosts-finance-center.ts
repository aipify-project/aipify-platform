/**
 * Aipify Hosts — Finance Center (Phase Airbnb 19).
 * Authoritative enforcement lives in Supabase RPCs (_ahostfin_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsFinanceCenterDashboard(
  supabase: RpcClient,
  section = "overview",
  filter = "all_properties",
  propertyId?: string | null,
  revenueStatus?: string | null,
  expenseCategory?: string | null,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_finance_center_dashboard", {
    p_section: section,
    p_filter: filter,
    p_property_id: propertyId ?? null,
    p_revenue_status: revenueStatus ?? null,
    p_expense_category: expenseCategory ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsFinanceCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_finance_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function recordAipifyHostsExpense(
  supabase: RpcClient,
  category: string,
  amount: number,
  propertyId?: string | null,
  expenseDate?: string | null,
  notes?: string | null,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_aipify_hosts_expense", {
    p_category: category,
    p_amount: amount,
    p_property_id: propertyId ?? null,
    p_expense_date: expenseDate ?? null,
    p_notes: notes ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function exportAipifyHostsFinanceReport(
  supabase: RpcClient,
  reportKey: string,
  format = "pdf",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("export_aipify_hosts_finance_report", {
    p_report_key: reportKey,
    p_format: format,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
