export type HostsGuestExperienceSectionKey =
  | "experience_overview"
  | "guest_feedback"
  | "service_recovery"
  | "improvement_opportunities"
  | "experience_trends";

export type HostsExperienceMetricsRow = {
  id: string;
  metrics_key: string;
  property_id: string | null;
  property: string;
  overall_satisfaction: number;
  check_in_experience: number;
  property_cleanliness: number;
  communication_quality: number;
  property_accuracy: number;
  issue_resolution: number;
  likelihood_to_return: number;
  experience_status: string;
  satisfaction_trend: number;
  returning_guest_satisfaction: number;
};

export type HostsGuestFeedbackRow = {
  id: string;
  feedback_key: string;
  property_id: string | null;
  property: string;
  stay_period_start: string;
  stay_period_end: string;
  feedback_category: string;
  rating: number;
  comments: string;
  submitted_at: string;
};

export type HostsImprovementOpportunityRow = {
  id: string;
  opportunity_key: string;
  property_id: string | null;
  property: string;
  opportunity_type: string;
  category: string;
  summary: string;
  severity: string;
  is_active: boolean;
};

export type HostsRecoveryCaseRow = {
  id: string;
  recovery_key: string;
  property_id: string | null;
  property: string;
  case_status: string;
  assigned_owner: string;
  resolution_notes: string;
  due_date: string;
  opened_at: string;
  is_overdue: boolean;
};

export type HostsExperienceTrendPoint = {
  month: string;
  overall_satisfaction: number;
  returning_guest_satisfaction: number;
  category_scores: Record<string, number>;
  property: string;
};

export type HostsImprovementArea = {
  category: string;
  count: number;
  severity: string;
};

export type HostsCategoryPerformance = Record<string, number>;

export type HostsGuestExperienceStats = {
  guest_satisfaction_score: number;
  portfolio_status: string;
  open_recovery_cases: number;
  overdue_recovery_cases: number;
  active_improvement_areas: number;
  critical_properties: number;
  excellent_properties: number;
  feedback_count_30d: number;
};

export type HostsGuestExperienceDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  experience_metrics: string[];
  experience_statuses: string[];
  stats: HostsGuestExperienceStats;
  category_performance: HostsCategoryPerformance;
  top_improvement_areas: HostsImprovementArea[];
  strongest_properties: HostsExperienceMetricsRow[];
  monthly_trends: HostsExperienceTrendPoint[];
  property_metrics: HostsExperienceMetricsRow[];
  guest_feedback: HostsGuestFeedbackRow[];
  recovery_cases: HostsRecoveryCaseRow[];
  improvement_opportunities: HostsImprovementOpportunityRow[];
};

export type HostsGuestExperienceActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
};
