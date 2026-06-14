export type PurposeAlignment = {
  alignment_key: string;
  domain: string;
  title: string;
  summary: string;
  alignment_area: string;
  alignment_score: number;
};

export type PurposeReflectionPrompt = {
  reflection_key: string;
  prompt: string;
  domain: string;
};

export type PurposeReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type PurposeTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type PurposeMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type PurposeSnapshot = {
  snapshot_key: string;
  period_label: string;
  purpose_score: number;
  summary: string;
  captured_at: string | null;
};

export type PurposeInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type PurposeRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type PurposeSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalPurposeCenter = {
  dashboard: {
    purpose_score: number;
    purpose_health_label: string;
    purpose_clarity_pct: number;
    values_alignment_trend_pct: number;
    leadership_participation_pct: number;
    reflections_completed: number;
    strategic_alignment_pct: number;
    employee_understanding_pct: number;
    leadership_confidence: number;
  } | null;
  purpose_alignment: PurposeAlignment[];
  reflection_prompts: PurposeReflectionPrompt[];
  purpose_reviews: PurposeReview[];
  timeline: PurposeTimelineEvent[];
  purpose_milestones: PurposeMilestone[];
  snapshots: PurposeSnapshot[];
  insights: PurposeInsight[];
  recommendations: PurposeRecommendation[];
  purpose_sessions: PurposeSession[];
  executive_view: {
    mission_alignment: string;
    values_consistency: string;
    reflection_participation: string;
    long_term_impact: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
