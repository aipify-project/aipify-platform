export type LearningLesson = {
  lesson_key: string;
  domain: string;
  title: string;
  what_happened: string;
  what_worked: string;
  what_did_not_work: string;
  what_should_change: string;
  what_should_remain: string;
  validation_stage: string;
};

export type LearningPattern = {
  pattern_key: string;
  pattern_type: string;
  message: string;
  occurrence_count: number;
};

export type BestPractice = {
  practice_key: string;
  practice_type: string;
  title: string;
  summary: string;
  validation_status: string;
};

export type LearningInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type LearningRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type LearningReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type DomainMetric = {
  metric_key: string;
  domain: string;
  label: string;
  value_label: string;
  trend: string;
};

export type ValidationStage = {
  stage: string;
  label: string;
};

export type OrganizationalLearningCenter = {
  dashboard: {
    lessons_captured: number;
    lessons_published: number;
    validation_completion_pct: number;
    knowledge_utilization_pct: number;
    improvement_adoption_pct: number;
    learning_health_score: number;
    learning_health_label: string;
    participation_satisfaction: number;
    executive_trust_indicator: number;
  } | null;
  domain_metrics: DomainMetric[];
  lessons: LearningLesson[];
  patterns: LearningPattern[];
  best_practices: BestPractice[];
  insights: LearningInsight[];
  recommendations: LearningRecommendation[];
  governance_reviews: LearningReview[];
  executive_view: {
    strategic_lessons: string;
    maturity_trends: string;
    high_value_opportunities: string;
    improvement_momentum: string;
  } | null;
  validation_workflow: ValidationStage[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
