import type {
  ActionHubCard,
  ActionHubDashboard,
  ActionHubSettings,
  ActionItem,
  ActionItemDetail,
} from "./types";

function parseActionItem(row: unknown): ActionItem {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    action_key: String(s.action_key ?? ""),
    title: String(s.title ?? ""),
    description: String(s.description ?? ""),
    source_module: String(s.source_module ?? ""),
    action_type: String(s.action_type ?? "general"),
    severity: String(s.severity ?? "medium"),
    priority: String(s.priority ?? "medium"),
    priority_score: Number(s.priority_score ?? 0),
    recommended_owner: s.recommended_owner as string | null | undefined,
    recommended_due_date: s.recommended_due_date as string | null | undefined,
    assigned_user_id: s.assigned_user_id as string | null | undefined,
    status: String(s.status ?? "open"),
    action_url: s.action_url as string | null | undefined,
    requires_approval: Boolean(s.requires_approval),
    rationale: String(s.rationale ?? ""),
    created_at: String(s.created_at ?? ""),
    updated_at: String(s.updated_at ?? ""),
  };
}

export function parseActionHubCard(data: unknown): ActionHubCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    my_open_count: d.my_open_count as number | undefined,
    critical_count: d.critical_count as number | undefined,
    waiting_approval_count: d.waiting_approval_count as number | undefined,
    blocked_count: d.blocked_count as number | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseActionHubDashboard(data: unknown): ActionHubDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = (key: string) =>
    Array.isArray(d[key]) ? (d[key] as unknown[]).map(parseActionItem) : [];
  return {
    has_customer: Boolean(d.has_customer),
    my_actions: list("my_actions"),
    team_actions: list("team_actions"),
    recommended_actions: list("recommended_actions"),
    critical_actions: list("critical_actions"),
    recently_completed: list("recently_completed"),
    blocked_items: list("blocked_items"),
  };
}

export function parseActionItems(data: unknown): ActionItem[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.items)) return [];
  return (d.items as unknown[]).map(parseActionItem);
}

export function parseActionItemDetail(data: unknown): ActionItemDetail {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.found) return { found: false };
  return {
    found: true,
    item: d.item ? parseActionItem(d.item) : undefined,
    assignments: Array.isArray(d.assignments) ? (d.assignments as ActionItemDetail["assignments"]) : [],
    decisions: Array.isArray(d.decisions) ? (d.decisions as ActionItemDetail["decisions"]) : [],
  };
}

export function parseActionHubSettings(data: unknown): ActionHubSettings {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    enabled: Boolean(d.enabled ?? true),
    auto_collect: Boolean(d.auto_collect ?? true),
    auto_assign: Boolean(d.auto_assign ?? false),
    require_approval_high_risk: Boolean(d.require_approval_high_risk ?? true),
    include_support: Boolean(d.include_support ?? true),
    include_quality: Boolean(d.include_quality ?? true),
    include_governance: Boolean(d.include_governance ?? true),
    include_memory: Boolean(d.include_memory ?? true),
    include_knowledge: Boolean(d.include_knowledge ?? true),
    include_briefing: Boolean(d.include_briefing ?? true),
    include_desktop: Boolean(d.include_desktop ?? true),
    default_owner_role: String(d.default_owner_role ?? "admin"),
    retention_days: Number(d.retention_days ?? 365),
  };
}
