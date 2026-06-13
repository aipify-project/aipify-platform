export type StrategicSignal = {
  signal_key: string;
  signal_type: string;
  domain: string;
  title: string;
  summary: string;
  priority_matrix: string;
  impact: string;
  urgency: string;
  trend_direction: string | null;
  status: string;
  created_at: string | null;
};

export type StrategicInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type StrategicRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type StrategicReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
  created_at: string | null;
};

export type ScenarioPrompt = {
  key: string;
  prompt: string;
};

export type ExecutiveStrategicIntelligenceCenter = {
  dashboard: {
    opportunities_count: number;
    risks_count: number;
    priorities_count: number;
    trends_count: number;
    escalations_count: number;
    reviews_pending: number;
    executive_satisfaction: number;
    leadership_trust_score: number;
  } | null;
  opportunities: StrategicSignal[];
  risks: StrategicSignal[];
  trends: StrategicSignal[];
  priorities: StrategicSignal[];
  executive_insights: StrategicInsight[];
  recommendations: StrategicRecommendation[];
  strategic_reviews: StrategicReview[];
  scenario_prompts: ScenarioPrompt[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};
