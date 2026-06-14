export type IdentitySignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type PurposeAlignmentPrompt = {
  application_key: string;
  application_type: string;
  title: string;
  summary: string;
};

export type IdentityInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type IdentityReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type IdentityTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type IdentityMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type IdentitySnapshot = {
  snapshot_key: string;
  period_label: string;
  identity_score: number;
  summary: string;
  captured_at: string | null;
};

export type IdentityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type IdentityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type IdentitySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalIdentityCenter = {
  dashboard: {
    identity_score: number;
    identity_health_label: string;
    initiatives_in_progress: number;
    values_alignment_pct: number;
    cultural_consistency_pct: number;
    leadership_participation_pct: number;
    legacy_preservation_pct: number;
    purpose_clarity_pct: number;
    values_consistency_pct: number;
    leadership_alignment_pct: number;
    cultural_reinforcement_pct: number;
    reviews_completed: number;
  } | null;
  identity_signals: IdentitySignal[];
  purpose_alignment_prompts: PurposeAlignmentPrompt[];
  identity_initiatives: IdentityInitiative[];
  identity_reviews: IdentityReview[];
  timeline: IdentityTimelineEvent[];
  identity_milestones: IdentityMilestone[];
  snapshots: IdentitySnapshot[];
  insights: IdentityInsight[];
  recommendations: IdentityRecommendation[];
  identity_sessions: IdentitySession[];
  executive_view: {
    purpose_alignment: string;
    leadership_consistency: string;
    values_reinforcement: string;
    stewardship_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
