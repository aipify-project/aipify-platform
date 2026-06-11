export type AipifyInternalOperationsEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  [key: string]: unknown;
};

export type AipifyInternalOperationsEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  tasks: Array<Record<string, unknown>>;
  [key: string]: unknown;
};
