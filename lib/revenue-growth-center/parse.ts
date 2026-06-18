import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  AuditItem,
  BusinessPackExpansion,
  ClvItem,
  CompanionAdvice,
  DashboardMetric,
  ExecutiveMetric,
  ExpansionItem,
  ForecastItem,
  PartnerViewItem,
  PlaybookItem,
  RecommendationItem,
  RenewalItem,
  RetentionSignal,
  RevenueGrowthCenter,
  SubscriptionItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = [
    "completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting",
  ];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseDashboard(raw: unknown): DashboardMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "dashboard_metric",
  };
}
function parseRenewal(raw: unknown): RenewalItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), renewalKey: asString(d.renewal_key), customerLabel: asString(d.customer_label),
    renewalDateLabel: asString(d.renewal_date_label), renewalStatus: asString(d.renewal_status),
    renewalRiskLabel: asString(d.renewal_risk_label), healthLabel: asString(d.health_label),
    ownerLabel: asString(d.owner_label), pipelineStage: asString(d.pipeline_stage),
    statusKey: asStatus(d.status_key), itemType: "renewal",
  };
}
function parseExpansion(raw: unknown): ExpansionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), opportunityKey: asString(d.opportunity_key), title: asString(d.title),
    insight: asString(d.insight), suggestion: asString(d.suggestion), opportunityType: asString(d.opportunity_type),
    potentialRevenueLabel: asString(d.potential_revenue_label), confidenceLabel: asString(d.confidence_label),
    statusKey: asStatus(d.status_key), itemType: "expansion",
  };
}
function parseSubscription(raw: unknown): SubscriptionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), itemKey: asString(d.item_key), title: asString(d.title), summary: asString(d.summary),
    valueLabel: asString(d.value_label), statusKey: asStatus(d.status_key), itemType: "subscription",
  };
}
function parsePack(raw: unknown): BusinessPackExpansion {
  const d = asRecord(raw);
  return {
    id: asString(d.id), packKey: asString(d.pack_key), packName: asString(d.pack_name),
    packStatus: asString(d.pack_status), departmentUsageLabel: asString(d.department_usage_label),
    potentialRevenueLabel: asString(d.potential_revenue_label), expectedAdoptionLabel: asString(d.expected_adoption_label),
    confidenceLabel: asString(d.confidence_label), summary: asString(d.summary),
    statusKey: asStatus(d.status_key), itemType: "business_pack",
  };
}
function parseForecast(raw: unknown): ForecastItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), forecastPeriod: asString(d.forecast_period),
    renewalsLabel: asString(d.renewals_label), expansionRevenueLabel: asString(d.expansion_revenue_label),
    newRevenueLabel: asString(d.new_revenue_label), retentionRevenueLabel: asString(d.retention_revenue_label),
    totalForecastLabel: asString(d.total_forecast_label), statusKey: asStatus(d.status_key), itemType: "forecast",
  };
}
function parseClv(raw: unknown): ClvItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), clvKey: asString(d.clv_key), title: asString(d.title),
    valueLabel: asString(d.value_label), summary: asString(d.summary),
    statusKey: asStatus(d.status_key), itemType: "clv",
  };
}
function parsePartner(raw: unknown): PartnerViewItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), itemKey: asString(d.item_key), title: asString(d.title), summary: asString(d.summary),
    valueLabel: asString(d.value_label), statusKey: asStatus(d.status_key), itemType: "partner",
  };
}
function parseExecutive(raw: unknown): ExecutiveMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}
function parseAdvice(raw: unknown): CompanionAdvice {
  const d = asRecord(raw);
  return {
    id: asString(d.id), adviceKey: asString(d.advice_key), title: asString(d.title),
    insight: asString(d.insight), recommendation: asString(d.recommendation),
    statusKey: asStatus(d.status_key), itemType: "companion_advice",
  };
}
function parseRetention(raw: unknown): RetentionSignal {
  const d = asRecord(raw);
  return {
    id: asString(d.id), signalKey: asString(d.signal_key), title: asString(d.title),
    insight: asString(d.insight), intervention: asString(d.intervention), signalType: asString(d.signal_type),
    statusKey: asStatus(d.status_key), itemType: "retention_signal",
  };
}
function parsePlaybook(raw: unknown): PlaybookItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), playbookKey: asString(d.playbook_key), title: asString(d.title),
    summary: asString(d.summary), stepsSummary: asString(d.steps_summary),
    statusKey: asStatus(d.status_key), itemType: "playbook",
  };
}
function parseRecommendation(raw: unknown): RecommendationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), recommendationKey: asString(d.recommendation_key), title: asString(d.title),
    insight: asString(d.insight), statusKey: asStatus(d.status_key), itemType: "recommendation",
  };
}
function parseAudit(raw: unknown): AuditItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), itemType: asString(d.item_type), action: asString(d.action),
    description: asString(d.description), createdAt: asString(d.created_at),
  };
}

