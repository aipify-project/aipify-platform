export const AGENT_STATUSES = ["active", "disabled", "maintenance", "experimental"] as const;
export const AGENT_RISK_LEVELS = ["low", "medium", "high", "restricted"] as const;
export const AGENT_MESSAGE_TYPES = [
  "request_information",
  "provide_information",
  "request_approval",
  "provide_recommendation",
  "create_action",
  "escalate",
  "record_learning",
  "request_review",
] as const;
export const AGENT_EVENT_STATUSES = ["pending", "processed", "failed", "blocked"] as const;

export type AgentCapability = {
  capability_key: string;
  description?: string | null;
  requires_approval: boolean;
};

export type AgentPermission = {
  permission_key: string;
  granted: boolean;
};

export type CollaborationAgent = {
  id: string;
  agent_key: string;
  name: string;
  description?: string | null;
  status: string;
  version: string;
  category: string;
  risk_level: string;
  enabled: boolean;
  responsibilities: string[];
  capabilities?: AgentCapability[];
  permissions?: AgentPermission[];
};

export type AgentEvent = {
  id: string;
  source_agent: string;
  target_agent?: string | null;
  message_type: string;
  status: string;
  payload?: Record<string, unknown>;
  created_at?: string;
};

export type AgentHealth = {
  agent_key: string;
  name: string;
  event_count: number;
  success_rate: number;
};

export type AgentsCard = {
  has_customer: boolean;
  active_agents?: number;
  events_today?: number;
  philosophy?: string;
  privacy_note?: string;
};

export type AgentsDashboard = {
  has_customer: boolean;
  agents: CollaborationAgent[];
  recent_events: AgentEvent[];
  health: AgentHealth[];
  active_count?: number;
  blocked_count?: number;
};

export type AgentDetail = {
  agent: CollaborationAgent;
  events: AgentEvent[];
  metrics: Array<{ metric_key: string; metric_value: number; period_end?: string }>;
  policy_sample?: Record<string, unknown>;
};

export type AgentActionPrecheck = {
  allowed: boolean;
  reason?: string;
  requires_approval?: boolean;
  requires_governance?: boolean;
  agent?: CollaborationAgent;
  policy?: Record<string, unknown>;
};

export type CollaborationResult = {
  flow_key?: string;
  scenario?: string;
  steps?: unknown[];
  status?: string;
  event_id?: string;
  precheck?: AgentActionPrecheck;
};
