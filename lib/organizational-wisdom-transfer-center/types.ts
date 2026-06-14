export type WisdomTransferSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type TransferPrompt = {
  transfer_key: string;
  transfer_type: string;
  title: string;
  summary: string;
};

export type WisdomTransferInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type WisdomTransferReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type WisdomTransferTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type WisdomTransferMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type WisdomTransferSnapshot = {
  snapshot_key: string;
  period_label: string;
  wisdom_transfer_score: number;
  summary: string;
  captured_at: string | null;
};

export type WisdomTransferInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type WisdomTransferRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type WisdomTransferSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalWisdomTransferCenter = {
  dashboard: {
    wisdom_transfer_score: number;
    wisdom_transfer_health_label: string;
    knowledge_preservation_pct: number;
    mentorship_participation_pct: number;
    lessons_documented_pct: number;
    initiatives_in_progress: number;
    experience_sharing_pct: number;
    judgment_transfer_pct: number;
    institutional_memory_pct: number;
    learning_integration_pct: number;
    wisdom_stewardship_pct: number;
    reviews_completed: number;
  } | null;
  wisdom_transfer_signals: WisdomTransferSignal[];
  transfer_prompts: TransferPrompt[];
  wisdom_transfer_initiatives: WisdomTransferInitiative[];
  wisdom_transfer_reviews: WisdomTransferReview[];
  timeline: WisdomTransferTimelineEvent[];
  wisdom_transfer_milestones: WisdomTransferMilestone[];
  snapshots: WisdomTransferSnapshot[];
  insights: WisdomTransferInsight[];
  recommendations: WisdomTransferRecommendation[];
  wisdom_transfer_sessions: WisdomTransferSession[];
  executive_view: {
    leadership_stewardship: string;
    institutional_memory_strength: string;
    knowledge_transfer_trends: string;
    succession_readiness: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
