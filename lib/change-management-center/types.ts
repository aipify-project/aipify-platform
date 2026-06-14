export type ChangeInitiative = {
  initiative_key: string;
  title: string;
  summary: string;
  category: string;
  workflow_stage: string;
  status: string;
  readiness_band: string;
  readiness_score: number;
  adoption_pct: number;
  sponsor: string;
  owner: string;
  created_at: string | null;
};

export type StakeholderEntry = {
  stakeholder_key: string;
  initiative_key: string;
  role_type: string;
  label: string;
  engagement_level: string;
};

export type ChangeCommunication = {
  communication_key: string;
  initiative_key: string;
  audience: string;
  title: string;
  content: string;
  status: string;
  created_at: string | null;
};

export type TrainingAssignment = {
  training_key: string;
  initiative_key: string;
  label: string;
  role_target: string;
  completion_pct: number;
  status: string;
};

export type AdoptionMetric = {
  metric_key: string;
  initiative_key: string;
  label: string;
  value_label: string;
  trend: string;
};

export type ChangeFeedback = {
  feedback_key: string;
  initiative_key: string | null;
  feedback_type: string;
  message: string;
  status: string;
  created_at: string | null;
};

export type ChangeInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type ChangeRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type ChangeReview = {
  review_key: string;
  initiative_key: string | null;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type ExecutiveChangeView = {
  strategic_initiatives: number;
  adoption_confidence: string;
  stakeholder_sentiment: string;
  leadership_actions: string;
};

export type ChangeManagementCenter = {
  dashboard: {
    active_initiatives: number;
    average_adoption_pct: number;
    average_readiness_score: number;
    initiatives_needing_attention: number;
    training_completion_pct: number;
    communications_sent: number;
    communication_effectiveness: number;
    stakeholder_engagement_score: number;
    employee_confidence_score: number;
    leadership_satisfaction: number;
    initiative_success_rate: number;
    companion_usefulness_rating: number;
  } | null;
  initiatives: ChangeInitiative[];
  stakeholders: StakeholderEntry[];
  communications: ChangeCommunication[];
  training: TrainingAssignment[];
  adoption_metrics: AdoptionMetric[];
  feedback: ChangeFeedback[];
  insights: ChangeInsight[];
  recommendations: ChangeRecommendation[];
  governance_reviews: ChangeReview[];
  executive_view: ExecutiveChangeView | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
