import type { ActivityEvent } from "@/lib/activity-operations/types";
import {
  mapExecutivePriorityToSeverity,
  type SeverityLevel,
  type WorkflowState,
} from "@/lib/design/semantic-status-system";

export type SinceLastLoginCategory =
  | "requires_attention"
  | "completed_by_aipify"
  | "observed_by_aipify"
  | "information";

export type SinceLastLoginMode = "observed_by_aipify" | "completed_by_aipify";

export type SinceLastLoginEvent = {
  id: string;
  eventType: string;
  title: string;
  explanation: string;
  count: number;
  occurredAt?: string;
  href: string;
  category: SinceLastLoginCategory;
  severity: SeverityLevel | null;
  workflowState: WorkflowState | null;
  dedupeKey: string;
};

const DETECTED_ISSUE_PATTERN =
  /\b(expir|risk detected|revenue alert|approval delay|escalation opened|needs review|requires attention|overdue|shift detected)\b/i;

const AIPIFY_COMPLETED_PATTERN =
  /\b(aipify|companion)\b.*\b(verified|prepared|completed|generated|confirmed)\b|\b(companion|aipify)\s+(summary|briefing|setup)\b/i;

const HUMAN_COMPLETED_PATTERN =
  /\b(completed|closed|resolved)\b/i;

function isAipifyCompletedSignal(input: {
  priority?: string;
  category?: string;
  title?: string;
  summary?: string;
}): boolean {
  const priority = String(input.priority ?? "").toLowerCase();
  const category = String(input.category ?? "").toLowerCase();

  if (priority === "completed" && category.includes("companion")) return true;

  const text = `${input.title ?? ""} ${input.summary ?? ""}`;
  if (DETECTED_ISSUE_PATTERN.test(text)) return false;
  if (AIPIFY_COMPLETED_PATTERN.test(text)) return true;

  if (priority === "completed" && /\bcompanion\b/i.test(text)) return true;

  return false;
}

function isDetectedIssueOnly(input: { title?: string; summary?: string; priority?: string }): boolean {
  const text = `${input.title ?? ""} ${input.summary ?? ""}`;
  if (DETECTED_ISSUE_PATTERN.test(text)) return true;
  const priority = String(input.priority ?? "").toLowerCase();
  return priority === "critical" || priority === "urgent" || priority === "attention_required" || priority === "security";
}

function normalizeSeverity(raw: string | null | undefined): SeverityLevel | null {
  if (!raw) return null;
  return mapExecutivePriorityToSeverity(raw);
}

function normalizeWorkflowState(raw: string | null | undefined): WorkflowState | null {
  const value = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (!value) return null;
  if (value === "open" || value === "acknowledged") return "open";
  if (value === "pending" || value === "queued") return "pending";
  if (value === "awaiting_approval" || value === "awaiting_review" || value === "review_required") {
    return "awaiting_approval";
  }
  if (value === "in_progress" || value === "active" || value === "processing") return "in_progress";
  if (value === "completed" || value === "done" || value === "resolved" || value === "closed") {
    return "completed";
  }
  return null;
}

function severityFromLegacyPriority(priority: string): SeverityLevel | null {
  return normalizeSeverity(priority);
}

function classifyCategory(input: {
  priority?: string;
  category?: string;
  title?: string;
  summary?: string;
  explicitCategory?: string;
}): SinceLastLoginCategory {
  const explicit = String(input.explicitCategory ?? "")
    .trim()
    .toLowerCase();
  if (explicit === "requires_attention" || explicit === "completed_by_aipify" || explicit === "observed_by_aipify" || explicit === "information") {
    return explicit;
  }

  if (isAipifyCompletedSignal(input)) return "completed_by_aipify";

  const priority = String(input.priority ?? "").toLowerCase();
  if (priority === "completed" && !isDetectedIssueOnly(input)) {
    if (isAipifyCompletedSignal(input) || String(input.category ?? "").includes("companion")) {
      return "completed_by_aipify";
    }
  }

  if (
    priority === "critical" ||
    priority === "urgent" ||
    priority === "attention" ||
    priority === "attention_required" ||
    priority === "security" ||
    priority === "pending"
  ) {
    return "requires_attention";
  }

  if (isDetectedIssueOnly(input)) return "requires_attention";

  if (HUMAN_COMPLETED_PATTERN.test(`${input.title ?? ""} ${input.summary ?? ""}`) && !isDetectedIssueOnly(input)) {
    return "information";
  }

  return "information";
}

