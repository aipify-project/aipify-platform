export type PartnerCommissionRecord = {
  id: string;
  commission_key: string;
  sale_reference: string;
  customer: string;
  package: string;
  sale_value: number;
  commission_rate_pct: number;
  commission_amount: number;
  status: string;
  tier_label: string;
  record_date: string;
  explanation: {
    why_earned?: string;
    customer?: string;
    package?: string;
    tier_applied?: string;
    calculation?: string;
    renewal_note?: string;
    formula?: string;
  };
};

export type PartnerCommissionsDashboard = {
  has_access: boolean;
  org_id: string;
  positioning: string;
  access: Record<string, boolean | string>;
  current_commission_level: string;
  current_commission_rate_pct: number;
  this_month_earnings: number;
  pending_commissions: number;
  approved_commissions: number;
  paid_commissions: number;
  milestone: {
    current_tier: string;
    next_tier: string;
    sales_remaining: number;
    potential_commission_increase_pct: number;
    milestone_message: string;
  };
  motivation: {
    current_performance: string;
    next_goal: string;
    potential_earnings_note: string;
    leaderboard_position: string;
  };
  records: PartnerCommissionRecord[];
  timeline: Array<{
    id: string;
    event_type: string;
    title: string;
    summary: string;
    created_at: string;
  }>;
  filters: {
    statuses: string[];
    packages: string[];
    tiers: number[];
  };
};

export type PartnerCommissionsSummary = {
  has_access: boolean;
  performance_insights: {
    best_performing_month: string;
    average_sale_value: number;
    conversion_rate_pct: number;
    tier_progress_pct: number;
    milestone_achievements: string;
  };
  totals: {
    pending: number;
    approved: number;
    paid: number;
  };
};

export type PartnerCommissionsMilestones = {
  has_access: boolean;
  current_tier: {
    tier_number: number;
    tier_label: string;
    rate_pct: number;
    qualifying_sales: number;
  };
  next_tier: {
    tier_number: number | null;
    tier_label: string;
    rate_pct: number;
    sales_remaining: number;
    potential_increase_pct: number;
    estimated_opportunity: string;
  };
  tiers: Array<{
    tier_number: number;
    tier_label: string;
    min_sales: number;
    max_sales: number | null;
    commission_rate_pct: number;
  }>;
};

export type PartnerCommissionsForecast = {
  has_access: boolean;
  estimated_earnings: number;
  tier_projection: string;
  sales_needed: number;
  growth_opportunities: string[];
  forecast_note: string;
};

export type PartnerCommissionsFilters = {
  customer?: string;
  package?: string;
  status?: string;
  tier?: number;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  search?: string;
};
