/**
 * Growth Partner Portal — Phase 331 foundation.
 */

import type { RpcClient } from "./rpc-client";

export async function getPartnerPortalProfile(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_portal_profile");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerPortalDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_portal_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerPortalTeam(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_portal_team");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerPortalActivity(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_portal_activity");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updatePartnerPortalProfile(
  supabase: RpcClient,
  patch: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_partner_portal_profile", {
    p_patch: patch,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function advancePartnerPortalOnboarding(
  supabase: RpcClient,
  step?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("advance_partner_portal_onboarding", {
    p_step: step ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getGrowthPartnerPortalSectionData(
  supabase: RpcClient,
  section: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_growth_partner_portal_dashboard", {
    p_section: section,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
