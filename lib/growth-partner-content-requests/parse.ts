import {
  DELIVERY_METHODS,
  MARKETING_LANGUAGES,
  NOTIFICATION_TYPES,
  REQUEST_STATUSES,
  RESOURCE_TYPES,
  TARGET_AUDIENCES,
  WORKFLOW_STAGES,
} from "./constants";
import type {
  ContentAuditEntry,
  ContentNotification,
  ContentReporting,
  ContentRequest,
  ContentRequestOverview,
  DuplicateRecommendation,
  GrowthPartnerContentRequestCenter,
  WorkflowStageInfo,
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

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const str = asString(value, fallback);
  return (allowed.includes(str as T) ? str : fallback) as T;
}

function parseOverview(raw: unknown): ContentRequestOverview {
  const row = asRecord(raw) ?? {};
  return {
    open_requests: asNumber(row.open_requests),
    in_production: asNumber(row.in_production),
    awaiting_review: asNumber(row.awaiting_review),
    completed_requests: asNumber(row.completed_requests),
    recently_published_assets: asNumber(row.recently_published_assets),
    average_delivery_time: asNumber(row.average_delivery_time),
  };
}

function parseDuplicate(raw: unknown): DuplicateRecommendation | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    kind: asString(row.kind),
    id: asString(row.id),
    title: asString(row.title),
    match_score: asNumber(row.match_score),
    reason: asString(row.reason),
  };
}

function parseRequest(raw: unknown): ContentRequest | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    tenant_id: asString(row.tenant_id),
    request_title: asString(row.request_title),
    resource_type: parseEnum(row.resource_type, RESOURCE_TYPES, "presentation_deck"),
    industry: asString(row.industry),
    target_audience: parseEnum(row.target_audience, TARGET_AUDIENCES, "small_business"),
    country: asString(row.country, "NO"),
    language: parseEnum(row.language, MARKETING_LANGUAGES, "en"),
    business_objective: asString(row.business_objective),
    additional_notes: asString(row.additional_notes),
    desired_completion_date: row.desired_completion_date ? asString(row.desired_completion_date) : null,
    status: parseEnum(row.status, REQUEST_STATUSES, "submitted"),
    priority_score: asNumber(row.priority_score),
    assigned_owner: asString(row.assigned_owner),
    assigned_partner: asString(row.assigned_partner),
    production_progress: asNumber(row.production_progress),
    clarification_required: asBool(row.clarification_required),
    clarification_message: asString(row.clarification_message),
    published_asset_id: row.published_asset_id ? asString(row.published_asset_id) : null,
    delivery_method: parseEnum(row.delivery_method, DELIVERY_METHODS, "marketing_center"),
    duplicate_recommendations: Array.isArray(row.duplicate_recommendations)
      ? row.duplicate_recommendations.map(parseDuplicate).filter((d): d is DuplicateRecommendation => d != null)
      : [],
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
    published_at: row.published_at ? asString(row.published_at) : null,
  };
}

function parseNotification(raw: unknown): ContentNotification | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    request_id: asString(row.request_id),
    notification_type: parseEnum(row.notification_type, NOTIFICATION_TYPES, "submitted"),
    message: asString(row.message),
    read_at: row.read_at ? asString(row.read_at) : null,
    created_at: asString(row.created_at),
  };
}

function parseAudit(raw: unknown): ContentAuditEntry | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    request_id: row.request_id ? asString(row.request_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseReporting(raw: unknown): ContentReporting {
  const row = asRecord(raw) ?? {};
  const mapPairs = (items: unknown, keyA: string, keyB: string) =>
    Array.isArray(items)
      ? items.map((item) => {
          const r = asRecord(item) ?? {};
          return { [keyA]: asString(r[keyA]), [keyB]: asNumber(r[keyB]) } as Record<string, string | number>;
        })
      : [];

  return {
    most_requested_types: mapPairs(row.most_requested_types, "resource_type", "request_count") as ContentReporting["most_requested_types"],
    industry_demand: mapPairs(row.industry_demand, "industry", "request_count") as ContentReporting["industry_demand"],
    average_production_days: asNumber(row.average_production_days),
    partner_satisfaction: asNumber(row.partner_satisfaction, 92),
  };
}

function parseWorkflowStage(raw: unknown): WorkflowStageInfo | null {
  const row = asRecord(raw);
  if (!row?.stage) return null;
  return {
    stage: parseEnum(row.stage, WORKFLOW_STAGES, "submitted"),
    label_key: asString(row.label_key, "submitted"),
  };
}

export function parseGrowthPartnerContentRequestCenter(raw: unknown): GrowthPartnerContentRequestCenter {
  const row = asRecord(raw) ?? {};
  if (!row.has_access) return { has_access: false };

  return {
    has_access: true,
    surface: asString(row.surface) as GrowthPartnerContentRequestCenter["surface"],
    overview: parseOverview(row.overview),
    requests: Array.isArray(row.requests)
      ? row.requests.map(parseRequest).filter((r): r is ContentRequest => r != null)
      : [],
    notifications: Array.isArray(row.notifications)
      ? row.notifications.map(parseNotification).filter((n): n is ContentNotification => n != null)
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter((a): a is ContentAuditEntry => a != null)
      : [],
    reporting: parseReporting(row.reporting),
    workflow_stages: Array.isArray(row.workflow_stages)
      ? row.workflow_stages.map(parseWorkflowStage).filter((s): s is WorkflowStageInfo => s != null)
      : [],
    delivery_methods: Array.isArray(row.delivery_methods)
      ? row.delivery_methods.map((m) => parseEnum(m, DELIVERY_METHODS, "marketing_center"))
      : [],
    principle: asString(row.principle),
    foundation_principle: asString(row.foundation_principle),
  };
}
