export type ActivityOperationsTab =
  | "overview"
  | "since_last_login"
  | "organization"
  | "my_activity"
  | "team"
  | "approvals"
  | "business_packs"
  | "domains"
  | "companion_insights"
  | "reports";

export type ActivityEvent = {
  id: string;
  event_number?: string;
  scope: string;
  category: string;
  priority: string;
  title: string;
  summary?: string;
  actor_user_id?: string;
  department_id?: string;
  domain_id?: string;
  business_pack_key?: string;
  entity_type?: string;
  entity_id?: string;
  record_href?: string;
  impact_note?: string;
  recommendation?: string;
  occurred_at?: string;
  data_classification?: string;
  source_verified?: boolean;
  readiness?: string;
  freshness?: string;
  source_reference?: string;
};

export type ActivityHighlight = {
  id: string;
  highlight_type: string;
  title: string;
  summary?: string;
  priority: string;
  record_href?: string;
};

export type SinceLastLoginSummary = {
  since?: string;
  headline?: string;
  summary_lines?: { text: string; priority: string }[];
  top_changes?: ActivityEvent[];
  top_risks?: ActivityEvent[];
  top_opportunities?: ActivityEvent[];
  recommended_actions?: { title: string; href: string }[];
  companion_summary?: string;
  stats?: Record<string, number>;
};

export type ActivityOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, string | number | undefined>;
  since_last_login?: SinceLastLoginSummary;
  personal_timeline?: ActivityEvent[];
  organization_timeline?: ActivityEvent[];
  team_timeline?: ActivityEvent[];
  categories?: { key: string; label: string }[];
  priorities?: { key: string; label: string; icon?: string }[];
  timeline_ranges?: string[];
  approval_feed?: ActivityEvent[];
  business_pack_activity?: ActivityEvent[];
  domain_activity?: ActivityEvent[];
  companion_highlights?: ActivityHighlight[];
  activity_intelligence?: Record<string, unknown>;
  executive_briefing?: Record<string, unknown>;
  notifications_integration?: Record<string, unknown>;
  search_integration?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  companion_integration?: Record<string, unknown>;
  mobile_access?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; section?: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
  access_state?: string;
};
