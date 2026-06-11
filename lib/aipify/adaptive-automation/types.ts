export const AUTOMATION_RISK_LEVELS = ["low", "medium", "high", "blocked"] as const;
export type AutomationRiskLevel = (typeof AUTOMATION_RISK_LEVELS)[number];

export const AUTOMATION_STATUSES = [
  "draft",
  "pending_approval",
  "active",
  "paused",
  "disabled",
  "archived",
  "failed",
] as const;
export type AutomationStatus = (typeof AUTOMATION_STATUSES)[number];

export const SUGGESTION_STATUSES = [
  "open",
  "reviewing",
  "approved",
  "rejected",
  "dismissed",
  "snoozed",
  "converted",
] as const;
export type SuggestionStatus = (typeof SUGGESTION_STATUSES)[number];

export type AutomationSuggestion = {
  id: string;
  suggestion_type: string;
  title: string;
  summary: string;
  evidence: Record<string, unknown>;
  estimated_time_saved_minutes_per_week: number | null;
  confidence_score: number;
  risk_level: AutomationRiskLevel;
  recommended_template_id: string | null;
  status: SuggestionStatus;
  created_at: string;
};

export type AutomationItem = {
  id: string;
  name: string;
  automation_key: string;
  description: string | null;
  category: string;
  status: AutomationStatus;
  risk_level: AutomationRiskLevel;
  template_id: string | null;
  last_run_at: string | null;
  created_by_ai: boolean;
  created_at: string;
};

export type AutomationTemplate = {
  id: string;
  template_key: string;
  template_name: string;
  category: string;
  description: string | null;
  risk_level: AutomationRiskLevel;
  is_global: boolean;
  trigger_definition: Record<string, unknown>;
  condition_definition: Record<string, unknown>;
  action_definition: Record<string, unknown>;
};

export type AutomationExecution = {
  id: string;
  automation_id: string;
  automation_name?: string;
  status: string;
  result_summary: string | null;
  error_message: string | null;
  created_at: string;
};

export type AutomationSettings = {
  enabled: boolean;
  allow_automation_discovery: boolean;
  allow_ai_generated_drafts: boolean;
  allow_low_risk_auto_execution: boolean;
  require_approval_for_medium_risk: boolean;
  require_approval_for_high_risk: boolean;
  max_daily_executions: number;
  max_external_messages_per_day: number;
  enable_value_estimation: boolean;
  notification_channel: string;
};

export type AutomationCenter = {
  has_customer: boolean;
  has_access: boolean;
  enabled?: boolean;
  upgrade_required: boolean;
  plan?: string;
  privacy_note?: string;
  settings_url?: string;
  metrics?: {
    active_count: number;
    draft_count: number;
    paused_count: number;
    failed_count: number;
    new_suggestions: number;
    pending_approvals: number;
    time_saved_minutes_month: number;
  };
  automations?: AutomationItem[];
  suggestions?: AutomationSuggestion[];
  pending_approvals_list?: Array<{
    id: string;
    automation_id: string;
    approval_type: string;
    status: string;
  }>;
  recent_executions?: AutomationExecution[];
};
