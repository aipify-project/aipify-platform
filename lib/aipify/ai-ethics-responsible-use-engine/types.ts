export type AiUseCaseRecord = {
  id?: string;
  organization_id?: string;
  use_case_name?: string;
  category?: string;
  risk_level?: string;
  oversight_required?: boolean;
  explainability_required?: boolean;
  status?: string;
  review_notes?: string;
  next_review_at?: string;
  [key: string]: unknown;
};

export type AiEthicsResponsibleUseEngineCard = {
  has_organization: boolean;
  approved_use_cases?: number;
  proposed_reviews?: number;
  restricted_count?: number;
  philosophy?: string;
  [key: string]: unknown;
};

export type AiEthicsResponsibleUseEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  ethics_policy?: Record<string, unknown>;
  prohibited_examples?: Array<Record<string, unknown>>;
  explainability_requirements?: Record<string, unknown>;
  approved_use_cases?: AiUseCaseRecord[];
  restricted_use_cases?: AiUseCaseRecord[];
  proposed_use_cases?: AiUseCaseRecord[];
  review_schedules?: Array<Record<string, unknown>>;
  policy_exceptions?: Array<Record<string, unknown>>;
  oversight_trends?: Record<string, unknown>;
  integration_notes?: Record<string, unknown>;
  [key: string]: unknown;
};
