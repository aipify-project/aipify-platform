import type { CustomerIntelligenceFoundation } from "./intelligence-foundation";
import type { AutomationCategoryKey, CustomerMasterDetail } from "./types";
import type { EnvironmentType } from "./self-learning";

export type PatternApprovalStatus =
  | "pending"
  | "pending_review"
  | "approved"
  | "approved_global"
  | "internal_only"
  | "rejected"
  | "more_data"
  | "needs_more_data"
  | "archived";

export type ReviewAction =
  | "approve_global"
  | "keep_internal"
  | "needs_more_evidence"
  | "reject"
  | "approve"
  | "request_more_data";

export type BrainPresence = {
  state: string;
  active_signals: number;
  healing_today: number;
  pending_reviews: number;
  system_confidence: "high" | "medium" | "low";
  activity_title: string;
};

export type SelfHealingLivePresence = {
  state: string;
  current_action: string;
  eta_seconds: number | null;
  risk_level: string;
  approval_required: boolean;
  last_result: string | null;
};

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
  detected_across?: string[];
  potential_impact_items?: string[];
  estimated_benefit?: {
    support_reduction_pct?: number;
    failure_prevention_pct?: number;
    onboarding_improvement_pct?: number;
  };
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
  requires_approval?: boolean;
  last_executed_at?: string | null;
  avg_resolution_ms?: number;
  category: string;
  success_count: number;
  failure_count: number;
};

export type SelfHealingDashboard = {
  live_presence: SelfHealingLivePresence | null;
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
  presence: BrainPresence | null;
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

export type IntelligenceAuditEntry = {
  id: string;
  type: string;
  action: string;
  pattern_title: string;
  reviewer_email: string | null;
  notes: string | null;
  environment?: string;
  risk_level?: string;
  created_at: string;
  explanation: string;
};

export type IntelligenceAuditFilters = {
  event_type?: string;
  environment?: string;
  action?: string;
  reviewer?: string;
  risk_level?: string;
  since?: string;
  until?: string;
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
  pending_review: "bg-amber-50 text-amber-700 ring-amber-100",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  approved_global: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  internal_only: "bg-blue-50 text-blue-700 ring-blue-100",
  rejected: "bg-rose-50 text-rose-700 ring-rose-100",
  more_data: "bg-sky-50 text-sky-700 ring-sky-100",
  needs_more_data: "bg-sky-50 text-sky-700 ring-sky-100",
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
  const presenceRaw = raw.presence as Record<string, unknown> | undefined;
  return {
    metrics: raw.metrics ? (raw.metrics as BrainMetrics) : null,
    presence: presenceRaw
      ? {
          state: String(presenceRaw.state ?? "standby"),
          active_signals: Number(presenceRaw.active_signals ?? 0),
          healing_today: Number(presenceRaw.healing_today ?? 0),
          pending_reviews: Number(presenceRaw.pending_reviews ?? 0),
          system_confidence: (presenceRaw.system_confidence as BrainPresence["system_confidence"]) ?? "medium",
          activity_title: String(presenceRaw.activity_title ?? ""),
        }
      : null,
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
  const liveRaw = raw.live_presence as Record<string, unknown> | undefined;
  return {
    live_presence: liveRaw
      ? {
          state: String(liveRaw.state ?? "standby"),
          current_action: String(liveRaw.current_action ?? ""),
          eta_seconds: liveRaw.eta_seconds != null ? Number(liveRaw.eta_seconds) : null,
          risk_level: String(liveRaw.risk_level ?? "low"),
          approval_required: Boolean(liveRaw.approval_required),
          last_result: liveRaw.last_result != null ? String(liveRaw.last_result) : null,
        }
      : null,
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

export function parseIntelligenceAuditLog(data: unknown): IntelligenceAuditEntry[] {
  return Array.isArray(data) ? (data as IntelligenceAuditEntry[]) : [];
}

export function getHealingStrategySuccessRate(strategy: HealingStrategy): number {
  const total = strategy.success_count + strategy.failure_count;
  if (total === 0) return 0;
  return Math.round((strategy.success_count / total) * 100);
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
