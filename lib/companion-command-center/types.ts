export type CompanionCommandCenterViewMode = "executive" | "manager" | "employee" | "auto";

export type CompanionCommandCenterTab =
  | "overview"
  | "health"
  | "briefing"
  | "actions"
  | "approvals"
  | "alerts"
  | "recommendations"
  | "personal"
  | "decisions"
  | "meetings"
  | "notifications";

export type HealthDimension = {
  key: string;
  label: string;
  score: number;
  status: string;
};

export type HubRecommendation = {
  id: string;
  recommendation_type: string;
  priority: string;
  title: string;
  summary?: string;
  impact_note?: string;
  effort_hint?: string;
  value_hint?: string;
  record_href?: string;
  business_pack_key?: string;
  status?: string;
};

export type HubAlert = {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  summary?: string;
  impact_note?: string;
  recommendation?: string;
  record_href?: string;
  created_at?: string;
};

export type HubAction = {
  id: string;
  action_type: string;
  priority: string;
  status: string;
  title: string;
  summary?: string;
  due_at?: string;
  record_href?: string;
};

export type PackIntel = {
  id: string;
  business_pack_key: string;
  intel_type: string;
  title: string;
  summary?: string;
  record_href?: string;
};

export type CompanionCommandCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  view_mode?: string;
  user_name?: string;
  executive_briefing?: Record<string, unknown>;
  organization_health?: {
    overall_score?: number;
    overall_status?: string;
    dimensions?: HealthDimension[];
    status_levels?: { key: string; label: string; icon?: string }[];
  };
  since_last_login?: Record<string, unknown>;
  recommended_actions?: HubRecommendation[];
  pending_approvals?: HubAction[];
  upcoming_deadlines?: HubAction[];
  critical_alerts?: HubAlert[];
  companion_recommendations?: HubRecommendation[];
  business_pack_intelligence?: PackIntel[];
  personal_workspace?: Record<string, HubAction[]>;
  action_center?: HubAction[];
  decision_support?: Record<string, unknown>;
  meeting_intelligence?: Record<string, unknown>;
  notifications_hub?: Record<string, unknown>;
  companion_memory?: { memory_key: string; memory_type: string; use_count?: number }[];
  companion_conversation?: Record<string, unknown>;
  search_integration?: Record<string, unknown>;
  view_modes?: Record<string, unknown>;
  team_activity?: Record<string, number>;
  mobile_access?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; section?: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};
