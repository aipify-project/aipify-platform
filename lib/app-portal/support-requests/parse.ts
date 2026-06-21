import type {
  SupportRequestCategory,
  SupportRequestDetail,
  SupportRequestItem,
  SupportRequestListResponse,
  SupportRequestPriority,
  SupportRequestStatus,
} from "./types";

const CATS = new Set<SupportRequestCategory>([
  "technical", "billing", "integrations", "business_packs", "account", "security", "general",
]);
const PRIOS = new Set<SupportRequestPriority>(["low", "medium", "high", "urgent"]);
const STATUSES = new Set<SupportRequestStatus>([
  "open", "in_review", "waiting_for_customer", "waiting_for_aipify", "resolved", "closed", "reopened", "archived",
]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseItem(raw: unknown): SupportRequestItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "general") as SupportRequestCategory;
  const pr = str(d.priority, "medium") as SupportRequestPriority;
  const st = str(d.status, "open") as SupportRequestStatus;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description),
    description_full: str(d.description_full) || str(d.description) || undefined,
    category: CATS.has(cat) ? cat : "general",
    priority: PRIOS.has(pr) ? pr : "medium",
    status: STATUSES.has(st) ? st : "open",
    created_by_id: str(d.created_by_id) || undefined,
    created_by: str(d.created_by, "Unknown"),
    assigned_support_owner_id: str(d.assigned_support_owner_id) || undefined,
    assigned_support_owner: str(d.assigned_support_owner, "Unassigned"),
    related_module: str(d.related_module) || undefined,
    channel: str(d.channel) || undefined,
    resolved_at: str(d.resolved_at) || undefined,
    attachments: Array.isArray(d.attachments) ? d.attachments : [],
    internal_notes: str(d.internal_notes_full) || str(d.internal_notes) || undefined,
    internal_notes_full: str(d.internal_notes_full) || undefined,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseAudit(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw.map((t) => {
    const row = t as Record<string, unknown>;
    return {
      id: str(row.id),
      event_type: str(row.event_type),
      description: str(row.description),
      created_at: str(row.created_at),
      performed_by: str(row.performed_by),
    };
  });
}

export function parseSupportRequestList(data: unknown): SupportRequestListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseItem) : [],
    principle: str(d.principle),
  };
}

export function parseSupportRequestDetail(data: unknown): SupportRequestDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const resolutionRaw = d.resolution as Record<string, unknown> | undefined;
  return {
    found: true,
    can_manage: d.can_manage === true,
    can_reopen: d.can_reopen === true,
    is_historical: d.is_historical === true,
    resolution: resolutionRaw
      ? {
          status: str(resolutionRaw.status),
          resolved_at: str(resolutionRaw.resolved_at) || undefined,
          summary: str(resolutionRaw.summary) || undefined,
        }
      : undefined,
    request: d.request ? parseItem(d.request) : undefined,
    status_history: Array.isArray(d.status_history)
      ? d.status_history.map((s) => {
          const row = s as Record<string, unknown>;
          return { status: str(row.status), at: str(row.at), description: str(row.description) || undefined };
        })
      : [],
    timeline: parseAudit(d.timeline),
    audit_history: parseAudit(d.audit_history),
    related_activity: parseAudit(d.related_activity),
    comments_placeholder: d.comments_placeholder === true,
    internal_notes_placeholder: d.internal_notes_placeholder === true,
    attachments_placeholder: d.attachments_placeholder === true,
  };
}

export function parseSupportRequestItem(data: unknown): SupportRequestItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.request) return parseItem(d.request);
  return parseItem(d);
}
