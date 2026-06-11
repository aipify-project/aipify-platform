export type SubscriptionPlanKey =
  | "starter"
  | "business"
  | "professional"
  | "enterprise"
  | "internal";

export type SubscriptionStatus =
  | "trial"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired"
  | "internal";

export type BillingProvider = "stripe" | "paddle" | "manual";

export type PlanModule = {
  module_key: string;
  enabled?: boolean;
  licensed?: boolean;
};

export type SubscriptionInfo = {
  id?: string;
  plan_key?: SubscriptionPlanKey;
  status?: SubscriptionStatus;
  started_at?: string;
  expires_at?: string | null;
  trial_ends_at?: string | null;
  trial_days_remaining?: number | null;
  billing_cycle?: string;
};

export type SpmSettings = {
  trial_duration_days?: number;
  trial_notifications_enabled?: boolean;
  billing_provider?: BillingProvider;
  billing_ready?: boolean;
};

export type AvailablePlan = {
  plan_key: SubscriptionPlanKey;
  label?: string;
  highlights?: string[];
};

export type UpgradeOpportunity = {
  plan_key: SubscriptionPlanKey;
  reason?: string;
};

export type BillingScaffold = {
  providers?: BillingProvider[];
  active_provider?: BillingProvider;
  ready?: boolean;
  note?: string;
};

export type DowngradeImpact = {
  current_plan?: string;
  new_plan?: string;
  modules_lost?: string[];
  critical_modules_lost?: string[];
  requires_confirmation?: boolean;
};

export type SubscriptionPlanManagementCard = {
  has_organization: boolean;
  plan_key?: SubscriptionPlanKey;
  status?: SubscriptionStatus;
  trial_ends_at?: string | null;
  module_count?: number;
  philosophy?: string;
};

export type SubscriptionPlanManagementDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  subscription?: SubscriptionInfo;
  settings?: SpmSettings;
  available_plans: AvailablePlan[];
  active_modules: PlanModule[];
  upgrade_opportunities: UpgradeOpportunity[];
  billing_scaffold?: BillingScaffold;
};
