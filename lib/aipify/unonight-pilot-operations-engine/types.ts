export type PilotHealthStatus = "excellent" | "healthy" | "needs_attention" | "critical";

export type PilotMilestoneStatus = "pending" | "in_progress" | "completed" | "blocked";

export type PilotMilestone = {
  id: string;
  milestone_key: string;
  title: string;
  status?: PilotMilestoneStatus;
  completed_at?: string | null;
  created_at?: string;
};

export type PilotMetric = {
  id: string;
  metric_key: string;
  metric_value?: number;
  measurement_period?: string;
  created_at?: string;
};

export type PilotFeedback = {
  id: string;
  feedback_type?: string;
  source?: string;
  rating?: number | null;
  comment_summary?: string | null;
  created_at?: string;
};

export type PilotUnresolvedIssue = {
  type?: string;
  severity?: number;
  title?: string;
  status?: string;
  id?: string;
};

export type UnonightPilotConfig = {
  pilot_status?: string;
  organization_type?: string;
  health_status?: PilotHealthStatus;
  module_flags?: Record<string, boolean>;
  pilot_objectives?: string[];
  last_health_check_at?: string | null;
  provisioned_at?: string | null;
};

export type UnonightPilotEngineCard = {
  has_organization: boolean;
  is_pilot?: boolean;
  health_status?: PilotHealthStatus;
  health_score?: number;
  milestones_completed?: number;
  milestones_total?: number;
  philosophy?: string;
};

export type UnonightPilotOperationsDashboard = {
  has_organization: boolean;
  is_unonight_pilot?: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  organization?: {
    id?: string;
    name?: string;
    slug?: string;
    subscription_plan?: string;
    status?: string;
  };
  config?: UnonightPilotConfig;
  pilot_health?: {
    score?: number;
    status?: PilotHealthStatus;
    factors?: Record<string, unknown>;
    module_metrics?: Record<string, unknown>;
  };
  support_improvements?: Record<string, unknown>;
  recommendation_outcomes?: Record<string, unknown>;
  unresolved_issues: PilotUnresolvedIssue[];
  milestones: PilotMilestone[];
  recent_metrics: PilotMetric[];
  recent_feedback: PilotFeedback[];
  administrator_satisfaction?: {
    avg_rating_90d?: number;
    feedback_count_90d?: number;
  };
  unonight_integration?: {
    connected?: boolean;
    status?: string | null;
    last_sync_at?: string | null;
  };
  module_snapshots?: Record<string, unknown>;
};
