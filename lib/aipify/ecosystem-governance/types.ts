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
  [key: string]: unknown;
};
