import {
  EFFORT_LEVELS,
  IDEA_SOURCES,
  IMPACT_LEVELS,
  INITIATIVE_STATUSES,
  PRIORITY_LEVELS,
  REQUEST_SOURCES,
  ROADMAP_CATEGORIES,
  ROADMAP_VIEWS,
} from "./constants";
import type {
  EffortLevel,
  IdeaSource,
  ImpactLevel,
  InitiativeStatus,
  PriorityLevel,
  RequestSource,
  RoadmapCategory,
  RoadmapView,
} from "./constants";
import type {
  InitiativeScores,
  ProductRoadmapCenter,
  RequestLink,
  RoadmapAuditEntry,
  RoadmapFilters,
  RoadmapItem,
  RoadmapOverview,
  RoadmapViewCount,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(value: unknown): boolean {
  return value === true;
}

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const str = asString(value, fallback);
  return (allowed.includes(str as T) ? str : fallback) as T;
}

function parseOverview(raw: unknown): RoadmapOverview {
  const row = asRecord(raw) ?? {};
  return {
    planned_initiatives: asNumber(row.planned_initiatives),
    in_development: asNumber(row.in_development),
    ready_for_release: asNumber(row.ready_for_release),
    customer_requested_features: asNumber(row.customer_requested_features),
    recently_completed: asNumber(row.recently_completed),
    deferred_items: asNumber(row.deferred_items),
  };
}

function parseScores(raw: unknown): InitiativeScores {
  const row = asRecord(raw) ?? {};
  return {
    customer_demand: asNumber(row.customer_demand, 50),
    revenue_potential: asNumber(row.revenue_potential, 50),
    strategic_alignment: asNumber(row.strategic_alignment, 50),
    implementation_complexity: asNumber(row.implementation_complexity, 50),
    risk_reduction: asNumber(row.risk_reduction, 50),
    competitive_advantage: asNumber(row.competitive_advantage, 50),
    composite: asNumber(row.composite, 50),
  };
}

function parseRequestLink(raw: unknown): RequestLink | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    request_source: parseEnum(row.request_source, REQUEST_SOURCES, "customer_feedback"),
    request_label: asString(row.request_label),
    company_name: asString(row.company_name),
  };
}

function parseItem(raw: unknown): RoadmapItem | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const phases = Array.isArray(row.related_phases)
    ? row.related_phases.map((p) => asString(p)).filter(Boolean)
    : [];
  return {
    id: asString(row.id),
    title: asString(row.title),
    description: asString(row.description),
    category: parseEnum(row.category, ROADMAP_CATEGORIES, "improvement"),
    source: parseEnum(row.source, IDEA_SOURCES, "internal_product"),
    roadmap_view: parseEnum(row.roadmap_view, ROADMAP_VIEWS, "under_consideration"),
    strategic_value: parseEnum(row.strategic_value, IMPACT_LEVELS, "medium"),
    customer_impact: parseEnum(row.customer_impact, IMPACT_LEVELS, "medium"),
    estimated_effort: parseEnum(row.estimated_effort, EFFORT_LEVELS, "medium"),
    priority: parseEnum(row.priority, PRIORITY_LEVELS, "medium"),
    status: parseEnum(row.status, INITIATIVE_STATUSES, "new"),
    owner: asString(row.owner),
    target_release: asString(row.target_release),
    release_window: asString(row.release_window),
    related_phases: phases,
    scores: parseScores(row.scores),
    deferred: asBool(row.deferred),
    supporting_requests: asNumber(row.supporting_requests),
    enterprise_requests: asNumber(row.enterprise_requests),
    growth_partner_requests: asNumber(row.growth_partner_requests),
    request_links: Array.isArray(row.request_links)
      ? row.request_links.map(parseRequestLink).filter((l): l is RequestLink => l != null)
      : [],
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
    released_at: row.released_at ? asString(row.released_at) : null,
  };
}

function parseViewCount(raw: unknown): RoadmapViewCount | null {
  const row = asRecord(raw);
  if (!row || !row.key) return null;
  return { key: asString(row.key), count: asNumber(row.count) };
}

function parseAudit(raw: unknown): RoadmapAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    roadmap_item_id: row.roadmap_item_id ? asString(row.roadmap_item_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseArray<T>(raw: unknown, parser: (item: unknown) => T | null): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser).filter((item): item is T => item != null);
}

export function buildRoadmapFilterQuery(filters: RoadmapFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.roadmap_view) params.set("roadmap_view", filters.roadmap_view);
  if (filters.release_window) params.set("release_window", filters.release_window);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function parseProductRoadmapCenter(raw: unknown): ProductRoadmapCenter | null {
  const row = asRecord(raw);
  if (!row || !row.overview) return null;
  const filters = asRecord(row.filters) ?? {};

  return {
    principle: asString(
      row.principle,
      "The best product roadmaps are shaped by customer needs, strategic thinking, and disciplined execution."
    ),
    filters: {
      category: filters.category
        ? parseEnum(filters.category, ROADMAP_CATEGORIES, "improvement")
        : undefined,
      priority: filters.priority
        ? parseEnum(filters.priority, PRIORITY_LEVELS, "medium")
        : undefined,
      status: filters.status
        ? parseEnum(filters.status, INITIATIVE_STATUSES, "new")
        : undefined,
      source: filters.source ? parseEnum(filters.source, IDEA_SOURCES, "internal_product") : undefined,
      roadmap_view: filters.roadmap_view
        ? parseEnum(filters.roadmap_view, ROADMAP_VIEWS, "under_consideration")
        : undefined,
      release_window: filters.release_window ? asString(filters.release_window) : undefined,
    },
    overview: parseOverview(row.overview),
    roadmap_views: parseArray(row.roadmap_views, parseViewCount),
    items: parseArray(row.items, parseItem),
    audit: parseArray(row.audit, parseAudit),
  };
}
