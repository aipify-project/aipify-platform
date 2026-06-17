import type { FollowUpDashboard, FollowUpItem, FollowUpTimelineEvent } from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

function parseItems(raw: unknown): FollowUpItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      description: str(d.description),
      explanation: str(d.explanation),
      category: str(d.category),
      source_type: str(d.source_type),
      priority: str(d.priority),
      status: str(d.status),
      assigned_to: str(d.assigned_to) || undefined,
      owner_label: str(d.owner_label) || undefined,
      due_date: str(d.due_date) || null,
      recommended_action: str(d.recommended_action) || undefined,
      waiting_direction: str(d.waiting_direction) || null,
      waiting_subtype: str(d.waiting_subtype) || undefined,
      department: str(d.department) || undefined,
      detection_type: str(d.detection_type) || undefined,
      created_at: str(d.created_at) || undefined,
      updated_at: str(d.updated_at) || undefined,
      completed_at: str(d.completed_at) || null,
    };
  });
}

export function parseFollowUpDashboard(data: unknown): FollowUpDashboard {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const timeline = Array.isArray(d.timeline)
    ? d.timeline.map((i) => {
        const e = i as Record<string, unknown>;
        return {
          id: str(e.id),
          event_type: str(e.event_type),
          description: str(e.description),
          created_at: str(e.created_at),
        } satisfies FollowUpTimelineEvent;
      })
    : [];
  return {
    found: bool(d.found),
    has_follow_ups: bool(d.has_follow_ups),
    role: str(d.role) || undefined,
    can_team: bool(d.can_team),
    can_organization: bool(d.can_organization),
    can_executive: bool(d.can_executive),
    follow_up_health_score: num(d.follow_up_health_score),
    open_count: num(d.open_count),
    overdue_count: num(d.overdue_count),
    upcoming_count: num(d.upcoming_count),
    completed_count: num(d.completed_count),
    success_rate: num(d.success_rate),
    items: parseItems(d.items),
    timeline,
    usage_example: str(d.usage_example),
    privacy_note: str(d.privacy_note),
    principle: str(d.principle),
  };
}

export function parseFollowUpList(data: unknown): { found: boolean; items: FollowUpItem[] } {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return { found: bool(d.found), items: parseItems(d.items) };
}

export function parseFollowUpWaiting(data: unknown): {
  found: boolean;
  waiting_on_others: FollowUpItem[];
  waiting_for_me: FollowUpItem[];
} {
  if (!data || typeof data !== "object") return { found: false, waiting_on_others: [], waiting_for_me: [] };
  const d = data as Record<string, unknown>;
  if (d.direction === "waiting_on_others") {
    return { found: true, waiting_on_others: parseItems(d.items), waiting_for_me: [] };
  }
  if (d.direction === "waiting_for_me") {
    return { found: true, waiting_on_others: [], waiting_for_me: parseItems(d.items) };
  }
  return {
    found: bool(d.found),
    waiting_on_others: parseItems(d.waiting_on_others),
    waiting_for_me: parseItems(d.waiting_for_me),
  };
}

export function parseFollowUpAction(data: unknown): { ok: boolean; follow_up_id?: string; error?: string } {
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;
  return {
    ok: bool(d.ok),
    follow_up_id: str(d.follow_up_id) || undefined,
    error: str(d.error) || undefined,
  };
}
