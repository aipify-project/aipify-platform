export type TransformationSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type AdoptionPrompt = {
  adoption_key: string;
  adoption_type: string;
  title: string;
  summary: string;
};

export type TransformationInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type TransformationReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type TransformationTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type TransformationMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type TransformationSnapshot = {
  snapshot_key: string;
  period_label: string;
  transformation_readiness_score: number;
  summary: string;
  captured_at: string | null;
};

export type TransformationInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type TransformationRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type TransformationSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type TransformationWorkflowStage = {
  stage_key: string;
  label: string;
  order: number;
};

export type OrganizationalTransformationCenter = {
  dashboard: {
    transformation_readiness_score: number;
    transformation_readiness_label: string;
    adoption_momentum_pct: number;
    risks_identified: number;
    initiatives_in_progress: number;
    leadership_commitment_pct: number;
    workforce_preparedness_pct: number;
    capability_maturity_pct: number;
    communication_effectiveness_pct: number;
    governance_readiness_pct: number;
    reviews_completed: number;
  } | null;
  transformation_signals: TransformationSignal[];
  adoption_prompts: AdoptionPrompt[];
  transformation_initiatives: TransformationInitiative[];
  transformation_reviews: TransformationReview[];
  timeline: TransformationTimelineEvent[];
  transformation_milestones: TransformationMilestone[];
  snapshots: TransformationSnapshot[];
  insights: TransformationInsight[];
  recommendations: TransformationRecommendation[];
  transformation_sessions: TransformationSession[];
  transformation_workflow: TransformationWorkflowStage[];
  executive_view: {
    strategic_progress: string;
    leadership_participation: string;
    adoption_confidence: string;
    transformation_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
