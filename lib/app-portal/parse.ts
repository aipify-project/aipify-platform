import type { AppPortalDashboard, AppPortalFeatureAccess } from "./types";

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

export function parseAppPortalFeatureAccess(raw: unknown): AppPortalFeatureAccess {
  const row = asRecord(raw) ?? {};
  return {
    feature: asString(row.feature),
    enabled: row.enabled === true,
    plan_key: asString(row.plan_key, "starter"),
    upgrade_required: row.upgrade_required === true,
    upgrade_href: asString(row.upgrade_href, "/app/billing/upgrade"),
  };
}

export function parseAppPortalDashboard(raw: unknown): AppPortalDashboard | null {
  const row = asRecord(raw);
  if (!row) return null;

  const org = asRecord(row.organization_overview) ?? {};
  const team = asRecord(row.team_activity_summary) ?? {};
  const sub = asRecord(row.subscription_status) ?? {};
  const sll = asRecord(row.since_last_login_summary) ?? {};

  const businessPacks = Array.isArray(row.business_pack_status)
    ? row.business_pack_status.map((item) => {
        const b = asRecord(item) ?? {};
        return { module_key: asString(b.module_key), status: asString(b.status) };
      })
    : [];

  const recommendations = Array.isArray(row.recommended_actions)
    ? row.recommended_actions.map((item) => {
        const r = asRecord(item) ?? {};
        return { id: asString(r.id), title: asString(r.title), href: asString(r.href) };
      })
    : [];

  const nextSteps = Array.isArray(sll.recommended_next_steps)
    ? sll.recommended_next_steps.map((item) => {
        const r = asRecord(item) ?? {};
        return { id: asString(r.id), title: asString(r.title), href: asString(r.href) };
      })
    : [];

  const highlights = Array.isArray(sll.business_pack_highlights)
    ? sll.business_pack_highlights.map((item) => {
        const b = asRecord(item) ?? {};
        return { module_key: asString(b.module_key), status: asString(b.status) };
      })
    : [];

  return {
    principle: asString(row.principle),
    organization_overview: {
      name: asString(org.name),
      team_active: asNumber(org.team_active),
      organization_role: asString(org.organization_role),
    },
    team_activity_summary: {
      active_members: asNumber(team.active_members),
      actions_today: asNumber(team.actions_today),
    },
    subscription_status: {
      status: asString(sub.status, "active"),
      plan_key: asString(sub.plan_key, "starter"),
    },
    business_pack_status: businessPacks,
    tasks_requiring_attention: asNumber(row.tasks_requiring_attention),
    recommended_actions: recommendations,
    notifications_count: asNumber(row.notifications_count),
    since_last_login_summary: {
      important_updates: asNumber(sll.important_updates),
      completed_actions: asNumber(sll.completed_actions),
      new_notifications: asNumber(sll.new_notifications),
      recommended_next_steps: nextSteps,
      business_pack_highlights: highlights,
    },
    privacy_note: asString(row.privacy_note),
  };
}
