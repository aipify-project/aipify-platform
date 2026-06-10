import type { CustomerIntelligenceFoundation } from "./intelligence-foundation";
import type { AutomationCategoryKey, CustomerMasterDetail } from "./types";
import type { EnvironmentType } from "./self-learning";

export type PatternApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "more_data"
  | "archived";

export type IntelligencePattern = {
  id: string;
  pattern_title: string;
  category: string;
  environment_type: EnvironmentType | "global";
  tenant_id: string | null;
  detection_count: number;
  confidence_score: number;
  potential_impact: string;
  suggested_action: string;
  approval_status: PatternApprovalStatus;
  first_detected: string;
  last_detected: string;
  created_at: string;
  updated_at: string;
};

export type GlobalPattern = {
  id: string;
  pattern_title: string;
  category: string;
  suggested_action: string;
  confidence_score: number;
  detection_count: number;
  source_environment: EnvironmentType;
  approved_at: string;
  approved_by: string | null;
  active: boolean;
};

export type BrainMetrics = {
  knowledge_patterns_approved: number;
  patterns_awaiting_review: number;
  learning_events_30d: number;
  self_healing_success_rate: number;
  global_recommendations_generated: number;
  learning_confidence: number;
  approved_automations_from_learning: number;
  automation_coverage: number;
  recorded_at: string;
};

export type IntelligenceRecommendation = {
  id: string;
  message: string;
  suggested_action: string;
  confidence: number;
  category: string;
  source_environment?: string;
};

export type HealingStrategy = {
  id: string;
  strategy_key: string;
  title: string;
  description: string | null;
  risk_level: string;
  auto_execute: boolean;
  category: string;
  success_count: number;
  failure_count: number;
};

export type SelfHealingDashboard = {
  totals: {
    attempts: number;
    successful: number;
    failed: number;
    escalated: number;
    avg_resolution_ms: number;
  };
  strategies: HealingStrategy[];
  recent_runs: Array<{
    id: string;
    healing_action: string;
    risk_level: string;
    execution_result: string;
    execution_time_ms: number | null;
    executed_at: string;
  }>;
  top_pattern: string | null;
  most_common_incident: string | null;
};

export type BrainDashboard = {
  metrics: BrainMetrics | null;
  recommendations: IntelligenceRecommendation[];
  recent_reviews: Array<{
    id: string;
    pattern_id: string;
    reviewer_email: string;
    action: string;
    notes: string | null;
    created_at: string;
  }>;
};

export type LearningQueue = {
  patterns: IntelligencePattern[];
  archived: IntelligencePattern[];
  totals: {
    pending: number;
    more_data: number;
    approved: number;
  };
};

export type SuccessScoreFactor = {
  key: string;
  label: string;
  score: number;
  weight: string;
};

export type ExpansionOpportunity = {
  key: string;
  label: string;
  eligible: boolean;
};

const APPROVAL_STYLES: Record<PatternApprovalStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  rejected: "bg-rose-50 text-rose-700 ring-rose-100",
  more_data: "bg-sky-50 text-sky-700 ring-sky-100",
  archived: "bg-gray-50 text-gray-600 ring-gray-100",
};

