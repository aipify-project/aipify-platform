/**
 * Aipify Employee Growth & Career Development Engine helpers (Phase 219).
 * Authoritative enforcement lives in Supabase RPCs (_aegcde_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEmployeeGrowthCareerDevelopmentEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_employee_growth_career_development_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEmployeeGrowthCareerDevelopmentEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_employee_growth_career_development_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEmployeeGrowthCareerDevelopmentEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
