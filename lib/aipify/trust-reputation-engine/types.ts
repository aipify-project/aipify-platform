export type OrganizationTrustProfile = {
  id?: string;
  entity_type?: string;
  entity_id?: string | null;
  trust_score?: number;
  trust_level?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationTrustSignal = {
  id?: string;
  profile_id?: string;
  signal_type?: string;
  signal_value?: number;
  metadata?: Record<string, unknown>;
  recorded_at?: string;
  [key: string]: unknown;
};

export type OrganizationTrustOutcome = {
  id?: string;
  profile_id?: string;
  outcome_type?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type RelationshipObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type RelationshipPrinciple = {
  key?: string;
  label?: string;
  description?: string;
};

export type ExamplePhrase = {
  key?: string;
  phrase?: string;
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type BlueprintBoundaries = {
  principle?: string;
  should_avoid?: string[];
  preserved_a72?: string[];
};

export type TrustSignalsBlueprint = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type DogfoodingBlueprint = {
  principle?: string;
  aipify_group?: Record<string, unknown>;
  unonight?: Record<string, unknown>;
};

export type TrustEngagementSummary = {
  active_profiles?: number;
  trusted_profiles?: number;
  under_review_profiles?: number;
  revoked_profiles?: number;
  avg_trust_score?: number;
  recent_signals_30d?: number;
  entity_type_count?: number;
  outcomes_total?: number;
  outcomes_last_30d?: number;
  expansion_approved?: number;
  expansion_rejected?: number;
  revocations?: number;
  signals_last_90d?: number;
  auto_signal_enabled?: boolean;
  expansion_review_required?: boolean;
  reliability_signals_90d?: number;
  continuity_signals_30d?: number;
  relationship_signals_90d?: number;
  warning_signals_30d?: number;
  phase116_note?: string;
  phase142_note?: string;
  companion_note?: string;
  privacy_note?: string;
  verified_verifications?: number;
  pending_verifications?: number;
  active_gp_certifications?: number;
  public_profile_visible?: boolean;
  knowledge_contributions_count?: number;
  community_participation_count?: number;
};

export type TrustInsightQuestion = {
  key?: string;
  question?: string;
  intent?: string;
};

export type EarlyWarningSignal = {
  key?: string;
  label?: string;
  description?: string;
};

export type RecognitionTypesBlueprint = {
  principle?: string;
  recognition_route?: string;
  types?: RelationshipObjective[];
};

export type CompanionResponsibilities = {
  may?: string[];
  must_avoid?: string[];
};

export type GrowthPartnerTrustModel = {
  principle?: string;
  growth_partner_route?: string;
  areas?: RelationshipObjective[];
};

export type ReputationSafeguards = {
  principle?: string;
  do_not?: string[];
  do?: string[];
};

export type TrustCompanionBlueprint = {
  principle?: string;
  may?: string[];
  must_avoid?: string[];
};

export type AipifyTrustNetwork = {
  principle?: string;
  participant_types?: RelationshipObjective[];
};

export type GrowthPartnerTrustProgram = {
  principle?: string;
  partners_route?: string;
  growth_partner_ops_route?: string;
  areas?: RelationshipObjective[];
};

export type OrganizationEcosystemTrustProfile = {
  organization_id?: string;
  display_name?: string;
  country_code?: string;
  industry_key?: string;
  verification_status?: string;
  growth_partner_status?: string;
  years_in_ecosystem?: number;
  knowledge_contributions_count?: number;
  community_participation_count?: number;
  enterprise_certification_keys?: string[];
  public_profile_visible?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationTrustVerification = {
  id?: string;
  verification_type?: string;
  status?: string;
  verified_at?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type GrowthPartnerTrustCertification = {
  id?: string;
  program_key?: string;
  certification_level?: string;
  status?: string;
  certified_at?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type OrganizationTrustProfileBundle = {
  has_organization?: boolean;
  organization_id?: string;
  ecosystem_profile?: OrganizationEcosystemTrustProfile;
  verifications?: OrganizationTrustVerification[];
  growth_partner_certifications?: GrowthPartnerTrustCertification[];
  profile_fields?: RelationshipObjective[];
  reputation_safeguards?: ReputationSafeguards;
  engagement_summary?: TrustEngagementSummary;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type TrustReputationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_profiles?: number;
  trusted_profiles?: number;
  under_review_profiles?: number;
  avg_trust_score?: number;
  implementation_blueprint?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: TrustEngagementSummary;
  blueprint_note?: string;
  [key: string]: unknown;
};

export type CompanionReliability = {
  principle?: string;
  indicators?: RelationshipObjective[];
  reputation_signal_types?: string[];
};

export type BoundaryPrinciples = {
  principle?: string;
  should_support?: string[];
  should_avoid?: string[];
  preserved_a72?: string[];
};

export type OrganizationalTrust = {
  principle?: string;
  pillars?: RelationshipObjective[];
};

export type TrustReputationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    trust_profiles?: OrganizationTrustProfile[];
    trust_trends?: Record<string, unknown>[];
    trusted_workflows?: OrganizationTrustProfile[];
    approval_quality?: Record<string, unknown>[];
    reputation_indicators?: OrganizationTrustSignal[];
    recent_outcomes?: OrganizationTrustOutcome[];
  };
  settings?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  implementation_blueprint?: ImplementationBlueprintMeta;
  implementation_blueprint_phase26?: ImplementationBlueprintMeta;
  implementation_blueprint_phase57?: ImplementationBlueprintMeta;
  trust_relationship_note?: string;
  companion_relationship_trust_note?: string;
  trust_reputation_relationship_note?: string;
  blueprint_philosophy?: string;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  vision?: string;
  blueprint_distinction_note?: string;
  relationship_objectives?: RelationshipObjective[];
  relationship_principles?: RelationshipPrinciple[];
  example_phrases?: ExamplePhrase[];
  trust_signals?: TrustSignalsBlueprint;
  companion_examples?: CompanionExample[];
  blueprint_boundaries?: BlueprintBoundaries;
  self_love_connection?: SelfLoveConnection;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: TrustEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  companion_objectives?: RelationshipObjective[];
  trust_principles?: RelationshipPrinciple[];
  avoid_practices?: string[];
  relationship_continuity?: CompanionExample[];
  companion_reliability?: CompanionReliability;
  companion_self_love?: SelfLoveConnection;
  boundary_principles?: BoundaryPrinciples;
  trust_signal_indicators?: TrustSignalsBlueprint;
  organizational_trust?: OrganizationalTrust;
  dogfooding_phase57?: DogfoodingBlueprint;
  companion_integration_links?: IntegrationLink[];
  companion_success_criteria?: AbosSuccessCriterion[];
  companion_vision_phrases?: string[];
  phase116_objectives?: RelationshipObjective[];
  trust_framework_dimensions?: RelationshipObjective[];
  relationship_health_categories?: RelationshipObjective[];
  reputation_profile_types?: RelationshipObjective[];
  trust_insights_questions?: TrustInsightQuestion[];
  early_warning_signals?: EarlyWarningSignal[];
  recognition_types?: RecognitionTypesBlueprint;
  trust_recovery_framework?: RelationshipObjective[];
  companion_responsibilities?: CompanionResponsibilities;
  growth_partner_trust_model?: GrowthPartnerTrustModel;
  enterprise_trust_governance?: RelationshipObjective[];
  privacy_ethics_principles?: RelationshipPrinciple[];
  self_love_in_relationships?: SelfLoveConnection;
  phase116_integration_links?: IntegrationLink[];
  limitation_principles?: string[];
  companion_adaptation?: CompanionExample[];
  phase116_success_metrics?: RelationshipObjective[];
  phase116_success_criteria?: AbosSuccessCriterion[];
  implementation_blueprint_phase116?: ImplementationBlueprintMeta;
  trust_network_verified_ecosystem_note?: string;
  phase142_objectives?: RelationshipObjective[];
  aipify_trust_network?: AipifyTrustNetwork;
  verified_organization_engine?: RelationshipObjective[];
  organization_trust_profile_fields?: RelationshipObjective[];
  growth_partner_trust_program?: GrowthPartnerTrustProgram;
  trust_signal_engine?: RelationshipObjective[];
  procurement_readiness_engine?: RelationshipObjective[];
  trust_companion?: TrustCompanionBlueprint;
  reputation_safeguards?: ReputationSafeguards;
  phase142_companion_limitations?: string[];
  phase142_self_love_connection?: SelfLoveConnection;
  phase142_security_requirements?: RelationshipObjective[];
  phase142_integration_links?: IntegrationLink[];
  dogfooding_phase142?: DogfoodingBlueprint;
  phase142_success_criteria?: AbosSuccessCriterion[];
  organization_trust_profile?: OrganizationTrustProfileBundle;
  privacy_note?: string;
  [key: string]: unknown;
};

export type TrustReputationExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  profiles?: OrganizationTrustProfile[];
  recent_signals?: OrganizationTrustSignal[];
  outcomes?: OrganizationTrustOutcome[];
  summary?: Record<string, unknown>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
