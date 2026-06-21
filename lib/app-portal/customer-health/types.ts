import type { HealthState } from "@/lib/design/semantic-status-system";
import type { RiskLevel } from "@/lib/app-portal/success-center/types";
import type { CustomerHealthSortOption, CustomerHealthTrendPeriod } from "./config";

export type CustomerHealthTrendState =
  | "improving"
  | "stable"
  | "declining"
  | "rapid_decline"
  | "insufficient_data";

export type CustomerHealthDriverEffect =
  | "positive"
  | "neutral"
  | "moderate_negative"
  | "strong_negative"
  | "critical_negative";

export type CustomerHealthMetrics = {
  team_count: number;
  active_users: number;
  business_packs: number;
  active_capabilities: number;
  integrations: number;
  operations_activity: number;
};

export type CustomerHealthOverviewSection = {
  health_score: number;
  health_state: HealthState;
  adoption_score: number;
  engagement_score: number;
  utilization_score: number;
  learning_score: number;
  risk_level: RiskLevel;
  trend_state: CustomerHealthTrendState;
  score_change: number;
  explanation: string;
  last_calculated_at?: string;
};

export type CustomerHealthRecommendedAction = {
  key: string;
  priority: string;
  module?: string;
};

export type CustomerHealthDriver = {
  key: string;
  score: number;
  effect: CustomerHealthDriverEffect;
};

export type CustomerHealthStrength = {
  key: string;
  value: number;
  impact: string;
  action_href?: string;
};

export type CustomerHealthNeedsAttentionItem = {
  key: string;
  severity: string;
  impact: string;
  action_href?: string;
  value: number;
};

export type CustomerHealthTrendPoint = {
  recorded_at: string;
  score: number;
  health_state?: string;
};

export type CustomerHealthRiskItem = {
  key: string;
  severity: string;
  description: string;
  category: string;
};

export type CustomerHealthOperationalSignal = {
  key: string;
  category: string;
  description: string;
  trend?: string;
};

export type CustomerHealthHistoryEntry = {
  id: string;
  event_type: string;
  description: string;
  score?: number;
  recorded_at: string;
};

export type CustomerHealthWorkspaceResponse = {
  found: boolean;
  filtered_out?: boolean;
  has_activity?: boolean;
  can_manage?: boolean;
  can_admin?: boolean;
  organization_name?: string;
  overview?: CustomerHealthOverviewSection;
  metrics?: CustomerHealthMetrics;
  recommended_action?: CustomerHealthRecommendedAction | null;
  drivers?: CustomerHealthDriver[];
  strengths?: CustomerHealthStrength[];
  needs_attention?: CustomerHealthNeedsAttentionItem[];
  trend_points?: CustomerHealthTrendPoint[];
  trend_state?: CustomerHealthTrendState;
  risks?: CustomerHealthRiskItem[];
  operational_signals?: CustomerHealthOperationalSignal[];
  health_history?: CustomerHealthHistoryEntry[];
};

export type CustomerHealthLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  loading: string;
  breadcrumbSupport: string;
  breadcrumbCustomerHealth: string;
  backToSupport: string;
  purposeSummary: Record<"healthy" | "moderate" | "poor" | "critical", string>;
  emptyTitle: string;
  emptyBody: string;
  emptyAction: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  sections: {
    overview: string;
    recommendedAction: string;
    drivers: string;
    strengths: string;
    needsAttention: string;
    trend: string;
    risks: string;
    operationalSignals: string;
    history: string;
    understanding: string;
  };
  overview: {
    healthScore: string;
    healthState: string;
    trend: string;
    scoreChange: string;
    riskLevel: string;
    lastCalculated: string;
    explanation: string;
    advisory: string;
  };
  healthStates: Record<HealthState, string>;
  trendStates: Record<CustomerHealthTrendState, string>;
  riskLevels: Record<RiskLevel, string>;
  driverEffects: Record<CustomerHealthDriverEffect, string>;
  drivers: Record<string, string>;
  strengths: Record<string, string>;
  needsAttention: Record<string, string>;
  risks: Record<string, string>;
  operationalSignals: Record<string, string>;
  trend: {
    periodLabel: string;
    empty: string;
    insufficientData: string;
    periods: Record<string, string>;
  };
  filters: {
    search: string;
    category: string;
    priority: string;
    trend: string;
    date: string;
    sortBy: string;
    all: string;
    categories: Record<string, string>;
    sortOptions: Record<CustomerHealthSortOption, string>;
  };
  history: {
    score: string;
    eventType: string;
    empty: string;
  };
  understanding: {
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
  };
  recommendations: Record<string, { title: string; reason: string; action: string }>;
};

export const CUSTOMER_HEALTH_TREND_STATES: CustomerHealthTrendState[] = [
  "improving",
  "stable",
  "declining",
  "rapid_decline",
  "insufficient_data",
];

export const CUSTOMER_HEALTH_TREND_PERIODS_UI: CustomerHealthTrendPeriod[] = [7, 30, 90, 365];
