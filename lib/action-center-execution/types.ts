import type { AipifyAction, RiskLevel } from "@/lib/aipify/execution/types";

export type ExecutionLifecycleStage =
  | "recommended"
  | "under_review"
  | "approved"
  | "assigned"
  | "in_progress"
  | "waiting"
  | "blocked"
  | "completed"
  | "cancelled";

export type LifecycleStepStatus = "pending" | "current" | "complete" | "blocked";

export type ExecutionPriority = "critical" | "high" | "medium" | "low" | "optional";

export type ConfidenceLevel = "very_low" | "low" | "moderate" | "high" | "very_high";

export type DependencyStatus =
  | "ready"
  | "waiting_for_dependency"
  | "dependency_delayed"
  | "dependency_resolved";

export type BlockerCategory =
  | "resource_constraints"
  | "approval_delays"
  | "technical_issues"
  | "vendor_delays"
  | "missing_information"
  | "policy_restrictions";

export type ExecutionActionItem = {
  id: string;
  title: string;
  risk_level?: RiskLevel;
  status?: string;
  lifecycle_stage?: ExecutionLifecycleStage;
  priority?: ExecutionPriority;
  scheduled_for?: string;
  created_at?: string;
  executed_at?: string;
  failure_reason?: string;
};

export type ExecutiveExecutionSummary = {
  execution_health_score: number;
  completion_rate: number;
  blocked_count: number;
  overdue_count: number;
  strategic_in_progress: number;
};

export type ExecutionCoordinationCenter = {
  found: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  executive_summary?: ExecutiveExecutionSummary;
  starting_today?: ExecutionActionItem[];
  in_progress?: ExecutionActionItem[];
  blocked?: ExecutionActionItem[];
  awaiting_dependencies?: ExecutionActionItem[];
  upcoming_deadlines?: ExecutionActionItem[];
  completed?: ExecutionActionItem[];
  executive_priority?: ExecutionActionItem[];
  principle?: string;
};

export type ExecutionBlocker = {
  id: string;
  category: BlockerCategory;
  description: string;
  severity: string;
  owner: string;
  resolution_plan: string;
  target_date?: string;
  resolved: boolean;
  created_at?: string;
};

export type ExecutionDependency = {
  id?: string;
  type: string;
  label: string;
  status: DependencyStatus;
  resolved: boolean;
};

export type ExecutionDetail = {
  found: boolean;
  action?: AipifyAction & { approved_at?: string };
  lifecycle?: {
    current_stage: ExecutionLifecycleStage;
    stages: Array<{ key: ExecutionLifecycleStage; status: LifecycleStepStatus }>;
  };
  ownership?: {
    primary_owner: string;
    secondary_owner?: string;
    contributors: string[];
    executive_sponsor?: string | null;
    history: Array<Record<string, unknown>>;
  };
  dependencies?: ExecutionDependency[];
  blockers?: ExecutionBlocker[];
  priority?: { level: ExecutionPriority; factors: string[] };
  timeline?: {
    planned_start?: string;
    actual_start?: string;
    estimated_completion?: string;
    actual_completion?: string;
    milestones: Array<{ label: string; achieved_at: string; event_type: string }>;
    schedule_deviation_hours: number;
  };
  confidence?: { score: number; level: ConfidenceLevel; factors: string[] };
  collaboration_log?: Array<{
    id: string;
    event_type: string;
    description: string;
    performed_by?: string;
    created_at: string;
  }>;
  audit_trail?: Array<{
    id: string;
    event_type: string;
    event_description: string;
    performed_by?: string;
    created_at: string;
  }>;
  principle?: string;
};

export type ExecutionDashboardWidget = {
  id: string;
  titleKey: keyof ExecutionCoordinationLabels["widgets"];
  items: ExecutionActionItem[];
};

export type ExecutionCoordinationLabels = {
  centerTitle: string;
  centerSubtitle: string;
  tabImpact: string;
  tabApprovals: string;
  tabExecution: string;
  humanOversight: string;
  sections: {
    lifecycle: string;
    ownership: string;
    dependencies: string;
    blockers: string;
    priority: string;
    timeline: string;
    confidence: string;
    collaboration: string;
    learning: string;
    executive: string;
    widgets: string;
    audit: string;
    knowledgeCenter: string;
  };
  lifecycle: {
    stages: Record<ExecutionLifecycleStage, string>;
    stepStatus: Record<LifecycleStepStatus, string>;
  };
  ownership: {
    primary: string;
    secondary: string;
    contributors: string;
    executiveSponsor: string;
    history: string;
    responsibilities: string;
  };
  dependencies: {
    title: string;
    statuses: Record<DependencyStatus, string>;
    types: Record<string, string>;
  };
  blockers: {
    title: string;
    register: string;
    category: string;
    description: string;
    severity: string;
    owner: string;
    resolutionPlan: string;
    targetDate: string;
    submit: string;
    categories: Record<BlockerCategory, string>;
  };
  priority: {
    level: string;
    levels: Record<ExecutionPriority, string>;
    recommendation: string;
  };
  timeline: {
    plannedStart: string;
    actualStart: string;
    estimatedCompletion: string;
    actualCompletion: string;
    milestones: string;
    deviation: string;
  };
  confidence: {
    score: string;
    level: string;
    disclaimer: string;
    levels: Record<ConfidenceLevel, string>;
    factors: Record<string, string>;
  };
  collaboration: {
    addUpdate: string;
    addNote: string;
    requestAssistance: string;
    mentionStakeholder: string;
    submit: string;
    placeholder: string;
  };
  learning: {
    intro: string;
    expectedOutcome: string;
    actualOutcome: string;
    timelineAccuracy: string;
    blockersEncountered: string;
    lessonsLearned: string;
    improvements: string;
    submit: string;
    submitted: string;
  };
  executive: {
    healthScore: string;
    completionRate: string;
    blocked: string;
    overdue: string;
    strategicProgress: string;
  };
  widgets: {
    startingToday: string;
    inProgress: string;
    blocked: string;
    awaitingDependencies: string;
    upcomingDeadlines: string;
    completed: string;
    executivePriority: string;
    empty: string;
    viewAction: string;
  };
  faq: {
    title: string;
    whatIsCoordination: string;
    whatIsCoordinationAnswer: string;
    howTrackProgress: string;
    howTrackProgressAnswer: string;
    autoExecute: string;
    autoExecuteAnswer: string;
    whenBlocked: string;
    whenBlockedAnswer: string;
    confidenceScores: string;
    confidenceScoresAnswer: string;
  };
  empty: string;
  principle: string;
  actions: { back: string };
};
