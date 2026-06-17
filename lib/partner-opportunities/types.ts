export type PartnerOpportunity = {
  id: string;
  opportunity_key: string;
  company_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  country_code: string;
  industry: string;
  opportunity_value: number;
  expected_close_date: string;
  stage_key: string;
  stage_label: string;
  owner_auth_user_id: string;
  owner_name: string;
  next_action: string;
  next_action_due: string;
  last_activity_at: string;
  health_score_label: string;
  health_score_pct: number;
  potential_commission: number;
  insights: string[];
  created_at: string;
  updated_at: string;
};

export type PartnerOpportunitiesOverview = {
  has_access: boolean;
  can_write?: boolean;
  team_role?: string;
  access_denied?: boolean;
  positioning?: string;
  dashboard?: {
    active_opportunities: number;
    new_opportunities: number;
    qualified_opportunities: number;
    proposal_opportunities: number;
    closed_won: number;
    closed_lost: number;
    pipeline_value: number;
  };
  performance?: {
    conversion_rate_pct: number;
    average_deal_size: number;
    win_rate_pct: number;
    pipeline_growth: number;
  };
  opportunities: PartnerOpportunity[];
  stages: Array<{ stage_key: string; stage_label: string; sort_order: number; weight_pct: number }>;
  empty_state?: { title: string; message: string; cta: string };
};

export type PartnerOpportunityDetail = {
  has_access: boolean;
  can_write?: boolean;
  opportunity?: PartnerOpportunity;
  timeline?: Array<{ id: string; activity_type: string; title: string; summary: string; created_at: string }>;
  stage_history?: Array<{ from_stage: string; to_stage: string; created_at: string }>;
};

export type PartnerOpportunitiesPipeline = {
  has_access: boolean;
  kanban: Record<string, PartnerOpportunity[]>;
};

export type PartnerOpportunitiesForecast = {
  has_access: boolean;
  expected_revenue: number;
  weighted_revenue: number;
  potential_commission: number;
  by_month: Array<{ month: string; value: number; weighted: number }>;
};

export type PartnerOpportunitiesFilters = {
  stage?: string;
  country?: string;
  industry?: string;
  value_min?: number;
  owner?: string;
  status?: string;
  search?: string;
};
