export type WorkspaceProjectStatus =
  | "active"
  | "recently_active"
  | "needs_attention"
  | "dormant"
  | "archived"
  | "completed";

export type WorkspaceHealthStatus =
  | "excellent"
  | "healthy"
  | "good"
  | "at_risk"
  | "dormant"
  | "completed";

export type WorkspacePriorityLevel = "highest" | "important" | "later" | "archived";

export type WorkspaceProject = {
  id: string;
  project_key: string;
  project_label: string;
  parent_project_key: string;
  project_status: WorkspaceProjectStatus | string;
  health_status: WorkspaceHealthStatus | string;
  priority_level: WorkspacePriorityLevel | string;
  last_activity_at: string;
  open_tasks_count: number;
  related_files_count: number;
  application_hints: string[];
};

export type WorkspaceMapNode = {
  project_key: string;
  project_label: string;
  children: Array<{
    project_key: string;
    label: string;
    relationship_type: string;
  }>;
};

export type WorkspaceInsight = {
  id: string;
  insight_type: string;
  title: string;
  message: string;
  confidence_level: string;
  related_project_key: string;
};

export type WorkspaceWorkflow = {
  id: string;
  workflow_key: string;
  workflow_label: string;
  steps: Array<{ step?: string }>;
  application_chain: string[];
  workflow_status: string;
  times_observed: number;
};

export type WorkspacePriority = {
  level: string;
  title: string;
  reason: string;
};

export type WorkspaceTimelineEntry = {
  period: string;
  summary: string;
  project_key: string;
  application_name: string;
  occurred_at: string;
};

export type WorkspaceAuditEntry = {
  id: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type WorkspaceCenter = {
  has_access: boolean;
  empty_state: boolean;
  positioning: string;
  workspace_enabled: boolean;
  permissions: {
    workspace_analysis_approved: boolean;
    project_discovery_approved: boolean;
    application_awareness_approved: boolean;
    relationship_discovery_approved: boolean;
    local_file_awareness_approved: boolean;
  };
  workspace_health: {
    label: string;
    score_pct: number;
    factors: string[];
  };
  briefing: {
    greeting: string;
    active_projects: number;
    pending_tasks: number;
    attention_projects: number;
    recommended_focus: string;
  };
  cross_link_phase343: string;
  privacy_note: string;
  workflows: WorkspaceWorkflow[];
  audit_logs: WorkspaceAuditEntry[];
};

export type WorkspaceProjectsBundle = {
  has_access: boolean;
  currently_active: WorkspaceProject[];
  recently_active: WorkspaceProject[];
  needs_attention: WorkspaceProject[];
  archived: WorkspaceProject[];
};

export type WorkspaceInsightsBundle = {
  has_access: boolean;
  insights: WorkspaceInsight[];
  priorities: WorkspacePriority[];
  timeline: WorkspaceTimelineEntry[];
};

export type WorkspaceRelationshipsBundle = {
  has_access: boolean;
  workspace_map: WorkspaceMapNode[];
  nested_relationships: Array<{
    parent_key: string;
    child_key: string;
    child_label: string;
    relationship_type: string;
  }>;
};

export type WorkspaceSearchResult = {
  type: string;
  title: string;
  id: string;
};
