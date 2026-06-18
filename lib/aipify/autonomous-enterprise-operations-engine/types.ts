export type AutonomousOpportunity = {
  id?: string;
  opportunity_key?: string;
  opportunity_title?: string;
  opportunity_type?: string;
  impact_summary?: string;
  recommendation?: string;
  confidence?: string;
  status?: string;
  [key: string]: unknown;
};

export type AutonomousRisk = {
  id?: string;
  risk_key?: string;
  risk_title?: string;
  risk_type?: string;
  severity?: string;
  impact_summary?: string;
  mitigation_recommendation?: string;
  status?: string;
  [key: string]: unknown;
};

export type AutonomousPlan = {
  id?: string;
  plan_key?: string;
  plan_title?: string;
  plan_type?: string;
  plan_summary?: string;
  steps?: unknown;
  status?: string;
  [key: string]: unknown;
};

export type AutonomousRecommendation = {
  id?: string;
  recommendation_key?: string;
  recommendation_title?: string;
  recommendation_type?: string;
  observation?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  status?: string;
  [key: string]: unknown;
};

export type AutonomousWorkflow = {
  id?: string;
  workflow_key?: string;
  workflow_title?: string;
  coordination_type?: string;
  status?: string;
  participants?: unknown;
  summary?: string;
  [key: string]: unknown;
};

export type AutonomousProactiveItem = {
  id?: string;
  item_key?: string;
  item_title?: string;
  item_type?: string;
  priority?: string;
  status?: string;
  assigned_to?: string;
  [key: string]: unknown;
};

export type AutonomousApprovalQueueItem = {
  id?: string;
  queue_key?: string;
  queue_title?: string;
  approval_type?: string;
  autonomy_level_required?: number;
  status?: string;
  risk_level?: string;
  [key: string]: unknown;
};

export type AutonomousIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type AutonomousAdvisorSignal = {
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

export type AutonomousImprovement = {
  id?: string;
  improvement_key?: string;
  improvement_title?: string;
  improvement_type?: string;
  outcome_summary?: string;
  business_impact?: string;
  status?: string;
  [key: string]: unknown;
};

export type AutonomousEnterpriseOperationsCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  approvals_route?: string;
  actions_route?: string;
  command_center_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  autonomy_levels?: Array<{ level?: number; label?: string }>;
  opportunities?: AutonomousOpportunity[];
  risks?: AutonomousRisk[];
  plans?: AutonomousPlan[];
  recommendations?: AutonomousRecommendation[];
  workflows?: AutonomousWorkflow[];
  proactive_items?: AutonomousProactiveItem[];
  approval_queue?: AutonomousApprovalQueueItem[];
  intelligence_signals?: AutonomousIntelligenceSignal[];
  advisor_signals?: AutonomousAdvisorSignal[];
  improvements?: AutonomousImprovement[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};
