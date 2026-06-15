export type HostsTrustModuleKey =
  | "local_regulation_intelligence"
  | "property_compliance_dashboard"
  | "neighborhood_relationship_center"
  | "house_rule_enforcement"
  | "safety_operations_center"
  | "insurance_readiness"
  | "operational_ethics"
  | "trust_score_dashboard"
  | "executive_governance_center"
  | "responsible_hospitality_knowledge";

export type HostsTrustModule = {
  key: HostsTrustModuleKey;
  label: string;
  description: string;
};

export type HostsComplianceArea = {
  key: string;
  label: string;
};

export type HostsRegulatoryAlert = {
  key: string;
  label: string;
  status: "compliant" | "attention_required" | "action_overdue";
  suggestion?: string;
};

export type HostsTrustSnapshot = {
  trust_score: number;
  compliance_ready_pct: number;
  safety_completion_pct: number;
  attention_required: number;
  action_overdue: number;
  community_concerns: number;
};

export type HostsExecutiveMetric = {
  key: string;
  label: string;
  value: string | number;
};

export type AipifyHostsTrustComplianceDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  property_count: number;
  human_oversight_required: boolean;
  positioning: string;
  vision: string;
  modules: HostsTrustModule[];
  compliance_areas: HostsComplianceArea[];
  house_rule_categories: string[];
  safety_areas: string[];
  ethics_principles: string[];
  governance: {
    principle: string;
    approval_required: boolean;
    audit_required: boolean;
    recommendations_only: boolean;
  };
  success_metrics: { key: string; label: string }[];
  knowledge_categories: string[];
  trust_snapshot: HostsTrustSnapshot;
  regulatory_alerts: HostsRegulatoryAlert[];
  executive_metrics: HostsExecutiveMetric[];
};

export type AipifyHostsTrustComplianceCard = {
  has_customer: boolean;
  enabled?: boolean;
  package_key?: string;
  property_count?: number;
  human_oversight_required?: boolean;
  positioning?: string;
  route?: string;
};
