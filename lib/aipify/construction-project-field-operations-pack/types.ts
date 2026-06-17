export type ConstructionProject = {
  id?: string;
  project_key?: string;
  project_name?: string;
  customer_name?: string;
  project_type?: string;
  location?: string;
  budget_amount?: number;
  project_status?: string;
  completion_percent?: number;
  profitability_label?: string;
  [key: string]: unknown;
};

export type ConstructionAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type ConstructionProjectFieldOperationsCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  industry_packs_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  projects?: ConstructionProject[];
  sites?: Array<Record<string, unknown>>;
  workforce?: Array<Record<string, unknown>>;
  equipment?: Array<Record<string, unknown>>;
  materials?: Array<Record<string, unknown>>;
  safety_incidents?: Array<Record<string, unknown>>;
  advisor_signals?: ConstructionAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
