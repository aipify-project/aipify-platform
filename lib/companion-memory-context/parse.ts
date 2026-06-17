import type {
  CompanionContextBundle,
  CompanionMemoryCenter,
  CompanionMemoryItem,
  CompanionProjectMap,
} from "./types";

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : Number(value ?? fallback) || fallback;
}

function parseMemoryItem(row: Record<string, unknown>): CompanionMemoryItem {
  return {
    id: str(row.id),
    memory_key: str(row.memory_key),
    memory_category: str(row.memory_category),
    title: str(row.title),
    summary: str(row.summary),
    what_stored: str(row.what_stored),
    why_helps: str(row.why_helps),
    how_learned: str(row.how_learned),
    source_label: str(row.source_label),
    confidence_level: str(row.confidence_level, "medium"),
    memory_status: str(row.memory_status, "active"),
    last_used_at: str(row.last_used_at),
    learned_at: str(row.learned_at),
  };
}

export function parseCompanionMemoryCenter(data: unknown): CompanionMemoryCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (!row.has_access) return null;
  const settings = (row.settings ?? {}) as Record<string, unknown>;
  const health = (row.memory_health ?? {}) as Record<string, unknown>;

  return {
    has_access: true,
    positioning: str(row.positioning),
    memory_enabled: Boolean(row.memory_enabled),
    always_ask_before_remembering: Boolean(row.always_ask_before_remembering ?? true),
    never_remember: Boolean(row.never_remember),
    settings: {
      profile_memory_enabled: Boolean(settings.profile_memory_enabled ?? true),
      workflow_memory_enabled: Boolean(settings.workflow_memory_enabled ?? true),
      project_memory_enabled: Boolean(settings.project_memory_enabled ?? true),
      companion_memory_enabled: Boolean(settings.companion_memory_enabled ?? true),
      context_engine_enabled: Boolean(settings.context_engine_enabled ?? true),
    },
    memory_health: {
      useful_count: num(health.useful_count),
      unused_count: num(health.unused_count),
      old_count: num(health.old_count),
      total_active: num(health.total_active),
    },
    recommended_cleanup: Array.isArray(row.recommended_cleanup)
      ? (row.recommended_cleanup as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          title: str(item.title),
          reason: str(item.reason),
        }))
      : [],
    memories: Array.isArray(row.memories)
      ? (row.memories as Record<string, unknown>[]).map(parseMemoryItem)
      : [],
    audit_logs: Array.isArray(row.audit_logs)
      ? (row.audit_logs as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          event_type: str(item.event_type),
          summary: str(item.summary),
          created_at: str(item.created_at),
        }))
      : [],
    cross_link_phase322: str(row.cross_link_phase322, "/app/companion/memory"),
  };
}

export function parseCompanionContextBundle(data: unknown): CompanionContextBundle | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (!row.has_access) return null;

  const briefing = row.briefing as Record<string, unknown> | undefined;
  const health = row.workspace_health as Record<string, unknown> | undefined;

  return {
    has_access: true,
    context_enabled: Boolean(row.context_enabled),
    empty_state: Boolean(row.empty_state),
    message: str(row.message),
    current_project: str(row.current_project),
    current_objective: str(row.current_objective),
    recent_work_summary: str(row.recent_work_summary),
    likely_next_task: str(row.likely_next_task),
    confidence_level: str(row.confidence_level, "medium"),
    active_projects_count: num(row.active_projects_count),
    pending_tasks_count: num(row.pending_tasks_count),
    attention_projects_count: num(row.attention_projects_count),
    recommended_focus: str(row.recommended_focus),
    briefing: briefing
      ? {
          greeting: str(briefing.greeting),
          active_projects: num(briefing.active_projects),
          pending_tasks: num(briefing.pending_tasks),
          attention_projects: num(briefing.attention_projects),
          recommended_focus: str(briefing.recommended_focus),
        }
      : undefined,
    insights: Array.isArray(row.insights)
      ? (row.insights as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          message: str(item.message),
          confidence_level: str(item.confidence_level),
        }))
      : [],
    workspace_health: health
      ? {
          label: str(health.label),
          score_pct: num(health.score_pct),
          factors: Array.isArray(health.factors) ? health.factors.map(String) : [],
        }
      : undefined,
    priorities: Array.isArray(row.priorities)
      ? (row.priorities as Record<string, unknown>[]).map((item) => ({
          level: str(item.level),
          title: str(item.title),
          reason: str(item.reason),
        }))
      : [],
    timeline: Array.isArray(row.timeline)
      ? (row.timeline as Record<string, unknown>[]).map((item) => ({
          period: str(item.period),
          summary: str(item.summary),
        }))
      : [],
  };
}

export function parseCompanionProjectMap(data: unknown): CompanionProjectMap | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (!row.has_access) return null;

  return {
    has_access: true,
    workspace_map: Array.isArray(row.workspace_map)
      ? (row.workspace_map as Record<string, unknown>[]).map((root) => ({
          project_key: str(root.project_key),
          project_label: str(root.project_label),
          children: Array.isArray(root.children)
            ? (root.children as Record<string, unknown>[]).map((child) => ({
                project_key: str(child.project_key),
                label: str(child.label),
                relationship_type: str(child.relationship_type),
              }))
            : [],
        }))
      : [],
  };
}

export function confidenceLabel(level: string): string {
  const map: Record<string, string> = {
    high: "High confidence",
    medium: "Medium confidence",
    low: "Low confidence",
  };
  return map[level] ?? level;
}

export function memoryCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    profile_memory: "Profile memory",
    workflow_memory: "Workflow memory",
    project_memory: "Project memory",
    companion_memory: "Companion memory",
  };
  return map[category] ?? category;
}
