import type { InstallPlatformOption, ModernInstallStepId } from "./experience";

export type ModernInstallFlowStep = {
  id: ModernInstallStepId;
  complete: boolean;
};

export type ModernInstallInstallationSummary = {
  id: string;
  name: string;
  domain: string | null;
  status: string;
  system_type: string;
  wizard_step: number;
  heartbeat_status: string;
  heartbeat_customer_label: string;
  modern_platform: string | null;
  last_seen_at: string | null;
};

export type ModernInstallState = {
  has_customer: boolean;
  principle?: string;
  selected_platform?: InstallPlatformOption | null;
  current_step?: ModernInstallStepId;
  flow?: ModernInstallFlowStep[];
  plan_limits?: {
    plan: string;
    max_domains: string | number | null;
    max_installations: string | number | null;
    used_domains: string | number;
    used_installations: string | number;
  };
  license?: {
    service_status: string;
    subscription_status: string;
    grace_period_ends_at?: string | null;
  };
  onboarding?: Record<string, unknown>;
  installations?: ModernInstallInstallationSummary[];
  developer_settings_available?: boolean;
};
