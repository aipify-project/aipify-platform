export type OnboardingStatus = "not_started" | "in_progress" | "completed" | "optional" | "blocked";
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
  last_updated_at?: string | null;
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
  connected_integrations?: number;
  overview?: OnboardingOverview;
  checklist?: OnboardingTask[];
  milestones?: OnboardingMilestone[];
  recommendations?: OnboardingRecommendation[];
  adoption_insights?: AdoptionInsights;
  completed_milestones?: OnboardingTask[];
};

export type OnboardingRecommendationsResponse = {
  found: boolean;
  recommendations: OnboardingRecommendation[];
  advisory_only?: boolean;
};

export type WorkflowPresentationState =
  | "not_started"
  | "in_progress"
  | "requires_attention"
  | "completed"
  | "blocked";

export type OnboardingLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  loading: string;
  breadcrumbSupport: string;
  breadcrumbGettingStarted: string;
  backToSupport: string;
  sections: {
    progress: string;
    nextAction: string;
    remaining: string;
    completed: string;
    adoption: string;
    understanding: string;
  };
  progress: {
    percentComplete: string;
    stepsCompleted: string;
    workflowState: string;
    lastUpdated: string;
    continueSetup: string;
    advisory: string;
  };
  workflowStates: Record<WorkflowPresentationState, string>;
  taskPriorities: {
    required: string;
    recommended: string;
    optional: string;
  };
  categories: Record<string, string>;
  tasks: Record<string, string>;
  recommendations: Record<string, string>;
  milestones: Record<string, string>;
  adoption: {
    explored: string;
    recommended: string;
    suggestedPacks: string;
    noneExplored: string;
    noneRecommended: string;
  };
  understanding: {
    revisit: string;
    revisitAnswer: string;
    progressMeaning: string;
    progressMeaningAnswer: string;
    permissions: string;
    permissionsAnswer: string;
  };
  empty: {
    title: string;
    body: string;
    action: string;
  };
  error: {
    title: string;
    body: string;
    retry: string;
  };
  actions: {
    open: string;
    markComplete: string;
    hide: string;
    startCourse: string;
  };
  taskStatuses: Record<OnboardingStatus, string>;
};
