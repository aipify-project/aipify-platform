export type RiskOperationsTab =
  | "overview"
  | "risk_register"
  | "assessments"
  | "mitigation_plans"
  | "business_continuity"
  | "incidents"
  | "dependencies"
  | "reports"
  | "executive_risk";

export type RiskItem = {
  id: string;
  risk_number?: string;
  title: string;
  description?: string;
  category: string;
  likelihood: string;
  impact: string;
  risk_score?: number;
  risk_level?: string;
  risk_control_status?: string;
  status: string;
  mitigation_plan?: string;
  review_date?: string;
};

export type Assessment = {
  id: string;
  assessment_number?: string;
  title: string;
  assessment_type: string;
  status: string;
};

export type MitigationPlan = {
  id: string;
  plan_number?: string;
  title: string;
  status: string;
  due_date?: string;
  risk_id?: string;
};

export type ContinuityPlan = {
  id: string;
  plan_number?: string;
  title: string;
  status: string;
  recovery_time_objective?: string;
  review_date?: string;
  process_count?: number;
};

export type VendorDependency = {
  id: string;
  vendor_name: string;
  dependency_level: string;
  replacement_available: boolean;
  contract_status: string;
  risk_score?: number;
  business_impact: string;
};

export type Dependency = {
  id: string;
  dependency_type: string;
  dependency_name: string;
  criticality: string;
  failure_impact?: string;
};

export type RiskIncident = {
  id: string;
  incident_number?: string;
  title: string;
  incident_type: string;
  severity: string;
  status: string;
};

export type RiskOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overall_risk?: Record<string, unknown>;
  overview?: Record<string, string | number | undefined>;
  risk_register?: RiskItem[];
  assessments?: Assessment[];
  mitigation_plans?: MitigationPlan[];
  continuity_plans?: ContinuityPlan[];
  vendor_dependencies?: VendorDependency[];
  dependencies?: Dependency[];
  incidents?: RiskIncident[];
  heat_map?: Record<string, unknown>[];
  executive_risk?: Record<string, unknown>;
  governance_link?: Record<string, string>;
  reports?: Record<string, unknown>;
  companion_insights?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at?: string }[];
  error?: string;
};
