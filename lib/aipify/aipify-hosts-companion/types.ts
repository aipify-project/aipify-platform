export type HostsCompanionModuleKey =
  | "owner_command_center"
  | "daily_briefing_engine"
  | "since_last_login_center"
  | "approval_hub"
  | "hospitality_companion_chat"
  | "executive_recommendation_engine"
  | "mobile_operations_experience"
  | "executive_notification_center"
  | "owner_performance_insights"
  | "hospitality_companion_memory_engine";

export type HostsCompanionModule = {
  key: HostsCompanionModuleKey;
  label: string;
  description: string;
};

export type HostsCommandSnapshot = {
  arrivals_today: number;
  departures_today: number;
  pending_approvals: number;
  revenue_snapshot: number;
  property_health_score: number;
  guest_alerts: number;
  team_activity_count: number;
  maintenance_tasks: number;
  occupancy_forecast_pct: number;
};

export type HostsDailyBriefing = {
  greeting: string;
  overview_lines: string[];
  recommended_actions: string[];
};

export type HostsSinceLastLoginItem = {
  key: string;
  label: string;
  count: number;
};

export type HostsPendingApproval = {
  key: string;
  category: string;
  label: string;
  impact: string;
};

export type HostsCompanionRecommendation = {
  key: string;
  type: string;
  label: string;
  impact: string;
  effort: string;
  next_step: string;
};

export type HostsPerformanceInsights = {
  response_speed_score: number;
  approval_efficiency_score: number;
  operational_consistency_score: number;
  guest_satisfaction_score: number;
};

export type AipifyHostsCompanionDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  property_count: number;
  human_oversight_required: boolean;
  positioning: string;
  vision: string;
  modules: HostsCompanionModule[];
  governance: {
    principle: string;
    approval_required: boolean;
    audit_required: boolean;
    recommendations_only: boolean;
  };
  success_metrics: { key: string; label: string }[];
  knowledge_categories: string[];
  command_snapshot: HostsCommandSnapshot;
  morning_briefing: HostsDailyBriefing;
  evening_briefing: { summary_lines: string[] };
  since_last_login: HostsSinceLastLoginItem[];
  pending_approvals: HostsPendingApproval[];
  recommendations: HostsCompanionRecommendation[];
  companion_prompts: string[];
  memory_insights: string[];
  notification_categories: string[];
  performance_insights: HostsPerformanceInsights;
  executive_questions: string[];
};

export type AipifyHostsCompanionCard = {
  has_customer: boolean;
  enabled?: boolean;
  package_key?: string;
  property_count?: number;
  human_oversight_required?: boolean;
  positioning?: string;
  route?: string;
};
