export type HeadquartersTab =
  | "overview"
  | "operations_room"
  | "executive_room"
  | "departments"
  | "live_activity"
  | "approvals"
  | "alerts"
  | "companion"
  | "reports";

export type HeadquartersAction = {
  action_key: string;
  action_title: string;
  owner_name?: string;
  action_status?: string;
  deadline_label?: string;
  approval_required?: boolean;
  summary?: string;
};

export type HeadquartersCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  departments?: Record<string, unknown>[];
  live_activity?: Record<string, unknown>[];
  live_activity_feed?: Record<string, unknown>[];
  metrics?: Record<string, unknown>[];
  live_metrics?: Record<string, unknown>[];
  actions?: HeadquartersAction[];
  action_coordination_board?: HeadquartersAction[];
  alerts?: Record<string, unknown>[];
  pulse?: Record<string, unknown>[];
  organizational_pulse?: Record<string, unknown>[];
  meetings?: Record<string, unknown>[];
  meeting_command_center?: Record<string, unknown>[];
  coordination?: Record<string, unknown>[];
  cross_department_coordination?: Record<string, unknown>[];
  war_room?: Record<string, unknown>[];
  operations_room?: Record<string, unknown>;
  executive_room?: Record<string, unknown>;
  companion?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type HeadquartersLabels = {
  title: string;
  subtitle: string;
  operationsTitle: string;
  executiveTitle: string;
  warRoomTitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<HeadquartersTab, string>;
  overview: Record<string, string>;
  operations: Record<string, string>;
  executive: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  pulseStatus: Record<string, string>;
  departmentStatus: Record<string, string>;
};
