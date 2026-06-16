/**
 * Growth Partner Portal — Foundation 05.
 */

import type { RpcClient } from "./rpc-client";

export async function getGrowthPartnerPortalDashboard(
  supabase: RpcClient,
  section = "dashboard",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_growth_partner_portal_dashboard", {
    p_section: section,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getGrowthPartnerPortalCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_growth_partner_portal_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performGrowthPartnerPortalAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    entityId?: string | null;
    status?: string | null;
    email?: string | null;
    name?: string | null;
    role?: string | null;
    notes?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_growth_partner_portal_action", {
    p_action_type: params.actionType,
    p_entity_id: params.entityId ?? null,
    p_status: params.status ?? null,
    p_email: params.email ?? null,
    p_name: params.name ?? null,
    p_role: params.role ?? null,
    p_notes: params.notes ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function checkGrowthPartnerPortalAccess(
  supabase: RpcClient,
): Promise<boolean> {
  const card = await getGrowthPartnerPortalCard(supabase);
  return Boolean(card.has_access);
}
