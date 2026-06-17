import type { BriefingItem, DailyBriefingDashboard, FocusArea, SinceLastLogin, BriefingTimelineEvent } from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

function parseItems(raw: unknown): BriefingItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      section: str(d.section),
      title: str(d.title),
      description: str(d.description),
      priority: str(d.priority),
      status_indicator: str(d.status_indicator),
      recommended_action: str(d.recommended_action),
      owner_label: str(d.owner_label) || undefined,
      due_date: str(d.due_date) || null,
      category: str(d.category) || undefined,
      department: str(d.department) || undefined,
      source_key: str(d.source_key) || undefined,
    };
  });
}

export function parseDailyBriefingDashboard(data: unknown): DailyBriefingDashboard {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const sll = d.since_last_login as Record<string, unknown> | undefined;
  const since_last_login: SinceLastLogin | undefined = sll ? {
    completed_tasks: num(sll.completed_tasks),
    new_notifications: num(sll.new_notifications),
    new_support_requests: num(sll.new_support_requests),
    new_approvals: num(sll.new_approvals),
    important_activity: str(sll.important_activity) || undefined,
  } : undefined;
  const timeline = Array.isArray(d.timeline)
    ? d.timeline.map((i) => {
        const e = i as Record<string, unknown>;
        return {
          id: str(e.id),
          event_type: str(e.event_type),
          description: str(e.description),
          created_at: str(e.created_at),
        } satisfies BriefingTimelineEvent;
      })
    : [];
  const focus_areas = Array.isArray(d.focus_areas)
    ? d.focus_areas.map((f) => {
        const x = f as Record<string, unknown>;
        return {
          focus_key: str(x.focus_key),
          focus_label: str(x.focus_label),
          focus_score: num(x.focus_score),
        } satisfies FocusArea;
      })
    : [];
  return {
    found: bool(d.found),
    has_briefing: bool(d.has_briefing),
    role: str(d.role) || undefined,
    can_team: bool(d.can_team),
    can_organization: bool(d.can_organization),
    can_executive: bool(d.can_executive),
    readiness_score: num(d.readiness_score),
    briefing_mode: str(d.briefing_mode) || undefined,
    todays_focus: str(d.todays_focus) || undefined,
    greeting: str(d.greeting) || undefined,
    executive_summary: str(d.executive_summary) || undefined,
    since_last_login,
    briefing_date: str(d.briefing_date) || undefined,
    generated_at: str(d.generated_at) || undefined,
    items: parseItems(d.items),
    focus_areas,
    new_insights_count: num(d.new_insights_count),
    new_recommendations_count: num(d.new_recommendations_count),
    timeline,
    usage_example: str(d.usage_example),
    privacy_note: str(d.privacy_note),
    principle: str(d.principle),
  };
}

export function parseDailyBriefingHistory(data: unknown): {
  found: boolean;
  history: { id: string; briefing_date: string; readiness_score: number; status: string; executive_summary: string }[];
} {
  if (!data || typeof data !== "object") return { found: false, history: [] };
  const d = data as Record<string, unknown>;
  const history = Array.isArray(d.history)
    ? d.history.map((h) => {
        const x = h as Record<string, unknown>;
        return {
          id: str(x.id),
          briefing_date: str(x.briefing_date),
          readiness_score: num(x.readiness_score),
          status: str(x.status),
          executive_summary: str(x.executive_summary),
        };
      })
    : [];
  return { found: bool(d.found), history };
}

export function parseDailyBriefingFocus(data: unknown): {
  found: boolean;
  todays_focus?: string;
  focus_areas: FocusArea[];
} {
  if (!data || typeof data !== "object") return { found: false, focus_areas: [] };
  const d = data as Record<string, unknown>;
  const focus_areas = Array.isArray(d.focus_areas)
    ? d.focus_areas.map((f) => {
        const x = f as Record<string, unknown>;
        return { focus_key: str(x.focus_key), focus_label: str(x.focus_label), focus_score: num(x.focus_score) };
      })
    : [];
  return { found: bool(d.found), todays_focus: str(d.todays_focus) || undefined, focus_areas };
}

export function parseDailyBriefingAction(data: unknown): { ok: boolean; briefing_id?: string; generated?: boolean; error?: string } {
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;
  return {
    ok: bool(d.ok),
    briefing_id: str(d.briefing_id) || undefined,
    generated: bool(d.generated),
    error: str(d.error) || undefined,
  };
}
