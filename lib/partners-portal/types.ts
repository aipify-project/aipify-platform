export type PartnersPortalConversionMetrics = {
  conversion_rate_pct: number;
  converted: number;
  total_leads: number;
};

export type PartnersPortalPipelineStage = {
  stage: string;
  count: number;
};

export type PartnersPortalFollowUp = {
  id: string;
  company_name: string;
  contact_name: string;
  lead_status: string;
  follow_up_at: string;
};

export type PartnersPortalRanking = {
  rank: number;
  label: string;
  score: number;
};

export type PartnersPortalMonthlySummary = {
  leads_this_month: number;
  converted_customers: number;
  pending_commissions: number;
  upcoming_payouts: number;
};

export type PartnersPortalReferralStatistics = {
  active: number;
  converted: number;
  invited: number;
};

export type PartnersPortalDashboard = {
  principle: string;
  access_role: string;
  leads_assigned: number;
  conversion_metrics: PartnersPortalConversionMetrics;
  pipeline_overview: PartnersPortalPipelineStage[];
  upcoming_follow_ups: PartnersPortalFollowUp[];
  partner_rankings: PartnersPortalRanking[];
  monthly_performance_summary: PartnersPortalMonthlySummary;
  referral_statistics: PartnersPortalReferralStatistics;
  certification_progress: number;
  certification_status: string;
  privacy_note: string;
};

export type PartnersPortalAccess = {
  has_access: boolean;
  role: string;
};

export type PartnersPortalLabels = {
  dashboard: {
    title: string;
    subtitle: string;
    loading: string;
    principle: string;
    privacyNote: string;
    leadsAssigned: string;
    conversionMetrics: string;
    conversionRate: string;
    pipelineOverview: string;
    upcomingFollowUps: string;
    partnerRankings: string;
    monthlyPerformance: string;
    referralStatistics: string;
    certificationProgress: string;
    activeReferrals: string;
    convertedReferrals: string;
    invitedReferrals: string;
    leadsThisMonth: string;
    convertedCustomers: string;
    noFollowUps: string;
    portalModules: string;
    openModule: string;
  };
  foundation: {
    back: string;
    structureNote: string;
  };
  shell: {
    portalBadge: string;
    portalTitle: string;
    portalSubtitle: string;
    governanceNote: string;
    accessDenied: string;
    loading: string;
  };
};
