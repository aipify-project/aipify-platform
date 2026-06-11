export const RELATIONSHIP_CATEGORIES = [
  "customers",
  "partners",
  "suppliers",
  "technology_providers",
  "regulatory_bodies",
  "consultants",
  "external_developers",
  "community_contributors",
  "custom",
] as const;

export type EcosystemRelationship = {
  id: string;
  relationship_name: string;
  category: string;
  description?: string | null;
  strategic_importance: string;
  dependency_level: string;
  value_contribution?: string | null;
  primary_owner?: string | null;
  secondary_owner?: string | null;
  continuity_owner?: string | null;
};

export type EcosystemDependency = {
  id: string;
  relationship_id: string;
  relationship_name?: string;
  dependency_type: string;
  dependency_name: string;
  criticality_level: string;
  continuity_plan_reference?: string | null;
};

export type EcosystemRisk = {
  id: string;
  relationship_id?: string | null;
  risk_description: string;
  risk_type: string;
  severity: string;
  mitigation_recommendation?: string | null;
  status: string;
  created_at?: string;
};

export type EcosystemOpportunity = {
  id: string;
  title: string;
  description: string;
  opportunity_type: string;
  status: string;
};

export type EcosystemIntelligenceCard = {
  has_customer: boolean;
  ecosystem_score?: number;
  ecosystem_band?: string;
  ecosystem_band_label?: string;
  open_risks?: number;
  philosophy?: string;
  consent_required?: boolean;
};

export type EcosystemIntelligenceDashboard = {
  has_customer: boolean;
  consent_required?: boolean;
  human_governance_required?: boolean;
  intelligence_enabled?: boolean;
  external_monitoring_consent?: boolean;
  philosophy?: string;
  safety_note?: string;
  ecosystem_score?: number;
  ecosystem_band?: string;
  ecosystem_band_label?: string;
  score_components?: Record<string, number>;
  dependency_score?: number;
  resilience_score?: number;
  partner_score?: number;
  relationships: EcosystemRelationship[];
  critical_dependencies: EcosystemDependency[];
  external_risks: EcosystemRisk[];
  partnership_opportunities: EcosystemOpportunity[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  relationship_categories?: Array<{ key: string; label: string }>;
  review_frequencies?: Array<{ key: string; label: string; purpose: string }>;
  integrations?: Record<string, string>;
};

export type EcosystemBriefingResult = {
  briefing_id?: string;
  summary?: string;
  content?: Record<string, unknown>;
  error?: string;
};
