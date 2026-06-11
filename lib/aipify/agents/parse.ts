import type {
  AgentActionPrecheck,
  AgentDetail,
  AgentEvent,
  AgentHealth,
  AgentsCard,
  AgentsDashboard,
  CollaborationAgent,
  CollaborationResult,
} from "./types";

export function parseCollaborationAgent(row: unknown): CollaborationAgent {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    agent_key: String(s.agent_key ?? ""),
    name: String(s.name ?? ""),
    description: s.description as string | null | undefined,
    status: String(s.status ?? "active"),
    version: String(s.version ?? "1.0.0"),
    category: String(s.category ?? ""),
    risk_level: String(s.risk_level ?? "low"),
    enabled: Boolean(s.enabled ?? true),
    responsibilities: Array.isArray(s.responsibilities) ? (s.responsibilities as string[]) : [],
    capabilities: Array.isArray(s.capabilities)
      ? (s.capabilities as CollaborationAgent["capabilities"])
      : [],
    permissions: Array.isArray(s.permissions)
      ? (s.permissions as CollaborationAgent["permissions"])
      : [],
  };
}

export function parseAgentEvent(row: unknown): AgentEvent {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    source_agent: String(s.source_agent ?? ""),
    target_agent: s.target_agent as string | null | undefined,
    message_type: String(s.message_type ?? ""),
    status: String(s.status ?? "pending"),
    payload: s.payload as Record<string, unknown> | undefined,
    created_at: s.created_at as string | undefined,
  };
}

export function parseAgentHealth(row: unknown): AgentHealth {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    agent_key: String(s.agent_key ?? ""),
    name: String(s.name ?? ""),
    event_count: Number(s.event_count ?? 0),
    success_rate: Number(s.success_rate ?? 0),
  };
}

export function parseAgentsCard(data: unknown): AgentsCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    active_agents: d.active_agents as number | undefined,
    events_today: d.events_today as number | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseAgentsDashboard(data: unknown): AgentsDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    agents: Array.isArray(d.agents) ? (d.agents as unknown[]).map(parseCollaborationAgent) : [],
    recent_events: Array.isArray(d.recent_events)
      ? (d.recent_events as unknown[]).map(parseAgentEvent)
      : [],
    health: Array.isArray(d.health) ? (d.health as unknown[]).map(parseAgentHealth) : [],
    active_count: d.active_count as number | undefined,
    blocked_count: d.blocked_count as number | undefined,
  };
}

export function parseAgentDetail(data: unknown): AgentDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.agent || d.error) return null;
  return {
    agent: parseCollaborationAgent(d.agent),
    events: Array.isArray(d.events) ? (d.events as unknown[]).map(parseAgentEvent) : [],
    metrics: Array.isArray(d.metrics)
      ? (d.metrics as Array<{ metric_key: string; metric_value: number; period_end?: string }>)
      : [],
    policy_sample: d.policy_sample as Record<string, unknown> | undefined,
  };
}

export function parseCollaborationAgents(data: unknown): CollaborationAgent[] {
  const d = (data ?? {}) as Record<string, unknown>;
  return Array.isArray(d.agents) ? (d.agents as unknown[]).map(parseCollaborationAgent) : [];
}

export function parseAgentActionPrecheck(data: unknown): AgentActionPrecheck {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    allowed: Boolean(d.allowed),
    reason: d.reason as string | undefined,
    requires_approval: d.requires_approval as boolean | undefined,
    requires_governance: d.requires_governance as boolean | undefined,
    agent: d.agent ? parseCollaborationAgent(d.agent) : undefined,
    policy: d.policy as Record<string, unknown> | undefined,
  };
}

export function parseCollaborationResult(data: unknown): CollaborationResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    flow_key: d.flow_key as string | undefined,
    scenario: d.scenario as string | undefined,
    steps: Array.isArray(d.steps) ? d.steps : undefined,
    status: d.status as string | undefined,
    event_id: d.event_id as string | undefined,
    precheck: d.precheck ? parseAgentActionPrecheck(d.precheck) : undefined,
  };
}
