export const OPPORTUNITY_CATEGORIES = [
  "operational",
  "knowledge",
  "automation",
  "organizational",
  "marketplace",
  "blueprint",
  "value",
  "risk_reduction",
] as const;

export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;

export const STRATEGIC_HORIZONS = ["short_term", "mid_term", "long_term"] as const;

export const HEALTH_BANDS = [
  "highly_prepared",
  "prepared",
  "improvement_recommended",
  "resilience_concerns",
  "critical_gap",
] as const;

export type StrategicOpportunity = {
  id: string;
  category: string;
  horizon: string;
  horizon_label?: string;
  title: string;
  description: string;
  expected_value?: string | null;
  risk_level: string;
  confidence_level: string;
  status?: string;
  created_at?: string;
};

export type StrategicRisk = {
  id: string;
  title: string;
  description: string;
  impact_level: string;
  confidence_level: string;
  mitigation_suggestion?: string | null;
  status?: string;
  created_at?: string;
};

export type StrategicRecommendation = {
  id: string;
  opportunity_id?: string | null;
  summary: string;
  opportunity_description?: string | null;
  supporting_evidence?: unknown;
  expected_benefits?: string | null;
  potential_risks?: string | null;
  confidence_level: string;
  next_steps?: string[] | unknown;
  horizon?: string;
  horizon_label?: string;
  status?: string;
  created_at?: string;
};

export type StrategicCard = {
  has_customer: boolean;
  overall_score?: number;
  health_band?: string;
  open_opportunities?: number;
  open_risks?: number;
  philosophy?: string;
  human_leadership_required?: boolean;
};

export type StrategicDashboard = {
  has_customer: boolean;
  human_leadership_required?: boolean;
  recommendations_enabled?: boolean;
  overall_score?: number;
  health_band?: string;
  score_components?: Record<string, number>;
  opportunities: StrategicOpportunity[];
  risks: StrategicRisk[];
  recommendations: StrategicRecommendation[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  horizons?: Array<{ horizon: string; label: string; focus: string }>;
  trends?: Record<string, number>;
  integrations?: Record<string, string>;
};

export type OpportunityDetail = {
  opportunity: StrategicOpportunity & { supporting_evidence?: Record<string, unknown> };
  recommendations: StrategicRecommendation[];
  human_leadership_required?: boolean;
};

export type RecommendationActionResult = {
  status?: string;
  human_leadership_required?: boolean;
  note?: string;
  error?: string;
};
