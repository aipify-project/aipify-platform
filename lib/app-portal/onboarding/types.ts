export type OnboardingStatus = "not_started" | "in_progress" | "completed" | "optional";
export type OverviewStatus = "not_started" | "in_progress" | "completed";

export type OnboardingTask = {
  key: string;
  category: string;
  optional: boolean;
  status: OnboardingStatus;
  completed_at?: string | null;
  auto_detected?: boolean;
};

export type OnboardingRecommendation = {
  id: string;
  key: string;
  priority: string;
  module?: string;
};

export type OnboardingMilestone = {
  key: string;
  celebration: boolean;
};

export type OnboardingOverview = {
  status: OverviewStatus;
  progress_percent: number;
  required_completed: number;
  required_total: number;
  started_at?: string | null;
  completed_at?: string | null;
};

export type AdoptionInsights = {
  features_explored: number;
  features_not_discovered: string[];
  suggested_business_packs: string[];
  recommended_actions: OnboardingRecommendation[];
};

export type OnboardingResponse = {
  found: boolean;
  started?: boolean;
  overview?: OnboardingOverview;
  checklist?: OnboardingTask[];
  milestones?: OnboardingMilestone[];
  recommendations?: OnboardingRecommendation[];
  adoption_insights?: AdoptionInsights;
  completed_milestones?: OnboardingTask[];
  principle?: string;
};

export type OnboardingRecommendationsResponse = {
  found: boolean;
  recommendations: OnboardingRecommendation[];
  advisory_only?: boolean;
};

export type OnboardingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  principle: string;
  sections: {
    overview: string;
    checklist: string;
    recommendations: string;
    milestones: string;
    adoption: string;
    completed: string;
  };
  overview: {
    progress: string;
    status: string;
    nextSteps: string;
    advisory: string;
  };
  statuses: Record<OverviewStatus, string>;
  taskStatuses: Record<OnboardingStatus, string>;
  categories: Record<string, string>;
  tasks: Record<string, string>;
  recommendations: Record<string, string>;
  milestones: Record<string, string>;
  adoption: {
    featuresExplored: string;
    featuresNotDiscovered: string;
    suggestedPacks: string;
    nextActions: string;
  };
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    requiredSteps: string;
    requiredStepsAnswer: string;
    revisit: string;
    revisitAnswer: string;
  };
  actions: {
    markComplete: string;
    dismissMilestone: string;
  };
};
