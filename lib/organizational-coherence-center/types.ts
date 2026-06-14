export type FragmentationSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
  status: string;
};

export type AlignmentItem = {
  alignment_key: string;
  domain: string;
  title: string;
  summary: string;
  alignment_status: string;
};

export type CoherenceReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type CoherenceTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type CoherenceMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type CoherenceSnapshot = {
  snapshot_key: string;
  period_label: string;
  coherence_score: number;
  summary: string;
  captured_at: string | null;
};

export type CoherenceInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type CoherenceRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type CoherenceSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalCoherenceCenter = {
  dashboard: {
    coherence_score: number;
    coherence_health_label: string;
    strategic_consistency_pct: number;
    alignment_trend_pct: number;
    vision_alignment_pct: number;
    values_consistency_pct: number;
    governance_integrity_pct: number;
    initiative_coordination_pct: number;
    leadership_synchronization_pct: number;
    fragmentation_risks: number;
    leadership_confidence: number;
    reviews_completed: number;
  } | null;
  fragmentation_signals: FragmentationSignal[];
  alignment_items: AlignmentItem[];
  coherence_reviews: CoherenceReview[];
  timeline: CoherenceTimelineEvent[];
  coherence_milestones: CoherenceMilestone[];
  snapshots: CoherenceSnapshot[];
  insights: CoherenceInsight[];
  recommendations: CoherenceRecommendation[];
  coherence_sessions: CoherenceSession[];
  executive_view: {
    leadership_alignment: string;
    strategic_consistency: string;
    organizational_integrity: string;
    coherence_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
