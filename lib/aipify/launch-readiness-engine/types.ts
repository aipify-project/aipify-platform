export type LaunchReadinessEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  [key: string]: unknown;
};

export type LaunchReadinessEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  checklist: Array<Record<string, unknown>>;
  [key: string]: unknown;
};
