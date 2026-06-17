export type PartnerPortalSectionKey =
  | "dashboard"
  | "opportunities"
  | "customers"
  | "academy"
  | "materials"
  | "commissions"
  | "settlements"
  | "performance"
  | "advisor"
  | "settings";

export type PartnerPortalProfile = {
  has_access: boolean;
  org_id: string;
  org_name: string;
  partner_type: string;
  activation_status: string;
  certification_status: string;
  team_role: string;
  permissions: Record<string, boolean>;
  two_factor: {
    enabled: boolean;
    required_for: string[];
    settings_route: string;
  };
  profile: {
    company_name: string;
    organization_number: string;
    vat_number: string;
    business_address: string;
    contact_email: string;
    contact_phone: string;
    website: string;
    country_code: string;
    preferred_language: string;
    bank_account_holder: string;
    bank_account_number: string;
    bank_routing: string;
    tax_information: string;
  };
  verifications: Array<{
    verification_type: string;
    verification_status: string;
    verified_at: string;
  }>;
  onboarding: {
    current_step: string;
    completion_pct: number;
    missing_requirements: string[];
    recommended_next_step: string;
  };
  business_verified: boolean;
};

export type PartnerPortalDashboard = {
  has_access: boolean;
  org_id: string;
  org_name: string;
  partner_type: string;
  activation_status: string;
  positioning: string;
  health_score: number;
  active_opportunities: number;
  customers_introduced: number;
  pending_commissions: number;
  pending_settlements: number;
  certification_status: string;
  certification_progress: number;
  performance_overview: {
    leads_this_month: number;
    active_referrals: number;
    conversion_rate_pct: number;
  };
  onboarding: {
    completion_pct: number;
    missing_requirements: string[];
    recommended_next_step: string;
  };
  notifications_unread: number;
  routes: Array<{ key: string; route: string }>;
  two_factor: {
    enabled: boolean;
    required_for: string[];
    settings_route: string;
  };
};

export type PartnerPortalTeam = {
  has_access: boolean;
  org_id: string;
  team_role: string;
  permissions: Record<string, boolean>;
  roles: string[];
  members: Array<{
    id: string;
    member_name: string;
    member_email: string;
    team_role: string;
    member_status: string;
    invited_at: string;
    joined_at: string;
    permissions: Record<string, boolean>;
  }>;
  team_performance: {
    active_members: number;
    invited_members: number;
  };
};

export type PartnerPortalActivity = {
  has_access: boolean;
  org_id: string;
  activity: Array<{
    id: string;
    activity_type: string;
    title: string;
    summary: string;
    created_at: string;
  }>;
  notifications: Array<{
    id: string;
    notification_type: string;
    title: string;
    body: string;
    read_at: string;
    created_at: string;
  }>;
};

export type PartnerPortalSectionData = {
  dashboard: PartnerPortalDashboard | null;
  profile: PartnerPortalProfile | null;
  team: PartnerPortalTeam | null;
  activity: PartnerPortalActivity | null;
  leads: unknown[];
  referrals: unknown[];
  commissions: unknown[];
  payouts: unknown[];
  academy: { modules: unknown[]; certification_progress: number } | null;
  assets: unknown[];
};
