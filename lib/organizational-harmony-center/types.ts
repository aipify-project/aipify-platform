export type HarmonySignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type DialoguePrompt = {
  dialogue_key: string;
  dialogue_type: string;
  title: string;
  summary: string;
};

export type HarmonyInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type HarmonyReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type HarmonyTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type HarmonyMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type HarmonySnapshot = {
  snapshot_key: string;
  period_label: string;
  harmony_score: number;
  summary: string;
  captured_at: string | null;
};

export type HarmonyInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type HarmonyRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type HarmonySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalHarmonyCenter = {
  dashboard: {
    harmony_score: number;
    harmony_health_label: string;
    collaboration_indicators_pct: number;
    cross_functional_alignment_pct: number;
    leadership_consistency_pct: number;
    initiatives_in_progress: number;
    collaboration_effectiveness_pct: number;
    cross_functional_cooperation_pct: number;
    communication_quality_pct: number;
    shared_ownership_pct: number;
    reviews_completed: number;
  } | null;
  harmony_signals: HarmonySignal[];
  dialogue_prompts: DialoguePrompt[];
  harmony_initiatives: HarmonyInitiative[];
  harmony_reviews: HarmonyReview[];
  timeline: HarmonyTimelineEvent[];
  harmony_milestones: HarmonyMilestone[];
  snapshots: HarmonySnapshot[];
  insights: HarmonyInsight[];
  recommendations: HarmonyRecommendation[];
  harmony_sessions: HarmonySession[];
  executive_view: {
    leadership_alignment: string;
    collaboration_effectiveness: string;
    cross_functional_relationships: string;
    cohesion_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
