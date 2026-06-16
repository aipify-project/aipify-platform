export type HostsUpgradeSignal = {
  signal_key: string;
  severity: string;
  priority: number;
  title: string;
  message: string;
  context: Record<string, unknown>;
};

export type HostsUpgradeRecommendation = {
  recommendation_key: string;
  recommendation_type: string;
  title: string;
  message: string;
  action_type: string;
  action_target: string;
  priority: number;
  routes: Record<string, string>;
};

export type HostsUpgradeSignalsDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  surface: string;
  positioning: string;
  principle: string;
  governance_note: string;
  licensing: Record<string, unknown>;
  signals: HostsUpgradeSignal[];
  recommendations: HostsUpgradeRecommendation[];
  routes: Record<string, string>;
};

export type HostsUpgradeSignalsCard = {
  has_customer: boolean;
  show_banner: boolean;
  signal_count?: number;
  recommendation_count?: number;
  primary_recommendation?: HostsUpgradeRecommendation;
  licensing?: Record<string, unknown>;
  principle?: string;
};

export type HostsUpgradeSignalActionResult = {
  status: string;
  message?: string;
  billing_route?: string;
  workspace_route?: string;
  marketplace_route?: string;
  requires_payment?: boolean;
};
