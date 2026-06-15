import type {
  HealthAlert,
  HealthAuditEntry,
  PaymentProviderHealthCenter,
  ProviderHealthCard,
} from "./types";
import type { AlertSeverity, HealthProviderKey, HealthStatus } from "./constants";
import { HEALTH_PROVIDERS } from "./constants";

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

function parseProvider(raw: unknown): ProviderHealthCard | null {
  const row = asRecord(raw);
  if (!row) return null;
  const key = asString(row.provider_key);
  if (!HEALTH_PROVIDERS.includes(key as HealthProviderKey)) return null;

  return {
    provider_key: key as HealthProviderKey,
    name: asString(row.name, key),
    health_status: asString(row.health_status, "offline") as HealthStatus,
    environment: asString(row.environment, "sandbox"),
    api_connection_status: asString(row.api_connection_status, "disconnected"),
    webhook_status: asString(row.webhook_status, "not_configured"),
    last_successful_transaction_at: row.last_successful_transaction_at
      ? asString(row.last_successful_transaction_at)
      : null,
    last_synchronization_at: row.last_synchronization_at
      ? asString(row.last_synchronization_at)
      : null,
    failed_events_24h: asNumber(row.failed_events_24h),
    success_rate_30d: asNumber(row.success_rate_30d, 100),
    check_interval_minutes: asNumber(row.check_interval_minutes, 5),
    last_health_check_at: row.last_health_check_at ? asString(row.last_health_check_at) : null,
    next_health_check_at: row.next_health_check_at ? asString(row.next_health_check_at) : null,
    regions: Array.isArray(row.regions) ? row.regions.map(String) : [],
    capabilities: Array.isArray(row.capabilities) ? row.capabilities.map(String) : [],
  };
}

function parseAlert(raw: unknown): HealthAlert | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    provider_key: asString(row.provider_key),
    severity: asString(row.severity, "info") as AlertSeverity,
    alert_type: asString(row.alert_type),
    title: asString(row.title),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseAudit(raw: unknown): HealthAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    provider_key: asString(row.provider_key),
    event_type: asString(row.event_type),
    severity: asString(row.severity, "info") as AlertSeverity,
    summary: asString(row.summary),
    resolution_status: asString(row.resolution_status, "open"),
    created_at: asString(row.created_at),
  };
}

export function parsePaymentProviderHealthCenter(raw: unknown): PaymentProviderHealthCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  const intervals = asRecord(row.auto_check_intervals) ?? {};

  return {
    principle: asString(row.principle),
    all_operational: Boolean(row.all_operational),
    auto_check_intervals: {
      stripe_minutes: asNumber(intervals.stripe_minutes, 5),
      vipps_minutes: asNumber(intervals.vipps_minutes, 5),
      klarna_minutes: asNumber(intervals.klarna_minutes, 5),
      dnb_minutes: asNumber(intervals.dnb_minutes, 30),
    },
    providers: Array.isArray(row.providers)
      ? row.providers.map(parseProvider).filter(Boolean) as ProviderHealthCard[]
      : [],
    alerts: Array.isArray(row.alerts)
      ? row.alerts.map(parseAlert).filter(Boolean) as HealthAlert[]
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter(Boolean) as HealthAuditEntry[]
      : [],
  };
}
