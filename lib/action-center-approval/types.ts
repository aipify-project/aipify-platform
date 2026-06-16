import type { AipifyAction, RiskLevel } from "@/lib/aipify/execution/types";

export type ApprovalWorkflowType =
  | "none"
  | "single"
  | "multi_step"
  | "parallel"
  | "executive";

export type SlaStatus = "on_track" | "approaching_deadline" | "overdue" | "escalated";

export type ApprovalDecisionType =
  | "approve"
  | "approve_with_conditions"
  | "reject"
  | "request_information"
  | "delegate_review"
  | "require_executive_oversight"
  | "escalate"
  | "return_for_clarification";

export type ApprovalActionItem = {
  id: string;
  title: string;
  action_type?: string;
  risk_level: RiskLevel;
  status: string;
  preview_text?: string;
  estimated_impact?: string;
  created_at?: string;
  required_approvals?: number;
  approval_count?: number;
  workflow_type?: ApprovalWorkflowType;
  sla_status?: SlaStatus;
  current_owner?: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
};

export type ExecutiveSummary = {
  approval_health_score: number;
  critical_blocked: number;
  high_risk_awaiting: number;
  avg_cycle_hours: number;
  delegation_events_30d: number;
};

export type ApprovalDelegationCenter = {
  found: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  user_role?: string;
  settings?: { multi_admin_approval?: boolean; allow_critical_review?: boolean };
  executive_summary?: ExecutiveSummary;
  pending_approvals?: ApprovalActionItem[];
  awaiting_my_review?: ApprovalActionItem[];
  recently_approved?: ApprovalActionItem[];
  rejected?: ApprovalActionItem[];
  escalated?: ApprovalActionItem[];
  executive_decisions?: ApprovalActionItem[];
  permissions?: Array<{ role_name: string; can_approve_actions: boolean; max_risk_level: string }>;
  principle?: string;
};

export type DelegationRecord = {
  owner?: string;
  from_owner?: string;
  performed_by?: string;
  created_at?: string;
};

export type ApprovalDetail = {
  found: boolean;
  action?: AipifyAction & {
    approved_by?: string;
    approved_at?: string;
    rejected_by?: string;
    rejection_reason?: string;
  };
  workflow?: {
    type: ApprovalWorkflowType;
    steps_completed: number;
    steps_required: number;
    rules: Array<{ key: string; label: string }>;
  };
  delegation?: {
    current_owner: string;
    previous_owners: DelegationRecord[];
    history: Array<{
      event_type: string;
      description: string;
      performed_by?: string;
      metadata?: Record<string, unknown>;
      created_at: string;
    }>;
  };
  sla?: {
    status: SlaStatus;
    hours_waiting: number;
    escalated: boolean;
    deadline_hours: number;
  };
  audit_trail?: Array<{
    id: string;
    event_type: string;
    event_description: string;
    performed_by?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
  }>;
  approvals?: Array<{ approved_by: string; approved_at: string }>;
  delegate_recommendations?: DelegateRecommendation[];
  principle?: string;
};

export type DelegateRecommendation = {
  role_name: string;
  reason_key: string;
  optional: true;
};

export type ApprovalDashboardWidget = {
  id: string;
  titleKey: keyof ApprovalDelegationLabels["widgets"];
  items: ApprovalActionItem[];
};

export type ApprovalDelegationLabels = {
  centerTitle: string;
  centerSubtitle: string;
  tabImpact: string;
  tabApprovals: string;
  humanOversight: string;
  sections: {
    workflow: string;
    delegation: string;
    sla: string;
    audit: string;
    executive: string;
    decisions: string;
    recommendations: string;
    widgets: string;
    knowledgeCenter: string;
  };
  workflow: {
    type: string;
    steps: string;
    rules: string;
    types: Record<ApprovalWorkflowType, string>;
  };
  delegation: {
    currentOwner: string;
    previousOwners: string;
    history: string;
    assign: string;
    delegateTo: string;
  };
  sla: {
    status: string;
    hoursWaiting: string;
    deadline: string;
    statuses: Record<SlaStatus, string>;
  };
  decisions: {
    approve: string;
    approveWithConditions: string;
    reject: string;
    requestInformation: string;
    delegateReview: string;
    requireExecutiveOversight: string;
    escalate: string;
    returnForClarification: string;
    comment: string;
    conditions: string;
    submit: string;
  };
  recommendations: {
    intro: string;
    optional: string;
    reasons: Record<string, string>;
  };
  executive: {
    healthScore: string;
    criticalBlocked: string;
    highRiskAwaiting: string;
    avgCycle: string;
    delegationEffectiveness: string;
  };
  widgets: {
    pendingApprovals: string;
    awaitingMyReview: string;
    recentlyApproved: string;
    rejected: string;
    escalated: string;
    executiveDecisions: string;
    empty: string;
    viewAction: string;
  };
  notifications: {
    approvalRequired: string;
    approvalCompleted: string;
    delegated: string;
    escalated: string;
    overdue: string;
  };
  faq: {
    title: string;
    whatIsDelegation: string;
    whatIsDelegationAnswer: string;
    whatIsWorkflow: string;
    whatIsWorkflowAnswer: string;
    autoApprove: string;
    autoApproveAnswer: string;
    howApproversSelected: string;
    howApproversSelectedAnswer: string;
    delayedApprovals: string;
    delayedApprovalsAnswer: string;
  };
  empty: string;
  principle: string;
  actions: { back: string };
};
