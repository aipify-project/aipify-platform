export type AuditActivity = {
  id: string;
  actor_type: string;
  actor_role?: string | null;
  action_type: string;
  entity_type?: string | null;
  action_summary?: string | null;
  ai_involved?: boolean;
  approval_status?: string;
  created_at?: string;
};

export type ActionCategoryCount = {
  action_type: string;
  count: number;
};

export type RetentionPolicy = {
  active_retention_months: number;
  archive_retention_months?: number | null;
  enterprise_retention_months?: number | null;
};

export type AuditAccountabilityCard = {
  has_organization: boolean;
  total_events?: number;
  philosophy?: string;
};

export type AuditAccountabilityDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  recent_activity: AuditActivity[];
  pending_approvals?: number;
  ai_activity_timeline: AuditActivity[];
  failed_actions: AuditActivity[];
  security_events: AuditActivity[];
  top_action_categories: ActionCategoryCount[];
  retention_policy?: RetentionPolicy;
  total_events?: number;
  ai_events?: number;
  export_formats?: string[];
};
