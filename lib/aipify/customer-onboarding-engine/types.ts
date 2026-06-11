export type OnboardingStepItem = {
  step_key: string;
  step_index?: number;
  completed?: boolean;
  current?: boolean;
};

export type OnboardingChecklistItem = {
  checklist_key: string;
  title: string;
  completed?: boolean;
  completed_at?: string | null;
};

export type OnboardingRecommendations = {
  current_step?: string;
  step_index?: number;
  total_steps?: number;
  next_step_hint?: string;
  knowledge_articles?: Array<Record<string, unknown>>;
  suggested_checklist?: OnboardingChecklistItem[];
};

export type CustomerOnboardingEngineCard = {
  has_organization: boolean;
  current_step?: string;
  completion_percentage?: number;
  completed?: boolean;
  checklist_remaining?: number;
  philosophy?: string;
};

export type CustomerOnboardingEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  current_step?: string;
  step_index?: number;
  total_steps?: number;
  steps: OnboardingStepItem[];
  completion_percentage?: number;
  completed_at?: string | null;
  checklist: OnboardingChecklistItem[];
  checklist_completed?: number;
  checklist_total?: number;
  recommendations?: OnboardingRecommendations;
};