const empty: RevenueGrowthCenter = {
  found: false,
  dashboardMetrics: [], renewals: [], expansionOpportunities: [], subscriptionGrowth: [],
  businessPackExpansion: [], revenueForecasts: [], customerLifetimeValue: [], growthPartnerView: [],
  executiveOverview: [], companionAdvice: [], retentionProtection: [], revenuePlaybooks: [],
  growthRecommendations: [], auditHistory: [],
  statistics: { renewalCount: 0, expansionCount: 0, atRiskRenewals: 0, playbookCount: 0 },
};

export function parseRevenueGrowthCenter(raw: unknown): RevenueGrowthCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...empty, error: asString(d.error) || undefined };
  const stats = asRecord(d.statistics);
  return {
    found: true,
    organizationName: asString(d.organization_name) || undefined,
    planLabel: asString(d.plan_label) || undefined,
    growthPartnerAttributed: d.growth_partner_attributed === true,
    growthPartnerName: asString(d.growth_partner_name) || undefined,
    canManage: d.can_manage === true,
    canExecutive: d.can_executive === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    corePrinciple: asString(d.core_principle) || undefined,
    dashboardMetrics: Array.isArray(d.dashboard_metrics) ? d.dashboard_metrics.map(parseDashboard) : [],
    renewals: Array.isArray(d.renewals) ? d.renewals.map(parseRenewal) : [],
    expansionOpportunities: Array.isArray(d.expansion_opportunities) ? d.expansion_opportunities.map(parseExpansion) : [],
    subscriptionGrowth: Array.isArray(d.subscription_growth) ? d.subscription_growth.map(parseSubscription) : [],
    businessPackExpansion: Array.isArray(d.business_pack_expansion) ? d.business_pack_expansion.map(parsePack) : [],
    revenueForecasts: Array.isArray(d.revenue_forecasts) ? d.revenue_forecasts.map(parseForecast) : [],
    customerLifetimeValue: Array.isArray(d.customer_lifetime_value) ? d.customer_lifetime_value.map(parseClv) : [],
    growthPartnerView: Array.isArray(d.growth_partner_view) ? d.growth_partner_view.map(parsePartner) : [],
    executiveOverview: Array.isArray(d.executive_overview) ? d.executive_overview.map(parseExecutive) : [],
    companionAdvice: Array.isArray(d.companion_advice) ? d.companion_advice.map(parseAdvice) : [],
    retentionProtection: Array.isArray(d.retention_protection) ? d.retention_protection.map(parseRetention) : [],
    revenuePlaybooks: Array.isArray(d.revenue_playbooks) ? d.revenue_playbooks.map(parsePlaybook) : [],
    growthRecommendations: Array.isArray(d.growth_recommendations) ? d.growth_recommendations.map(parseRecommendation) : [],
    auditHistory: Array.isArray(d.audit_history) ? d.audit_history.map(parseAudit) : [],
    statistics: {
      renewalCount: asNumber(stats.renewal_count),
      expansionCount: asNumber(stats.expansion_count),
      atRiskRenewals: asNumber(stats.at_risk_renewals),
      playbookCount: asNumber(stats.playbook_count),
    },
  };
}
