import type {
  CriticalityLevel,
  ExternalRelationshipDetail,
  ExternalRelationshipItem,
  ExternalRelationshipListResponse,
  ExternalRelationshipsDashboard,
  RelationshipRecommendation,
  RelationshipStatus,
  RelationshipType,
} from "./types";

const TYPES = new Set<RelationshipType>([
  "supplier", "strategic_partner", "technology_vendor", "consultant",
  "outsourcing_provider", "financial_institution", "legal_advisor",
  "insurance_provider", "service_provider", "custom",
]);
const STATUSES = new Set<RelationshipStatus>([
  "active", "under_review", "pending_renewal", "suspended", "ended",
]);
const CRITICALITY = new Set<CriticalityLevel>(["low", "moderate", "high", "mission_critical"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseItem(raw: unknown): ExternalRelationshipItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const type = str(d.relationship_type, "supplier") as RelationshipType;
  const status = str(d.status, "active") as RelationshipStatus;
  const crit = str(d.criticality_level, "moderate") as CriticalityLevel;
  return {
    id: str(d.id),
    organization_name: str(d.organization_name),
    relationship_type: TYPES.has(type) ? type : "supplier",
    primary_contact: str(d.primary_contact),
    secondary_contact: str(d.secondary_contact),
    email: str(d.email),
    phone: str(d.phone),
    country: str(d.country),
    status: STATUSES.has(status) ? status : "active",
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    stakeholder_ids: strArray(d.stakeholder_ids),
    shared_with_ids: strArray(d.shared_with_ids),
    service_description: str(d.service_description_full) || str(d.service_description) || undefined,
    service_description_full: str(d.service_description_full) || undefined,
    contract_start_date: str(d.contract_start_date) || null,
    contract_end_date: str(d.contract_end_date) || null,
    renewal_reminder_date: str(d.renewal_reminder_date) || null,
    criticality_level: CRITICALITY.has(crit) ? crit : "moderate",
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    needs_review: d.needs_review === true,
    renewal_upcoming: d.renewal_upcoming === true,
    renewal_expired: d.renewal_expired === true,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): RelationshipRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), relationship_id: str(row.relationship_id) || undefined };
  });
}

function parseDashboard(raw: unknown): ExternalRelationshipsDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active: typeof d.active === "number" ? d.active : 0,
    upcoming_renewals: typeof d.upcoming_renewals === "number" ? d.upcoming_renewals : 0,
    critical: typeof d.critical === "number" ? d.critical : 0,
    needs_review: typeof d.needs_review === "number" ? d.needs_review : 0,
    without_owner: typeof d.without_owner === "number" ? d.without_owner : 0,
    recently_updated: Array.isArray(d.recently_updated) ? d.recently_updated.map(parseItem) : [],
  };
}

export function parseExternalRelationshipList(data: unknown): ExternalRelationshipListResponse {
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

export function parseExternalRelationshipDetail(data: unknown): ExternalRelationshipDetail {
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
  return {
    found: true,
    can_manage: d.can_manage === true,
    relationship: d.relationship ? parseItem(d.relationship) : undefined,
    stakeholders: Array.isArray(d.stakeholders)
      ? d.stakeholders.map((c) => {
          const row = c as Record<string, unknown>;
          return { user_id: str(row.user_id), name: str(row.name) };
        })
      : [],
    related_risks: Array.isArray(d.related_risks)
      ? d.related_risks.map((r) => {
          const row = r as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    related_follow_ups: Array.isArray(d.related_follow_ups)
      ? d.related_follow_ups.map((f) => {
          const row = f as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    renewal_history: Array.isArray(d.renewal_history)
      ? d.renewal_history.map((r) => {
          const row = r as Record<string, unknown>;
          return { id: str(row.id), description: str(row.description), created_at: str(row.created_at), performed_by: str(row.performed_by) };
        })
      : [],
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseExternalRelationshipItem(data: unknown): ExternalRelationshipItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.relationship) return parseItem(d.relationship);
  return parseItem(d);
}
