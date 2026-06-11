export const ACTION_STATUSES = [
  "open",
  "assigned",
  "in_progress",
  "waiting_approval",
  "blocked",
  "completed",
  "dismissed",
] as const;
export type ActionStatus = (typeof ACTION_STATUSES)[number];

export const ACTION_PRIORITIES = [
  "critical",
  "high",
  "medium",
  "low",
  "informational",
] as const;
export type ActionPriority = (typeof ACTION_PRIORITIES)[number];

export type ActionItem = {
  id: string;
  action_key: string;
  title: string;
  description: string;
  source_module: string;
  action_type: string;
  severity: string;
  priority: string;
  priority_score: number;
  recommended_owner?: string | null;
  recommended_due_date?: string | null;
  assigned_user_id?: string | null;
  status: string;
  action_url?: string | null;
  requires_approval: boolean;
  rationale: string;
  created_at: string;
  updated_at: string;
};

export type ActionHubCard = {
  has_customer: boolean;
  my_open_count?: number;
  critical_count?: number;
  waiting_approval_count?: number;
  blocked_count?: number;
  philosophy?: string;
  privacy_note?: string;
};

export type ActionHubDashboard = {
  has_customer: boolean;
  my_actions: ActionItem[];
  team_actions: ActionItem[];
  recommended_actions: ActionItem[];
  critical_actions: ActionItem[];
  recently_completed: ActionItem[];
  blocked_items: ActionItem[];
};

export type ActionItemDetail = {
  found: boolean;
  item?: ActionItem;
  assignments?: Array<{
    id: string;
    assigned_to_user_id?: string | null;
    assigned_to_label?: string | null;
    note: string;
    created_at: string;
  }>;
  decisions?: Array<{
    id: string;
    decision_type: string;
    note: string;
    created_at: string;
  }>;
};

export type ActionHubSettings = {
  enabled: boolean;
  auto_collect: boolean;
  auto_assign: boolean;
  require_approval_high_risk: boolean;
  include_support: boolean;
  include_quality: boolean;
  include_governance: boolean;
  include_memory: boolean;
  include_knowledge: boolean;
  include_briefing: boolean;
  include_desktop: boolean;
  default_owner_role: string;
  retention_days: number;
};

export type NormalizedActionItem = {
  action_key: string;
  title: string;
  description?: string;
  source_module: string;
  source_type?: string;
  source_id?: string;
  action_type?: string;
  severity?: string;
  priority?: string;
  recommended_owner?: string;
  recommended_due_date?: string;
  action_url?: string;
  requires_approval?: boolean;
  rationale?: string;
  metadata?: Record<string, unknown>;
};
