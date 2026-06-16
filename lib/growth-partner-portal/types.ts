export type GrowthPartnerPortalSectionKey =
  | "dashboard"
  | "leads"
  | "referrals"
  | "commissions"
  | "payouts"
  | "academy"
  | "assets"
  | "team"
  | "settings";

export type GrowthPartnerLeadRow = {
  id: string;
  lead_key: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  lead_status: string;
  source: string;
  notes: string;
  created_at: string;
};

export type GrowthPartnerReferralRow = {
  id: string;
  referral_key: string;
  prospect_name: string;
  prospect_email: string;
  referral_status: string;
  invited_at: string;
  converted_at: string;
};

export type GrowthPartnerCommissionRow = {
  id: string;
  commission_key: string;
  customer_label: string;
  amount: number;
  commission_status: string;
  expected_payout_date: string;
  notes: string;
};

export type GrowthPartnerPayoutRow = {
  id: string;
  payout_key: string;
  payout_period: string;
  total_amount: number;
  payout_status: string;
  scheduled_date: string;
  paid_at: string;
};

export type GrowthPartnerAcademyModule = {
  id: string;
  module_key: string;
  module_type: string;
  title: string;
  summary: string;
  progress_pct: number;
  completed: boolean;
};

export type GrowthPartnerAssetRow = {
  id: string;
  asset_key: string;
  asset_type: string;
  title: string;
  description: string;
  download_label: string;
};

export type GrowthPartnerTeamMember = {
  id: string;
  member_name: string;
  member_email: string;
  team_role: string;
  member_status: string;
  invited_at: string;
  joined_at: string;
};

export type GrowthPartnerPortalStats = {
  leads_this_month: number;
  active_referrals: number;
  converted_customers: number;
  pending_commissions: number;
  upcoming_payouts: number;
  certification_status: string;
};

export type GrowthPartnerPortalDashboard = {
  has_access: boolean;
  org_id: string;
  org_name: string;
  active_section: string;
  team_role: string;
  positioning: string;
  governance: Record<string, boolean>;
  lead_statuses: string[];
  referral_statuses: string[];
  commission_statuses: string[];
  team_roles: string[];
  stats: GrowthPartnerPortalStats;
  settings: { default_section: string; notification_email: string };
  leads: GrowthPartnerLeadRow[];
  referrals: GrowthPartnerReferralRow[];
  commissions: GrowthPartnerCommissionRow[];
  payouts: GrowthPartnerPayoutRow[];
  academy: { modules: GrowthPartnerAcademyModule[]; certification_progress: number } | null;
  assets: GrowthPartnerAssetRow[];
  team: GrowthPartnerTeamMember[];
};

export type GrowthPartnerPortalActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
};
