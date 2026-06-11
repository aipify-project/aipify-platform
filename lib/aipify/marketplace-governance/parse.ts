import type {
  MarketplaceGovernanceCard,
  MarketplaceGovernanceDashboard,
  MarketplaceGovernanceActionResult,
  MarketplaceGovernanceBriefingResult,
} from "./types";

export function parseMarketplaceGovernanceCard(data: unknown): MarketplaceGovernanceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    governance_score: d.governance_score as number | undefined,
    open_incidents: d.open_incidents as number | undefined,
    open_fraud_alerts: d.open_fraud_alerts as number | undefined,
    philosophy: d.philosophy as string | undefined,
    human_oversight_required: d.human_oversight_required as boolean | undefined,
  };
}

export function parseMarketplaceGovernanceDashboard(data: unknown): MarketplaceGovernanceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: d.human_oversight_required as boolean | undefined,
    automated_actions_enabled: d.automated_actions_enabled as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    governance_score: d.governance_score as number | undefined,
    governance_band: d.governance_band as string | undefined,
    governance_band_label: d.governance_band_label as string | undefined,
    refund_rate_pct: d.refund_rate_pct as number | undefined,
    customer_satisfaction: d.customer_satisfaction as number | undefined,
    support_burden: d.support_burden as number | undefined,
    incident_frequency: d.incident_frequency as number | undefined,
    fraud_risk_score: d.fraud_risk_score as number | undefined,
    supplier_performance: d.supplier_performance as number | undefined,
    governance_scores: Array.isArray(d.governance_scores)
      ? (d.governance_scores as MarketplaceGovernanceDashboard["governance_scores"])
      : [],
    quality_incidents: Array.isArray(d.quality_incidents)
      ? (d.quality_incidents as MarketplaceGovernanceDashboard["quality_incidents"])
      : [],
    fraud_alerts: Array.isArray(d.fraud_alerts)
      ? (d.fraud_alerts as MarketplaceGovernanceDashboard["fraud_alerts"])
      : [],
    supplier_scores: Array.isArray(d.supplier_scores)
      ? (d.supplier_scores as MarketplaceGovernanceDashboard["supplier_scores"])
      : [],
    policy_rules: Array.isArray(d.policy_rules)
      ? (d.policy_rules as MarketplaceGovernanceDashboard["policy_rules"])
      : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as MarketplaceGovernanceDashboard["recommendations"])
      : [],
    root_cause_reports: Array.isArray(d.root_cause_reports)
      ? (d.root_cause_reports as MarketplaceGovernanceDashboard["root_cause_reports"])
      : [],
    pre_publish_controls: Array.isArray(d.pre_publish_controls)
      ? (d.pre_publish_controls as string[])
      : [],
    post_publish_monitoring: Array.isArray(d.post_publish_monitoring)
      ? (d.post_publish_monitoring as string[])
      : [],
    briefings: Array.isArray(d.briefings)
      ? (d.briefings as MarketplaceGovernanceDashboard["briefings"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseMarketplaceGovernanceActionResult(data: unknown): MarketplaceGovernanceActionResult {
  return (data ?? {}) as MarketplaceGovernanceActionResult;
}

export function parseMarketplaceGovernanceBriefingResult(data: unknown): MarketplaceGovernanceBriefingResult {
  return (data ?? {}) as MarketplaceGovernanceBriefingResult;
}
