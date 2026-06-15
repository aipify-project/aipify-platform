import type {
  CustomerFeedbackHistory,
  FeedbackAuditEntry,
  FeedbackFilters,
  FeedbackOverview,
  FeedbackRow,
  FeedbackTrends,
  ProductInitiative,
  TrendItem,
  VocFeedbackCenter,
  VocGlobalInsights,
} from "./types";
import type {
  CustomerStatus,
  FeedbackPriority,
  FeedbackType,
  WorkflowStatus,
} from "./constants";
import {
  CUSTOMER_STATUSES,
  FEEDBACK_PRIORITIES,
  FEEDBACK_TYPES,
  WORKFLOW_STATUSES,
} from "./constants";

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

function parseTrendItems(raw: unknown): TrendItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const row = asRecord(item);
      if (!row) return null;
      return { title: asString(row.title), count: asNumber(row.count) };
    })
    .filter((item): item is TrendItem => item !== null);
}

function parseOverview(raw: unknown): FeedbackOverview {
  const row = asRecord(raw) ?? {};
  return {
    new_feedback: asNumber(row.new_feedback),
    bugs_reported: asNumber(row.bugs_reported),
    feature_requests: asNumber(row.feature_requests),
    improvements_submitted: asNumber(row.improvements_submitted),
    resolved_feedback: asNumber(row.resolved_feedback),
    awaiting_review: asNumber(row.awaiting_review),
  };
}

function parseFeedbackRow(raw: unknown): FeedbackRow | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;

  const feedbackType = asString(row.feedback_type, "general_feedback");
  const priority = asString(row.priority, "medium");
  const workflowStatus = asString(row.workflow_status, "new");
  const customerStatus = asString(row.customer_status, "received");

  return {
    id: asString(row.id),
    feedback_type: (FEEDBACK_TYPES.includes(feedbackType as FeedbackType)
      ? feedbackType
      : "general_feedback") as FeedbackType,
    title: asString(row.title),
    description: asString(row.description),
    priority: (FEEDBACK_PRIORITIES.includes(priority as FeedbackPriority)
      ? priority
      : "medium") as FeedbackPriority,
    wants_response: asBool(row.wants_response),
    workflow_status: (WORKFLOW_STATUSES.includes(workflowStatus as WorkflowStatus)
      ? workflowStatus
      : "new") as WorkflowStatus,
    customer_status: (CUSTOMER_STATUSES.includes(customerStatus as CustomerStatus)
      ? customerStatus
      : "received") as CustomerStatus,
    assigned_to: asString(row.assigned_to),
    linked_phase: asString(row.linked_phase),
    page_url: asString(row.page_url),
    browser_info: asString(row.browser_info),
    device_type: asString(row.device_type),
    attachment_url: asString(row.attachment_url),
    company_id: asString(row.company_id),
    customer: asString(row.customer, "Customer"),
    submitted_at: asString(row.submitted_at ?? row.created_at),
    created_at: asString(row.created_at),
  };
}

function parseTrends(raw: unknown): FeedbackTrends {
  const row = asRecord(raw) ?? {};
  return {
    top_feature_requests: parseTrendItems(row.top_feature_requests),
    top_bugs: parseTrendItems(row.top_bugs),
    top_frustrations: parseTrendItems(row.top_frustrations),
  };
}

function parseAudit(raw: unknown): FeedbackAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    feedback_id: row.feedback_id ? asString(row.feedback_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

export function parseVocFeedbackCenter(raw: unknown): VocFeedbackCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  const filtersRaw = asRecord(row.filters) ?? {};

  return {
    principle: asString(
      row.principle,
      "The people using Aipify every day are one of our greatest sources of innovation."
    ),
    is_empty: Boolean(row.is_empty),
    filters: {
      feedback_type: asString(filtersRaw.feedback_type) as FeedbackFilters["feedback_type"],
      workflow_status: asString(filtersRaw.workflow_status) as FeedbackFilters["workflow_status"],
      priority: asString(filtersRaw.priority) as FeedbackFilters["priority"],
    },
    overview: parseOverview(row.overview),
    feedback: Array.isArray(row.feedback)
      ? row.feedback.map(parseFeedbackRow).filter((item): item is FeedbackRow => item !== null)
      : [],
    trends: parseTrends(row.trends),
    top_improvement_requests: parseTrendItems(row.top_improvement_requests),
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter((item): item is FeedbackAuditEntry => item !== null)
      : [],
  };
}

export function parseCustomerFeedbackHistory(raw: unknown): CustomerFeedbackHistory {
  const row = asRecord(raw) ?? {};
  return {
    items: Array.isArray(row.items)
      ? row.items.map(parseFeedbackRow).filter((item): item is FeedbackRow => item !== null)
      : [],
  };
}

function parseInitiative(raw: unknown): ProductInitiative | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    summary: asString(row.summary),
    recommendation: asString(row.recommendation),
    feedback_count: asNumber(row.feedback_count),
    initiative_type: asString(row.initiative_type),
    status: asString(row.status),
    linked_phase: asString(row.linked_phase),
    created_at: asString(row.created_at),
  };
}

export function parseVocGlobalInsights(raw: unknown): VocGlobalInsights | null {
  const row = asRecord(raw);
  if (!row) return null;

  const insightsRaw = asRecord(row.insights) ?? {};

  return {
    principle: asString(
      row.principle,
      "Listen carefully. Improve continuously. Build with customers, not just for customers."
    ),
    insights: {
      total_feedback: asNumber(insightsRaw.total_feedback),
      feature_request_themes: parseTrendItems(insightsRaw.feature_request_themes),
      onboarding_requests: asNumber(insightsRaw.onboarding_requests),
      recommendation: asString(insightsRaw.recommendation),
    },
    initiatives: Array.isArray(row.initiatives)
      ? row.initiatives
          .map(parseInitiative)
          .filter((item): item is ProductInitiative => item !== null)
      : [],
  };
}

export function buildVocFilterQuery(filters: FeedbackFilters): string {
  const params = new URLSearchParams();
  if (filters.feedback_type) params.set("feedback_type", filters.feedback_type);
  if (filters.workflow_status) params.set("workflow_status", filters.workflow_status);
  if (filters.priority) params.set("priority", filters.priority);
  const query = params.toString();
  return query ? `?${query}` : "";
}
