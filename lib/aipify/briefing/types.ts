export const BRIEF_TYPES = [
  "since_last_login",
  "daily_command_brief",
  "executive_brief",
  "operational_brief",
  "weekly_summary",
] as const;
export type BriefType = (typeof BRIEF_TYPES)[number];

export const BRIEF_SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;
export type BriefSeverity = (typeof BRIEF_SEVERITIES)[number];

export type BriefKeyItem = {
  id?: string;
  title: string;
  summary?: string | null;
  severity: string;
  requires_action?: boolean;
  action_url?: string | null;
  source_module?: string;
  icon?: string;
};

export type BriefingCard = {
  has_customer: boolean;
  enabled?: boolean;
  greeting?: string;
  summary?: string;
  key_items?: BriefKeyItem[];
  recommended_next_step?: string;
  metrics?: Record<string, number>;
  period_start?: string;
  summary_id?: string;
  privacy_note?: string;
};

export type BriefingSummary = {
  id: string;
  brief_type: string;
  title: string;
  summary: string;
  greeting?: string | null;
  status: string;
  generated_at: string;
};

export type BriefingEvent = {
  id: string;
  source_module: string;
  source_type: string;
  title: string;
  summary?: string | null;
  severity: string;
  requires_action: boolean;
  action_url?: string | null;
  occurred_at: string;
};

export type BriefingSettings = {
  enabled: boolean;
  since_last_login_enabled: boolean;
  daily_brief_enabled: boolean;
  executive_brief_enabled: boolean;
  operational_brief_enabled: boolean;
  default_daily_time: string;
  default_timezone: string;
  max_default_items: number;
  include_quality: boolean;
  include_support: boolean;
  include_knowledge: boolean;
  include_governance: boolean;
  include_automation: boolean;
  include_insights: boolean;
  include_integrations: boolean;
  include_memory?: boolean;
};

export type BriefingFull = BriefingCard & {
  key_items: BriefKeyItem[];
  recommended_actions?: BriefKeyItem[];
  has_customer: boolean;
};

export type NormalizedBriefingEvent = {
  source_module: string;
  source_type: string;
  source_id?: string;
  event_key: string;
  title: string;
  summary: string;
  severity: BriefSeverity;
  requires_action: boolean;
  action_url?: string;
  occurred_at?: string;
  metadata?: Record<string, unknown>;
};

export type CompanionContextBriefing = {
  has_customer: boolean;
  enabled?: boolean;
  context?: string;
  summary?: string;
  key_items?: BriefKeyItem[];
  metrics?: Record<string, number | string>;
  companion_note?: string;
  privacy_note?: string;
};
