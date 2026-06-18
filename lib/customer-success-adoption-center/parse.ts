import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  AdoptionMetric,
  AuditItem,
  BusinessPackUsage,
  CompanionAdvice,
  CustomerSuccessAdoptionCenter,
  EngagementItem,
  ExecutiveMetric,
  ExpansionOpportunity,
  HealthDimension,
  JourneyStage,
  RecommendationItem,
  RetentionRisk,
  SuccessPlan,
  SuccessReview,
  SuccessTask,
  TrainingItem,
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

function parseHealth(raw: unknown): HealthDimension {
  const d = asRecord(raw);
  return {
    id: asString(d.id), dimensionKey: asString(d.dimension_key), title: asString(d.title),
    scoreLabel: asString(d.score_label), trendLabel: asString(d.trend_label),
    statusKey: asStatus(d.status_key), itemType: "health_dimension",
  };
}
function parseAdoption(raw: unknown): AdoptionMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "adoption_metric",
  };
}
function parsePlan(raw: unknown): SuccessPlan {
  const d = asRecord(raw);
  return {
    id: asString(d.id), planKey: asString(d.plan_key), title: asString(d.title),
    goalSummary: asString(d.goal_summary), milestoneLabel: asString(d.milestone_label),
    targetOutcome: asString(d.target_outcome), reviewDateLabel: asString(d.review_date_label),
    ownerLabel: asString(d.owner_label), statusKey: asStatus(d.status_key), itemType: "success_plan",
  };
}
function parseExpansion(raw: unknown): ExpansionOpportunity {
  const d = asRecord(raw);
  return {
    id: asString(d.id), opportunityKey: asString(d.opportunity_key), title: asString(d.title),
    insight: asString(d.insight), opportunityType: asString(d.opportunity_type),
    statusKey: asStatus(d.status_key), itemType: "expansion",
  };
}
function parseTraining(raw: unknown): TrainingItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), moduleKey: asString(d.module_key), moduleTitle: asString(d.module_title),
    trainingCategory: asString(d.training_category), progressLabel: asString(d.progress_label),
    statusKey: asStatus(d.status_key), sortOrder: asNumber(d.sort_order), itemType: "training",
  };
}
function parseEngagement(raw: unknown): EngagementItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), engagementKey: asString(d.engagement_key), title: asString(d.title),
    summary: asString(d.summary), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key), itemType: "engagement",
  };
}
function parsePack(raw: unknown): BusinessPackUsage {
  const d = asRecord(raw);
  return {
    id: asString(d.id), packKey: asString(d.pack_key), packName: asString(d.pack_name),
    utilizationCategory: asString(d.utilization_category), summary: asString(d.summary),
    usageLabel: asString(d.usage_label), statusKey: asStatus(d.status_key), itemType: "business_pack",
  };
}
function parseJourney(raw: unknown): JourneyStage {
  const d = asRecord(raw);
  return {
    id: asString(d.id), journeyStage: asString(d.journey_stage), title: asString(d.title),
    summary: asString(d.summary), progressLabel: asString(d.progress_label),
    statusKey: asStatus(d.status_key), sortOrder: asNumber(d.sort_order), itemType: "journey",
  };
}
function parseReview(raw: unknown): SuccessReview {
  const d = asRecord(raw);
  return {
    id: asString(d.id), reviewKey: asString(d.review_key), title: asString(d.title),
    achievements: asString(d.achievements), challenges: asString(d.challenges),
    recommendations: asString(d.recommendations), reviewDateLabel: asString(d.review_date_label),
    statusKey: asStatus(d.status_key), itemType: "review",
  };
}
function parseRisk(raw: unknown): RetentionRisk {
  const d = asRecord(raw);
  return {
    id: asString(d.id), riskKey: asString(d.risk_key), title: asString(d.title),
    insight: asString(d.insight), riskType: asString(d.risk_type),
    statusKey: asStatus(d.status_key), itemType: "retention_risk",
  };
}
function parseTask(raw: unknown): SuccessTask {
  const d = asRecord(raw);
  return {
    id: asString(d.id), taskKey: asString(d.task_key), title: asString(d.title),
    taskType: asString(d.task_type), summary: asString(d.summary), dueLabel: asString(d.due_label),
    statusKey: asStatus(d.status_key), itemType: "task",
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
function parseExecutive(raw: unknown): ExecutiveMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
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

const empty: CustomerSuccessAdoptionCenter = {
  found: false,
  healthDimensions: [], adoptionMetrics: [], successPlans: [], expansionOpportunities: [],
  trainingCenter: [], engagement: [], businessPackUsage: [], customerJourney: [],
  successReviews: [], retentionRisks: [], successTasks: [], companionAdvice: [],
  executiveOverview: [], topRecommendations: [], auditHistory: [],
  statistics: { healthDimensionCount: 0, expansionCount: 0, riskCount: 0, taskCount: 0 },
};

export function parseCustomerSuccessAdoptionCenter(raw: unknown): CustomerSuccessAdoptionCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...empty, error: asString(d.error) || undefined };
  const stats = asRecord(d.statistics);
  return {
    found: true,
    organizationName: asString(d.organization_name) || undefined,
    planLabel: asString(d.plan_label) || undefined,
    healthScore: asNumber(d.health_score),
    healthBand: asString(d.health_band) || undefined,
    healthStatusKey: asStatus(d.health_status_key),
    healthBandLabel: asString(d.health_band_label) || undefined,
    adoptionScore: asNumber(d.adoption_score),
    engagementScore: asNumber(d.engagement_score),
    retentionRiskLevel: asString(d.retention_risk_level) || undefined,
    canManage: d.can_manage === true,
    canExecutive: d.can_executive === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    healthDimensions: Array.isArray(d.health_dimensions) ? d.health_dimensions.map(parseHealth) : [],
    adoptionMetrics: Array.isArray(d.adoption_metrics) ? d.adoption_metrics.map(parseAdoption) : [],
    successPlans: Array.isArray(d.success_plans) ? d.success_plans.map(parsePlan) : [],
    expansionOpportunities: Array.isArray(d.expansion_opportunities) ? d.expansion_opportunities.map(parseExpansion) : [],
    trainingCenter: Array.isArray(d.training_center) ? d.training_center.map(parseTraining) : [],
    engagement: Array.isArray(d.engagement) ? d.engagement.map(parseEngagement) : [],
    businessPackUsage: Array.isArray(d.business_pack_usage) ? d.business_pack_usage.map(parsePack) : [],
    customerJourney: Array.isArray(d.customer_journey) ? d.customer_journey.map(parseJourney) : [],
    successReviews: Array.isArray(d.success_reviews) ? d.success_reviews.map(parseReview) : [],
    retentionRisks: Array.isArray(d.retention_risks) ? d.retention_risks.map(parseRisk) : [],
    successTasks: Array.isArray(d.success_tasks) ? d.success_tasks.map(parseTask) : [],
    companionAdvice: Array.isArray(d.companion_advice) ? d.companion_advice.map(parseAdvice) : [],
    executiveOverview: Array.isArray(d.executive_overview) ? d.executive_overview.map(parseExecutive) : [],
    topRecommendations: Array.isArray(d.top_recommendations) ? d.top_recommendations.map(parseRecommendation) : [],
    auditHistory: Array.isArray(d.audit_history) ? d.audit_history.map(parseAudit) : [],
    statistics: {
      healthDimensionCount: asNumber(stats.health_dimension_count),
      expansionCount: asNumber(stats.expansion_count),
      riskCount: asNumber(stats.risk_count),
      taskCount: asNumber(stats.task_count),
    },
  };
}
