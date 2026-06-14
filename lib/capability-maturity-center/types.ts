export type CapabilityItem = {
  capability_key: string;
  domain: string;
  label: string;
  summary: string;
  current_level: number;
  previous_level: number;
  current_level_label: string;
  previous_level_label: string;
  maturity_score: number;
  momentum: string;
};

export type CapabilityMilestone = {
  milestone_key: string;
  capability_key: string;
  label: string;
  achieved_at: string | null;
};

export type RoadmapItem = {
  roadmap_key: string;
  priority_type: string;
  title: string;
  summary: string;
  related_domain: string;
  status: string;
};

export type MaturitySnapshot = {
  snapshot_key: string;
  label: string;
  overall_score: number;
  summary: string;
  captured_at: string | null;
};

export type MaturityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type MaturityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type MaturityReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type MaturityLevel = {
  level: number;
  key: string;
  label: string;
  description: string;
};

export type CapabilityMaturityCenter = {
  dashboard: {
    overall_maturity_score: number;
    overall_maturity_level: string;
    capabilities_assessed: number;
    strongest_count: number;
    developing_count: number;
    improving_count: number;
    improvement_opportunities: number;
    executive_confidence: number;
    participation_satisfaction: number;
  } | null;
  capabilities: CapabilityItem[];
  milestones: CapabilityMilestone[];
  roadmap: RoadmapItem[];
  snapshots: MaturitySnapshot[];
  insights: MaturityInsight[];
  recommendations: MaturityRecommendation[];
  governance_reviews: MaturityReview[];
  executive_view: {
    organizational_strengths: string;
    capability_gaps: string;
    improvement_momentum: string;
    strategic_readiness: string;
  } | null;
  maturity_levels: MaturityLevel[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