function workflowFromSignals(input: {
  priority?: string;
  status?: string;
  category?: string;
}): WorkflowState | null {
  const fromStatus = normalizeWorkflowState(input.status);
  if (fromStatus) return fromStatus;

  const priority = String(input.priority ?? "").toLowerCase();
  if (priority === "pending") return "awaiting_approval";
  if (priority === "attention_required") return "open";
  if (priority === "completed") return "completed";

  const category = String(input.category ?? "").toLowerCase();
  if (category.includes("approval")) return "awaiting_approval";

  return null;
}

export function classifyEccSummaryItem(item: Record<string, unknown>): SinceLastLoginEvent {
  const itemKey = String(item.item_key ?? item.id ?? "");
  const itemTitle = String(item.item_title ?? item.title ?? "Update");
  const summary = String(item.summary ?? "");
  const itemCategory = String(item.item_category ?? item.category ?? "operational");
  const priority = String(item.priority ?? "information");
  const count = Math.max(1, Number(item.item_count ?? item.count ?? 1));

  const category = classifyCategory({
    priority,
    category: itemCategory,
    title: itemTitle,
    summary,
  });

  const severity =
    category === "requires_attention" ? severityFromLegacyPriority(priority) : category === "information" ? "info" : null;

  return {
    id: itemKey || `ecc:${itemTitle}`,
    eventType: itemCategory.replace(/_/g, " "),
    title: itemTitle,
    explanation: summary,
    count,
    href: resolveEccItemHref(itemCategory, itemKey),
    category,
    severity,
    workflowState: workflowFromSignals({ priority, category: itemCategory }),
    dedupeKey: `ecc:${itemKey || itemTitle}:${category}`,
  };
}

export function classifyActivityEvent(event: ActivityEvent): SinceLastLoginEvent {
  const category = classifyCategory({
    priority: event.priority,
    category: event.category,
    title: event.title,
    summary: event.summary,
  });

  const severity =
    category === "requires_attention"
      ? severityFromLegacyPriority(event.priority)
      : category === "information"
        ? normalizeSeverity(event.priority) ?? "info"
        : null;

  return {
    id: event.id,
    eventType: event.category.replace(/_/g, " "),
    title: event.title,
    explanation: event.summary ?? event.impact_note ?? event.recommendation ?? "",
    count: 1,
    occurredAt: event.occurred_at,
    href: event.record_href ?? "/app/activity",
    category,
    severity,
    workflowState: workflowFromSignals({
      priority: event.priority,
      category: event.category,
    }),
    dedupeKey: `activity:${event.id}:${category}`,
  };
}

export function classifyTimelineEvent(evt: Record<string, unknown>): SinceLastLoginEvent {
  const eventKey = String(evt.event_key ?? evt.id ?? "");
  const title = String(evt.event_title ?? evt.title ?? "Timeline event");
  const summary = String(evt.summary ?? "");
  const eventType = String(evt.event_type ?? evt.type ?? "timeline");
  const priority = String(evt.priority ?? "information");

  const category = classifyCategory({
    priority,
    category: eventType,
    title,
    summary,
  });

  return {
    id: eventKey || `timeline:${title}`,
    eventType: eventType.replace(/_/g, " "),
    title,
    explanation: summary,
    count: 1,
    occurredAt: typeof evt.occurred_at === "string" ? evt.occurred_at : undefined,
    href: typeof evt.record_href === "string" ? evt.record_href : resolveTimelineHref(eventType),
    category,
    severity: category === "requires_attention" ? severityFromLegacyPriority(priority) : "info",
    workflowState: workflowFromSignals({ priority, status: String(evt.status ?? "") }),
    dedupeKey: `timeline:${eventKey || title}:${category}`,
  };
}

export function classifyRawEvent(raw: Record<string, unknown>): SinceLastLoginEvent {
  if (raw.item_key || raw.item_title) return classifyEccSummaryItem(raw);
  if (raw.event_key || raw.event_title) return classifyTimelineEvent(raw);
  if (raw.id && raw.category) {
    return classifyActivityEvent({
      id: String(raw.id),
      scope: String(raw.scope ?? "organization"),
      category: String(raw.category),
      priority: String(raw.priority ?? "information"),
      title: String(raw.title ?? "Activity"),
      summary: typeof raw.summary === "string" ? raw.summary : undefined,
      record_href: typeof raw.record_href === "string" ? raw.record_href : undefined,
      occurred_at: typeof raw.occurred_at === "string" ? raw.occurred_at : undefined,
      impact_note: typeof raw.impact_note === "string" ? raw.impact_note : undefined,
      recommendation: typeof raw.recommendation === "string" ? raw.recommendation : undefined,
    });
  }

  const title = String(raw.title ?? raw.item_title ?? "Update");
  const summary = String(raw.summary ?? "");
  const category = classifyCategory({ title, summary, priority: String(raw.priority ?? "information") });

  return {
    id: String(raw.id ?? raw.item_key ?? title),
    eventType: String(raw.category ?? raw.item_category ?? "activity"),
    title,
    explanation: summary,
    count: Math.max(1, Number(raw.item_count ?? 1)),
    occurredAt: typeof raw.occurred_at === "string" ? raw.occurred_at : undefined,
    href: typeof raw.record_href === "string" ? raw.record_href : "/app/activity",
    category,
    severity: category === "requires_attention" ? "medium" : "info",
    workflowState: null,
    dedupeKey: `raw:${title}:${category}`,
  };
}

