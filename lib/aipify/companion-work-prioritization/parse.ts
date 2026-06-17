import type {
  FocusModeView,
  PriorityDependency,
  PriorityTimelineEvent,
  WorkloadSnapshot,
  WorkPriorityItem,
  WorkPrioritizationDashboard,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

function parseItems(raw: unknown): WorkPriorityItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      description: str(d.description),
      priority_level: str(d.priority_level),
      priority_score: num(d.priority_score),
      reason: str(d.reason),
      recommended_action: str(d.recommended_action),
      source_type: str(d.source_type),
      owner_label: str(d.owner_label) || undefined,
      due_date: str(d.due_date) || null,
      status: str(d.status),
      department: str(d.department) || undefined,
      project: str(d.project) || undefined,
      factors: typeof d.factors === "object" && d.factors ? (d.factors as Record<string, unknown>) : undefined,
      rank_order: num(d.rank_order),
    };
  });
}

function parseWorkload(raw: unknown): WorkloadSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  return {
    current_workload: num(d.current_workload),
    upcoming_workload: num(d.upcoming_workload),
    overload_risk: str(d.overload_risk),
    capacity_indicator: str(d.capacity_indicator),
    delegation_suggestion: str(d.delegation_suggestion),
  };
}

export function parseWorkPrioritizationDashboard(data: unknown): WorkPrioritizationDashboard {
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
        } satisfies PriorityTimelineEvent;
      })
    : [];
  return {
    found: bool(d.found),
    has_priorities: bool(d.has_priorities),
    role: str(d.role) || undefined,
    can_team: bool(d.can_team),
    can_organization: bool(d.can_organization),
    can_executive: bool(d.can_executive),
    work_priority_score: num(d.work_priority_score),
    critical_count: num(d.critical_count),
    focus_limit: num(d.focus_limit, 5),
    todays_focus: str(d.todays_focus) || undefined,
    items: parseItems(d.items),
    workload: parseWorkload(d.workload),
    timeline,
    usage_example: str(d.usage_example),
    privacy_note: str(d.privacy_note),
    principle: str(d.principle),
  };
}

export function parseWorkPrioritizationFocus(data: unknown): {
  found: boolean;
  focus_items: WorkPriorityItem[];
  focus_mode?: FocusModeView;
} {
  if (!data || typeof data !== "object") return { found: false, focus_items: [] };
  const d = data as Record<string, unknown>;
  const fm = d.focus_mode as Record<string, unknown> | undefined;
  return {
    found: bool(d.found),
    focus_items: parseItems(d.focus_items),
    focus_mode: fm
      ? {
          top_priority: str(fm.top_priority) || undefined,
          next_priority: str(fm.next_priority) || undefined,
          suggested_sequence: Array.isArray(fm.suggested_sequence) ? fm.suggested_sequence : undefined,
          focus_limit: num(fm.focus_limit, 5),
        }
      : undefined,
  };
}

export function parseWorkPrioritizationWorkload(data: unknown): {
  found: boolean;
  workload?: WorkloadSnapshot;
  usage_example?: string;
} {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };
  return {
    found: true,
    workload: {
      current_workload: num(d.current_workload),
      upcoming_workload: num(d.upcoming_workload),
      overload_risk: str(d.overload_risk),
      capacity_indicator: str(d.capacity_indicator),
      delegation_suggestion: str(d.delegation_suggestion),
    },
    usage_example: str(d.usage_example) || undefined,
  };
}

export function parseWorkPrioritizationDependencies(data: unknown): {
  found: boolean;
  dependencies: PriorityDependency[];
} {
  if (!data || typeof data !== "object") return { found: false, dependencies: [] };
  const d = data as Record<string, unknown>;
  const dependencies = Array.isArray(d.dependencies)
    ? d.dependencies.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id),
          dependency_type: str(x.dependency_type),
          title: str(x.title),
          description: str(x.description),
          priority_id: str(x.priority_id) || undefined,
          related_key: str(x.related_key) || undefined,
        };
      })
    : [];
  return { found: bool(d.found), dependencies };
}

export function parseWorkPrioritizationAction(data: unknown): { ok: boolean; recalculated?: boolean; error?: string } {
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;
  return {
    ok: bool(d.ok),
    recalculated: bool(d.recalculated),
    error: str(d.error) || undefined,
  };
}
