export type ContinuousImprovementEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  [key: string]: unknown;
};

export type ImprovementInitiativeRecord = {
  id?: string;
  initiative_title?: string;
  source?: string;
  priority?: string;
  status?: string;
  description?: string;
  [key: string]: unknown;
};

export type ImprovementReviewCycleRecord = {
  id?: string;
  initiative_id?: string;
  cycle_number?: number;
  review_status?: string;
  findings_summary?: string;
  [key: string]: unknown;
};

export type ImprovementSuccessMeasurementRecord = {
  id?: string;
  initiative_id?: string;
  metric_key?: string;
  baseline_value?: number;
  current_value?: number;
  improvement_percentage?: number;
  [key: string]: unknown;
};

export type ImprovementSuggestion = {
  initiative_title?: string;
  source?: string;
  priority?: string;
  confidence?: string;
  rationale?: string;
};

export type ContinuousImprovementEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  items?: Record<string, unknown>[];
  initiatives?: ImprovementInitiativeRecord[];
  review_cycles?: ImprovementReviewCycleRecord[];
  success_measurements?: ImprovementSuccessMeasurementRecord[];
  trends?: Record<string, unknown>;
  memory_integration?: Record<string, unknown>;
  recent_feedback?: Record<string, unknown>[];
  outcomes?: Record<string, unknown>[];
};
