export type HostsReferralRole = "host" | "service_provider" | "growth_partner";

export type HostsReferralStatus =
  | "invited"
  | "registered"
  | "trial_started"
  | "converted"
  | "active"
  | "rewarded";

export type HostsReferralRewardType =
  | "fixed"
  | "percentage"
  | "account_credit"
  | "free_property_license";

export type HostsReferralModuleKey =
  | "referral_links"
  | "referral_tracking"
  | "conversion_monitoring"
  | "reward_monitoring"
  | "referral_assets"
  | "growth_partner_oversight";

export type HostsReferralWidgets = {
  referrals_this_month: number;
  active_referrals: number;
  pending_rewards: number;
  lifetime_referrals: number;
};

export type HostsReferralLink = {
  referral_role: HostsReferralRole | string;
  referral_code: string;
  referral_url: string;
  is_active: boolean;
};

export type HostsReferralRecord = {
  id: string;
  referral_key: string;
  referral_role: HostsReferralRole | string;
  referred_label: string;
  status: HostsReferralStatus | string;
  conversion_at: string | null;
  created_at: string;
  updated_at: string;
};

export type HostsReferralReward = {
  id: string;
  referral_id: string | null;
  reward_type: HostsReferralRewardType | string;
  reward_label: string;
  reward_value: number | null;
  status: string;
  unlocked_at: string | null;
  created_at: string;
};

export type HostsReferralRewardCatalogItem = {
  key: string;
  label: string;
  reward: string;
  reward_type: string;
};

export type HostsReferralAsset = {
  key: string;
  label: string;
  format: string;
};

export type HostsReferralEvent = {
  event_type: string;
  summary: string | null;
  created_at: string;
};

export type HostsGrowthPartnerSummary = {
  enabled: boolean;
  accounts_oversight?: number;
  commission_summary?: { pending: number; paid: number; currency: string };
  conversion_rate_pct?: number;
  reporting_period?: string;
};

export type HostsReferralModule = {
  key: HostsReferralModuleKey | string;
  label: string;
  description: string;
};

export type AipifyHostsReferralDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  referral_role: HostsReferralRole | string;
  human_oversight_required: boolean;
  positioning: string;
  modules: HostsReferralModule[];
  governance: {
    principle: string;
    audit_required: boolean;
    prevent_duplicate_referrals: boolean;
    prevent_self_referrals: boolean;
    reward_history_tracked: boolean;
  };
  reward_catalog: HostsReferralRewardCatalogItem[];
  knowledge_categories: string[];
  notification_triggers: string[];
  referral_roles: string[];
  referral_statuses: string[];
  reward_types: string[];
  widgets: HostsReferralWidgets;
  referral_links: HostsReferralLink[];
  referrals: HostsReferralRecord[];
  rewards: HostsReferralReward[];
  recent_events: HostsReferralEvent[];
  growth_partner: HostsGrowthPartnerSummary;
  referral_assets: HostsReferralAsset[];
};

export type AipifyHostsReferralCard = {
  has_customer: boolean;
  enabled?: boolean;
  package_key?: string;
  referral_role?: string;
  widgets?: HostsReferralWidgets;
  human_oversight_required?: boolean;
  positioning?: string;
  route?: string;
};

export type GenerateReferralLinkResult = {
  success: boolean;
  referral_role?: string;
  referral_code?: string;
  referral_url?: string;
  download_assets_route?: string;
};
