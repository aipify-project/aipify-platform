export type CustomerSuccessEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  [key: string]: unknown;
};

export type CustomerSuccessEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  interventions: Array<Record<string, unknown>>;
  [key: string]: unknown;
};
