import type {
  BlueprintImpact,
  ImpactScore,
  MarketplaceImpact,
  RoiSettings,
  ValueEngineCard,
  ValueEngineDashboard,
  ValueEvent,
  ValueOpportunity,
  ValueReport,
  ValueTimelinePoint,
} from "./types";

export function parseRoiSettings(data: unknown): RoiSettings {
  const s = (data ?? {}) as Record<string, unknown>;
  return {
    tenant_id: String(s.tenant_id ?? ""),
    support_hourly_rate: Number(s.support_hourly_rate ?? 35),
    admin_hourly_rate: Number(s.admin_hourly_rate ?? 45),
    management_hourly_rate: Number(s.management_hourly_rate ?? 80),
    default_hourly_rate: Number(s.default_hourly_rate ?? 45),
    currency: String(s.currency ?? "USD"),
    enabled: Boolean(s.enabled ?? false),
  };
}

export function parseValueEvent(row: unknown): ValueEvent {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    source_module: String(s.source_module ?? ""),
    event_type: String(s.event_type ?? ""),
    category: String(s.category ?? ""),
    estimated_time_saved_minutes: Number(s.estimated_time_saved_minutes ?? 0),
    estimated_value: s.estimated_value as number | null | undefined,
    evidence: s.evidence as Record<string, unknown> | undefined,
    evidence_ref: s.evidence_ref as string | null | undefined,
    created_at: s.created_at as string | undefined,
  };
}

export function parseImpactScore(data: unknown): ImpactScore {
  const s = (data ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    overall_score: Number(s.overall_score ?? 0),
    time_saved_score: Number(s.time_saved_score ?? 0),
    support_score: Number(s.support_score ?? 0),
    quality_score: Number(s.quality_score ?? 0),
    knowledge_score: Number(s.knowledge_score ?? 0),
    automation_score: Number(s.automation_score ?? 0),
    governance_score: Number(s.governance_score ?? 0),
    productivity_score: Number(s.productivity_score ?? 0),
    operational_score: Number(s.operational_score ?? 0),
    trend_delta: s.trend_delta as number | null | undefined,
    evidence_summary: s.evidence_summary as Record<string, unknown> | undefined,
    generated_at: s.generated_at as string | undefined,
  };
}

export function parseValueEngineCard(data: unknown): ValueEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    impact_score: d.impact_score as number | undefined,
    trend_delta: d.trend_delta as number | null | undefined,
    minutes_saved_30d: d.minutes_saved_30d as number | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseValueEngineDashboard(data: unknown): ValueEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    impact_score: d.impact_score ? parseImpactScore(d.impact_score) : undefined,
    roi_enabled: d.roi_enabled as boolean | undefined,
    minutes_saved_30d: d.minutes_saved_30d as number | undefined,
    estimated_value_30d: d.estimated_value_30d as number | null | undefined,
    currency: d.currency as string | undefined,
    timeline: Array.isArray(d.timeline) ? (d.timeline as ValueTimelinePoint[]) : [],
    marketplace_impact: Array.isArray(d.marketplace_impact)
      ? (d.marketplace_impact as MarketplaceImpact[])
      : [],
    blueprint_impact: (d.blueprint_impact as BlueprintImpact | null) ?? null,
    category_scores: d.category_scores as Record<string, number> | undefined,
  };
}

export function parseValueEvents(data: unknown): ValueEvent[] {
  const d = (data ?? {}) as Record<string, unknown>;
  return Array.isArray(d.events) ? (d.events as unknown[]).map(parseValueEvent) : [];
}

export function parseValueReports(data: unknown): ValueReport[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.reports)) return [];
  return (d.reports as unknown[]).map((row) => {
    const r = (row ?? {}) as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      report_type: String(r.report_type ?? ""),
      title: String(r.title ?? ""),
      summary: r.summary as string | null | undefined,
      generated_at: r.generated_at as string | undefined,
      payload: r.payload as Record<string, unknown> | undefined,
    };
  });
}

export function parseValueOpportunities(data: unknown): ValueOpportunity[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.opportunities)) return [];
  return (d.opportunities as unknown[]).map((row) => {
    const r = (row ?? {}) as Record<string, unknown>;
    return {
      type: String(r.type ?? ""),
      title: String(r.title ?? ""),
      summary: String(r.summary ?? ""),
      priority: String(r.priority ?? "low"),
      evidence: String(r.evidence ?? ""),
    };
  });
}
