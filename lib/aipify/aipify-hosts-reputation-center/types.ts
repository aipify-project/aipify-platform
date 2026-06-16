export type HostsReputationSectionKey =
  | "review_overview"
  | "property_reviews"
  | "review_trends"
  | "improvement_opportunities"
  | "recovery_actions";

export type HostsPropertyReviewRow = {
  id: string;
  review_key: string;
  property_id: string | null;
  property: string;
  guest_name: string;
  stay_period: string;
  stay_start: string;
  stay_end: string;
  overall_rating: number;
  review_date: string;
  review_status: string;
  guest_summary: string;
  category_scores: Record<string, number>;
};

export type HostsRecoveryCaseRow = {
  id: string;
  case_key: string;
  review_id: string | null;
  property_id: string | null;
  property: string;
  action_type: string;
  assigned_owner: string;
  due_date: string;
  case_status: string;
  resolution_notes: string;
  is_overdue: boolean;
};

export type HostsReputationTrendPoint = {
  month: string;
  avg_rating: number;
  review_count?: number;
};

export type HostsPropertyComparison = {
  property_id: string;
  property: string;
  avg_rating: number;
  review_count: number;
  reputation_status: string;
};

export type HostsImprovementOpportunity = {
  type: string;
  category?: string;
  property_id?: string;
  property?: string;
  label: string;
  severity: string;
  avg_rating?: number;
  current_avg?: number;
  prior_avg?: number;
};

export type HostsReputationStats = {
  average_rating: number;
  properties_requiring_attention: number;
  top_performing_properties: Array<{
    property_id: string;
    property: string;
    avg_rating: number;
    review_count: number;
  }>;
  open_recovery_cases: number;
  new_reviews: number;
  action_required_reviews: number;
};

export type HostsReputationTrends = {
  rating_trends: HostsReputationTrendPoint[];
  category_trends: Record<string, HostsReputationTrendPoint[]>;
  property_comparisons: HostsPropertyComparison[];
  monthly_performance: HostsReputationTrendPoint[];
};

export type HostsReputationCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  review_statuses: string[];
  review_categories: string[];
  stats: HostsReputationStats;
  properties: Array<{ id: string; display_name: string }>;
  reviews: HostsPropertyReviewRow[];
  trends: HostsReputationTrends | null;
  improvement_opportunities: HostsImprovementOpportunity[];
  recovery_cases: HostsRecoveryCaseRow[];
};

export type HostsReputationCenterActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
};
