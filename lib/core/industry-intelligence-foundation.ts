/**
 * Industry Intelligence Foundation helpers (Phase A.44).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getIndustryIntelligenceFoundationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_industry_intelligence_foundation_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getIndustryIntelligenceFoundationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_industry_intelligence_foundation_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function assignOrganizationIndustryProfile(supabase: RpcClient, industryKey: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("assign_organization_industry_profile", { p_industry_key: industryKey });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function overrideIndustryInsight(
  supabase: RpcClient,
  insightId: string,
  overrideRecommendation: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("override_industry_insight", {
    p_insight_id: insightId,
    p_override_recommendation: overrideRecommendation,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function disableOrganizationIndustryInsights(supabase: RpcClient, disabled = true): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("disable_organization_industry_insights", { p_disabled: disabled });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function customizeOrganizationIndustrySettings(
  supabase: RpcClient,
  settings: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("customize_organization_industry_settings", { p_settings: settings });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function exportOrganizationIndustryInsights(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("export_organization_industry_insights");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createIndustryIntelligenceFoundationAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
