import type {
  OwnerDetailResponse,
  ResponsibilityArea,
  ResponsibilityDetail,
  ResponsibilityItem,
  ResponsibilityListResponse,
  ResponsibilityRecommendation,
  ResponsibilityStatus,
  ResponsibilitiesDashboard,
  ReviewFrequency,
  WorkloadIndicator,
} from "./types";

const AREAS = new Set<ResponsibilityArea>([
  "goals", "follow_ups", "decisions", "approvals", "support_requests",
  "integrations", "business_packs", "billing", "security", "operations",
]);
const STATUSES = new Set<ResponsibilityStatus>(["active", "needs_review", "unassigned", "inactive"]);
const FREQS = new Set<ReviewFrequency>(["monthly", "quarterly", "semi_annual", "annual"]);
const WORKLOADS = new Set<WorkloadIndicator>(["balanced", "moderate", "high"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseItem(raw: unknown): ResponsibilityItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const area = str(d.area, "operations") as ResponsibilityArea;
  const status = str(d.status, "unassigned") as ResponsibilityStatus;
  const freq = str(d.review_frequency) as ReviewFrequency;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description),
    description_full: str(d.description_full) || undefined,
    area: AREAS.has(area) ? area : "operations",
    primary_owner_id: str(d.primary_owner_id) || null,
    primary_owner_name: str(d.primary_owner_name, "Unassigned"),
    backup_owner_id: str(d.backup_owner_id) || null,
    backup_owner_name: str(d.backup_owner_name, "Unassigned"),
    contributor_ids: strArray(d.contributor_ids),
    status: STATUSES.has(status) ? status : "unassigned",
    related_module: str(d.related_module) || null,
    last_reviewed_date: str(d.last_reviewed_date) || null,
    review_frequency: FREQS.has(freq) ? freq : null,
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): ResponsibilityRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), responsibility_id: str(row.responsibility_id) || undefined };
  });
}

function parseDashboard(raw: unknown): ResponsibilitiesDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    assigned: typeof d.assigned === "number" ? d.assigned : 0,
    unassigned: typeof d.unassigned === "number" ? d.unassigned : 0,
    needs_review: typeof d.needs_review === "number" ? d.needs_review : 0,
    critical_no_backup: typeof d.critical_no_backup === "number" ? d.critical_no_backup : 0,
    overloaded_owners: Array.isArray(d.overloaded_owners)
      ? d.overloaded_owners.map((o) => {
          const row = o as Record<string, unknown>;
          return { user_id: str(row.user_id), name: str(row.name), count: typeof row.count === "number" ? row.count : 0 };
        })
      : [],
    recently_updated: Array.isArray(d.recently_updated) ? d.recently_updated.map(parseItem) : [],
  };
}

export function parseResponsibilityList(data: unknown): ResponsibilityListResponse {
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

export function parseResponsibilityDetail(data: unknown): ResponsibilityDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  return {
    found: true,
    can_manage: d.can_manage === true,
    responsibility: d.responsibility ? parseItem(d.responsibility) : undefined,
    contributors: Array.isArray(d.contributors)
      ? d.contributors.map((c) => {
          const row = c as Record<string, unknown>;
          return { user_id: str(row.user_id), name: str(row.name) };
        })
      : [],
    audit_history: Array.isArray(d.audit_history)
      ? d.audit_history.map((a) => {
          const row = a as Record<string, unknown>;
          return { id: str(row.id), event_type: str(row.event_type), description: str(row.description), created_at: str(row.created_at), performed_by: str(row.performed_by) };
        })
      : [],
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseResponsibilityItem(data: unknown): ResponsibilityItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.responsibility) return parseItem(d.responsibility);
  return parseItem(d);
}

export function parseOwnerDetail(data: unknown): OwnerDetailResponse | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.found !== true) return null;
  const wl = str(d.workload_indicator, "balanced") as WorkloadIndicator;
  return {
    found: true,
    user_id: str(d.user_id),
    user_name: str(d.user_name),
    owned_responsibilities: Array.isArray(d.owned_responsibilities) ? d.owned_responsibilities.map(parseItem) : [],
    backup_responsibilities: Array.isArray(d.backup_responsibilities) ? d.backup_responsibilities.map(parseItem) : [],
    assigned_follow_ups: Array.isArray(d.assigned_follow_ups)
      ? d.assigned_follow_ups.map((f) => {
          const row = f as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    assigned_goals: Array.isArray(d.assigned_goals)
      ? d.assigned_goals.map((g) => {
          const row = g as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    pending_approvals: typeof d.pending_approvals === "number" ? d.pending_approvals : 0,
    open_support_requests: typeof d.open_support_requests === "number" ? d.open_support_requests : 0,
    workload_indicator: WORKLOADS.has(wl) ? wl : "balanced",
    workload_total: typeof d.workload_total === "number" ? d.workload_total : 0,
  };
}
