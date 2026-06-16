import type {
  AudienceType,
  CommunicationDetail,
  CommunicationItem,
  CommunicationListResponse,
  CommunicationPriority,
  CommunicationRecommendation,
  CommunicationStatus,
  CommunicationType,
  CommunicationsDashboard,
} from "./types";

const TYPES = new Set<CommunicationType>([
  "company_announcement", "operational_update", "policy_update", "security_notice",
  "executive_message", "team_update", "maintenance_notification", "celebration_recognition",
  "emergency_communication", "custom_communication",
]);
const STATUSES = new Set<CommunicationStatus>(["draft", "scheduled", "published", "expired", "archived"]);
const PRIORITIES = new Set<CommunicationPriority>(["informational", "important", "high_priority", "critical"]);
const AUDIENCES = new Set<AudienceType>([
  "entire_organization", "specific_departments", "administrators_only", "executives_only",
  "custom_groups", "individual_users",
]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseItem(raw: unknown): CommunicationItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const type = str(d.communication_type, "company_announcement") as CommunicationType;
  const status = str(d.status, "draft") as CommunicationStatus;
  const priority = str(d.priority, "informational") as CommunicationPriority;
  const audience = str(d.audience_type, "entire_organization") as AudienceType;
  return {
    id: str(d.id),
    title: str(d.title),
    summary: str(d.summary_full) || str(d.summary) || undefined,
    summary_full: str(d.summary_full) || undefined,
    full_message: str(d.full_message) || undefined,
    communication_type: TYPES.has(type) ? type : "company_announcement",
    author_id: str(d.author_id) || null,
    author_name: str(d.author_name, "Unassigned"),
    publish_date: str(d.publish_date) || null,
    expiration_date: str(d.expiration_date) || null,
    audience_type: AUDIENCES.has(audience) ? audience : "entire_organization",
    audience_target_ids: strArray(d.audience_target_ids),
    priority: PRIORITIES.has(priority) ? priority : "informational",
    status: STATUSES.has(status) ? status : "draft",
    requires_acknowledgement: d.requires_acknowledgement === true,
    related_modules: strArray(d.related_modules),
    related_policy_ids: strArray(d.related_policy_ids),
    expiring_soon: d.expiring_soon === true,
    user_acknowledged: d.user_acknowledged === true,
    acknowledgement_count: typeof d.acknowledgement_count === "number" ? d.acknowledgement_count : 0,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): CommunicationRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), communication_id: str(row.communication_id) || undefined };
  });
}

function parseDashboard(raw: unknown): CommunicationsDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active: typeof d.active === "number" ? d.active : 0,
    scheduled: typeof d.scheduled === "number" ? d.scheduled : 0,
    critical: typeof d.critical === "number" ? d.critical : 0,
    expiring: typeof d.expiring === "number" ? d.expiring : 0,
    recently_published: Array.isArray(d.recently_published) ? d.recently_published.map(parseItem) : [],
    drafts: typeof d.drafts === "number" ? d.drafts : 0,
  };
}

export function parseCommunicationList(data: unknown): CommunicationListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseItem) : [],
    dashboard: parseDashboard(d.dashboard),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseCommunicationDetail(data: unknown): CommunicationDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const audit = Array.isArray(d.audit_history)
    ? d.audit_history.map((a) => {
        const row = a as Record<string, unknown>;
        return {
          id: str(row.id),
          event_type: str(row.event_type),
          description: str(row.description),
          created_at: str(row.created_at),
          performed_by: str(row.performed_by),
        };
      })
    : [];
  const userAck = d.user_acknowledgement as Record<string, unknown> | undefined;
  const delivery = d.delivery_status as Record<string, unknown> | undefined;
  return {
    found: true,
    can_manage: d.can_manage === true,
    communication: d.communication ? parseItem(d.communication) : undefined,
    related_policies: Array.isArray(d.related_policies)
      ? d.related_policies.map((p) => {
          const row = p as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    delivery_status: delivery
      ? { acknowledged_count: typeof delivery.acknowledged_count === "number" ? delivery.acknowledged_count : 0, outstanding_note: str(delivery.outstanding_note) || undefined }
      : undefined,
    acknowledgements: Array.isArray(d.acknowledgements)
      ? d.acknowledgements.map((a) => {
          const row = a as Record<string, unknown>;
          return { user_id: str(row.user_id), user_name: str(row.user_name), acknowledged_at: str(row.acknowledged_at) };
        })
      : [],
    user_acknowledgement: userAck
      ? { acknowledged: userAck.acknowledged === true, pending: userAck.pending === true }
      : undefined,
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseCommunicationItem(data: unknown): CommunicationItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.communication) return parseItem(d.communication);
  return parseItem(d);
}
