import type {
  ApprovalRole,
  ConditionKey,
  DesignerSurface,
  DesignerTriggerType,
  ExecutionOutcome,
  ExecutionStatus,
  PlaybookCategory,
  PlaybookPriority,
  PlaybookStatus,
  StepActionType,
  StepKind,
} from "./constants";

export type PlaybookFilters = {
  category?: PlaybookCategory | "";
  status?: PlaybookStatus | "";
  trigger_type?: DesignerTriggerType | "";
  owner?: string;
  department?: string;
  outcome?: ExecutionOutcome | "";
  playbook_id?: string;
};

export type PlaybookOverview = {
  active_playbooks: number;
  scheduled_automations: number;
  running_automations: number;
  failed_executions: number;
  pending_approvals: number;
  recently_completed: number;
};

export type PlaybookStep = {
  id: string;
  step_order: number;
  action_type: StepActionType;
  step_kind: StepKind;
  label: string;
};

export type PlaybookCondition = {
  id: string;
  condition_key: ConditionKey;
  operator: string;
  condition_value: string;
  sort_order: number;
};

export type PlaybookApprovalCheckpoint = {
  id: string;
  approval_role: ApprovalRole;
  label: string;
  step_order: number;
};

export type PlaybookNotificationConfig = {
  on_start: boolean;
  on_approval: boolean;
  on_complete: boolean;
  on_failure: boolean;
};

export type Playbook = {
  id: string;
  name: string;
  category: PlaybookCategory;
  description: string;
  owner: string;
  department: string;
  priority: PlaybookPriority;
  trigger_type: DesignerTriggerType;
  status: PlaybookStatus;
  condition_summary: string;
  requires_approval: boolean;
  completion_rule: string;
  notification_config: PlaybookNotificationConfig;
  is_template: boolean;
  last_executed_at: string | null;
  steps: PlaybookStep[];
  conditions: PlaybookCondition[];
  approvals: PlaybookApprovalCheckpoint[];
  created_at: string;
  updated_at: string;
};

export type PlaybookExecutionStep = {
  id: string;
  step_label: string;
  step_status: "pending" | "completed" | "failed" | "skipped";
  completed_at: string | null;
};

export type PlaybookExecution = {
  id: string;
  playbook_id: string;
  playbook_name: string;
  trigger_event: string;
  outcome: ExecutionOutcome;
  started_by: string;
  current_status: ExecutionStatus;
  completed_steps: number;
  failed_steps: number;
  duration_seconds: number;
  owner: string;
  manual_intervention: boolean;
  approval_status: string | null;
  executed_at: string;
  completed_at: string | null;
  steps: PlaybookExecutionStep[];
};

export type PlaybookAuditEntry = {
  id: string;
  playbook_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type PlatformPlaybookCenter = {
  principle: string;
  filters: PlaybookFilters;
  overview: PlaybookOverview;
  playbooks: Playbook[];
  templates: Playbook[];
  executions: PlaybookExecution[];
  audit: PlaybookAuditEntry[];
};

export type PlaybookDesignerSuperStats = {
  total_playbooks: number;
  active_playbooks: number;
  failed_executions_7d: number;
  templates_published: number;
};

export type PlaybookTestResult = {
  execution_id: string;
  mode: string;
  valid: boolean;
  message: string;
};

export type PlatformPlaybookDesigner = {
  has_access: boolean;
  surface: DesignerSurface;
  principle: string;
  playbook: Playbook | null;
  templates: Playbook[];
  executions: PlaybookExecution[];
  audit: PlaybookAuditEntry[];
  super: PlaybookDesignerSuperStats;
  test_result?: PlaybookTestResult;
};

export type PlatformPlaybookCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  emptyOnboardingTitle: string;
  emptyOnboardingBody: string;
  sections: Record<string, string>;
  overview: Record<string, string>;
  table: Record<string, string>;
  categories: Record<PlaybookCategory, string>;
  triggerTypes: Record<DesignerTriggerType, string>;
  statuses: Record<PlaybookStatus, string>;
  priorities: Record<PlaybookPriority, string>;
  stepActions: Record<StepActionType, string>;
  stepKinds: Record<StepKind, string>;
  conditions: Record<ConditionKey, string>;
  approvalRoles: Record<ApprovalRole, string>;
  outcomes: Record<ExecutionOutcome, string>;
  executionStatuses: Record<ExecutionStatus, string>;
  flowNodes: Record<string, string>;
  filters: Record<string, string>;
  actions: Record<string, string>;
  create: Record<string, string>;
  designer: Record<string, string>;
  notifications: Record<string, string>;
  errorHandling: Record<string, string>;
  testMode: Record<string, string>;
  superAdmin: Record<string, string>;
};
