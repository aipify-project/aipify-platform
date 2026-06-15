import type {
  AlertType,
  ApprovalPriority,
  ApprovalStatus,
  GovernanceModule,
  PolicyCategory,
  PolicyStatus,
  RetentionDataType,
  RiskLevel,
  AccessRecordType,
} from "./constants";

export type ComplianceFilters = {
  category?: PolicyCategory | "";
  status?: PolicyStatus | "";
  risk_level?: RiskLevel | "";
  owner?: string;
  review_from?: string;
  review_to?: string;
};

export type ComplianceOverview = {
  compliance_alerts: number;
  policies_requiring_review: number;
  pending_approvals: number;
  governance_exceptions: number;
  audit_findings: number;
  high_risk_activities: number;
};

export type GovernancePolicy = {
  id: string;
  policy_name: string;
  category: PolicyCategory;
  owner: string;
  effective_date: string;
  review_date: string;
  status: PolicyStatus;
  risk_level: RiskLevel;
  summary: string;
  updated_at: string;
};

export type GovernanceApproval = {
  id: string;
  request_title: string;
  category: PolicyCategory;
  submitted_by: string;
  priority: ApprovalPriority;
  due_date: string;
  approver: string;
  status: ApprovalStatus;
  risk_level: RiskLevel;
};

export type RetentionControl = {
  id: string;
  data_type: RetentionDataType;
  retention_days: number;
  updated_at: string;
};

export type AccessRecord = {
  id: string;
  record_type: AccessRecordType;
  subject: string;
  detail: string;
  risk_level: RiskLevel;
  active: boolean;
  reviewed_at: string | null;
};

export type GovernanceAlert = {
  id: string;
  alert_type: AlertType;
  message: string;
  severity: RiskLevel;
  created_at: string;
};

export type GovernanceException = {
  id: string;
  title: string;
  category: string;
  owner: string;
  risk_level: RiskLevel;
  status: string;
  summary: string;
  expires_at: string | null;
};

export type ComplianceReports = {
  governance_activities: number;
  approval_histories: number;
  policy_compliance: number;
  audit_summaries: number;
};

export type ComplianceAuditEntry = {
  id: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type ComplianceGovernanceCenter = {
  principle: string;
  filters: ComplianceFilters;
  overview: ComplianceOverview;
  modules: GovernanceModule[];
  policies: GovernancePolicy[];
  approvals: GovernanceApproval[];
  retention: RetentionControl[];
  access: AccessRecord[];
  alerts: GovernanceAlert[];
  exceptions: GovernanceException[];
  reports: ComplianceReports;
  audit: ComplianceAuditEntry[];
};

export type ComplianceGovernanceCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    modules: string;
    policies: string;
    approvals: string;
    retention: string;
    access: string;
    alerts: string;
    exceptions: string;
    reports: string;
    audit: string;
    filters: string;
    createPolicy: string;
  };
  overview: {
    complianceAlerts: string;
    policiesRequiringReview: string;
    pendingApprovals: string;
    governanceExceptions: string;
    auditFindings: string;
    highRiskActivities: string;
  };
  table: {
    policyName: string;
    category: string;
    owner: string;
    effectiveDate: string;
    reviewDate: string;
    status: string;
    riskLevel: string;
    request: string;
    submittedBy: string;
    priority: string;
    dueDate: string;
    approver: string;
    actions: string;
    dataType: string;
    retentionDays: string;
    subject: string;
    detail: string;
    message: string;
    severity: string;
    title: string;
    expiresAt: string;
  };
  categories: Record<PolicyCategory, string>;
  policyStatuses: Record<PolicyStatus, string>;
  riskLevels: Record<RiskLevel, string>;
  priorities: Record<ApprovalPriority, string>;
  retentionTypes: Record<RetentionDataType, string>;
  accessTypes: Record<AccessRecordType, string>;
  alertTypes: Record<AlertType, string>;
  modules: Record<GovernanceModule, string>;
  filters: {
    category: string;
    status: string;
    riskLevel: string;
    owner: string;
    reviewFrom: string;
    reviewTo: string;
    allCategories: string;
    allStatuses: string;
    allRiskLevels: string;
    apply: string;
  };
  reports: {
    governanceActivities: string;
    approvalHistories: string;
    policyCompliance: string;
    auditSummaries: string;
    exportPdf: string;
    exportExcel: string;
    exportCsv: string;
  };
  actions: {
    approve: string;
    reject: string;
    requestChanges: string;
    escalate: string;
    activatePolicy: string;
    archivePolicy: string;
    resolveAlert: string;
    resolveException: string;
    completeAccessReview: string;
    updateRetention: string;
    applying: string;
  };
  create: {
    policyName: string;
    owner: string;
    summary: string;
    submit: string;
    placeholderName: string;
    placeholderOwner: string;
    placeholderSummary: string;
  };
};
