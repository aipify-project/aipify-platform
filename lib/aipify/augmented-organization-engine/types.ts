export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  phase?: number;
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  relationship?: string;
  description?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type MaturityLevel = {
  level?: number;
  key?: string;
  label?: string;
  description?: string;
};

export type SymbiosisAssessment = {
  id: string;
  assessment_key?: string;
  assessment_type?: string;
  summary?: string;
  maturity_level?: number | null;
  health_signal?: string;
  captured_at?: string;
};

export type TrustSignal = {
  id: string;
  signal_key?: string;
  signal_type?: string;
  summary?: string;
  visibility_level?: string;
  confidence?: string;
  captured_at?: string;
};

export type AgencyRecord = {
  id: string;
  record_key?: string;
  checkpoint_type?: string;
  summary?: string;
  status?: string;
  captured_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type AugmentedOrganizationEngagementSummary = {
  symbiosis_score?: number;
  symbiosis_maturity_level?: number;
  symbiosis_assessments_count?: number;
  trust_signals_count?: number;
  agency_records_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  maturity_levels_count?: number;
  privacy_note?: string;
  not_employee_surveillance?: boolean;
};

export type AugmentedOrganizationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  augmented_organization_center?: Record<string, unknown>;
  human_companion_symbiosis_model?: Record<string, unknown>;
  symbiosis_design_principles?: Record<string, unknown>;
  augmented_experience_engine?: Record<string, unknown>;
  human_agency_protection_framework?: Record<string, unknown>;
  trust_engine?: Record<string, unknown>;
  relationship_intelligence_engine?: Record<string, unknown>;
  augmented_organization_maturity_model?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  era_capstone_summary?: IntegrationLink[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: AugmentedOrganizationEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type AugmentedOrganizationCard = {
  has_customer: boolean;
  symbiosis_score?: number;
  symbiosis_maturity_level?: number;
  symbiosis_assessments_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  human_agency_protection_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  augmented_organization_mission?: string;
  augmented_organization_abos_principle?: string;
  augmented_organization_engagement_summary?: AugmentedOrganizationEngagementSummary;
  augmented_organization_note?: string;
  augmented_organization_vision_note?: string;
};

export type AugmentedOrganizationDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  symbiosis_maturity_level?: number;
  human_agency_protection_enabled?: boolean;
  trust_transparency_enabled?: boolean;
  human_oversight_required?: boolean;
  governance_visibility?: string;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  symbiosis_score?: number;
  symbiosis_assessments_count?: number;
  trust_signals_count?: number;
  agency_records_count?: number;
  symbiosis_assessments: SymbiosisAssessment[];
  trust_signals: TrustSignal[];
  agency_records: AgencyRecord[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  augmented_organization_blueprint?: AugmentedOrganizationBlueprint;
  augmented_organization_mission?: string;
  augmented_organization_philosophy?: string;
  augmented_organization_abos_principle?: string;
  augmented_organization_objectives?: BlueprintObjective[];
  augmented_organization_center_meta?: Record<string, unknown>;
  human_companion_symbiosis_model_meta?: Record<string, unknown>;
  symbiosis_design_principles_meta?: Record<string, unknown>;
  augmented_experience_engine_meta?: Record<string, unknown>;
  human_agency_protection_framework_meta?: Record<string, unknown>;
  trust_engine_meta?: Record<string, unknown>;
  relationship_intelligence_engine_meta?: Record<string, unknown>;
  augmented_organization_maturity_model_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  auorgbp140_era_capstone_summary?: IntegrationLink[];
  auorgbp140_extended_cross_links?: IntegrationLink[];
  auorgbp140_integration_links?: IntegrationLink[];
  augmented_organization_engagement_summary?: AugmentedOrganizationEngagementSummary;
  augmented_organization_success_criteria?: AbosSuccessCriterion[];
  augmented_organization_vision?: string;
  augmented_organization_vision_phrases?: string[];
  augmented_organization_privacy_note?: string;
  augmented_organization_dogfooding?: string;
  augmented_organization_engine_note?: string;
  augmented_organization_distinction_note?: string;
};
