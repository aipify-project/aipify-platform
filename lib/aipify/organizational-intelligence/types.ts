export const INSIGHT_TYPES = [
  "bottleneck",
  "forgotten_task",
  "customer_followup",
  "risk",
  "opportunity",
  "automation_suggestion",
  "workload",
  "trend",
  "health_score",
  "relationship_memory",
] as const;

export type InsightType = (typeof INSIGHT_TYPES)[number];

export const INSIGHT_SEVERITIES = [
  "info",
  "low",
  "medium",
  "high",
  "critical",
] as const;

export type InsightSeverity = (typeof INSIGHT_SEVERITIES)[number];

export const INSIGHT_STATUSES = [
  "open",
  "acknowledged",
  "dismissed",
  "resolved",
  "snoozed",
] as const;

export type InsightStatus = (typeof INSIGHT_STATUSES)[number];

export const HEALTH_BANDS = [
  "healthy",
  "good",
  "needs_attention",
  "risky",
  "critical",
] as const;

export type HealthBand = (typeof HEALTH_BANDS)[number];

export type InsightItem = {
  id: string;
  insight_type: InsightType;
  severity: InsightSeverity;
  title: string;
  summary: string;
  evidence: Record<string, unknown>;
  recommended_action: string | null;
  status: InsightStatus;
  assigned_user_id: string | null;
  assigned_unit_id: string | null;
  confidence_score: number;
  generated_by: string;
  generated_at: string;
  resolved_at: string | null;
  snoozed_until: string | null;
  created_at: string;
  updated_at: string;
};

export type IntelligenceSettings = {
  enabled: boolean;
  allow_email_analysis: boolean;
  allow_calendar_analysis: boolean;
  allow_support_analysis: boolean;
  allow_customer_memory: boolean;
  allow_staff_workload_insights: boolean;
  allow_cross_department_insights: boolean;
  require_admin_approval_for_actions: boolean;
  default_retention_days: number;
};

export type IntelligenceCenter = {
  has_customer: boolean;
  has_access: boolean;
  enabled?: boolean;
  upgrade_required: boolean;
  plan?: string;
  privacy_note?: string;
  settings_url?: string;
  health_score?: number;
  health_band?: HealthBand;
  strongest_area?: string;
  weakest_area?: string;
  snapshot?: {
    support_score: number | null;
    followup_score: number | null;
    risk_score: number | null;
    summary: string | null;
    snapshot_date: string;
  } | null;
  insights?: InsightItem[];
  open_risks?: number;
  resolved_recent?: InsightItem[];
};

export type OrganizationUnit = {
  id: string;
  name: string;
  unit_type: string;
  description: string | null;
  parent_unit_id: string | null;
  manager_user_id: string | null;
  active: boolean;
};

export type WorkflowDefinition = {
  id: string;
  name: string;
  workflow_key: string;
  description: string | null;
  category: string;
  expected_response_time_minutes: number | null;
  expected_completion_time_minutes: number | null;
  owner_unit_id: string | null;
  owner_user_id: string | null;
  active: boolean;
  open_events?: number;
};

export type ResponsibilityEntry = {
  id: string;
  role_name: string;
  responsibility_type: string;
  description: string | null;
  organization_unit_id: string | null;
  user_id: string | null;
  priority: number;
  active: boolean;
};
