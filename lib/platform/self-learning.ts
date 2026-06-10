export type EnvironmentType = "internal" | "pilot" | "customer" | "enterprise";

export type LearningEventType = "detection" | "diagnosis" | "recommendation" | "healing";

export type LearningEventCategory =
  | "automation"
  | "webhook"
  | "support"
  | "integration"
  | "onboarding"
  | "health"
  | "billing"
  | "system";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type HealingExecutionResult = "success" | "failed" | "skipped" | "pending_approval";

export type AiLearningEvent = {
  id: string;
  tenant_id: string | null;
  environment_type: EnvironmentType;
  event_type: LearningEventType;
  event_category: LearningEventCategory;
  metadata: Record<string, unknown>;
  resolution_type: string | null;
  created_at: string;
};

export type AiPattern = {
  id: string;
  pattern_name: string;
  category: string;
  detection_count: number;
  success_rate: number;
  recommended_action: string;
  approved_for_global_use: boolean;
  source_environment: EnvironmentType | null;
  created_at: string;
  updated_at: string;
};

export type RecommendationEffectiveness = {
  id: string;
  recommendation_type: string;
  times_presented: number;
  times_accepted: number;
  times_dismissed: number;
  successful_outcomes: number;
  updated_at: string;
};

export type SelfHealingExecution = {
  id: string;
  tenant_id: string;
  healing_action: string;
  risk_level: RiskLevel;
  execution_result: HealingExecutionResult;
  execution_time_ms: number | null;
  requires_approval: boolean;
  approved_by: string | null;
  metadata: Record<string, unknown>;
  executed_at: string;
};

export type CustomerSelfLearning = {
  environment_type: EnvironmentType | null;
  learning_events: AiLearningEvent[];
  self_healing_executions: SelfHealingExecution[];
  patterns: AiPattern[];
  recommendation_effectiveness: RecommendationEffectiveness[];
};

export type PlatformLearningOverview = {
  patterns: AiPattern[];
  recommendation_effectiveness: RecommendationEffectiveness[];
  learning_by_environment: Record<string, number>;
  recent_healing_executions: SelfHealingExecution[];
  totals: {
    patterns: number;
    approved_patterns: number;
    learning_events_30d: number;
    healing_executions_30d: number;
  };
};

const ENVIRONMENT_STYLES: Record<EnvironmentType, string> = {
  internal: "bg-violet-50 text-violet-700 ring-violet-100",
  pilot: "bg-sky-50 text-sky-700 ring-sky-100",
  customer: "bg-gray-50 text-gray-700 ring-gray-100",
  enterprise: "bg-indigo-50 text-indigo-700 ring-indigo-100",
};

const RISK_STYLES: Record<RiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  medium: "bg-amber-50 text-amber-700 ring-amber-100",
  high: "bg-orange-50 text-orange-700 ring-orange-100",
  critical: "bg-rose-50 text-rose-700 ring-rose-100",
};

const HEALING_RESULT_STYLES: Record<HealingExecutionResult, string> = {
  success: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-700",
  skipped: "bg-gray-50 text-gray-600",
  pending_approval: "bg-amber-50 text-amber-700",
};

export function getEnvironmentStyle(env: EnvironmentType): string {
  return ENVIRONMENT_STYLES[env] ?? ENVIRONMENT_STYLES.customer;
}

export function getRiskLevelStyle(risk: RiskLevel): string {
  return RISK_STYLES[risk] ?? RISK_STYLES.low;
}

export function getHealingResultStyle(result: HealingExecutionResult): string {
  return HEALING_RESULT_STYLES[result] ?? HEALING_RESULT_STYLES.skipped;
}

export function parseCustomerSelfLearning(data: unknown): CustomerSelfLearning {
  const raw = (data ?? {}) as Record<string, unknown>;
  return {
    environment_type: (raw.environment_type as EnvironmentType) ?? null,
    learning_events: Array.isArray(raw.learning_events)
      ? (raw.learning_events as AiLearningEvent[])
      : [],
    self_healing_executions: Array.isArray(raw.self_healing_executions)
      ? (raw.self_healing_executions as SelfHealingExecution[])
      : [],
    patterns: Array.isArray(raw.patterns) ? (raw.patterns as AiPattern[]) : [],
    recommendation_effectiveness: Array.isArray(raw.recommendation_effectiveness)
      ? (raw.recommendation_effectiveness as RecommendationEffectiveness[])
      : [],
  };
}

export function parsePlatformLearningOverview(data: unknown): PlatformLearningOverview {
  const raw = (data ?? {}) as Record<string, unknown>;
  const totals = (raw.totals ?? {}) as Record<string, number>;
  return {
    patterns: Array.isArray(raw.patterns) ? (raw.patterns as AiPattern[]) : [],
    recommendation_effectiveness: Array.isArray(raw.recommendation_effectiveness)
      ? (raw.recommendation_effectiveness as RecommendationEffectiveness[])
      : [],
    learning_by_environment:
      (raw.learning_by_environment as Record<string, number>) ?? {},
    recent_healing_executions: Array.isArray(raw.recent_healing_executions)
      ? (raw.recent_healing_executions as SelfHealingExecution[])
      : [],
    totals: {
      patterns: totals.patterns ?? 0,
      approved_patterns: totals.approved_patterns ?? 0,
      learning_events_30d: totals.learning_events_30d ?? 0,
      healing_executions_30d: totals.healing_executions_30d ?? 0,
    },
  };
}

export function computeAcceptanceRate(record: RecommendationEffectiveness): number {
  if (record.times_presented === 0) return 0;
  return Math.round((record.times_accepted / record.times_presented) * 100);
}
