import type {
  WorkspaceCenter,
  WorkspaceInsightsBundle,
  WorkspaceProject,
  WorkspaceProjectsBundle,
  WorkspaceRelationshipsBundle,
  WorkspaceSearchResult,
  WorkspaceWorkflow,
} from "./types";

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : Number(value ?? fallback) || fallback;
}

function parseProject(row: Record<string, unknown>): WorkspaceProject {
  const hints = row.application_hints;
  return {
    id: str(row.id),
    project_key: str(row.project_key),
    project_label: str(row.project_label),
    parent_project_key: str(row.parent_project_key),
    project_status: str(row.project_status, "active"),
    health_status: str(row.health_status, "healthy"),
    priority_level: str(row.priority_level, "important"),
    last_activity_at: str(row.last_activity_at),
    open_tasks_count: num(row.open_tasks_count),
    related_files_count: num(row.related_files_count),
    application_hints: Array.isArray(hints)
      ? hints.map(String)
      : [],
  };
}

function parseWorkflow(row: Record<string, unknown>): WorkspaceWorkflow {
  const steps = row.steps;
  return {
    id: str(row.id),
    workflow_key: str(row.workflow_key),
    workflow_label: str(row.workflow_label),
    steps: Array.isArray(steps) ? (steps as Array<{ step?: string }>) : [],
    application_chain: Array.isArray(row.application_chain) ? row.application_chain.map(String) : [],
    workflow_status: str(row.workflow_status, "active"),
    times_observed: num(row.times_observed, 1),
  };
}

export function parseWorkspaceCenter(data: unknown): WorkspaceCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (!row.has_access) return null;

  const permissions = (row.permissions ?? {}) as Record<string, unknown>;
  const health = (row.workspace_health ?? {}) as Record<string, unknown>;
  const briefing = (row.briefing ?? {}) as Record<string, unknown>;

  return {
    has_access: true,
    empty_state: Boolean(row.empty_state),
    positioning: str(row.positioning),
    workspace_enabled: Boolean(row.workspace_enabled),
    permissions: {
      workspace_analysis_approved: Boolean(permissions.workspace_analysis_approved),
      project_discovery_approved: Boolean(permissions.project_discovery_approved),
      application_awareness_approved: Boolean(permissions.application_awareness_approved),
      relationship_discovery_approved: Boolean(permissions.relationship_discovery_approved),
      local_file_awareness_approved: Boolean(permissions.local_file_awareness_approved),
    },
    workspace_health: {
      label: str(health.label, "—"),
      score_pct: num(health.score_pct),
      factors: Array.isArray(health.factors) ? health.factors.map(String) : [],
    },
    briefing: {
      greeting: str(briefing.greeting),
      active_projects: num(briefing.active_projects),
      pending_tasks: num(briefing.pending_tasks),
      attention_projects: num(briefing.attention_projects),
      recommended_focus: str(briefing.recommended_focus),
    },
    cross_link_phase343: str(row.cross_link_phase343, "/desktop/memory"),
    privacy_note: str(row.privacy_note),
    workflows: Array.isArray(row.workflows)
      ? (row.workflows as Record<string, unknown>[]).map(parseWorkflow)
      : [],
    audit_logs: Array.isArray(row.audit_logs)
      ? (row.audit_logs as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          event_type: str(item.event_type),
          summary: str(item.summary),
          created_at: str(item.created_at),
        }))
      : [],
  };
}

export function parseWorkspaceProjects(data: unknown): WorkspaceProjectsBundle | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (!row.has_access) return null;

  const mapList = (key: string) =>
    Array.isArray(row[key])
      ? (row[key] as Record<string, unknown>[]).map(parseProject)
      : [];

  return {
    has_access: true,
    currently_active: mapList("currently_active"),
    recently_active: mapList("recently_active"),
    needs_attention: mapList("needs_attention"),
    archived: mapList("archived"),
  };
}

export function parseWorkspaceInsights(data: unknown): WorkspaceInsightsBundle | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (!row.has_access) return null;

  return {
    has_access: true,
    insights: Array.isArray(row.insights)
      ? (row.insights as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          insight_type: str(item.insight_type),
          title: str(item.title),
          message: str(item.message),
          confidence_level: str(item.confidence_level, "medium"),
          related_project_key: str(item.related_project_key),
        }))
      : [],
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
          project_key: str(item.project_key),
          application_name: str(item.application_name),
          occurred_at: str(item.occurred_at),
        }))
      : [],
  };
}

export function parseWorkspaceRelationships(data: unknown): WorkspaceRelationshipsBundle | null {
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
    nested_relationships: Array.isArray(row.nested_relationships)
      ? (row.nested_relationships as Record<string, unknown>[]).map((item) => ({
          parent_key: str(item.parent_key),
          child_key: str(item.child_key),
          child_label: str(item.child_label),
          relationship_type: str(item.relationship_type),
        }))
      : [],
  };
}

export function parseWorkspaceSearch(data: unknown): WorkspaceSearchResult[] {
  if (!data || typeof data !== "object") return [];
  const row = data as Record<string, unknown>;
  if (!row.has_access) return [];
  return Array.isArray(row.results)
    ? (row.results as Record<string, unknown>[]).map((item) => ({
        type: str(item.type),
        title: str(item.title),
        id: str(item.id),
      }))
    : [];
}

export function parseWorkspaceWorkflows(data: unknown): WorkspaceWorkflow[] {
  if (!data || typeof data !== "object") return [];
  const row = data as Record<string, unknown>;
  return Array.isArray(row.workflows)
    ? (row.workflows as Record<string, unknown>[]).map(parseWorkflow)
    : [];
}
