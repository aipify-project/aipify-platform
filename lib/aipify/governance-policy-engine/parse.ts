import type { GovernancePolicyEngineCard, GovernancePolicyEngineDashboard } from "./types";

export function parseGovernancePolicyEngineCard(data: unknown): GovernancePolicyEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_policies: Number(d.active_policies ?? 0),
    open_violations: Number(d.open_violations ?? 0),
    pending_approvals: Number(d.pending_approvals ?? 0),
    upcoming_reviews: Number(d.upcoming_reviews ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseGovernancePolicyEngineDashboard(
  data: unknown
): GovernancePolicyEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as GovernancePolicyEngineDashboard["settings"])
        : undefined,
    active_policies: Array.isArray(d.active_policies)
      ? (d.active_policies as GovernancePolicyEngineDashboard["active_policies"])
      : [],
    policy_violations: Array.isArray(d.policy_violations)
      ? (d.policy_violations as GovernancePolicyEngineDashboard["policy_violations"])
      : [],
    upcoming_reviews: Array.isArray(d.upcoming_reviews)
      ? (d.upcoming_reviews as GovernancePolicyEngineDashboard["upcoming_reviews"])
      : [],
    pending_approvals: Array.isArray(d.pending_approvals)
      ? (d.pending_approvals as GovernancePolicyEngineDashboard["pending_approvals"])
      : [],
    pending_approval_count: Number(d.pending_approval_count ?? 0),
    approval_requirements:
      typeof d.approval_requirements === "object" && d.approval_requirements
        ? (d.approval_requirements as GovernancePolicyEngineDashboard["approval_requirements"])
        : undefined,
    governance_recommendations: Array.isArray(d.governance_recommendations)
      ? (d.governance_recommendations as GovernancePolicyEngineDashboard["governance_recommendations"])
      : undefined,
    policy_categories: Array.isArray(d.policy_categories)
      ? (d.policy_categories as GovernancePolicyEngineDashboard["policy_categories"])
      : undefined,
    autonomy_levels: Array.isArray(d.autonomy_levels)
      ? (d.autonomy_levels as GovernancePolicyEngineDashboard["autonomy_levels"])
      : undefined,
    integrates_with: Array.isArray(d.integrates_with)
      ? (d.integrates_with as string[])
      : undefined,
  };
}
