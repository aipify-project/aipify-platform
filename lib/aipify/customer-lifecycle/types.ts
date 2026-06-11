export const LIFECYCLE_STAGES = [
  "discovery",
  "onboarding",
  "activation",
  "adoption",
  "expansion",
  "optimization",
  "advocacy",
] as const;

export const HEALTH_BANDS = [
  "thriving",
  "healthy",
  "support_opportunity",
  "at_risk",
  "critical",
] as const;

export type CustomerMilestone = {
  id: string;
  milestone_type: string;
  description: string;
  is_quick_win?: boolean;
  achieved_at?: string;
};

export type CustomerRecommendation = {
  id: string;
  recommendation: string;
  category: string;
  rationale?: string | null;
  priority: string;
  status?: string;
  created_at?: string;
};

export type CustomerPlaybook = {
  id: string;
  playbook_name: string;
  audience: string;
  content?: Record<string, unknown>;
  active?: boolean;
};

export type CustomerLifecycleCard = {
  has_customer: boolean;
  success_score?: number;
  health_band?: string;
  health_band_label?: string;
  lifecycle_stage?: string;
  quick_wins_count?: number;
  philosophy?: string;
  no_pressure?: boolean;
};

export type CustomerLifecycleDashboard = {
  has_customer: boolean;
  no_pressure?: boolean;
  expansion_follows_value?: boolean;
  orchestration_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  success_score?: number;
  health_band?: string;
  health_band_label?: string;
  lifecycle_stage?: string;
  lifecycle_stage_label?: string;
  score_components?: Record<string, number>;
  milestones: CustomerMilestone[];
  quick_wins: CustomerMilestone[];
  recommendations: CustomerRecommendation[];
  playbooks: CustomerPlaybook[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  signals?: { positive?: string[]; risk?: string[] };
  lifecycle_stages?: Array<{ key: string; label: string; purpose: string }>;
  integrations?: Record<string, string>;
};

export type RecommendationActionResult = {
  status?: string;
  no_pressure?: boolean;
  error?: string;
};
