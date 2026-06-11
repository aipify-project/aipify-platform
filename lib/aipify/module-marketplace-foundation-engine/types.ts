export type ModuleMarketplaceFoundationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  [key: string]: unknown;
};

export type ModuleMarketplaceFoundationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  catalog: Array<Record<string, unknown>>;
  [key: string]: unknown;
};
