export type AgentOrchestrationAgent = {
  id?: string;
  agent_key?: string;
  agent_name?: string;
  agent_role?: string;
  agent_type?: string;
  agent_status?: string;
  workload_score?: number;
  capabilities?: unknown;
  [key: string]: unknown;
};

export type AgentOrchestrationTeam = {
  id?: string;
  team_key?: string;
  team_name?: string;
  team_type?: string;
  agent_ids?: unknown;
  [key: string]: unknown;
};

export type AgentOrchestrationTask = {
  id?: string;
  task_key?: string;
  task_title?: string;
  task_status?: string;
  priority?: string;
  department?: string;
  assigned_agent_id?: string | null;
  risk_level?: string;
  [key: string]: unknown;
};

export type AgentOrchestrationWorkflow = {
  id?: string;
  workflow_key?: string;
  workflow_name?: string;
  workflow_type?: string;
  workflow_status?: string;
  started_at?: string | null;
  completed_at?: string | null;
  [key: string]: unknown;
};

export type AgentOrchestrationApproval = {
  id?: string;
  approval_key?: string;
  approval_type?: string;
  approval_status?: string;
  summary?: string;
  task_id?: string | null;
  workflow_id?: string | null;
  [key: string]: unknown;
};

export type AgentOrchestrationAdvisorSignal = {
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

export type EnterpriseAiAgentOrchestrationCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  coordination_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  agents?: AgentOrchestrationAgent[];
  teams?: AgentOrchestrationTeam[];
  tasks?: AgentOrchestrationTask[];
  workflows?: AgentOrchestrationWorkflow[];
  approval_requests?: AgentOrchestrationApproval[];
  advisor_signals?: AgentOrchestrationAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
