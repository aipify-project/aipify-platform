import type {
  MobileApiChannel,
  MobileApiDeliveryLog,
  MobileApiEventRule,
  MobileApiIntegrationCenter,
  MobileApiPendingSend,
  MobileApiSettings,
} from "./types";

function mapArr(arr: unknown) {
  return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
}

function parseChannel(row: Record<string, unknown>): MobileApiChannel {
  return {
    id: String(row.id ?? ""),
    channel_key: String(row.channel_key ?? ""),
    name: String(row.name ?? ""),
    channel_type: String(row.channel_type ?? "rest_api"),
    provider: String(row.provider ?? "custom"),
    endpoint_url: typeof row.endpoint_url === "string" ? row.endpoint_url : null,
    auth_method: String(row.auth_method ?? "api_key"),
    connection_mode: String(row.connection_mode ?? "test"),
    status: String(row.status ?? "draft"),
    rate_limit_per_hour: Number(row.rate_limit_per_hour ?? 5),
    daily_limit: Number(row.daily_limit ?? 50),
    quiet_hours_start: typeof row.quiet_hours_start === "string" ? row.quiet_hours_start : null,
    quiet_hours_end: typeof row.quiet_hours_end === "string" ? row.quiet_hours_end : null,
    last_test_at: typeof row.last_test_at === "string" ? row.last_test_at : null,
    last_test_status: typeof row.last_test_status === "string" ? row.last_test_status : null,
    domain_id: typeof row.domain_id === "string" ? row.domain_id : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    allowed_events: Array.isArray(row.allowed_events) ? row.allowed_events : [],
  };
}

function parseEventRule(row: Record<string, unknown>): MobileApiEventRule {
  return {
    id: String(row.id ?? ""),
    channel_id: String(row.channel_id ?? ""),
    event_key: String(row.event_key ?? ""),
    enabled: Boolean(row.enabled ?? true),
    requires_approval: Boolean(row.requires_approval ?? false),
    min_priority: String(row.min_priority ?? "normal"),
    deep_link_template: typeof row.deep_link_template === "string" ? row.deep_link_template : null,
  };
}

function parsePendingSend(row: Record<string, unknown>): MobileApiPendingSend {
  return {
    id: String(row.id ?? ""),
    channel_id: String(row.channel_id ?? ""),
    event_key: String(row.event_key ?? ""),
    title: String(row.title ?? ""),
    message: typeof row.message === "string" ? row.message : null,
    priority: String(row.priority ?? "normal"),
    status: String(row.status ?? "pending_approval"),
    created_at: typeof row.created_at === "string" ? row.created_at : null,
  };
}

function parseDeliveryLog(row: Record<string, unknown>): MobileApiDeliveryLog {
  return {
    id: String(row.id ?? ""),
    channel_id: typeof row.channel_id === "string" ? row.channel_id : null,
    event_key: typeof row.event_key === "string" ? row.event_key : null,
    delivery_status: String(row.delivery_status ?? "sent"),
    suppression_reason: typeof row.suppression_reason === "string" ? row.suppression_reason : null,
    retry_count: typeof row.retry_count === "number" ? row.retry_count : undefined,
    fallback_channel: typeof row.fallback_channel === "string" ? row.fallback_channel : null,
    summary: typeof row.summary === "string" ? row.summary : null,
    created_at: typeof row.created_at === "string" ? row.created_at : null,
  };
}

export function parseMobileApiIntegrationCenter(data: unknown): MobileApiIntegrationCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    philosophy: typeof row.philosophy === "string" ? row.philosophy : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    channels: mapArr(row.channels).map(parseChannel),
    event_rules: mapArr(row.event_rules).map(parseEventRule),
    pending_sends: mapArr(row.pending_sends).map(parsePendingSend),
    settings: row.settings as MobileApiSettings | undefined,
    delivery_history: mapArr(row.delivery_history).map(parseDeliveryLog),
    reports: row.reports as Record<string, unknown> | undefined,
    connection_types: Array.isArray(row.connection_types) ? (row.connection_types as string[]) : [],
    connection_modes: Array.isArray(row.connection_modes) ? (row.connection_modes as string[]) : [],
    providers: Array.isArray(row.providers) ? (row.providers as string[]) : [],
    priorities: Array.isArray(row.priorities) ? (row.priorities as string[]) : [],
    default_event_keys: Array.isArray(row.default_event_keys) ? (row.default_event_keys as string[]) : [],
    payload_fields: Array.isArray(row.payload_fields) ? (row.payload_fields as string[]) : [],
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    sections: Array.isArray(row.sections) ? (row.sections as string[]) : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
