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
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  relationship?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type CompanionAdaptationExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  required?: string[];
  boundary_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  route?: string;
  boundary_note?: string;
};

export type CertificationProgram = {
  id?: string;
  program_key?: string;
  title?: string;
  program_type?: string;
  cross_link_route?: string;
  status?: string;
};

export type CertificationRecord = {
  id?: string;
  participant_key?: string;
  participant_type?: string;
  certification_level?: string;
  certification_level_label?: string;
  status?: string;
  progress_pct?: number;
  maintenance_requirements_met?: number;
};

export type AuditReview = {
  id?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  priority?: string;
  scheduled_at?: string;
  findings_count?: number;
  support_not_punishment_note?: string;
};

export type PolicyEntry = {
  id?: string;
  policy_key?: string;
  title?: string;
  summary?: string;
  topic?: string;
  acknowledgement_required?: boolean;
  status?: string;
};

export type TrustBadge = {
  id?: string;
  badge_key?: string;
  badge_type?: string;
  title?: string;
  summary?: string;
  granted_to_key?: string;
  status?: string;
  granted_at?: string;
};

export type GpCertificationLevel = {
  key?: string;
  label?: string;
  maps_to_tier?: string;
  maps_to_tier_label?: string;
};

export type EngagementSummary = {
  governance_maturity_score?: number;
  certified_participants?: number;
  certifications_in_review?: number;
  active_trust_badges?: number;
  open_audit_reviews?: number;
  active_policies?: number;
  certification_programs_count?: number;
  governance_functions_count?: number;
  cross_links_count?: number;
  professional_directory_count?: number;
  certified_professionals_count?: number;
  certification_reviews_scheduled?: number;
  certification_reviews_in_progress?: number;
  certification_pathways_count?: number;
  professional_standards_count?: number;
  global_certification_capabilities_count?: number;
  privacy_note?: string;
};

export type ProfessionalDirectoryEntry = {
  id?: string;
  entry_key?: string;
  display_name?: string;
  participant_type?: string;
  certification_status?: string;
  gp_status?: string;
  gp_tier_label?: string;
  expertise_areas?: string[];
  regional_presence?: string[];
  contributions_summary?: string;
  public_visible?: boolean;
};

export type CertificationReview = {
  id?: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  participant_key?: string;
  status?: string;
  scheduled_at?: string;
  next_due_at?: string;
  recertification_cadence_months?: number;
  support_not_punishment_note?: string;
};

export type GlobalEcosystemCertificationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  global_certification_center?: Record<string, unknown>;
  certification_framework_engine?: Record<string, unknown>;
  growth_partner_accreditation_engine?: Record<string, unknown>;
  continuous_learning_engine?: Record<string, unknown>;
  professional_standards_framework?: Record<string, unknown>;
  certification_companion?: Record<string, unknown>;
  executive_education_engine?: Record<string, unknown>;
  professional_directory_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: SelfLoveConnection;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: EngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type EcosystemGovernanceBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  governance_center?: Record<string, unknown>;
  certification_framework?: Record<string, unknown>;
  audit_programs?: Record<string, unknown>;
  policy_library?: Record<string, unknown>;
  trust_badging?: Record<string, unknown>;
  continuous_improvement?: Record<string, unknown>;
  enterprise_integration?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  self_love_in_governance?: SelfLoveConnection;
  cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: Record<string, unknown>;
  success_metrics?: Array<Record<string, unknown>>;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: EngagementSummary;
  privacy_note?: string;
};

export type EcosystemGovernanceCard = {
  has_customer: boolean;
  governance_maturity_score?: number;
  certified_participants?: number;
  active_trust_badges?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  voluntary_alignment_enabled?: boolean;
  implementation_blueprint_phase119?: ImplementationBlueprintMeta;
  ecosystem_governance_mission?: string;
  ecosystem_governance_abos_principle?: string;
  ecosystem_governance_engagement_summary?: EngagementSummary;
  ecosystem_governance_vision_note?: string;
  implementation_blueprint_phase146?: ImplementationBlueprintMeta;
  gecsbp146_mission?: string;
  gecsbp146_philosophy?: string;
  gecsbp146_abos_principle?: string;
  gecsbp146_engagement_summary?: EngagementSummary;
  gecsbp146_vision_note?: string;
  gecsbp146_distinction_note?: string;
  global_ecosystem_certification_note?: string;
  [key: string]: unknown;
};

