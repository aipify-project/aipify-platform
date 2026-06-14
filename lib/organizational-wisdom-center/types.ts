export type WisdomLesson = {
  lesson_key: string;
  domain: string;
  title: string;
  summary: string;
  integrated_at: string | null;
};

export type ReflectionPrompt = {
  reflection_key: string;
  prompt: string;
  domain: string;
};

export type ValuesAlignmentItem = {
  value_key: string;
  label: string;
  guidance: string;
};

export type HistoricalPattern = {
  pattern_key: string;
  domain: string;
  label: string;
  summary: string;
};

export type WisdomSynthesisSource = {
  source_key: string;
  source_label: string;
  route_path: string;
  summary: string;
};

export type WisdomTimelineEvent = {
  timeline_key: string;
  event_type: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type WisdomSnapshot = {
  snapshot_key: string;
  period_label: string;
  wisdom_score: number;
  summary: string;
  captured_at: string | null;
};

export type WisdomInsight = {
  insight_key: string;
  message: string;
  domain: string;
  priority: string;
};

export type WisdomRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type WisdomReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalWisdomCenter = {
  dashboard: {
    wisdom_score: number;
    wisdom_health_label: string;
    insights_generated: number;
    lessons_integrated: number;
    reflection_participation_pct: number;
    historical_patterns: number;
    executive_learning_trend_pct: number;
    decision_quality_satisfaction: number;
    leadership_confidence: number;
  } | null;
  lessons: WisdomLesson[];
  reflection_prompts: ReflectionPrompt[];
  values_alignment: ValuesAlignmentItem[];
  historical_patterns: HistoricalPattern[];
  wisdom_synthesis: WisdomSynthesisSource[];
  timeline: WisdomTimelineEvent[];
  snapshots: WisdomSnapshot[];
  insights: WisdomInsight[];
  recommendations: WisdomRecommendation[];
  wisdom_reviews: WisdomReview[];
  executive_view: {
    emerging_themes: string;
    learning_patterns: string;
    lessons_revisited: string;
    wisdom_indicators: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
