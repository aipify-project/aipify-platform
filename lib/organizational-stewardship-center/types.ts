export type StewardshipSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type ResponsibilityPrompt = {
  question_key: string;
  question_type: string;
  title: string;
  summary: string;
};

export type StewardshipInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type StewardshipReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type StewardshipTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type StewardshipMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type StewardshipSnapshot = {
  snapshot_key: string;
  period_label: string;
  stewardship_score: number;
  summary: string;
  captured_at: string | null;
};

export type StewardshipInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type StewardshipRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type StewardshipSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalStewardshipCenter = {
  dashboard: {
    stewardship_score: number;
    stewardship_health_label: string;
    leadership_stewardship_pct: number;
    trust_preservation_pct: number;
    knowledge_continuity_pct: number;
    resource_sustainability_pct: number;
    strategic_consistency_pct: number;
    leadership_responsibility_pct: number;
    customer_trust_pct: number;
    initiatives_in_progress: number;
    reviews_completed: number;
  } | null;
  stewardship_signals: StewardshipSignal[];
  responsibility_prompts: ResponsibilityPrompt[];
  stewardship_initiatives: StewardshipInitiative[];
  stewardship_reviews: StewardshipReview[];
  timeline: StewardshipTimelineEvent[];
  stewardship_milestones: StewardshipMilestone[];
  snapshots: StewardshipSnapshot[];
  insights: StewardshipInsight[];
  recommendations: StewardshipRecommendation[];
  stewardship_sessions: StewardshipSession[];
  executive_view: {
    leadership_responsibility: string;
    trust_preservation: string;
    knowledge_continuity: string;
    future_investment_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
