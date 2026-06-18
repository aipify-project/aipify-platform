import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  ActivityItem,
  CommissionItem,
  CustomerItem,
  DashboardMetric,
  GrowthPartnerOperationsCenter,
  LeadItem,
  OpportunityItem,
  PayoutItem,
  PerformanceMetric,
  RecommendationItem,
  ResourceItem,
  TrainingModuleItem,
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
  const allowed: OperationsStatusKey[] = ["completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting"];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseDashboard(raw: unknown): DashboardMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "dashboard_metric",
  };
}
function parseLead(raw: unknown): LeadItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), leadKey: asString(d.lead_key), companyName: asString(d.company_name),
    contactName: asString(d.contact_name), leadStatus: asString(d.lead_status), leadSource: asString(d.lead_source),
    partnerNotes: asString(d.partner_notes), followUpTask: asString(d.follow_up_task),
    statusKey: asStatus(d.status_key), itemType: "lead",
  };
}
function parseOpportunity(raw: unknown): OpportunityItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), opportunityKey: asString(d.opportunity_key), title: asString(d.title),
    stage: asString(d.stage), forecastValueLabel: asString(d.forecast_value_label),
    expectedCloseDate: asString(d.expected_close_date), statusKey: asStatus(d.status_key), itemType: "opportunity",
  };
}
function parseCustomer(raw: unknown): CustomerItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), customerKey: asString(d.customer_key), customerName: asString(d.customer_name),
    planLabel: asString(d.plan_label), monthlyRevenueLabel: asString(d.monthly_revenue_label),
    commissionValueLabel: asString(d.commission_value_label), renewalStatus: asString(d.renewal_status),
    healthLabel: asString(d.health_label), supportStatus: asString(d.support_status),
    statusKey: asStatus(d.status_key), itemType: "customer",
  };
}
function parseCommission(raw: unknown): CommissionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), periodKey: asString(d.period_key), periodLabel: asString(d.period_label),
    amountLabel: asString(d.amount_label), commissionType: asString(d.commission_type),
    rulesSummary: asString(d.rules_summary), statusKey: asStatus(d.status_key), itemType: "commission",
  };
}
function parsePayout(raw: unknown): PayoutItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), payoutKey: asString(d.payout_key), amountLabel: asString(d.amount_label),
    payoutStatus: asString(d.payout_status), bankVerificationLabel: asString(d.bank_verification_label),
    settlementDateLabel: asString(d.settlement_date_label), statusKey: asStatus(d.status_key), itemType: "payout",
  };
}
function parseResource(raw: unknown): ResourceItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), resourceType: asString(d.resource_type), title: asString(d.title),
    summary: asString(d.summary), statusKey: asStatus(d.status_key), itemType: "resource",
  };
}
function parseTraining(raw: unknown): TrainingModuleItem {
  const d = asRecord(raw);
  return {
    moduleKey: asString(d.module_key), moduleTitle: asString(d.module_title),
    status: asString(d.status, "not_started"), sortOrder: asNumber(d.sort_order), itemType: "training_module",
  };
}
function parsePerformance(raw: unknown): PerformanceMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "performance",
  };
}
function parseRecommendation(raw: unknown): RecommendationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), recommendationType: asString(d.recommendation_type), title: asString(d.title),
    insight: asString(d.insight), statusKey: asStatus(d.status_key), itemType: "recommendation",
  };
}
function parseActivity(raw: unknown): ActivityItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), activityKey: asString(d.activity_key), title: asString(d.title),
    summary: asString(d.summary), dateLabel: asString(d.date_label), auditRef: asString(d.audit_ref),
    statusKey: asStatus(d.status_key), itemType: "activity",
  };
}

const empty: GrowthPartnerOperationsCenter = {
  found: false,
  dashboardMetrics: [], leadManagement: [], opportunityPipeline: [], customerPortfolio: [],
  commissionCenter: [], payoutCenter: [], marketingResources: [], trainingCenter: [],
  performanceCenter: [], growthRecommendations: [], recentActivity: [],
  statistics: { leadCount: 0, opportunityCount: 0, customerCount: 0, resourceCount: 0 },
};

export function parseGrowthPartnerOperationsCenter(raw: unknown): GrowthPartnerOperationsCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...empty, error: asString(d.error) || undefined };
  const stats = asRecord(d.statistics);
  return {
    found: true,
    partnerStatus: asString(d.partner_status) || undefined,
    certificationStatus: asString(d.certification_status) || undefined,
    certificationStatusKey: asString(d.certification_status_key) || undefined,
    certificationStatusLabel: asString(d.certification_status_label) || undefined,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    trainingProgressPct: asNumber(d.training_progress_pct),
    trainingCompletedCount: asNumber(d.training_completed_count),
    trainingTotalCount: asNumber(d.training_total_count),
    dashboardMetrics: Array.isArray(d.dashboard_metrics) ? d.dashboard_metrics.map(parseDashboard) : [],
    leadManagement: Array.isArray(d.lead_management) ? d.lead_management.map(parseLead) : [],
    opportunityPipeline: Array.isArray(d.opportunity_pipeline) ? d.opportunity_pipeline.map(parseOpportunity) : [],
    customerPortfolio: Array.isArray(d.customer_portfolio) ? d.customer_portfolio.map(parseCustomer) : [],
    commissionCenter: Array.isArray(d.commission_center) ? d.commission_center.map(parseCommission) : [],
    payoutCenter: Array.isArray(d.payout_center) ? d.payout_center.map(parsePayout) : [],
    marketingResources: Array.isArray(d.marketing_resources) ? d.marketing_resources.map(parseResource) : [],
    trainingCenter: Array.isArray(d.training_center) ? d.training_center.map(parseTraining) : [],
    performanceCenter: Array.isArray(d.performance_center) ? d.performance_center.map(parsePerformance) : [],
    growthRecommendations: Array.isArray(d.growth_recommendations) ? d.growth_recommendations.map(parseRecommendation) : [],
    recentActivity: Array.isArray(d.recent_activity) ? d.recent_activity.map(parseActivity) : [],
    statistics: {
      leadCount: asNumber(stats.lead_count),
      opportunityCount: asNumber(stats.opportunity_count),
      customerCount: asNumber(stats.customer_count),
      resourceCount: asNumber(stats.resource_count),
    },
  };
}
