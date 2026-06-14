export type CuriositySignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type QuestionPrompt = {
  question_key: string;
  question_type: string;
  title: string;
  summary: string;
};

export type DiscoveryHighlight = {
  discovery_key: string;
  discovery_type: string;
  title: string;
  summary: string;
};

export type CuriosityInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type CuriosityReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type CuriosityTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type CuriosityMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type CuriositySnapshot = {
  snapshot_key: string;
  period_label: string;
  curiosity_score: number;
  summary: string;
  captured_at: string | null;
};

export type CuriosityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type CuriosityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type CuriositySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalCuriosityCenter = {
  dashboard: {
    curiosity_score: number;
    curiosity_health_label: string;
    learning_engagement_pct: number;
    exploration_initiatives_pct: number;
    innovation_opportunities_pct: number;
    initiatives_in_progress: number;
    learning_participation_pct: number;
    reflection_engagement_pct: number;
    cross_functional_exploration_pct: number;
    knowledge_sharing_pct: number;
    innovation_discipline_pct: number;
    reviews_completed: number;
  } | null;
  curiosity_signals: CuriositySignal[];
  question_prompts: QuestionPrompt[];
  discovery_highlights: DiscoveryHighlight[];
  curiosity_initiatives: CuriosityInitiative[];
  curiosity_reviews: CuriosityReview[];
  timeline: CuriosityTimelineEvent[];
  curiosity_milestones: CuriosityMilestone[];
  snapshots: CuriositySnapshot[];
  insights: CuriosityInsight[];
  recommendations: CuriosityRecommendation[];
  curiosity_sessions: CuriositySession[];
  executive_view: {
    leadership_learning: string;
    exploration_trends: string;
    innovation_opportunities: string;
    organizational_inquiry: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
