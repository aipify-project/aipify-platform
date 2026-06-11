import { FORBIDDEN_ACTION_TYPES, AEF_ALLOWED_PLANS } from "./dimensions";
import type { AipifyAction, RiskLevel, SafetyResult } from "./types";

const RISK_ORDER: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function validateAipifyActionSafety(
  action: Pick<AipifyAction, "action_type" | "risk_level" | "execution_level" | "status" | "requires_approval">,
  context: {
    plan: string;
    maxRiskLevel?: RiskLevel;
    autonomousEnabled?: boolean;
    allowCriticalReview?: boolean;
  }
): SafetyResult {
  if (!AEF_ALLOWED_PLANS.includes(context.plan as (typeof AEF_ALLOWED_PLANS)[number])) {
    return {
      safe: false,
      blocked: true,
      reason: "Autonomous Execution requires Business or Enterprise plan.",
    };
  }

  if ((FORBIDDEN_ACTION_TYPES as readonly string[]).includes(action.action_type)) {
    return { safe: false, blocked: true, reason: "Forbidden action type." };
  }

  if (action.risk_level === "critical") {
    if (context.plan !== "enterprise" || !context.allowCriticalReview) {
      return { safe: false, blocked: true, reason: "Critical actions blocked by policy." };
    }
  }

  if (context.maxRiskLevel && RISK_ORDER[action.risk_level] > RISK_ORDER[context.maxRiskLevel]) {
    return { safe: false, blocked: true, reason: "Risk level exceeds role limit." };
  }

  if (action.execution_level === "autonomous") {
    if (context.plan !== "enterprise") {
      return { safe: false, blocked: true, reason: "Autonomous execution requires Enterprise." };
    }
    if (!context.autonomousEnabled) {
      return { safe: false, blocked: true, reason: "Autonomous execution is disabled." };
    }
  }

  if (
    action.execution_level !== "observer" &&
    action.requires_approval &&
    !["approved", "scheduled"].includes(action.status)
  ) {
    return { safe: false, blocked: false, reason: "Approval required before execution." };
  }

  return { safe: true, blocked: false, reason: null };
}
