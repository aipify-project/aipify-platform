/**
 * Organizational Resilience Engine helpers (Phase A.50).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const RESILIENCE_SCENARIO_TYPES = [
  "critical_employee_absence",
  "support_backlog",
  "supplier_disruption",
  "integration_failure",
  "operational_incident",
  "rapid_growth",
] as const;

export type ResilienceScenarioType = (typeof RESILIENCE_SCENARIO_TYPES)[number];

export const RESILIENCE_PLAN_STATUSES = [
  "draft",
  "active",
  "under_review",
  "archived",
] as const;

export type ResiliencePlanStatus = (typeof RESILIENCE_PLAN_STATUSES)[number];

export const RESILIENCE_REVIEW_FREQUENCIES = [
  "monthly",
  "quarterly",
  "semi_annual",
  "annual",
] as const;

export type ResilienceReviewFrequency = (typeof RESILIENCE_REVIEW_FREQUENCIES)[number];

export const RESILIENCE_SIMULATION_TYPES = [
  "tabletop",
  "walkthrough",
  "recovery_review",
  "lessons_learned",
] as const;

export type ResilienceSimulationType = (typeof RESILIENCE_SIMULATION_TYPES)[number];

export const RESILIENCE_VULNERABILITY_SEVERITIES = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export type ResilienceVulnerabilitySeverity = (typeof RESILIENCE_VULNERABILITY_SEVERITIES)[number];

export async function getOrganizationalResilienceEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_resilience_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOrganizationalResilienceEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_resilience_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getResilienceExecutiveSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_resilience_executive_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createOrganizationalResilienceAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
