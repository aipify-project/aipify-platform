import type {
  PackageAccessCenter,
  PackageFeature,
  PackageFeatureAccess,
  PackageTier,
  PackageUpgradeResult,
  PackageUpgradeStart,
} from "./types";
import { PACKAGE_TIERS } from "./constants";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asTier(value: unknown, fallback: PackageTier = "starter"): PackageTier {
  const key = String(value ?? fallback);
  return PACKAGE_TIERS.includes(key as PackageTier) ? (key as PackageTier) : fallback;
}

function parseLockedFeature(raw: unknown): PackageFeature {
  const row = asRecord(raw);
  return {
    feature_key: String(row.feature_key ?? ""),
    feature_label: String(row.feature_label ?? ""),
    required_package: asTier(row.required_package, "business"),
    is_gold_nugget: Boolean(row.is_gold_nugget),
    upgrade_message_en: String(row.upgrade_message_en ?? ""),
    upgrade_message_no: String(row.upgrade_message_no ?? ""),
    action_capability: Boolean(row.action_capability),
  };
}

export function parsePackageAccessCenter(raw: unknown): PackageAccessCenter {
  const row = asRecord(raw);
  const current = asRecord(row.current_package);
  const sub = asRecord(row.subscription_access);
  const rec = row.recommendation ? asRecord(row.recommendation) : null;

  return {
    current_package: {
      package_key: asTier(current.package_key),
      resolved_from: String(current.resolved_from ?? ""),
    },
    subscription: {
      current_package: asTier(sub.current_package),
      subscription_status: String(sub.subscription_status ?? "active"),
      trial_ends_at: sub.trial_ends_at ? String(sub.trial_ends_at) : null,
      renewal_at: sub.renewal_at ? String(sub.renewal_at) : null,
      seat_count: Number(sub.seat_count ?? 1),
      instant_access_enabled: Boolean(sub.instant_access_enabled ?? true),
      last_upgrade_at: sub.last_upgrade_at ? String(sub.last_upgrade_at) : null,
    },
    packages: Array.isArray(row.packages_comparison)
      ? row.packages_comparison.map((pkg) => {
          const p = asRecord(pkg);
          return {
            package_key: asTier(p.package_key),
            package_name: String(p.package_name ?? ""),
            description: String(p.description ?? ""),
            package_type: String(p.package_type ?? ""),
            sort_order: Number(p.sort_order ?? 0),
            is_current: Boolean(p.is_current),
            is_upgrade: Boolean(p.is_upgrade),
          };
        })
      : [],
    locked_features: Array.isArray(row.locked_features)
      ? row.locked_features.map(parseLockedFeature)
      : [],
    recommendation: rec
      ? {
          best_fit: asTier(rec.best_fit, "professional"),
          reason: String(rec.reason ?? ""),
        }
      : null,
    recent_events: Array.isArray(row.recent_billing_events)
      ? row.recent_billing_events.map((event) => {
          const e = asRecord(event);
          return {
            id: String(e.id ?? ""),
            event_type: String(e.event_type ?? ""),
            summary: e.summary ? String(e.summary) : null,
            created_at: String(e.created_at ?? ""),
            feature_key: e.feature_key ? String(e.feature_key) : null,
            package_key: e.package_key ? String(e.package_key) : null,
          };
        })
      : [],
    blueprint: row.blueprint ? asRecord(row.blueprint) : null,
    can_manage: Boolean(row.can_manage),
    can_upgrade: Boolean(row.can_upgrade),
    can_view_billing: Boolean(row.can_view_billing),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}

export function parsePackageFeatureAccess(raw: unknown): PackageFeatureAccess {
  const row = asRecord(raw);
  return {
    allowed: Boolean(row.allowed),
    required_package: asTier(row.required_package, "business"),
    upgrade_message: String(row.upgrade_message ?? ""),
    access_status: String(row.access_status ?? "locked"),
    feature_key: row.feature_key ? String(row.feature_key) : undefined,
    feature_label: row.feature_label ? String(row.feature_label) : undefined,
    is_gold_nugget: row.is_gold_nugget != null ? Boolean(row.is_gold_nugget) : undefined,
  };
}

export function parsePackageUpgradeStart(raw: unknown): PackageUpgradeStart {
  const row = asRecord(raw);
  return {
    upgrade_event_id: String(row.upgrade_event_id ?? ""),
    from_package: asTier(row.from_package),
    to_package: asTier(row.to_package, "business"),
    status: String(row.status ?? "started"),
    instant_activation: Boolean(row.instant_activation ?? true),
    message: String(row.message ?? ""),
  };
}

export function parsePackageUpgradeResult(raw: unknown): PackageUpgradeResult {
  const row = asRecord(raw);
  return {
    success: Boolean(row.success),
    message: String(row.message ?? row.confirmation ?? ""),
    confirmation: String(row.confirmation ?? row.message ?? ""),
    from_package: row.from_package ? asTier(row.from_package) : null,
    to_package: row.to_package ? asTier(row.to_package) : null,
    instant_activation: Boolean(row.instant_activation ?? true),
    upgrade_event_id: row.upgrade_event_id ? String(row.upgrade_event_id) : null,
  };
}

export function tierMeetsRequirement(current: string, required: string): boolean {
  const order = PACKAGE_TIERS as readonly string[];
  return order.indexOf(current) >= order.indexOf(required);
}
