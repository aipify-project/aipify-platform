export type DiscoveryOpportunity = {
  opportunity_key: string;
  domain: string;
  title: string;
  summary: string;
  score_level: string;
  strategic_alignment: string;
  potential_impact: string;
  required_effort: string;
  workflow_status: string;
  status: string;
  created_at: string | null;
};

export type DiscoverySignal = {
  signal_key: string;
  signal_type: string;
  title: string;
  message: string;
};

export type OpportunityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type OpportunityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type OpportunityExecutiveReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OpportunityLearning = {
  learning_key: string;
  opportunity_key: string | null;
  title: string;
  content: string;
  outcome_type: string;
  created_at: string | null;
};

export type OpportunityDiscoveryCenter = {
  dashboard: {
    opportunities_identified: number;
    under_review: number;
    high_value: number;
    realization_trend: string;
    strategic_alignment_score: number;
    executive_satisfaction: number;
    companion_usefulness: number;
  } | null;
  opportunities: DiscoveryOpportunity[];
  discovery_signals: DiscoverySignal[];
  insights: OpportunityInsight[];
  recommendations: OpportunityRecommendation[];
  executive_reviews: OpportunityExecutiveReview[];
  opportunity_learning: OpportunityLearning[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
