export type AlignmentIndicator = {
  indicator_key: string;
  domain: string;
  label: string;
  value_label: string;
  trend: string;
};

export type AlignmentPriority = {
  priority_key: string;
  domain: string;
  title: string;
  owner_label: string;
  summary: string;
  alignment_score: number;
};

export type MisalignmentItem = {
  misalignment_key: string;
  misalignment_type: string;
  message: string;
  priority: string;
  status: string;
};

export type TimelineEvent = {
  timeline_key: string;
  event_type: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type AlignmentSnapshot = {
  snapshot_key: string;
  department_label: string;
  alignment_score: number;
  summary: string;
  captured_at: string | null;
};

export type AlignmentInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type AlignmentRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type AlignmentReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalAlignmentCenter = {
  dashboard: {
    alignment_score: number;
    alignment_health_label: string;
    strong_alignment_count: number;
    alignment_opportunities: number;
    misalignment_open: number;
    cross_functional_trend_pct: number;
    goal_consistency_pct: number;
    initiative_overlap_count: number;
    leadership_confidence: number;
  } | null;
  indicators: AlignmentIndicator[];
  priorities: AlignmentPriority[];
  misalignments: MisalignmentItem[];
  timeline: TimelineEvent[];
  snapshots: AlignmentSnapshot[];
  insights: AlignmentInsight[];
  recommendations: AlignmentRecommendation[];
  alignment_reviews: AlignmentReview[];
  executive_view: {
    vision_clarity: string;
    strategic_consistency: string;
    collaboration_trends: string;
    focus_areas: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
