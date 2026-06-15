import type {
  ExecutionOutcome,
  PlaybookCategory,
  PlaybookStatus,
  StepActionType,
  TriggerType,
} from "./constants";

export type PlaybookFilters = {
  category?: PlaybookCategory | "";
  status?: PlaybookStatus | "";
  trigger_type?: TriggerType | "";
  owner?: string;
  outcome?: ExecutionOutcome | "";
};

export type PlaybookOverview = {
  active_playbooks: number;
  automations_running: number;
  failed_executions: number;
  manual_interventions: number;
  scheduled_workflows: number;
  most_used_playbooks: number;
};

export type PlaybookStep = {
  id: string;
  step_order: number;
  action_type: StepActionType;
  label: string;
};

export type Playbook = {
  id: string;
  name: string;
  category: PlaybookCategory;
  description: string;
  owner: string;
  trigger_type: TriggerType;
  status: PlaybookStatus;
  condition_summary: string;
  requires_approval: boolean;
  is_template: boolean;
  last_executed_at: string | null;
  steps: PlaybookStep[];
  created_at: string;
  updated_at: string;
};

export type PlaybookExecution = {
  id: string;
  playbook_id: string;
  playbook_name: string;
  trigger_event: string;
  outcome: ExecutionOutcome;
  duration_seconds: number;
  owner: string;
  manual_intervention: boolean;
  approval_status: string | null;
  executed_at: string;
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

export type PlatformPlaybookCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    playbooks: string;
    templates: string;
    executions: string;
    audit: string;
    filters: string;
    steps: string;
    conditions: string;
    createPlaybook: string;
  };
  overview: {
    activePlaybooks: string;
    automationsRunning: string;
    failedExecutions: string;
    manualInterventions: string;
    scheduledWorkflows: string;
    mostUsedPlaybooks: string;
  };
  table: {
    name: string;
    category: string;
    description: string;
    owner: string;
    triggerType: string;
    status: string;
    lastExecuted: string;
    playbookName: string;
    triggerEvent: string;
    executionDate: string;
    outcome: string;
    duration: string;
    actions: string;
    requiresApproval: string;
  };
  categories: Record<PlaybookCategory, string>;
  triggerTypes: Record<TriggerType, string>;
  statuses: Record<PlaybookStatus, string>;
  stepActions: Record<StepActionType, string>;
  outcomes: Record<ExecutionOutcome, string>;
  filters: {
    category: string;
    status: string;
    triggerType: string;
    owner: string;
    outcome: string;
    allCategories: string;
    allStatuses: string;
    allTriggerTypes: string;
    allOutcomes: string;
    apply: string;
  };
  actions: {
    activate: string;
    pause: string;
    archive: string;
    execute: string;
    retry: string;
    escalate: string;
    disable: string;
    grantApproval: string;
    rejectApproval: string;
    useTemplate: string;
    applying: string;
  };
  create: {
    name: string;
    owner: string;
    description: string;
    submit: string;
    placeholderName: string;
    placeholderOwner: string;
    placeholderDescription: string;
  };
};
