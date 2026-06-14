export type IntentionalitySignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type PurposePrompt = {
  purpose_key: string;
  purpose_type: string;
  title: string;
  summary: string;
};

export type IntentionalityInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type IntentionalityReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type IntentionalityTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type IntentionalityMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type IntentionalitySnapshot = {
  snapshot_key: string;
  period_label: string;
  intentionality_score: number;
  summary: string;
  captured_at: string | null;
};

export type IntentionalityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type IntentionalityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type IntentionalitySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalIntentionalityCenter = {
  dashboard: {
    intentionality_score: number;
    intentionality_health_label: string;
    priority_alignment_pct: number;
    strategic_discipline_pct: number;
    resource_allocation_insight_pct: number;
    initiatives_in_progress: number;
    strategic_consistency_pct: number;
    values_alignment_pct: number;
    leadership_reflection_pct: number;
    resource_allocation_pct: number;
    purpose_integration_pct: number;
    reviews_completed: number;
  } | null;
  intentionality_signals: IntentionalitySignal[];
  purpose_prompts: PurposePrompt[];
  intentionality_initiatives: IntentionalityInitiative[];
  intentionality_reviews: IntentionalityReview[];
  timeline: IntentionalityTimelineEvent[];
  intentionality_milestones: IntentionalityMilestone[];
  snapshots: IntentionalitySnapshot[];
  insights: IntentionalityInsight[];
  recommendations: IntentionalityRecommendation[];
  intentionality_sessions: IntentionalitySession[];
  executive_view: {
    strategic_discipline: string;
    purpose_alignment: string;
    leadership_reflection: string;
    opportunity_prioritization: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
