import type {
  BottleneckResult,
  DigitalTwinCard,
  DigitalTwinDashboard,
  DigitalTwinInsight,
  DigitalTwinKnowledgeOwner,
  DigitalTwinProcess,
  DigitalTwinRole,
  EscalationResult,
  KnowledgeRouteResult,
  ProcessDetail,
  TwinHealthResult,
} from "./types";

function parseRole(row: unknown): DigitalTwinRole {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: s.id as string | undefined,
    role_key: String(s.role_key ?? ""),
    role_name: String(s.role_name ?? ""),
    description: s.description as string | null | undefined,
    responsibility_types: Array.isArray(s.responsibility_types)
      ? (s.responsibility_types as string[])
      : [],
    escalation_authority: Boolean(s.escalation_authority),
    knowledge_ownership: Boolean(s.knowledge_ownership),
  };
}

function parseInsight(row: unknown): DigitalTwinInsight {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    insight_type: String(s.insight_type ?? ""),
    summary: String(s.summary ?? ""),
    confidence: Number(s.confidence ?? 0),
    status: s.status as string | undefined,
  };
}

export function parseDigitalTwinCard(data: unknown): DigitalTwinCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    twin_health_score: d.twin_health_score as number | undefined,
    open_insights: d.open_insights as number | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseDigitalTwinDashboard(data: unknown): DigitalTwinDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    twin_health_score: d.twin_health_score as number | undefined,
    process_coverage: d.process_coverage as number | undefined,
    knowledge_owners: d.knowledge_owners as number | undefined,
    low_confidence_count: d.low_confidence_count as number | undefined,
    roles: Array.isArray(d.roles) ? (d.roles as unknown[]).map(parseRole) : [],
    processes: Array.isArray(d.processes) ? (d.processes as DigitalTwinProcess[]) : [],
    knowledge_routing: Array.isArray(d.knowledge_routing)
      ? (d.knowledge_routing as DigitalTwinKnowledgeOwner[])
      : [],
    insights: Array.isArray(d.insights) ? (d.insights as unknown[]).map(parseInsight) : [],
    organization_units: Array.isArray(d.organization_units)
      ? (d.organization_units as DigitalTwinDashboard["organization_units"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseKnowledgeRouteResult(data: unknown): KnowledgeRouteResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    routed: Boolean(d.routed),
    topic: d.topic as string | undefined,
    role_key: d.role_key as string | undefined,
    role_name: d.role_name as string | undefined,
    confidence: d.confidence as number | undefined,
    confidence_level: d.confidence_level as string | undefined,
    requires_review: d.requires_review as boolean | undefined,
    explanation: d.explanation as string | undefined,
    reason: d.reason as string | undefined,
  };
}

export function parseEscalationResult(data: unknown): EscalationResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    resolved: Boolean(d.resolved),
    process_key: d.process_key as string | undefined,
    current_step: d.current_step as number | undefined,
    role_key: d.role_key as string | undefined,
    role_name: d.role_name as string | undefined,
    next_role_key: d.next_role_key as string | undefined,
    explanation: d.explanation as string | undefined,
    reason: d.reason as string | undefined,
  };
}

export function parseBottleneckResult(data: unknown): BottleneckResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    bottlenecks_found: Number(d.bottlenecks_found ?? 0),
    insights: Array.isArray(d.insights) ? (d.insights as unknown[]).map(parseInsight) : [],
  };
}

export function parseTwinHealthResult(data: unknown): TwinHealthResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    twin_health_score: d.twin_health_score as number | undefined,
    process_coverage: d.process_coverage as number | undefined,
    role_count: d.role_count as number | undefined,
    knowledge_owners: d.knowledge_owners as number | undefined,
    low_confidence_count: d.low_confidence_count as number | undefined,
  };
}

export function parseProcessDetail(data: unknown): ProcessDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (d.error || !d.process) return null;
  return {
    process: d.process as DigitalTwinProcess,
    steps: Array.isArray(d.steps) ? (d.steps as ProcessDetail["steps"]) : [],
    escalation_path: Array.isArray(d.escalation_path)
      ? (d.escalation_path as ProcessDetail["escalation_path"])
      : [],
  };
}