export function mergeSinceLastLoginEvents(events: SinceLastLoginEvent[]): SinceLastLoginEvent[] {
  const seen = new Set<string>();
  const merged: SinceLastLoginEvent[] = [];

  for (const event of events) {
    if (seen.has(event.dedupeKey)) continue;
    seen.add(event.dedupeKey);
    merged.push(event);
  }

  return merged;
}

export function groupSinceLastLoginEvents(events: SinceLastLoginEvent[]): {
  requiresAttention: SinceLastLoginEvent[];
  completedByAipify: SinceLastLoginEvent[];
  otherChanges: SinceLastLoginEvent[];
  counts: {
    requiresAttention: number;
    completedByAipify: number;
    otherChanges: number;
  };
} {
  const requiresAttention: SinceLastLoginEvent[] = [];
  const completedByAipify: SinceLastLoginEvent[] = [];
  const otherChanges: SinceLastLoginEvent[] = [];

  for (const event of events) {
    if (event.category === "requires_attention") requiresAttention.push(event);
    else if (event.category === "completed_by_aipify" || event.category === "observed_by_aipify") {
      completedByAipify.push(event);
    } else otherChanges.push(event);
  }

  return {
    requiresAttention,
    completedByAipify,
    otherChanges,
    counts: {
      requiresAttention: requiresAttention.length,
      completedByAipify: completedByAipify.length,
      otherChanges: otherChanges.length,
    },
  };
}

function resolveEccItemHref(itemCategory: string, itemKey: string): string {
  const category = itemCategory.toLowerCase();
  if (category === "approval") return "/app/approvals";
  if (category === "contract") return "/app/command-center/alerts";
  if (category === "customer") return "/app/customers";
  if (category === "business_pack") return "/app/settings/modules";
  if (category === "risk" || category === "revenue") return "/app/command-center/alerts";
  if (category === "knowledge") return "/app/knowledge";
  if (category === "partner") return "/app/partners";
  if (category === "opportunity") return "/app/command-center/opportunities";
  return `/app/activity?highlight=${encodeURIComponent(itemKey)}`;
}

function resolveTimelineHref(eventType: string): string {
  const type = eventType.toLowerCase();
  if (type.includes("approval")) return "/app/approvals";
  if (type.includes("alert") || type.includes("risk")) return "/app/command-center/alerts";
  if (type.includes("briefing")) return "/app/command-center/companion-briefing";
  return "/app/activity";
}

export function buildSinceLastLoginDataset(input: {
  eccItems?: Record<string, unknown>[];
  activitySinceLogin?: Record<string, unknown>;
  timeline?: Record<string, unknown>[];
  activityEvents?: ActivityEvent[];
}): SinceLastLoginEvent[] {
  const rawEvents: SinceLastLoginEvent[] = [];

  for (const item of input.eccItems ?? []) {
    rawEvents.push(classifyEccSummaryItem(item));
  }

  const since = input.activitySinceLogin ?? {};
  const changeEvents = [...(Array.isArray(since.top_changes) ? since.top_changes : [])];
  const riskEvents = [...(Array.isArray(since.top_risks) ? since.top_risks : [])];
  const opportunityEvents = [...(Array.isArray(since.top_opportunities) ? since.top_opportunities : [])];

  for (const raw of [...changeEvents, ...riskEvents, ...opportunityEvents]) {
    if (raw && typeof raw === "object") rawEvents.push(classifyRawEvent(raw as Record<string, unknown>));
  }

  for (const evt of input.timeline ?? []) {
    rawEvents.push(classifyTimelineEvent(evt));
  }

  for (const event of input.activityEvents ?? []) {
    rawEvents.push(classifyActivityEvent(event));
  }

  return mergeSinceLastLoginEvents(rawEvents);
}

/** Read-only pilot: "Observed by Aipify" instead of "Completed by Aipify". */
export function applyPilotReadOnlySinceLastLoginMode(
  events: SinceLastLoginEvent[],
  mode: SinceLastLoginMode | undefined
): SinceLastLoginEvent[] {
  if (mode !== "observed_by_aipify") return events;
  return events.map((event) =>
    event.category === "completed_by_aipify"
      ? { ...event, category: "observed_by_aipify", dedupeKey: `${event.dedupeKey}:observed` }
      : event
  );
}
