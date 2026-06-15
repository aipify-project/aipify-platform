import type {
  BusinessEntity,
  GroupAuditEntry,
  GroupInvestment,
  GroupOverviewCenter,
  HierarchyLevel,
  SharedIntelligenceSignal,
} from "./types";
import type { EntityStatus, EntityType } from "./constants";

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

function parseEntity(raw: unknown): BusinessEntity | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const metrics = asRecord(row.metrics) ?? {};

  return {
    id: asString(row.id),
    name: asString(row.name),
    slug: asString(row.slug),
    entity_type: asString(row.entity_type, "subsidiary") as EntityType,
    status: asString(row.status, "active") as EntityStatus,
    brand_name: asString(row.brand_name),
    primary_domain: asString(row.primary_domain),
    company_id: row.company_id ? asString(row.company_id) : null,
    customer_id: row.customer_id ? asString(row.customer_id) : null,
    revenue_currency: asString(row.revenue_currency, "NOK"),
    payment_provider_keys: Array.isArray(row.payment_provider_keys)
      ? row.payment_provider_keys.map(String)
      : [],
    departments_count: asNumber(row.departments_count),
    teams_count: asNumber(row.teams_count),
    administrators_count: asNumber(row.administrators_count),
    verified_domains_count: asNumber(row.verified_domains_count),
    metrics: {
      active_users: asNumber(metrics.active_users),
      active_subscriptions: asNumber(metrics.active_subscriptions),
      support_open_cases: asNumber(metrics.support_open_cases),
    },
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function parseInvestment(raw: unknown): GroupInvestment | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    company_name: asString(row.company_name),
    asset_class: asString(row.asset_class),
    ownership_percentage: asNumber(row.ownership_percentage),
    investment_date: row.investment_date ? asString(row.investment_date) : null,
    investment_amount: row.investment_amount != null ? asNumber(row.investment_amount) : null,
    currency: asString(row.currency, "NOK"),
    status: asString(row.status),
    notes: asString(row.notes),
  };
}

function parseSignal(raw: unknown): SharedIntelligenceSignal | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    source_entity_id: row.source_entity_id ? asString(row.source_entity_id) : null,
    signal_type: asString(row.signal_type),
    summary: asString(row.summary),
    confidence: asString(row.confidence),
    created_at: asString(row.created_at),
  };
}

function parseAudit(raw: unknown): GroupAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    entity_id: row.entity_id ? asString(row.entity_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseHierarchyLevel(raw: unknown): HierarchyLevel | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    level: asNumber(row.level),
    name: asString(row.name),
    key: asString(row.key),
  };
}

export function parseGroupOverviewCenter(raw: unknown): GroupOverviewCenter | null {
  const row = asRecord(raw);
  if (!row) return null;
  const parent = asRecord(row.parent);
  const summary = asRecord(row.summary);
  if (!parent || !summary) return null;

  return {
    principle: asString(row.principle),
    foundation_statement: asString(row.foundation_statement),
    tagline: asString(row.tagline),
    parent: {
      id: asString(parent.id),
      legal_name: asString(parent.legal_name),
      country_of_origin: asString(parent.country_of_origin),
      tagline: asString(parent.tagline),
    },
    summary: {
      total_entities: asNumber(summary.total_entities),
      active_entities: asNumber(summary.active_entities),
      active_users: asNumber(summary.active_users),
      active_subscriptions: asNumber(summary.active_subscriptions),
      investments_count: asNumber(summary.investments_count),
      shared_signals_count: asNumber(summary.shared_signals_count),
    },
    entities: Array.isArray(row.entities)
      ? row.entities.map(parseEntity).filter(Boolean) as BusinessEntity[]
      : [],
    investments: Array.isArray(row.investments)
      ? row.investments.map(parseInvestment).filter(Boolean) as GroupInvestment[]
      : [],
    shared_intelligence: Array.isArray(row.shared_intelligence)
      ? row.shared_intelligence.map(parseSignal).filter(Boolean) as SharedIntelligenceSignal[]
      : [],
    recent_audit: Array.isArray(row.recent_audit)
      ? row.recent_audit.map(parseAudit).filter(Boolean) as GroupAuditEntry[]
      : [],
    hierarchy_levels: Array.isArray(row.hierarchy_levels)
      ? row.hierarchy_levels.map(parseHierarchyLevel).filter(Boolean) as HierarchyLevel[]
      : [],
  };
}

export function parseGroupInvestment(raw: unknown): GroupInvestment | null {
  return parseInvestment(raw);
}

export function parseBusinessEntity(raw: unknown): BusinessEntity | null {
  return parseEntity(raw);
}
