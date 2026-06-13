import type {
  ACTIVITY_LEVELS,
  AUTOMATION_CLASSIFICATIONS,
  AUTOMATION_HEALTH_BANDS,
} from "./constants";

export type AutomationClassification = (typeof AUTOMATION_CLASSIFICATIONS)[number];
export type AutomationHealthBand = (typeof AUTOMATION_HEALTH_BANDS)[number];
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];

export type AutomationControlEntry = {
  entry_key: string;
  automation_id: string | null;
  name: string;
  classification: AutomationClassification | string;
  purpose: string;
  aipify_explanation: string;
  business_value_message: string | null;
  owner_name: string | null;
  department_owner: string | null;
  escalation_contact: string | null;
  approval_status: string;
  review_state: string;
  review_frequency_days: number;
  last_reviewed_at: string | null;
  status: string;
  success_rate: number;
  execution_count: number;
  avg_runtime_ms: number;
  failure_count: number;
  health_score: number;
  health_band: AutomationHealthBand | string;
  time_saved_hours_month: number;
  last_executed_at: string | null;
  next_execution_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type AutomationActivityItem = {
  activity_key: string;
  entry_key: string | null;
  message: string;
  activity_level: ActivityLevel | string;
  created_at: string | null;
};

export type AutomationRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
  status: string;
  related_entry_key: string | null;
  created_at: string | null;
};

export type AutomationControlCenter = {
  executive_overview: {
    active_automations: number;
    needs_attention: number;
    time_saved_hours_month: number;
    self_healing_hours_saved: number;
    review_overdue_count: number;
    avg_health_score: number;
  } | null;
  aipify_insight: { state: string; message: string } | null;
  automations: AutomationControlEntry[];
  self_healing: AutomationControlEntry[];
  activity_feed: AutomationActivityItem[];
  recommendations: AutomationRecommendation[];
  analytics: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};

export type AutomationControlDetail = {
  entry: AutomationControlEntry;
  overview: Record<string, unknown>;
  performance: Record<string, unknown>;
  business_value: Record<string, unknown>;
  aipify_explanation: string;
  ownership: Record<string, unknown>;
  timeline: Array<{ label: string; at: string | null }>;
  recent_activity: AutomationActivityItem[];
};
