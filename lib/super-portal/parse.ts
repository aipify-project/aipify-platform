import {
  GLOBAL_PLATFORM_STATUSES,
  PLATFORM_ADMIN_ROLES,
  PLATFORM_ADMIN_STATUSES,
  TREND_DIRECTIONS,
} from "./constants";
import type {
  SuperExecutiveInsights,
  SuperGlobalAuditEntry,
  SuperLanguageSetting,
  SuperPlatformAdministrator,
  SuperPortalDashboard,
} from "./types";

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

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const key = asString(value, fallback);
  return (allowed.includes(key as T) ? key : fallback) as T;
}

export function parseSuperPortalDashboard(raw: unknown): SuperPortalDashboard | null {
  const row = asRecord(raw);
  if (!row) return null;

  const growthTrends = Array.isArray(row.growth_trends)
    ? row.growth_trends.map((item) => {
        const t = asRecord(item) ?? {};
        return {
          key: asString(t.key),
          label: asString(t.label),
          value_pct: asNumber(t.value_pct),
        };
      })
    : [];

  const executiveAlerts = Array.isArray(row.executive_alerts)
    ? row.executive_alerts.map((item) => {
        const a = asRecord(item) ?? {};
        return {
          id: asString(a.id),
          title: asString(a.title),
          severity: asString(a.severity),
          category: asString(a.category),
          created_at: asString(a.created_at),
        };
      })
    : [];

  return {
    principle: asString(row.principle),
    total_organizations: asNumber(row.total_organizations),
    total_active_users: asNumber(row.total_active_users),
    total_active_subscriptions: asNumber(row.total_active_subscriptions),
    platform_administrator_count: asNumber(row.platform_administrator_count),
    global_platform_status: parseEnum(
      row.global_platform_status,
      GLOBAL_PLATFORM_STATUSES,
      "operational"
    ),
    open_critical_incidents: asNumber(row.open_critical_incidents),
    growth_trends: growthTrends,
    executive_alerts: executiveAlerts,
    platform_uptime_pct: asNumber(row.platform_uptime_pct, 99.9),
    privacy_note: asString(row.privacy_note),
  };
}

export function parseSuperPlatformAdministrators(raw: unknown): SuperPlatformAdministrator[] {
  const row = asRecord(raw);
  if (!row || !Array.isArray(row.administrators)) return [];

  return row.administrators
    .map((item) => {
      const a = asRecord(item);
      if (!a || !a.id) return null;
      const activity = asRecord(a.activity_summary) ?? {};
      return {
        id: asString(a.id),
        auth_user_id: asString(a.auth_user_id),
        email: asString(a.email),
        display_name: asString(a.display_name),
        role: parseEnum(a.role, PLATFORM_ADMIN_ROLES, "platform_support"),
        status: parseEnum(a.status, PLATFORM_ADMIN_STATUSES, "active"),
        last_login_at: a.last_login_at ? asString(a.last_login_at) : null,
        suspended_at: a.suspended_at ? asString(a.suspended_at) : null,
        created_at: asString(a.created_at),
        activity_summary: {
          last_login_at: activity.last_login_at ? asString(activity.last_login_at) : null,
          audit_events_30d: asNumber(activity.audit_events_30d),
        },
      };
    })
    .filter((a): a is SuperPlatformAdministrator => a !== null);
}

export function parseSuperLanguageAdministration(raw: unknown): SuperLanguageSetting[] {
  const row = asRecord(raw);
  if (!row || !Array.isArray(row.languages)) return [];

  return row.languages
    .map((item) => {
      const l = asRecord(item);
      if (!l || !l.locale) return null;
      return {
        locale: asString(l.locale),
        enabled: l.enabled === true,
        completeness_pct: asNumber(l.completeness_pct, 100),
        missing_keys_count: asNumber(l.missing_keys_count),
        updated_at: asString(l.updated_at),
      };
    })
    .filter((l): l is SuperLanguageSetting => l !== null);
}

export function parseSuperGlobalAuditCenter(raw: unknown): SuperGlobalAuditEntry[] {
  const row = asRecord(raw);
  if (!row || !Array.isArray(row.audit_logs)) return [];

  return row.audit_logs
    .map((item) => {
      const l = asRecord(item);
      if (!l || !l.id) return null;
      return {
        id: asString(l.id),
        user_email: asString(l.user_email),
        action: asString(l.action),
        target_type: l.target_type ? asString(l.target_type) : null,
        target_id: l.target_id ? asString(l.target_id) : null,
        previous_state: asRecord(l.previous_state) ?? {},
        new_state: asRecord(l.new_state) ?? {},
        created_at: asString(l.created_at),
      };
    })
    .filter((l): l is SuperGlobalAuditEntry => l !== null);
}

export function parseSuperExecutiveInsights(raw: unknown): SuperExecutiveInsights | null {
  const row = asRecord(raw);
  if (!row) return null;

  const org = asRecord(row.organization_growth) ?? {};
  const subs = asRecord(row.subscription_growth) ?? {};
  const revenue = asRecord(row.revenue_indicators) ?? {};
  const adoption = asRecord(row.platform_adoption) ?? {};
  const activity = asRecord(row.global_activity) ?? {};

  return {
    organization_growth: {
      new_organizations_30d: asNumber(org.new_organizations_30d),
      trend: parseEnum(org.trend, TREND_DIRECTIONS, "stable"),
    },
    subscription_growth: {
      new_subscriptions_30d: asNumber(subs.new_subscriptions_30d),
      active_subscriptions: asNumber(subs.active_subscriptions),
      trend: parseEnum(subs.trend, TREND_DIRECTIONS, "stable"),
    },
    revenue_indicators: {
      mrr: asNumber(revenue.mrr),
      trend: parseEnum(revenue.trend, TREND_DIRECTIONS, "stable"),
    },
    platform_adoption: {
      active_installations: asNumber(adoption.active_installations),
      trend: parseEnum(adoption.trend, TREND_DIRECTIONS, "stable"),
    },
    global_activity: {
      actions_today: asNumber(activity.actions_today),
      platform_admin_logins_7d: asNumber(activity.platform_admin_logins_7d),
    },
  };
}
