export type ComplianceRegulatoryReadinessEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  [key: string]: unknown;
};

export type ComplianceRegulatoryReadinessEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
