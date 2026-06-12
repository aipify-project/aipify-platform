export type PersonalProductivityProfile = {
  id?: string;
  user_id?: string;
  preferences?: Record<string, unknown>;
  quiet_hours?: Record<string, unknown>;
  reminder_settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type PersonalProductivityBriefing = {
  id?: string;
  briefing_date?: string;
  status?: string;
  summary?: string;
  content?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type PersonalProductivityReminder = {
  id?: string;
  title?: string;
  remind_at?: string;
  channel?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type ProductivityRecommendation = {
  type?: string;
  confidence?: string;
  summary?: string;
  [key: string]: unknown;
};

export type PersonalProductivityEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  open_priorities?: number;
  overdue_items?: number;
  upcoming_commitments_7d?: number;
  scheduled_reminders?: number;
  [key: string]: unknown;
};

export type PersonalProductivityEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    todays_priorities?: Record<string, unknown>[];
    upcoming_commitments?: Record<string, unknown>[];
    overdue_work?: Record<string, unknown>[];
    completion_trends?: Record<string, unknown>[];
    focus_recommendations?: ProductivityRecommendation[];
    daily_briefing?: Record<string, unknown>;
  };
  reminders?: PersonalProductivityReminder[];
  recommendations?: ProductivityRecommendation[];
  profile?: PersonalProductivityProfile;
  settings?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type PersonalProductivityExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  profile?: PersonalProductivityProfile;
  briefings?: PersonalProductivityBriefing[];
  reminders?: PersonalProductivityReminder[];
  summary?: Record<string, unknown>;
  recommendations?: ProductivityRecommendation[];
  metadata_only?: boolean;
  [key: string]: unknown;
};
