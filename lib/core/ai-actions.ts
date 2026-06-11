/**
 * Secure AI Action helpers (Phase A.3).
 * Authoritative enforcement lives in Supabase RPCs (_sae_*).
 */

import { type RiskLevel, requiresHumanApproval } from "./risk";

export const AI_ACTION_CATEGORIES = [
  "support",
  "knowledge",
  "tasks",
  "notifications",
  "integrations",
  "users",
  "settings",
  "commerce",
  "moderation",
] as const;

export type AiActionCategory = (typeof AI_ACTION_CATEGORIES)[number];

export const AI_ACTION_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "executed",
  "failed",
  "cancelled",
] as const;

export type AiActionStatus = (typeof AI_ACTION_STATUSES)[number];

export type AiActionRecommendation = {
  summary?: string;
  reason?: string;
  expected_impact?: string;
  required_approvals?: string;
  rollback_considerations?: string;
};

const LOW_RISK_PATTERNS = [/faq/i, /summary/i, /draft/i, /recommend/i];
const HIGH_RISK_PATTERNS = [/role/i, /billing/i, /suspend/i, /remove/i, /delete/i, /destructive/i];

/** Client-side risk preview — server `_sae_classify_risk` is authoritative. */
export function classifyRisk(actionKey: string, defaultRisk: RiskLevel = "medium"): RiskLevel {
  if (LOW_RISK_PATTERNS.some((p) => p.test(actionKey))) return "low";
  if (HIGH_RISK_PATTERNS.some((p) => p.test(actionKey))) return "high";
  return defaultRisk;
}

export function requiresApproval(
  riskLevel: RiskLevel,
  actionRequiresApproval = true
): boolean {
  if (riskLevel === "low" && !actionRequiresApproval) return false;
  if (actionRequiresApproval && (riskLevel === "medium" || riskLevel === "high")) return true;
  return riskLevel !== "low";
}

export function canApproveAiRisk(
  role: string,
  riskLevel: RiskLevel
): boolean {
  switch (riskLevel) {
    case "low":
    case "medium":
      return ["owner", "administrator", "manager"].includes(role);
    case "high":
    case "critical":
      return ["owner", "administrator"].includes(role);
    default:
      return false;
  }
}

export function suggestActionPayload(
  actionKey: string,
  payload: Record<string, unknown> = {},
  recommendation: AiActionRecommendation = {}
): { action_key: string; payload: Record<string, unknown>; recommendation: AiActionRecommendation } {
  const risk = classifyRisk(actionKey);
  return {
    action_key: actionKey,
    payload,
    recommendation: {
      summary: recommendation.summary ?? `Suggested action: ${actionKey.replace(/_/g, " ")}`,
      reason: recommendation.reason ?? "AI identified an operational opportunity",
      expected_impact: recommendation.expected_impact ?? "Improved operational efficiency",
      required_approvals:
        recommendation.required_approvals ??
        (risk === "low"
          ? "none"
          : risk === "medium"
            ? "manager_or_administrator"
            : "owner_or_administrator"),
      rollback_considerations:
        recommendation.rollback_considerations ??
        (requiresHumanApproval(risk) ? "Manual review required" : "N/A"),
    },
  };
}

export function recordOutcomeStatus(status: AiActionStatus): "success" | "failure" | "pending" {
  if (status === "executed") return "success";
  if (status === "failed" || status === "rejected" || status === "cancelled") return "failure";
  return "pending";
}
