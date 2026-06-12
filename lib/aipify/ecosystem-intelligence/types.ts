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

export type IntegrationLink = {
  label?: string;
  route?: string;
  description?: string;
  note?: string;
};

export type ImplementationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type BlueprintPrincipleBlock = {
  principle?: string;
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
};

export type BlueprintGuidanceBlock = {
  principle?: string;
  examples?: Array<Record<string, unknown>>;
  insights?: Array<Record<string, unknown>>;
  connections?: Array<Record<string, unknown>>;
  questions?: Array<Record<string, unknown>>;
  guidance?: Array<Record<string, unknown>>;
  categories?: Array<Record<string, unknown>>;
  dimensions?: Array<Record<string, unknown>>;
  signals?: Array<Record<string, unknown>>;
  insight_types?: Array<Record<string, unknown>>;
  insights_types?: Array<Record<string, unknown>>;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  journey_phrase?: string;
  self_love_route?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  leaders_should_know?: string[];
  organizations_should_understand?: string[];
  audit_note?: string;
};

export type EcosystemBlueprintEngagementSummary = {
  active_relationships?: number;
  open_risks?: number;
  open_opportunities?: number;
  ecosystem_score?: number;
  relationship_categories?: number;
  relationship_insights?: number;
  partnership_health_dimensions?: number;
  companion_examples?: number;
  community_connections?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type EcosystemIntelligenceExternalRelationshipBlueprint = {
  implementation_blueprint_phase88?: ImplementationBlueprint;
  ecosystem_intelligence_external_relationship_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  blueprint_relationship_categories?: BlueprintGuidanceBlock;
  relationship_insights?: BlueprintGuidanceBlock;
  partnership_health?: BlueprintGuidanceBlock;
  customer_relationship_intelligence?: BlueprintGuidanceBlock;
  community_connection?: BlueprintGuidanceBlock;
  companion_guidance?: BlueprintGuidanceBlock;
  self_love_connection?: SelfLoveConnection;
  leadership_insights?: BlueprintGuidanceBlock;
  trust_connection?: TrustConnection;
  limitation_principles?: BlueprintPrincipleBlock;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: EcosystemBlueprintEngagementSummary;
  privacy_note?: string;
};

export type EcosystemIntelligenceCard = {
  has_customer: boolean;
  ecosystem_score?: number;
  ecosystem_band?: string;
  ecosystem_band_label?: string;
  open_risks?: number;
  philosophy?: string;
  consent_required?: boolean;
  implementation_blueprint_phase88?: ImplementationBlueprint;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  blueprint_vision?: string;
  stewardship_note?: string;
  blueprint_engagement_summary?: EcosystemBlueprintEngagementSummary;
  blueprint_note?: string;
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
  ecosystem_intelligence_external_relationship_blueprint?: EcosystemIntelligenceExternalRelationshipBlueprint;
};

export type EcosystemBriefingResult = {
  briefing_id?: string;
  summary?: string;
  content?: Record<string, unknown>;
  error?: string;
};
