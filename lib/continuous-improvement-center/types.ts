export type ImprovementOpportunity = {
  opportunity_key: string;
  domain: string;
  title: string;
  summary: string;
  priority_matrix: string;
  impact: string;
  effort: string;
  frequency: string;
  status: string;
  created_at: string | null;
};

export type ImprovementInitiative = {
  initiative_key: string;
  title: string;
  summary: string;
  domain: string;
  owner_label: string | null;
  participating_teams: string | null;
  status: string;
  impact_estimate_hours: number;
  review_schedule: string | null;
  success_measurement: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ImprovementInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type ImprovementRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type LessonLearned = {
  lesson_key: string;
  initiative_key: string | null;
  title: string;
  content: string;
  outcome_type: string;
  created_at: string | null;
};

export type ContinuousImprovementCenter = {
  dashboard: {
    opportunities_identified: number;
    improvements_implemented: number;
    impact_estimate_hours: number;
    department_participation: number;
    improvement_trend: string;
    recommendations_open: number;
    initiatives_active: number;
    employee_satisfaction: number;
    executive_trust_score: number;
  } | null;
  opportunities: ImprovementOpportunity[];
  initiatives: ImprovementInitiative[];
  insights: ImprovementInsight[];
  recommendations: ImprovementRecommendation[];
  lessons_learned: LessonLearned[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
