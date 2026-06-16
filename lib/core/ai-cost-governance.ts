/**
 * AI Cost Governance Engine helpers (Phase A.74).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const AI_TASK_TIERS = ["cost_efficient", "standard", "high_accuracy"] as const;
export type AiTaskTier = (typeof AI_TASK_TIERS)[number];

export const AI_USAGE_STATUSES = [
  "completed",
  "failed",
  "cancelled",
  "blocked_by_budget",
  "blocked_by_policy",
] as const;
export type AiUsageStatus = (typeof AI_USAGE_STATUSES)[number];

export const AI_BUDGET_SCOPE_TYPES = [
  "organization",
  "module",
  "user",
  "workflow",
  "api_key",
  "integration",
] as const;
export type AiBudgetScopeType = (typeof AI_BUDGET_SCOPE_TYPES)[number];

export const AI_BUDGET_PERIODS = ["daily", "weekly", "monthly", "quarterly", "annual"] as const;
export type AiBudgetPeriod = (typeof AI_BUDGET_PERIODS)[number];

export const AI_BUDGET_STATUSES = ["active", "paused", "exceeded", "archived"] as const;
export type AiBudgetStatus = (typeof AI_BUDGET_STATUSES)[number];

export const AI_BUDGET_ALERT_LEVELS = ["50", "75", "90", "hard_limit", "spike"] as const;
export type AiBudgetAlertLevel = (typeof AI_BUDGET_ALERT_LEVELS)[number];

export const AI_BUDGET_CAPACITY_STATUSES = ["allowed", "warn", "blocked"] as const;
export type AiBudgetCapacityStatus = (typeof AI_BUDGET_CAPACITY_STATUSES)[number];

/** Map internal model name to customer-facing task tier — never expose provider brands. */
export function modelToTaskTier(modelName: string): AiTaskTier {
  const m = modelName.toLowerCase();
  if (m.includes("mini") || m.includes("haiku") || m.includes("flash") || m.includes("lite") || m.includes("efficient")) {
    return "cost_efficient";
  }
  if (m.includes("opus") || m.includes("pro") || m.includes("ultra") || m.includes("accurate")) {
    return "high_accuracy";
  }
  return "standard";
}

export async function getAiCostGovernanceEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_ai_cost_governance_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAiCostGovernanceEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_ai_cost_governance_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveAiCostSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_ai_cost_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function checkAiBudgetCapacity(
  supabase: RpcClient,
  moduleKey: string,
  estimatedCost: number
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("check_ai_budget_capacity", {
    p_module_key: moduleKey,
    p_estimated_cost: estimatedCost,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAiCostGovernanceAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
