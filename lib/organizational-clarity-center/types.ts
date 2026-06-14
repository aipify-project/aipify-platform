export type ClaritySignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type AlignmentPrompt = {
  alignment_key: string;
  alignment_type: string;
  title: string;
  summary: string;
};

export type ClarityInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type ClarityReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type ClarityTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type ClarityMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type ClaritySnapshot = {
  snapshot_key: string;
  period_label: string;
  clarity_score: number;
  summary: string;
  captured_at: string | null;
};

export type ClarityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type ClarityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type ClaritySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalClarityCenter = {
  dashboard: {
    clarity_score: number;
    clarity_health_label: string;
    communication_effectiveness_pct: number;
    role_understanding_pct: number;
    priority_transparency_pct: number;
    initiatives_in_progress: number;
    communication_consistency_pct: number;
    responsibility_awareness_pct: number;
    priority_understanding_pct: number;
    governance_transparency_pct: number;
    expectation_alignment_pct: number;
    reviews_completed: number;
  } | null;
  clarity_signals: ClaritySignal[];
  alignment_prompts: AlignmentPrompt[];
  clarity_initiatives: ClarityInitiative[];
  clarity_reviews: ClarityReview[];
  timeline: ClarityTimelineEvent[];
  clarity_milestones: ClarityMilestone[];
  snapshots: ClaritySnapshot[];
  insights: ClarityInsight[];
  recommendations: ClarityRecommendation[];
  clarity_sessions: ClaritySession[];
  executive_view: {
    communication_effectiveness: string;
    strategic_understanding: string;
    responsibility_transparency: string;
    clarity_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