export type EcosystemGovernanceDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  governance_enabled?: boolean;
  voluntary_alignment_enabled?: boolean;
  certification_oversight_enabled?: boolean;
  audit_programs_enabled?: boolean;
  mandatory_2fa_for_governance_roles?: boolean;
  policy_acknowledgement_required?: boolean;
  philosophy?: string;
  distinction_note?: string;
  safety_note?: string;
  governance_maturity_score?: number;
  certified_participants?: number;
  certifications_in_review?: number;
  active_trust_badges?: number;
  open_audit_reviews?: number;
  active_policies?: number;
  certification_programs_count?: number;
  gp_levels_count?: number;
  companion_assessment_areas_count?: number;
  policy_topics_count?: number;
  trust_badge_types_count?: number;
  governance_functions_count?: number;
  certification_programs: CertificationProgram[];
  certification_records: CertificationRecord[];
  audit_reviews: AuditReview[];
  policy_entries: PolicyEntry[];
  trust_badges: TrustBadge[];
  gp_certification_levels: GpCertificationLevel[];
  companion_assessment_areas: Array<Record<string, unknown>>;
  certification_maintenance_requirements: Array<Record<string, unknown>>;
  audit_review_types: Array<Record<string, unknown>>;
  policy_topic_scaffolds: Array<Record<string, unknown>>;
  trust_badge_scaffolds: Array<Record<string, unknown>>;
  governance_center_functions: Array<Record<string, unknown>>;
  integration_links?: IntegrationLink[];
  implementation_blueprint?: EcosystemGovernanceBlueprint;
  implementation_blueprint_phase119?: ImplementationBlueprintMeta;
  ecosystem_governance_mission?: string;
  ecosystem_governance_philosophy?: string;
  ecosystem_governance_abos_principle?: string;
  ecosystem_governance_objectives?: BlueprintObjective[];
  governance_center_meta?: Record<string, unknown>;
  certification_framework_meta?: Record<string, unknown>;
  audit_programs_meta?: Record<string, unknown>;
  policy_library_meta?: Record<string, unknown>;
  trust_badging_meta?: Record<string, unknown>;
  continuous_improvement_meta?: Record<string, unknown>;
  enterprise_integration_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  self_love_in_governance?: SelfLoveConnection;
  egcbp119_cross_links?: IntegrationLink[];
  ecosystem_governance_limitation_principles?: LimitationPrinciples;
  ecosystem_governance_companion_adaptation?: Record<string, unknown>;
  ecosystem_governance_engagement_summary?: EngagementSummary;
  ecosystem_governance_success_criteria?: AbosSuccessCriterion[];
  ecosystem_governance_success_metrics?: Array<Record<string, unknown>>;
  ecosystem_governance_vision?: string;
  privacy_note?: string;
  implementation_blueprint_phase146?: ImplementationBlueprintMeta;
  global_ecosystem_certification_blueprint?: GlobalEcosystemCertificationBlueprint;
  global_ecosystem_certification_note?: string;
  gecsbp146_distinction_note?: string;
  gecsbp146_mission?: string;
  gecsbp146_philosophy?: string;
  gecsbp146_abos_principle?: string;
  gecsbp146_vision?: string;
  gecsbp146_objectives?: BlueprintObjective[];
  global_certification_center_meta?: Record<string, unknown>;
  certification_framework_engine_meta?: Record<string, unknown>;
  growth_partner_accreditation_meta?: Record<string, unknown>;
  continuous_learning_engine_meta?: Record<string, unknown>;
  professional_standards_framework_meta?: Record<string, unknown>;
  certification_companion_meta?: Record<string, unknown>;
  executive_education_engine_meta?: Record<string, unknown>;
  professional_directory_engine_meta?: Record<string, unknown>;
  gecsbp146_companion_limitations?: LimitationPrinciples;
  gecsbp146_self_love_connection?: SelfLoveConnection;
  gecsbp146_security_requirements?: Record<string, unknown>;
  gecsbp146_integration_links?: IntegrationLink[];
  gecsbp146_dogfooding?: string;
  gecsbp146_engagement_summary?: EngagementSummary;
  gecsbp146_success_criteria?: AbosSuccessCriterion[];
  gecsbp146_vision_phrases?: string[];
  gecsbp146_privacy_note?: string;
  professional_directory_count?: number;
  certified_professionals_count?: number;
  certification_reviews_scheduled?: number;
  certification_reviews_in_progress?: number;
  certification_pathways_count?: number;
  professional_standards_count?: number;
  professional_directory_entries: ProfessionalDirectoryEntry[];
  certification_reviews: CertificationReview[];
  [key: string]: unknown;
};
