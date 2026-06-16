import type {
  ComplianceDashboard,
  ComplianceReadiness,
  PolicyCategory,
  PolicyDetail,
  PolicyItem,
  PolicyListResponse,
  PolicyRecommendation,
  PolicyStatus,
  PolicyVersionSummary,
} from "./types";
import type { ReviewFrequency } from "../responsibilities/types";

const CATEGORIES = new Set<PolicyCategory>([
  "information_security", "privacy_data_protection", "employee_policies", "acceptable_use",
  "incident_response", "vendor_management", "financial_controls", "business_continuity",
  "operational_procedures", "custom",
]);
const STATUSES = new Set<PolicyStatus>(["draft", "active", "under_review", "retired"]);
const AUDIENCES = new Set(["all_organization_members", "managers", "owners_admins", "custom"]);
const FREQS = new Set<ReviewFrequency>(["monthly", "quarterly", "semi_annual", "annual"]);
const READINESS = new Set<ComplianceReadiness["label"]>(["building", "strong", "moderate", "needs_attention"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseAck(raw: unknown) {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    acknowledged_count: typeof d.acknowledged_count === "number" ? d.acknowledged_count : 0,
    outstanding_count: typeof d.outstanding_count === "number" ? d.outstanding_count : 0,
    completion_rate: typeof d.completion_rate === "number" ? d.completion_rate : 0,
  };
}

function parseItem(raw: unknown): PolicyItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const category = str(d.category, "custom") as PolicyCategory;
  const status = str(d.status, "draft") as PolicyStatus;
  const audience = str(d.audience, "all_organization_members");
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
    audience_user_ids: strArray(d.audience_user_ids),
    status: STATUSES.has(status) ? status : "draft",
    version_number: typeof d.version_number === "number" ? d.version_number : 1,
    effective_date: str(d.effective_date) || null,
    review_date: str(d.review_date) || null,
    review_frequency: FREQS.has(freq) ? freq : null,
    audience: AUDIENCES.has(audience) ? (audience as PolicyItem["audience"]) : "all_organization_members",
    related_playbook_ids: strArray(d.related_playbook_ids),
    related_knowledge_content: strArray(d.related_knowledge_content),
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    needs_review: d.needs_review === true,
    acknowledgement: parseAck(d.acknowledgement),
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): PolicyRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), policy_id: str(row.policy_id) || undefined };
  });
}

function parseDashboard(raw: unknown): ComplianceDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const r = d.readiness as Record<string, unknown> | undefined;
  const label = str(r?.label, "building") as ComplianceReadiness["label"];
  return {
    active: typeof d.active === "number" ? d.active : 0,
    needs_review: typeof d.needs_review === "number" ? d.needs_review : 0,
    outstanding_acknowledgements: typeof d.outstanding_acknowledgements === "number" ? d.outstanding_acknowledgements : 0,
    without_owner: typeof d.without_owner === "number" ? d.without_owner : 0,
    recently_updated: Array.isArray(d.recently_updated) ? d.recently_updated.map(parseItem) : [],
    readiness: {
      score: typeof r?.score === "number" ? r.score : 0,
      label: READINESS.has(label) ? label : "building",
    },
  };
}

export function parseComplianceList(data: unknown): PolicyListResponse {
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

export function parseComplianceDetail(data: unknown): PolicyDetail {
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
    policy: d.policy ? parseItem(d.policy) : undefined,
    contributors: Array.isArray(d.contributors)
      ? d.contributors.map((c) => {
          const row = c as Record<string, unknown>;
          return { user_id: str(row.user_id), name: str(row.name) };
        })
      : [],
    version_history: Array.isArray(d.version_history)
      ? d.version_history.map((v) => {
          const row = v as Record<string, unknown>;
          return {
            id: str(row.id),
            version_number: typeof row.version_number === "number" ? row.version_number : 0,
            change_summary: str(row.change_summary),
            updated_by: str(row.updated_by),
            created_at: str(row.created_at),
          } satisfies PolicyVersionSummary;
        })
      : [],
    acknowledgements: Array.isArray(d.acknowledgements)
      ? d.acknowledgements.map((a) => {
          const row = a as Record<string, unknown>;
          return { user_id: str(row.user_id), user_name: str(row.user_name), acknowledged_at: str(row.acknowledged_at) };
        })
      : [],
    user_acknowledged: d.user_acknowledged === true,
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parsePolicyItem(data: unknown): PolicyItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.policy) return parseItem(d.policy);
  return parseItem(d);
}
