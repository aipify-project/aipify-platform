import type { FrictionCategory, FrictionRecommendationStatus, FrictionScoreLevel } from "./dimensions";

export type FrictionEvent = {
  id: string;
  category: FrictionCategory;
  source_module: string;
  title: string;
  description: string;
  frequency_level: string;
  impact_level: string;
  recommendation_text: string;
  detected_at: string;
};

export type FrictionCategoryCard = {
  category: FrictionCategory;
  score_level: FrictionScoreLevel;
  explanation: string;
  trend?: string;
  event_count: number;
};

export type FrictionRecommendation = {
  id: string;
  friction_event_id?: string | null;
  recommendation_type: string;
  recommendation_text: string;
  status: FrictionRecommendationStatus;
  action_center_reference?: string | null;
  created_at: string;
};

export type FrictionScoreRecord = {
  category: string;
  score_level: FrictionScoreLevel;
  explanation: string;
  measurement_period?: string;
  created_at: string;
};

export type FrictionCenter = {
  has_customer: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  plan?: string;
  enterprise_features?: boolean;
  overall_score_level?: FrictionScoreLevel;
  briefing?: string;
  category_cards?: FrictionCategoryCard[];
  events?: FrictionEvent[];
  recommendations?: FrictionRecommendation[];
  history?: FrictionScoreRecord[];
  privacy_note?: string;
};
