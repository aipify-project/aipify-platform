import type {
  PackageUpgradeCheckout,
  PaymentProviderCard,
  PaymentProvidersCenter,
} from "./types";
import { PAYMENT_PROVIDER_KEYS } from "./constants";

export function parseProviderCard(raw: unknown): PaymentProviderCard | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const key = String(row.provider_key ?? "");
  if (!PAYMENT_PROVIDER_KEYS.includes(key as PaymentProviderCard["provider_key"])) return null;

  const progress = row.setup_progress as Record<string, unknown> | undefined;

  return {
    provider_key: key as PaymentProviderCard["provider_key"],
    name: String(row.name ?? key),
    status: (row.status as PaymentProviderCard["status"]) ?? "pending_setup",
    mode: (row.mode as PaymentProviderCard["mode"]) ?? "test",
    enabled: Boolean(row.enabled),
    regions: Array.isArray(row.regions) ? row.regions.map(String) : [],
    capabilities: Array.isArray(row.capabilities) ? row.capabilities.map(String) : [],
    last_health_check_at: row.last_health_check_at ? String(row.last_health_check_at) : null,
    setup_completed: Boolean(row.setup_completed),
    setup_progress: {
      required_fields: Number(progress?.required_fields ?? 0),
      configured_fields: Number(progress?.configured_fields ?? 0),
    },
    webhook_url: String(row.webhook_url ?? ""),
    webhook_status: (row.webhook_status as PaymentProviderCard["webhook_status"]) ?? "not_configured",
    last_webhook_at: row.last_webhook_at ? String(row.last_webhook_at) : null,
    public_config: (row.public_config as Record<string, unknown>) ?? {},
    credentials: Array.isArray(row.credentials)
      ? row.credentials.map((c) => {
          const field = c as Record<string, unknown>;
          return {
            key: String(field.key ?? ""),
            category: String(field.category ?? ""),
            masked_value: String(field.masked_value ?? ""),
            configured: Boolean(field.configured),
          };
        })
      : [],
  };
}

export function parsePaymentProvidersCenter(raw: unknown): PaymentProvidersCenter | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;

  return {
    scope: row.scope === "platform" ? "platform" : "tenant",
    tenant_id: row.tenant_id ? String(row.tenant_id) : null,
    can_edit: Boolean(row.can_edit),
    principle: String(row.principle ?? ""),
    paid_access_now: Boolean(row.paid_access_now),
    providers: Array.isArray(row.providers)
      ? row.providers.map(parseProviderCard).filter((p): p is PaymentProviderCard => p !== null)
      : [],
    recent_audit: Array.isArray(row.recent_audit)
      ? row.recent_audit.map((a) => {
          const entry = a as Record<string, unknown>;
          return {
            id: String(entry.id ?? ""),
            provider_key: String(entry.provider_key ?? ""),
            event_type: String(entry.event_type ?? ""),
            summary: String(entry.summary ?? ""),
            created_at: String(entry.created_at ?? ""),
          };
        })
      : [],
    regional_strategy:
      row.regional_strategy && typeof row.regional_strategy === "object"
        ? Object.fromEntries(
            Object.entries(row.regional_strategy as Record<string, unknown>).map(([k, v]) => [
              k,
              Array.isArray(v) ? v.map(String) : [],
            ])
          )
        : {},
  };
}

export function parsePackageUpgradeCheckout(raw: unknown): PackageUpgradeCheckout | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;

  return {
    current_plan: String(row.current_plan ?? ""),
    new_plan: String(row.new_plan ?? ""),
    current_price_monthly: Number(row.current_price_monthly ?? 0),
    new_price_monthly: Number(row.new_price_monthly ?? 0),
    price_difference_monthly: Number(row.price_difference_monthly ?? 0),
    currency: String(row.currency ?? "USD"),
    payment_provider: String(row.payment_provider ?? "stripe") as PackageUpgradeCheckout["payment_provider"],
    provider_name: String(row.provider_name ?? ""),
    provider_operational: Boolean(row.provider_operational),
    instant_access: Boolean(row.instant_access),
    instant_access_message: String(row.instant_access_message ?? ""),
    available_providers: Array.isArray(row.available_providers)
      ? row.available_providers.map(parseProviderCard).filter((p): p is PaymentProviderCard => p !== null)
      : [],
  };
}
