import type {
  PaymentOperationsAlert,
  PaymentOperationsAuditEntry,
  PaymentOperationsCenter,
  PaymentOperationsProvider,
  PaymentOperationsSettlements,
  PaymentOperationsSummary,
  RegionalCoverageRegion,
  SettlementRecord,
} from "./types";
import type { AlertSeverity, PaymentOpsProviderKey, RegionalCoverageKey } from "./constants";
import { PAYMENT_OPS_PROVIDERS, REGIONAL_COVERAGE_KEYS } from "./constants";

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

function parseSettlement(raw: unknown): SettlementRecord | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    provider_key: asString(row.provider_key),
    amount: asNumber(row.amount),
    currency: asString(row.currency, "NOK"),
    status: asString(row.status),
    estimated_payout_date: row.estimated_payout_date ? asString(row.estimated_payout_date) : null,
    reference: row.reference ? asString(row.reference) : undefined,
    settlement_date: row.settlement_date ? asString(row.settlement_date) : undefined,
  };
}

function parseProvider(raw: unknown): PaymentOperationsProvider | null {
  const row = asRecord(raw);
  if (!row) return null;
  const key = asString(row.provider_key);
  if (!PAYMENT_OPS_PROVIDERS.includes(key as PaymentOpsProviderKey)) return null;

  return {
    provider_key: key as PaymentOpsProviderKey,
    name: asString(row.name, key),
    status: asString(row.status, "pending_setup"),
    mode: asString(row.mode, "test"),
    enabled: Boolean(row.enabled),
    regions: Array.isArray(row.regions) ? row.regions.map(String) : [],
    capabilities: Array.isArray(row.capabilities) ? row.capabilities.map(String) : [],
    webhook_status: asString(row.webhook_status, "not_configured"),
    environment: asString(row.environment, "sandbox"),
    api_status: asString(row.api_status, "disconnected"),
    last_synchronization: row.last_synchronization ? asString(row.last_synchronization) : null,
    api_key_status: asString(row.api_key_status, "not_configured"),
    settlement_status: asString(row.settlement_status, "pending"),
    operational_capabilities: Array.isArray(row.operational_capabilities)
      ? row.operational_capabilities.map(String)
      : [],
    supported_currencies: Array.isArray(row.supported_currencies)
      ? row.supported_currencies.map(String)
      : [],
    supported_countries: Array.isArray(row.supported_countries)
      ? row.supported_countries.map(String)
      : [],
  };
}

function parseSummary(raw: unknown): PaymentOperationsSummary {
  const row = asRecord(raw) ?? {};
  return {
    active_payment_providers: asNumber(row.active_payment_providers),
    countries_supported: asNumber(row.countries_supported),
    pending_provider_setups: asNumber(row.pending_provider_setups),
    enterprise_invoice_customers: asNumber(row.enterprise_invoice_customers),
    monthly_transaction_volume: asNumber(row.monthly_transaction_volume),
    monthly_transaction_currency: asString(row.monthly_transaction_currency, "NOK"),
    failed_payment_events: asNumber(row.failed_payment_events),
  };
}

function parseSettlements(raw: unknown): PaymentOperationsSettlements {
  const row = asRecord(raw) ?? {};
  const mapList = (value: unknown) =>
    Array.isArray(value)
      ? value.map(parseSettlement).filter(Boolean) as SettlementRecord[]
      : [];

  return {
    today: mapList(row.today),
    pending: mapList(row.pending),
    failed: mapList(row.failed),
  };
}

function parseRegional(raw: unknown): Record<RegionalCoverageKey, RegionalCoverageRegion> {
  const row = asRecord(raw) ?? {};
  return Object.fromEntries(
    REGIONAL_COVERAGE_KEYS.map((key) => {
      const region = asRecord(row[key]) ?? {};
      return [
        key,
        {
          providers: Array.isArray(region.providers) ? region.providers.map(String) : [],
          ready: Boolean(region.ready),
        },
      ];
    })
  ) as Record<RegionalCoverageKey, RegionalCoverageRegion>;
}

function parseAlert(raw: unknown): PaymentOperationsAlert | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    provider_key: row.provider_key ? asString(row.provider_key) : null,
    severity: asString(row.severity, "info") as AlertSeverity,
    alert_type: asString(row.alert_type),
    title: asString(row.title),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseAudit(raw: unknown): PaymentOperationsAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    provider_key: row.provider_key ? asString(row.provider_key) : null,
    action: asString(row.action),
    summary: asString(row.summary),
    before_value: asRecord(row.before_value) ?? {},
    after_value: asRecord(row.after_value) ?? {},
    created_at: asString(row.created_at),
  };
}

export function parsePaymentOperationsCenter(raw: unknown): PaymentOperationsCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  return {
    principle: asString(row.principle),
    founding_principle: asString(row.founding_principle),
    summary: parseSummary(row.summary),
    providers: Array.isArray(row.providers)
      ? row.providers.map(parseProvider).filter(Boolean) as PaymentOperationsProvider[]
      : [],
    settlements: parseSettlements(row.settlements),
    regional_coverage: parseRegional(row.regional_coverage),
    alerts: Array.isArray(row.alerts)
      ? row.alerts.map(parseAlert).filter(Boolean) as PaymentOperationsAlert[]
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter(Boolean) as PaymentOperationsAuditEntry[]
      : [],
  };
}
