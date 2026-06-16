/**
 * Aipify Hosts — Maintenance Center (Phase Airbnb 33).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsMaintenanceCenterDashboard(
  supabase: RpcClient,
  section = "open_work_orders",
  filters?: { propertyId?: string | null; status?: string | null },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_maintenance_center_dashboard", {
    p_section: section,
    p_property_id: filters?.propertyId ?? null,
    p_status: filters?.status ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsMaintenanceCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_maintenance_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsMaintenanceAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    workOrderId?: string | null;
    contractorId?: string | null;
    priority?: string | null;
    scheduledAt?: string | null;
    notes?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_maintenance_action", {
    p_action_type: params.actionType,
    p_work_order_id: params.workOrderId ?? null,
    p_contractor_id: params.contractorId ?? null,
    p_priority: params.priority ?? null,
    p_scheduled_at: params.scheduledAt ?? null,
    p_notes: params.notes ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
