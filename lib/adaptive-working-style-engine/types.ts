import type {
  AdaptationSignalType,
  AwseReminderFrequency,
  DetailLevel,
  PreferredSummaryTime,
  WorkingProfile,
} from "./dimensions";

export type AwseNotificationCategories = {
  email?: boolean;
  task?: boolean;
  meeting?: boolean;
  support?: boolean;
  sales?: boolean;
  relationship?: boolean;
};

export type AwseDashboardLayout = {
  widgets?: string[];
  layout?: string;
};

export type AwseUserPreferences = {
  id: string;
  tenant_id: string;
  user_id: string;
  working_profile: WorkingProfile;
  detail_level: DetailLevel;
  reminder_frequency: AwseReminderFrequency;
  preferred_summary_time: PreferredSummaryTime;
  preferred_notification_categories: AwseNotificationCategories;
  preferred_dashboard_layout: AwseDashboardLayout;
  focus_mode_enabled: boolean;
  adaptive_learning_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type AwseAdaptationSignal = {
  id: string;
  signal_type: AdaptationSignalType;
  signal_value: string;
  source_module: string;
  created_at: string;
};

export type AwsePackageCapabilities = {
  plan_key: string;
  manual_preferences_only: boolean;
  adaptive_learning_allowed: boolean;
  enterprise_templates: boolean;
  user_profiles: boolean;
  daily_summary_customization: boolean;
};

export type AwseDepartmentTemplate = {
  id: string;
  department_name: string;
  working_profile: WorkingProfile;
  detail_level: DetailLevel;
  reminder_frequency: AwseReminderFrequency;
  role_names: string[];
  is_default: boolean;
};

export type AwseCenterBundle = {
  has_customer: boolean;
  preferences?: AwseUserPreferences;
  capabilities?: AwsePackageCapabilities;
  signals?: AwseAdaptationSignal[];
  department_templates?: AwseDepartmentTemplate[];
  transparency_note?: string;
  adaptation_suggestion?: string | null;
};

export type AwseStyleCueKey =
  | "prefer_compact"
  | "prefer_detailed"
  | "reduce_reminders"
  | "increase_reminders";

export type AwseStyleCueResult = {
  detected: boolean;
  cueKey: AwseStyleCueKey;
  reply: string;
  suggested_detail_level?: DetailLevel;
  suggested_reminder_frequency?: AwseReminderFrequency;
};
