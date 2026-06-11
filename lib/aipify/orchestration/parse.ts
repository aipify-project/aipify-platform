import type {
  OrchestrationAuditEntry,
  OrchestrationCard,
  OrchestrationDashboard,
  OrchestrationEvent,
  OrchestrationFlow,
  OrchestrationFlowDetail,
  OrchestrationRule,
  OrchestrationSettings,
  OrchestrationStep,
} from "./types";

export function parseOrchestrationCard(data: unknown): OrchestrationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    events_today: d.events_today as number | undefined,
    active_flows: d.active_flows as number | undefined,
    blocked_flows: d.blocked_flows as number | undefined,
    failed_flows: d.failed_flows as number | undefined,
    waiting_approvals: d.waiting_approvals as number | undefined,
    emergency_stop_active: d.emergency_stop_active as boolean | undefined,
    enabled: d.enabled as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
  };
}

function parseEvent(row: unknown): OrchestrationEvent {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    event_key: String(s.event_key ?? ""),
    source_module: String(s.source_module ?? ""),
    source_type: String(s.source_type ?? ""),
    source_id: s.source_id as string | null | undefined,
    event_type: String(s.event_type ?? ""),
    severity: String(s.severity ?? ""),
    priority_score: Number(s.priority_score ?? 0),
    status: String(s.status ?? ""),
    duplicate_count: s.duplicate_count as number | undefined,
    occurred_at: s.occurred_at as string | undefined,
    created_at: s.created_at as string | undefined,
  };
}

function parseFlow(row: unknown): OrchestrationFlow {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    flow_key: String(s.flow_key ?? ""),
    name: String(s.name ?? ""),
    status: String(s.status ?? ""),
    current_step: s.current_step as string | null | undefined,
    result_summary: s.result_summary as string | null | undefined,
    trigger_event_id: s.trigger_event_id as string | null | undefined,
    started_at: s.started_at as string | undefined,
    completed_at: s.completed_at as string | null | undefined,
  };
}

function parseStep(row: unknown): OrchestrationStep {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    step_order: Number(s.step_order ?? 0),
    step_key: String(s.step_key ?? ""),
    module_key: String(s.module_key ?? ""),
    action_key: String(s.action_key ?? ""),
    status: String(s.status ?? ""),
    input: s.input as Record<string, unknown> | undefined,
    output: s.output as Record<string, unknown> | undefined,
    error_message: s.error_message as string | null | undefined,
  };
}

function parseAudit(row: unknown): OrchestrationAuditEntry {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    action: String(s.action ?? ""),
    result: s.result as string | null | undefined,
    created_at: String(s.created_at ?? ""),
  };
}

export function parseOrchestrationDashboard(data: unknown): OrchestrationDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = <T>(key: string, parser: (r: unknown) => T) =>
    Array.isArray(d[key]) ? (d[key] as unknown[]).map(parser) : [];
  return {
    has_customer: Boolean(d.has_customer),
    events_today: d.events_today as number | undefined,
    active_flows: d.active_flows as number | undefined,
    failed_flows: d.failed_flows as number | undefined,
    blocked_flows: d.blocked_flows as number | undefined,
    waiting_approvals: d.waiting_approvals as number | undefined,
    duplicates_suppressed: d.duplicates_suppressed as number | undefined,
    emergency_stop_active: d.emergency_stop_active as boolean | undefined,
    recent_events: list("recent_events", parseEvent),
    recent_flows: list("recent_flows", parseFlow),
    top_modules: list("top_modules", (r) => {
      const m = (r ?? {}) as Record<string, unknown>;
      return { source_module: String(m.source_module ?? ""), count: Number(m.count ?? 0) };
    }),
    recent_audit: list("recent_audit", parseAudit),
  };
}

export function parseOrchestrationEvents(data: unknown): OrchestrationEvent[] {
  const d = (data ?? {}) as Record<string, unknown>;
  return Array.isArray(d.events) ? (d.events as unknown[]).map(parseEvent) : [];
}

export function parseOrchestrationFlows(data: unknown): OrchestrationFlow[] {
  const d = (data ?? {}) as Record<string, unknown>;
  return Array.isArray(d.flows) ? (d.flows as unknown[]).map(parseFlow) : [];
}

export function parseOrchestrationFlowDetail(data: unknown): OrchestrationFlowDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.flow) return null;
  return {
    flow: parseFlow(d.flow),
    steps: Array.isArray(d.steps) ? (d.steps as unknown[]).map(parseStep) : [],
    dispatches: Array.isArray(d.dispatches) ? (d.dispatches as Record<string, unknown>[]) : [],
    audit: Array.isArray(d.audit) ? (d.audit as unknown[]).map(parseAudit) : [],
  };
}

export function parseOrchestrationRules(data: unknown): OrchestrationRule[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.rules)) return [];
  return (d.rules as unknown[]).map((row) => {
    const s = (row ?? {}) as Record<string, unknown>;
    return {
      id: String(s.id ?? ""),
      tenant_id: s.tenant_id as string | null | undefined,
      rule_key: String(s.rule_key ?? ""),
      name: String(s.name ?? ""),
      description: s.description as string | null | undefined,
      enabled: Boolean(s.enabled ?? true),
      source_module: s.source_module as string | null | undefined,
      event_type: String(s.event_type ?? ""),
      conditions: s.conditions as Record<string, unknown> | undefined,
      actions: Array.isArray(s.actions) ? (s.actions as Record<string, unknown>[]) : [],
      risk_level: String(s.risk_level ?? "low"),
      requires_policy_check: Boolean(s.requires_policy_check ?? true),
    };
  });
}

export function parseOrchestrationSettings(data: unknown): OrchestrationSettings | null {
  const d = (data ?? {}) as Record<string, unknown>;
  const s = (d.settings ?? {}) as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    enabled: Boolean(s.enabled ?? true),
    auto_route_events: Boolean(s.auto_route_events ?? true),
    require_policy_engine: Boolean(s.require_policy_engine ?? true),
    allow_cross_module_dispatch: Boolean(s.allow_cross_module_dispatch ?? true),
    max_flow_steps: Number(s.max_flow_steps ?? 20),
    max_parallel_flows: Number(s.max_parallel_flows ?? 50),
    notify_on_critical: Boolean(s.notify_on_critical ?? true),
    create_actions_for_high: Boolean(s.create_actions_for_high ?? true),
    create_actions_for_medium: Boolean(s.create_actions_for_medium ?? true),
    suppress_duplicate_events: Boolean(s.suppress_duplicate_events ?? true),
    duplicate_window_minutes: Number(s.duplicate_window_minutes ?? 60),
  };
}
