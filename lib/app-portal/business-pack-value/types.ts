export type PackValueCategory =
  | "productivity_value"
  | "operational_efficiency"
  | "customer_experience"
  | "revenue_enablement"
  | "cost_reduction"
  | "risk_reduction"
  | "employee_experience"
  | "strategic_value";

export type PackRoiIndicator =
  | "emerging_value"
  | "positive_roi"
  | "strong_roi"
  | "strategic_roi_leader";

export type PackValueTrend =
  | "increasing"
  | "stable"
  | "declining"
  | "unrealized_opportunity";

export type PackValueTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type PackValueSnapshot = {
  snapshot_date: string;
  estimated_value: number;
  potential_value: number;
  time_saved_hours: number;
  adoption_score: number;
  value_trend: string;
};

export type PackValueRecommendation = {
  id: string;
  key: string;
  pack_key: string;
};

export type PackValueHighlight = {
  pack_key: string;
  name: string;
  estimated_value?: number;
};

export type PackValueCard = {
  id: string;
  pack_key: string;
  name: string;
  department?: string;
  estimated_value: number;
  potential_value: number;
  time_saved_hours: number;
  adoption_score: number;
  utilization_rate: number;
  value_trend: PackValueTrend | string;
  roi_indicator: PackRoiIndicator | string;
  primary_category: PackValueCategory | string;
  category_breakdown?: Record<string, number>;
  executive_summary: string;
  improvement_opportunities?: string[];
  key_wins?: string[];
  strategic_observations?: string[];
  installed_at?: string | null;
  last_activity_at?: string | null;
  timeline?: PackValueTimelineEvent[];
};

export type PackValueExecutiveReport = {
  executive_summary: string;
  pack_contribution?: number;
  key_wins?: string[];
  improvement_areas?: string[];
  recommendations?: PackValueRecommendation[];
  strategic_observations?: string[];
};

export type PackValueOverview = {
  found: boolean;
  can_full?: boolean;
  can_manage?: boolean;
  can_view?: boolean;
  has_value_data?: boolean;
  total_estimated_value?: number;
  total_time_saved_hours?: number;
  realized_value?: number;
  potential_value?: number;
  value_trends?: Record<string, number>;
  category_distribution?: Record<string, number>;
  highest_value_packs?: PackValueHighlight[];
  packs?: PackValueCard[];
  recommendations?: PackValueRecommendation[];
  executive_summary?: string;
  principle?: string;
};

export type PackValueDetail = PackValueCard & {
  found: boolean;
  value_snapshots?: PackValueSnapshot[];
  executive_report?: PackValueExecutiveReport;
  recommendations?: PackValueRecommendation[];
  can_export?: boolean;
};

export type PackValueReports = {
  found: boolean;
  can_export?: boolean;
  executive_summary?: string;
  total_estimated_value?: number;
  total_time_saved_hours?: number;
  realized_value?: number;
  potential_value?: number;
  highest_value_packs?: PackValueHighlight[];
  value_trends?: Record<string, number>;
  category_distribution?: Record<string, number>;
  recommendations?: PackValueRecommendation[];
  principle?: string;
  report_generated_at?: string;
};

export type PackValueExportResult = {
  export_id: string;
  status: string;
  format: string;
  file_name: string;
  content_type: string;
  content: string;
  estimate_disclaimer?: string;
};

export type PackValueLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    packKey: string;
    valueCategory: string;
    department: string;
    periodFrom: string;
    roiIndicator: string;
    adoptionStatus: string;
    all: string;
    lowAdoption: string;
    healthyAdoption: string;
    highAdoption: string;
  };
  dashboard: {
    totalEstimatedValue: string;
    totalTimeSaved: string;
    highestValuePacks: string;
    valueTrends: string;
    realizedVsPotential: string;
    recommendedActions: string;
    executiveSummary: string;
    installedPacks: string;
    valueTimeline: string;
    executiveReport: string;
    exportReport: string;
  };
  card: {
    estimatedValue: string;
    timeSaved: string;
    adoptionScore: string;
    utilizationRate: string;
    valueTrend: string;
    roiIndicator: string;
    improvementOpportunities: string;
    executiveSummary: string;
    viewDetails: string;
    keyWins: string;
    strategicObservations: string;
  };
  export: {
    pdf: string;
    excel: string;
    csv: string;
    exporting: string;
    success: string;
    estimateNote: string;
  };
  categories: Record<string, string>;
  roiIndicators: Record<string, string>;
  valueTrends: Record<string, string>;
  recommendations: Record<string, string>;
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    exactRoi: string;
    exactRoiAnswer: string;
    whyImportant: string;
    whyImportantAnswer: string;
  };
};

export const PACK_VALUE_CATEGORIES: PackValueCategory[] = [
  "productivity_value", "operational_efficiency", "customer_experience", "revenue_enablement",
  "cost_reduction", "risk_reduction", "employee_experience", "strategic_value",
];

export const PACK_ROI_INDICATORS: PackRoiIndicator[] = [
  "emerging_value", "positive_roi", "strong_roi", "strategic_roi_leader",
];

export const PACK_VALUE_TRENDS: PackValueTrend[] = [
  "increasing", "stable", "declining", "unrealized_opportunity",
];

export const PACK_VALUE_EXPORT_FORMATS = ["pdf", "excel", "csv"] as const;
export type PackValueExportFormat = (typeof PACK_VALUE_EXPORT_FORMATS)[number];
