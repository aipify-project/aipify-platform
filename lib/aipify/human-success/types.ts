export const ADOPTION_BANDS = [
  "exceptional_adoption",
  "strong_adoption",
  "growth_opportunity",
  "adoption_challenges",
  "critical_adoption_risk",
] as const;

export const CHAMPION_TYPES = ["support", "knowledge", "governance", "learning"] as const;

export const JOURNEY_KEYS = ["support", "knowledge", "leadership"] as const;

export const FRICTION_CATEGORIES = [
  "complex_workflow",
  "abandoned_action",
  "user_confusion",
  "underutilized_feature",
  "excessive_notifications",
  "missing_documentation",
] as const;

export type AdoptionScore = {
  adoption_score?: number;
  adoption_band?: string;
  usage_score?: number;
  discovery_score?: number;
  knowledge_score?: number;
  learning_score?: number;
  value_score?: number;
  workflow_score?: number;
  privacy_note?: string;
};

export type HumanSuccessScore = {
  success_score?: number;
  success_band?: string;
  confidence_score?: number;
  progress_score?: number;
  learning_score?: number;
  value_score?: number;
  friction_score?: number;
  human_centered?: boolean;
};

export type FrictionInsight = {
  id: string;
  category: string;
  description: string;
  severity: string;
  recommendation?: string | null;
  status?: string;
};

export type LearningRecommendation = {
  id: string;
  recommendation: string;
  context?: string | null;
  knowledge_article_slug?: string | null;
  status?: string;
};

export type SuccessJourney = {
  journey_key: string;
  current_step: number;
  total_steps?: number;
  completed?: boolean;
  steps?: Array<{ key?: string; title?: string }>;
};

export type OnboardingProgress = {
  path: string;
  current_step: number;
  completed?: boolean;
  steps?: string[];
};

export type ChampionRecognition = {
  champion_type: string;
  recognition_reason: string;
  recognized_at?: string;
};

export type SuccessMilestone = {
  id: string;
  title: string;
  milestone_type?: string;
  journey_key?: string | null;
  achieved_at?: string;
};

export type ValueReinforcement = {
  id: string;
  message: string;
  metric_key?: string | null;
  metric_value?: string | null;
};

export type HumanSuccessCard = {
  has_customer: boolean;
  adoption_score?: number;
  success_score?: number;
  value_message?: string | null;
  philosophy?: string;
  human_centered?: boolean;
  no_surveillance?: boolean;
};

export type HumanSuccessDashboard = {
  has_customer: boolean;
  human_centered?: boolean;
  no_surveillance?: boolean;
  no_employee_rankings?: boolean;
  adoption_features_enabled?: boolean;
  show_personal_scores?: boolean;
  org_adoption_score?: number;
  org_adoption_band?: string;
  personal_adoption?: AdoptionScore;
  personal_success?: HumanSuccessScore;
  friction_insights: FrictionInsight[];
  learning_recommendations: LearningRecommendation[];
  success_journeys: SuccessJourney[];
  onboarding: OnboardingProgress[];
  champions: ChampionRecognition[];
  milestones: SuccessMilestone[];
  value_reinforcements: ValueReinforcement[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  adoption_bands?: Array<{ band: string; range: string; label: string }>;
  integrations?: Record<string, string>;
};
