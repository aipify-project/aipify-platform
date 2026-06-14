import type {
  SinceLastLoginEngineBundle,
  SinceLastLoginEvent,
  SinceLastLoginEventType,
  SinceLastLoginScope,
  SinceLastLoginSeverity,
} from "./types";

function parseSeverity(value: unknown): SinceLastLoginSeverity {
  if (
    value === "critical" ||
    value === "attention" ||
    value === "success" ||
    value === "neutral" ||
    value === "recommendation"
  ) {
    return value;
  }
  return "neutral";
}

function parseEventType(value: unknown): SinceLastLoginEventType {
  const types: SinceLastLoginEventType[] = [
    "support",
    "automation",
    "customer",
    "billing",
    "installation",
    "action",
    "recommendation",
    "critical",
  ];
  if (typeof value === "string" && types.includes(value as SinceLastLoginEventType)) {
    return value as SinceLastLoginEventType;
  }
  return "action";
}

function parseScope(value: unknown): SinceLastLoginScope {
  if (
    value === "platform_executive" ||
    value === "platform_admin" ||
    value === "customer" ||
    value === "support"
  ) {
    return value;
  }
  return "platform_executive";
}

function parseEvent(item: unknown): SinceLastLoginEvent | null {
  if (!item || typeof item !== "object") return null;
  const row = item as Record<string, unknown>;
  const id = typeof row.id === "string" ? row.id : null;
  const summary = typeof row.summary_text === "string" ? row.summary_text : null;
  if (!id || !summary) return null;

  return {
    id,
    event_type: parseEventType(row.event_type),
    severity: parseSeverity(row.severity),
    timestamp: typeof row.timestamp === "string" ? row.timestamp : new Date().toISOString(),
    tenant_scope: typeof row.tenant_scope === "string" ? row.tenant_scope : "platform",
    summary_text: summary,
    deep_link: typeof row.deep_link === "string" ? row.deep_link : "/",
    action_required: row.action_required === true,
    priority: typeof row.priority === "number" ? row.priority : undefined,
  };
}

export function parseSinceLastLoginEngineBundle(payload: unknown): SinceLastLoginEngineBundle | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;

  const items = Array.isArray(data.items)
    ? data.items
        .map(parseEvent)
        .filter((item): item is SinceLastLoginEvent => item !== null)
        .slice(0, 6)
    : [];

  return {
    scope: parseScope(data.scope),
    since: typeof data.since === "string" ? data.since : new Date().toISOString(),
    previous_login_at:
      typeof data.previous_login_at === "string" ? data.previous_login_at : null,
    generated_at:
      typeof data.generated_at === "string" ? data.generated_at : new Date().toISOString(),
    critical_header:
      typeof data.critical_header === "string" ? data.critical_header : null,
    items,
    is_empty: data.is_empty === true || items.length === 0,
    privacy_note: typeof data.privacy_note === "string" ? data.privacy_note : undefined,
  };
}

export function severityAccentClass(severity: SinceLastLoginSeverity): string {
  if (severity === "critical") return "bg-red-500";
  if (severity === "attention") return "bg-amber-500";
  if (severity === "success") return "bg-emerald-500";
  return "bg-zinc-400";
}

export function severityTextClass(severity: SinceLastLoginSeverity): string {
  if (severity === "critical") return "text-red-800";
  if (severity === "attention") return "text-amber-900";
  if (severity === "success") return "text-emerald-800";
  return "text-zinc-700";
}
