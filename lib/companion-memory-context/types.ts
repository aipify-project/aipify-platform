export type CompanionMemoryCategory =
  | "profile_memory"
  | "workflow_memory"
  | "project_memory"
  | "companion_memory";

export type CompanionConfidenceLevel = "high" | "medium" | "low";

export type CompanionMemoryStatus = "active" | "disabled" | "archived" | "pending_approval";

export type CompanionMemoryItem = {
  id: string;
  memory_key: string;
  memory_category: CompanionMemoryCategory | string;
  title: string;
  summary: string;
  what_stored: string;
  why_helps: string;
  how_learned: string;
  source_label: string;
  confidence_level: CompanionConfidenceLevel | string;
  memory_status: CompanionMemoryStatus | string;
  last_used_at: string;
  learned_at: string;
};

export type CompanionMemoryAuditEntry = {
  id: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type CompanionMemoryCenter = {
  has_access: boolean;
  positioning: string;
  memory_enabled: boolean;
  always_ask_before_remembering: boolean;
  never_remember: boolean;
  settings: {
    profile_memory_enabled: boolean;
    workflow_memory_enabled: boolean;
    project_memory_enabled: boolean;
    companion_memory_enabled: boolean;
    context_engine_enabled: boolean;
  };
  memory_health: {
    useful_count: number;
    unused_count: number;
    old_count: number;
    total_active: number;
  };
  recommended_cleanup: Array<{ id: string; title: string; reason: string }>;
  memories: CompanionMemoryItem[];
  audit_logs: CompanionMemoryAuditEntry[];
  cross_link_phase322: string;
};

export type CompanionContextBundle = {
  has_access: boolean;
  context_enabled: boolean;
  empty_state?: boolean;
  message?: string;
  current_project?: string;
  current_objective?: string;
  recent_work_summary?: string;
  likely_next_task?: string;
  confidence_level?: CompanionConfidenceLevel | string;
  active_projects_count?: number;
  pending_tasks_count?: number;
  attention_projects_count?: number;
  recommended_focus?: string;
  briefing?: {
    greeting: string;
    active_projects: number;
    pending_tasks: number;
    attention_projects: number;
    recommended_focus: string;
  };
  insights?: Array<{ id: string; message: string; confidence_level: string }>;
  workspace_health?: { label: string; score_pct: number; factors: string[] };
  priorities?: Array<{ level: string; title: string; reason: string }>;
  timeline?: Array<{ period: string; summary: string }>;
};

export type CompanionProjectMap = {
  has_access: boolean;
  workspace_map: Array<{
    project_key: string;
    project_label: string;
    children: Array<{
      project_key: string;
      label: string;
      relationship_type: string;
    }>;
  }>;
};
