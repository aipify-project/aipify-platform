import type {
  ActivityEvent,
  ActivityEventType,
  ActivityHistoryResponse,
  ActivitySeverity,
} from "./types";

const EVENT_TYPES = new Set<ActivityEventType>([
  "follow_up_created", "follow_up_completed", "decision_recorded", "decision_evaluated",
  "approval_requested", "approval_completed", "task_updated", "integration_connected",
  "business_pack_installed", "billing_event", "security_event", "support_event", "system_recommendation",
]);
const SEVERITIES = new Set<ActivitySeverity>(["info", "notice", "important", "critical"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseEvent(raw: unknown): ActivityEvent {
  const d = (raw ?? {}) as Record<string, unknown>;
  const et = str(d.event_type, "system_recommendation") as ActivityEventType;
  const sev = str(d.severity, "info") as ActivitySeverity;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description),
    event_type: EVENT_TYPES.has(et) ? et : "system_recommendation",
    module_source: str(d.module_source, "system"),
    user_id: str(d.user_id) || undefined,
    user_name: str(d.user_name, "System"),
    timestamp: str(d.timestamp),
    organization: str(d.organization, "Organization"),
    related_entity_id: str(d.related_entity_id) || undefined,
    related_entity_type: str(d.related_entity_type) || undefined,
    severity: SEVERITIES.has(sev) ? sev : "info",
    action_link: str(d.action_link) || undefined,
  };
}

export function parseActivityHistory(data: unknown): ActivityHistoryResponse {
  if (!data || typeof data !== "object") {
    return { found: false, items: [] };
  }
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseEvent) : [],
    principle: str(d.principle),
  };
}
