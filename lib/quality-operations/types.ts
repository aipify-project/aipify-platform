export type QualityOperationsTab =
  | "overview"
  | "standards"
  | "audits"
  | "compliance"
  | "incidents"
  | "corrective_actions"
  | "improvements"
  | "reports";

export type QualityScore = {
  quality_score?: number;
  quality_status?: string;
  open_audits?: number;
  critical_findings?: number;
  non_compliant_items?: number;
  open_incidents?: number;
  overdue_corrective_actions?: number;
};

export type Standard = {
  id: string;
  standard_number?: string;
  title: string;
  description?: string;
  status: string;
  version_number?: number;
  review_date?: string;
  business_pack_key?: string;
};

export type ComplianceItem = {
  id: string;
  item_number?: string;
  title: string;
  compliance_type: string;
  status: string;
  review_date?: string;
};

export type Audit = {
  id: string;
  audit_number?: string;
  title: string;
  audit_type: string;
  status: string;
  scheduled_date?: string;
  findings_count?: number;
};

export type Finding = {
  id: string;
  finding_number?: string;
  title: string;
  severity: string;
  status: string;
  due_date?: string;
  audit_id?: string;
};

export type Incident = {
  id: string;
  incident_number?: string;
  title: string;
  category: string;
  impact: string;
  status: string;
  occurred_at?: string;
};

export type CorrectiveAction = {
  id: string;
  action_number?: string;
  title: string;
  priority: string;
  status: string;
  due_date?: string;
  incident_id?: string;
  audit_finding_id?: string;
};

export type Improvement = {
  id: string;
  improvement_number?: string;
  title: string;
  category: string;
  status: string;
  expected_value?: string;
};

export type QualityOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  quality_score?: QualityScore;
  overview?: Record<string, string | number | undefined>;
  standards?: Standard[];
  compliance_items?: ComplianceItem[];
  audits?: Audit[];
  findings?: Finding[];
  incidents?: Incident[];
  corrective_actions?: CorrectiveAction[];
  improvements?: Improvement[];
  reports?: Record<string, unknown>;
  integrations?: Record<string, string>;
  companion_insights?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at?: string }[];
  error?: string;
};
