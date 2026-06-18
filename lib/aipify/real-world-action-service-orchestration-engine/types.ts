export type ActionCatalogItem = {
  id?: string;
  action_key?: string;
  action_name?: string;
  action_category?: string;
  risk_level?: string;
  approval_required?: boolean;
  description?: string;
  status?: string;
  [key: string]: unknown;
};

export type ServiceProvider = {
  id?: string;
  provider_key?: string;
  provider_name?: string;
  provider_category?: string;
  region?: string;
  availability_status?: string;
  integration_type?: string;
  approval_requirements?: string;
  vendor_tier?: string;
  status?: string;
  [key: string]: unknown;
};

export type ActionExecution = {
  id?: string;
  execution_key?: string;
  action_name?: string;
  provider_name?: string;
  status?: string;
  risk_level?: string;
  estimated_cost?: number;
  confirmation_ref?: string;
  failure_reason?: string;
  recovery_status?: string;
  created_at?: string;
  completed_at?: string;
  [key: string]: unknown;
};

export type ActionApproval = {
  id?: string;
  approval_key?: string;
  approval_type?: string;
  status?: string;
  action_title?: string;
  risk_level?: string;
  approver_role?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type ActionIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type ActionAdvisorSignal = {
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

export type RealWorldActionServiceOrchestrationCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  approvals_route?: string;
  action_center_route?: string;
  action_hub_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  action_catalog?: ActionCatalogItem[];
  service_providers?: ServiceProvider[];
  executions?: ActionExecution[];
  approvals?: ActionApproval[];
  intelligence_signals?: ActionIntelligenceSignal[];
  advisor_signals?: ActionAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};