const CATEGORY_BADGE_STYLES: Record<AutomationCategoryKey, string> = {
  ai_generated: "bg-violet-50 text-violet-700 ring-violet-100",
  admin_approved: "bg-blue-50 text-blue-700 ring-blue-100",
  self_healing: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

export function getApprovalStatusStyle(status: PatternApprovalStatus): string {
  return APPROVAL_STYLES[status] ?? APPROVAL_STYLES.pending;
}

export function getAutomationCategoryStyle(key: AutomationCategoryKey): string {
  return CATEGORY_BADGE_STYLES[key] ?? CATEGORY_BADGE_STYLES.admin_approved;
}

export function parseBrainDashboard(data: unknown): BrainDashboard {
  const raw = (data ?? {}) as Record<string, unknown>;
  return {
    metrics: raw.metrics ? (raw.metrics as BrainMetrics) : null,
    recommendations: Array.isArray(raw.recommendations)
      ? (raw.recommendations as IntelligenceRecommendation[])
      : [],
    recent_reviews: Array.isArray(raw.recent_reviews)
      ? (raw.recent_reviews as BrainDashboard["recent_reviews"])
      : [],
  };
}

export function parseLearningQueue(data: unknown): LearningQueue {
  const raw = (data ?? {}) as Record<string, unknown>;
  const totals = (raw.totals ?? {}) as Record<string, number>;
  return {
    patterns: Array.isArray(raw.patterns) ? (raw.patterns as IntelligencePattern[]) : [],
    archived: Array.isArray(raw.archived) ? (raw.archived as IntelligencePattern[]) : [],
    totals: {
      pending: totals.pending ?? 0,
      more_data: totals.more_data ?? 0,
      approved: totals.approved ?? 0,
    },
  };
}

export function parseGlobalPatterns(data: unknown): GlobalPattern[] {
  return Array.isArray(data) ? (data as GlobalPattern[]) : [];
}

export function parseSelfHealingDashboard(data: unknown): SelfHealingDashboard {
  const raw = (data ?? {}) as Record<string, unknown>;
  const totals = (raw.totals ?? {}) as SelfHealingDashboard["totals"];
  return {
    totals: {
      attempts: totals.attempts ?? 0,
      successful: totals.successful ?? 0,
      failed: totals.failed ?? 0,
      escalated: totals.escalated ?? 0,
      avg_resolution_ms: totals.avg_resolution_ms ?? 0,
    },
    strategies: Array.isArray(raw.strategies) ? (raw.strategies as HealingStrategy[]) : [],
    recent_runs: Array.isArray(raw.recent_runs)
      ? (raw.recent_runs as SelfHealingDashboard["recent_runs"])
      : [],
    top_pattern: (raw.top_pattern as string) ?? null,
    most_common_incident: (raw.most_common_incident as string) ?? null,
  };
}

export function parseIntelligenceRecommendations(data: unknown): IntelligenceRecommendation[] {
  return Array.isArray(data) ? (data as IntelligenceRecommendation[]) : [];
}

export function buildSuccessScoreFactors(
  detail: CustomerMasterDetail,
  intelligence: CustomerIntelligenceFoundation,
  labels: Record<string, string>
): SuccessScoreFactor[] {
  const supportVolume = detail.usage?.support_requests_handled ?? 0;
  const installHealth = intelligence.installation_health?.health_score ?? 0;
  const automationRuns = intelligence.automation_runs.length;
  const billingStable =
    detail.overview.customer_status === "active" || detail.overview.customer_status === "trial"
      ? 85
      : 40;
  const onboardingComplete = detail.installations.some((i) => i.status === "active") ? 90 : 45;

  return [
    {
      key: "support",
      label: labels.supportVolume,
      score: Math.max(0, 100 - Math.min(supportVolume * 2, 80)),
      weight: labels.weightMedium,
    },
    {
      key: "installation",
      label: labels.installationHealth,
      score: installHealth || (detail.installations.length > 0 ? 75 : 30),
      weight: labels.weightHigh,
    },
    {
      key: "automation",
      label: labels.automationAdoption,
      score: Math.min(100, 40 + automationRuns * 8),
      weight: labels.weightMedium,
    },
    {
      key: "billing",
      label: labels.billingStability,
      score: billingStable,
      weight: labels.weightHigh,
    },
    {
      key: "onboarding",
      label: labels.onboardingCompletion,
      score: onboardingComplete,
      weight: labels.weightMedium,
    },
  ];
}

export function detectExpansionOpportunities(
  detail: CustomerMasterDetail,
  labels: Record<string, string>
): ExpansionOpportunity[] {
  const license = detail.license;
  const plan = detail.overview.plan_type ?? "starter";
  const modules = detail.usage?.most_used_modules ?? [];

  const extraDomainsEligible =
    license?.has_subscription === true &&
    license.max_domains != null &&
    (license.used_domains ?? 0) < license.max_domains;

  return [
    {
      key: "extra_domains",
      label: labels.extraDomains,
      eligible: extraDomainsEligible,
    },
    {
      key: "support_ai",
      label: labels.supportAiUpgrade,
      eligible: (detail.usage?.support_requests_handled ?? 0) >= 15,
    },
    {
      key: "analytics_ai",
      label: labels.analyticsAi,
      eligible: modules.length >= 2 || plan !== "starter",
    },
    {
      key: "commerce_ai",
      label: labels.commerceAi,
      eligible:
        detail.installations.some((i) => i.system_type === "wordpress") &&
        (plan === "growth" || plan === "business" || plan === "enterprise"),
    },
  ];
}
