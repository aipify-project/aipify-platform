import type {
  PlaybookAuditEntry,
  PlaybookCategory,
  PlaybookDetail,
  PlaybookItem,
  PlaybookListResponse,
  PlaybookRecommendation,
  PlaybookStatus,
  PlaybookStep,
  PlaybookVersionSummary,
  PlaybookVersionsResponse,
  PlaybooksDashboard,
} from "./types";
import type { ReviewFrequency } from "../responsibilities/types";

const CATEGORIES = new Set<PlaybookCategory>([
  "customer_support", "employee_onboarding", "incident_response", "security_procedures",
  "billing_operations", "approval_processes", "business_pack_operations",
  "integration_management", "executive_processes", "custom",
]);
const STATUSES = new Set<PlaybookStatus>(["draft", "active", "under_review", "archived"]);
const FREQS = new Set<ReviewFrequency>(["monthly", "quarterly", "semi_annual", "annual"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseStep(raw: unknown): PlaybookStep {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(d.id),
    step_order: typeof d.step_order === "number" ? d.step_order : 0,
    title: str(d.title),
    description: str(d.description),
    responsible_role: str(d.responsible_role),
    requires_approval: d.requires_approval === true,
    related_resources: strArray(d.related_resources),
    checklist_items: strArray(d.checklist_items),
  };
}

function parseItem(raw: unknown): PlaybookItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const category = str(d.category, "custom") as PlaybookCategory;
  const status = str(d.status, "draft") as PlaybookStatus;
  const freq = str(d.review_frequency) as ReviewFrequency;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description),
    description_full: str(d.description_full) || undefined,
    category: CATEGORIES.has(category) ? category : "custom",
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    contributor_ids: strArray(d.contributor_ids),
    status: STATUSES.has(status) ? status : "draft",
    version_number: typeof d.version_number === "number" ? d.version_number : 1,
    review_frequency: FREQS.has(freq) ? freq : null,
    last_reviewed_date: str(d.last_reviewed_date) || null,
    related_modules: strArray(d.related_modules),
    related_knowledge_articles: strArray(d.related_knowledge_articles),
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    access_count: typeof d.access_count === "number" ? d.access_count : 0,
    needs_review: d.needs_review === true,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): PlaybookRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), playbook_id: str(row.playbook_id) || undefined };
  });
}

function parseDashboard(raw: unknown): PlaybooksDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active: typeof d.active === "number" ? d.active : 0,
    draft: typeof d.draft === "number" ? d.draft : 0,
    archived: typeof d.archived === "number" ? d.archived : 0,
    needs_review: typeof d.needs_review === "number" ? d.needs_review : 0,
    recently_updated: Array.isArray(d.recently_updated) ? d.recently_updated.map(parseItem) : [],
    most_accessed: Array.isArray(d.most_accessed) ? d.most_accessed.map(parseItem) : [],
  };
}

function parseAudit(raw: unknown): PlaybookAuditEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((a) => {
    const row = a as Record<string, unknown>;
    return {
      id: str(row.id),
      event_type: str(row.event_type),
      description: str(row.description),
      created_at: str(row.created_at),
      performed_by: str(row.performed_by),
    };
  });
}

function parseVersions(raw: unknown): PlaybookVersionSummary[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((v) => {
    const row = v as Record<string, unknown>;
    return {
      id: str(row.id),
      version_number: typeof row.version_number === "number" ? row.version_number : 0,
      change_summary: str(row.change_summary),
      updated_by: str(row.updated_by),
      updated_by_id: str(row.updated_by_id) || null,
      created_at: str(row.created_at),
      snapshot: row.snapshot,
    };
  });
}

export function parsePlaybookList(data: unknown): PlaybookListResponse {
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

export function parsePlaybookDetail(data: unknown): PlaybookDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  return {
    found: true,
    can_manage: d.can_manage === true,
    playbook: d.playbook ? parseItem(d.playbook) : undefined,
    steps: Array.isArray(d.steps) ? d.steps.map(parseStep) : [],
    contributors: Array.isArray(d.contributors)
      ? d.contributors.map((c) => {
          const row = c as Record<string, unknown>;
          return { user_id: str(row.user_id), name: str(row.name) };
        })
      : [],
    version_history: parseVersions(d.version_history),
    activity_timeline: parseAudit(d.activity_timeline),
    audit_history: parseAudit(d.audit_history),
    recommendations: parseRecs(d.recommendations),
  };
}

export function parsePlaybookItem(data: unknown): PlaybookItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.playbook) return parseItem(d.playbook);
  return parseItem(d);
}

export function parsePlaybookVersions(data: unknown): PlaybookVersionsResponse {
  if (!data || typeof data !== "object") return { found: false, versions: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    playbook_id: str(d.playbook_id) || undefined,
    current_version: typeof d.current_version === "number" ? d.current_version : undefined,
    versions: parseVersions(d.versions),
  };
}
