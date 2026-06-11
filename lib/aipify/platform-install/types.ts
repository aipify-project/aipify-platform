export type PlatformConnector = {
  id: string;
  connector_key: string;
  name: string;
  description: string;
  install_method: string;
};

export type WizardStep = {
  id: string;
  step_key: string;
  step_order: number;
  title: string;
  status: string;
};

export type ConnectorInstallation = {
  id: string;
  platform: string;
  domain?: string | null;
  install_status: string;
  plugin_status?: string | null;
  widget_visible?: boolean;
  last_health_score?: number | null;
};

export type PlatformPermission = {
  id: string;
  permission_key: string;
  permission_label: string;
  granted: boolean;
  required: boolean;
  installation_id?: string;
};

export type InstallationError = {
  id: string;
  error_code: string;
  title: string;
  explanation: string;
  fix_recommendation: string;
  can_retry?: boolean;
  resolved?: boolean;
};

export type AssistantMessage = {
  id: string;
  message_type: string;
  content: string;
  created_at?: string;
};

export type HealthCheck = {
  id: string;
  check_type: string;
  status: string;
  summary: string;
};

export type TrialReminder = {
  id: string;
  reminder_day: number;
  message: string;
  sent_at?: string | null;
};

export type PlatformInstallCard = {
  has_customer: boolean;
  install_score?: number;
  steps_total?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type PlatformInstallDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  install_assistant_enabled?: boolean;
  trial_days?: number;
  require_payment_before_trial?: boolean;
  install_score?: number;
  steps_completed?: number;
  steps_total?: number;
  health_checks_passed?: number;
  active_installations?: number;
  session_id?: string;
  session_status?: string;
  trial_status?: string;
  current_step?: string;
  selected_platform?: string | null;
  trial_ends_at?: string | null;
  payment_method_registered?: boolean;
  billing_copy_short?: string;
  billing_copy_full?: string;
  wizard_steps: WizardStep[];
  platform_connectors: PlatformConnector[];
  connector_installations: ConnectorInstallation[];
  platform_permissions: PlatformPermission[];
  installation_errors: InstallationError[];
  assistant_messages: AssistantMessage[];
  health_checks: HealthCheck[];
  trial_reminders: TrialReminder[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type InstallStatus = {
  has_customer: boolean;
  session_status?: string;
  trial_status?: string;
  current_step?: string;
  selected_platform?: string | null;
  trial_ends_at?: string | null;
  payment_method_registered?: boolean;
  install_score?: number;
};

export type BillingTrialStatus = {
  has_customer: boolean;
  trial_status?: string;
  plan_key?: string;
  trial_starts_at?: string | null;
  trial_ends_at?: string | null;
  payment_method_registered?: boolean;
  billing_copy_short?: string;
  billing_copy_full?: string;
};

export type PlatformInstallActionResult = {
  status?: string;
  error?: string;
  [key: string]: unknown;
};

export type PlatformInstallBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
