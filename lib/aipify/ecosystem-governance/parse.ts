import type {
  AbosSuccessCriterion,
  AuditReview,
  BlueprintObjective,
  CertificationProgram,
  CertificationRecord,
  EcosystemGovernanceBlueprint,
  EcosystemGovernanceCard,
  EcosystemGovernanceDashboard,
  EngagementSummary,
  GpCertificationLevel,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  PolicyEntry,
  ProfessionalDirectoryEntry,
  CertificationReview,
  GlobalEcosystemCertificationBlueprint,
  SelfLoveConnection,
  TrustBadge,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] {
  if (!Array.isArray(data)) return [];
  return data as IntegrationLink[];
}

function parsePrograms(data: unknown): CertificationProgram[] {
  if (!Array.isArray(data)) return [];
  return data as CertificationProgram[];
}

function parseRecords(data: unknown): CertificationRecord[] {
  if (!Array.isArray(data)) return [];
  return data as CertificationRecord[];
}

function parseAuditReviews(data: unknown): AuditReview[] {
  if (!Array.isArray(data)) return [];
  return data as AuditReview[];
}

function parsePolicyEntries(data: unknown): PolicyEntry[] {
  if (!Array.isArray(data)) return [];
  return data as PolicyEntry[];
}

function parseTrustBadges(data: unknown): TrustBadge[] {
  if (!Array.isArray(data)) return [];
  return data as TrustBadge[];
}

function parseGpLevels(data: unknown): GpCertificationLevel[] {
  if (!Array.isArray(data)) return [];
  return data as GpCertificationLevel[];
}

function parseRecordArray(data: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(data)) return [];
  return data as Array<Record<string, unknown>>;
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseEngagementSummary(data: unknown): EngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EngagementSummary;
}

function parseBlueprintBlock(data: unknown): EcosystemGovernanceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EcosystemGovernanceBlueprint;
}

function parseGlobalCertificationBlueprint(data: unknown): GlobalEcosystemCertificationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalEcosystemCertificationBlueprint;
}

function parseProfessionalDirectory(data: unknown): ProfessionalDirectoryEntry[] {
  if (!Array.isArray(data)) return [];
  return data as ProfessionalDirectoryEntry[];
}

function parseCertificationReviews(data: unknown): CertificationReview[] {
  if (!Array.isArray(data)) return [];
  return data as CertificationReview[];
}

function parseStringArray(data: unknown): string[] {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is string => typeof item === "string");
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

export function parseEcosystemGovernanceCard(data: unknown): EcosystemGovernanceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    governance_maturity_score: Number(d.governance_maturity_score ?? 0),
    certified_participants: Number(d.certified_participants ?? 0),
    active_trust_badges: Number(d.active_trust_badges ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    voluntary_alignment_enabled: Boolean(d.voluntary_alignment_enabled ?? true),
    implementation_blueprint_phase119: parseBlueprintMeta(d.implementation_blueprint_phase119),
    ecosystem_governance_mission:
      typeof d.ecosystem_governance_mission === "string" ? d.ecosystem_governance_mission : undefined,
    ecosystem_governance_abos_principle:
      typeof d.ecosystem_governance_abos_principle === "string"
        ? d.ecosystem_governance_abos_principle
        : undefined,
    ecosystem_governance_engagement_summary: parseEngagementSummary(d.ecosystem_governance_engagement_summary),
    ecosystem_governance_vision_note:
      typeof d.ecosystem_governance_vision_note === "string" ? d.ecosystem_governance_vision_note : undefined,
    implementation_blueprint_phase146: parseBlueprintMeta(d.implementation_blueprint_phase146),
    gecsbp146_mission: typeof d.gecsbp146_mission === "string" ? d.gecsbp146_mission : undefined,
    gecsbp146_philosophy: typeof d.gecsbp146_philosophy === "string" ? d.gecsbp146_philosophy : undefined,
    gecsbp146_abos_principle:
      typeof d.gecsbp146_abos_principle === "string" ? d.gecsbp146_abos_principle : undefined,
    gecsbp146_engagement_summary: parseEngagementSummary(d.gecsbp146_engagement_summary),
    gecsbp146_vision_note: typeof d.gecsbp146_vision_note === "string" ? d.gecsbp146_vision_note : undefined,
    gecsbp146_distinction_note:
      typeof d.gecsbp146_distinction_note === "string" ? d.gecsbp146_distinction_note : undefined,
    global_ecosystem_certification_note:
      typeof d.global_ecosystem_certification_note === "string" ? d.global_ecosystem_certification_note : undefined,
  };
}

export function parseEcosystemGovernanceDashboard(data: unknown): EcosystemGovernanceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    governance_enabled: Boolean(d.governance_enabled ?? true),
    voluntary_alignment_enabled: Boolean(d.voluntary_alignment_enabled ?? true),
    certification_oversight_enabled: Boolean(d.certification_oversight_enabled ?? true),
    audit_programs_enabled: Boolean(d.audit_programs_enabled ?? true),
    mandatory_2fa_for_governance_roles: Boolean(d.mandatory_2fa_for_governance_roles ?? true),
    policy_acknowledgement_required: Boolean(d.policy_acknowledgement_required ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    governance_maturity_score: Number(d.governance_maturity_score ?? 0),
    certified_participants: Number(d.certified_participants ?? 0),
    certifications_in_review: Number(d.certifications_in_review ?? 0),
    active_trust_badges: Number(d.active_trust_badges ?? 0),
    open_audit_reviews: Number(d.open_audit_reviews ?? 0),
    active_policies: Number(d.active_policies ?? 0),
    certification_programs_count: Number(d.certification_programs_count ?? 0),
    gp_levels_count: Number(d.gp_levels_count ?? 0),
    companion_assessment_areas_count: Number(d.companion_assessment_areas_count ?? 0),
    policy_topics_count: Number(d.policy_topics_count ?? 0),
    trust_badge_types_count: Number(d.trust_badge_types_count ?? 0),
    governance_functions_count: Number(d.governance_functions_count ?? 0),
    certification_programs: parsePrograms(d.certification_programs),
    certification_records: parseRecords(d.certification_records),
    audit_reviews: parseAuditReviews(d.audit_reviews),
    policy_entries: parsePolicyEntries(d.policy_entries),
    trust_badges: parseTrustBadges(d.trust_badges),
    gp_certification_levels: parseGpLevels(d.gp_certification_levels),
    companion_assessment_areas: parseRecordArray(d.companion_assessment_areas),
    certification_maintenance_requirements: parseRecordArray(d.certification_maintenance_requirements),
    audit_review_types: parseRecordArray(d.audit_review_types),
    policy_topic_scaffolds: parseRecordArray(d.policy_topic_scaffolds),
    trust_badge_scaffolds: parseRecordArray(d.trust_badge_scaffolds),
    governance_center_functions: parseRecordArray(d.governance_center_functions),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintBlock(d.ecosystem_governance_blueprint ?? d.implementation_blueprint),
    implementation_blueprint_phase119: parseBlueprintMeta(d.implementation_blueprint_phase119),
    ecosystem_governance_mission:
      typeof d.ecosystem_governance_mission === "string" ? d.ecosystem_governance_mission : undefined,
    ecosystem_governance_philosophy:
      typeof d.ecosystem_governance_philosophy === "string" ? d.ecosystem_governance_philosophy : undefined,
    ecosystem_governance_abos_principle:
      typeof d.ecosystem_governance_abos_principle === "string"
        ? d.ecosystem_governance_abos_principle
        : undefined,
    ecosystem_governance_objectives: parseObjectives(d.ecosystem_governance_objectives),
    governance_center_meta: parseRecord(d.governance_center_meta),
    certification_framework_meta: parseRecord(d.certification_framework_meta),
    audit_programs_meta: parseRecord(d.audit_programs_meta),
    policy_library_meta: parseRecord(d.policy_library_meta),
    trust_badging_meta: parseRecord(d.trust_badging_meta),
    continuous_improvement_meta: parseRecord(d.continuous_improvement_meta),
    enterprise_integration_meta: parseRecord(d.enterprise_integration_meta),
    security_requirements_meta: parseRecord(d.security_requirements_meta),
    self_love_in_governance: parseSelfLoveConnection(d.self_love_in_governance),
    egcbp119_cross_links: parseIntegrationLinks(d.egcbp119_cross_links),
    ecosystem_governance_limitation_principles: parseLimitationPrinciples(
      d.ecosystem_governance_limitation_principles,
    ),
    ecosystem_governance_companion_adaptation: parseRecord(d.ecosystem_governance_companion_adaptation),
    ecosystem_governance_engagement_summary: parseEngagementSummary(d.ecosystem_governance_engagement_summary),
    ecosystem_governance_success_criteria: parseSuccessCriteria(d.ecosystem_governance_success_criteria),
    ecosystem_governance_success_metrics: parseRecordArray(d.ecosystem_governance_success_metrics),
    ecosystem_governance_vision:
      typeof d.ecosystem_governance_vision === "string" ? d.ecosystem_governance_vision : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    implementation_blueprint_phase146: parseBlueprintMeta(d.implementation_blueprint_phase146),
    global_ecosystem_certification_blueprint: parseGlobalCertificationBlueprint(
      d.global_ecosystem_certification_blueprint,
    ),
    global_ecosystem_certification_note:
      typeof d.global_ecosystem_certification_note === "string" ? d.global_ecosystem_certification_note : undefined,
    gecsbp146_distinction_note:
      typeof d.gecsbp146_distinction_note === "string" ? d.gecsbp146_distinction_note : undefined,
    gecsbp146_mission: typeof d.gecsbp146_mission === "string" ? d.gecsbp146_mission : undefined,
    gecsbp146_philosophy: typeof d.gecsbp146_philosophy === "string" ? d.gecsbp146_philosophy : undefined,
    gecsbp146_abos_principle:
      typeof d.gecsbp146_abos_principle === "string" ? d.gecsbp146_abos_principle : undefined,
    gecsbp146_vision: typeof d.gecsbp146_vision === "string" ? d.gecsbp146_vision : undefined,
    gecsbp146_objectives: parseObjectives(d.gecsbp146_objectives),
    global_certification_center_meta: parseRecord(d.global_certification_center_meta),
    certification_framework_engine_meta: parseRecord(d.certification_framework_engine_meta),
    growth_partner_accreditation_meta: parseRecord(d.growth_partner_accreditation_meta),
    continuous_learning_engine_meta: parseRecord(d.continuous_learning_engine_meta),
    professional_standards_framework_meta: parseRecord(d.professional_standards_framework_meta),
    certification_companion_meta: parseRecord(d.certification_companion_meta),
    executive_education_engine_meta: parseRecord(d.executive_education_engine_meta),
    professional_directory_engine_meta: parseRecord(d.professional_directory_engine_meta),
    gecsbp146_companion_limitations: parseLimitationPrinciples(d.gecsbp146_companion_limitations),
    gecsbp146_self_love_connection: parseSelfLoveConnection(d.gecsbp146_self_love_connection),
    gecsbp146_security_requirements: parseRecord(d.gecsbp146_security_requirements),
    gecsbp146_integration_links: parseIntegrationLinks(d.gecsbp146_integration_links),
    gecsbp146_dogfooding: typeof d.gecsbp146_dogfooding === "string" ? d.gecsbp146_dogfooding : undefined,
    gecsbp146_engagement_summary: parseEngagementSummary(d.gecsbp146_engagement_summary),
    gecsbp146_success_criteria: parseSuccessCriteria(d.gecsbp146_success_criteria),
    gecsbp146_vision_phrases: parseStringArray(d.gecsbp146_vision_phrases),
    gecsbp146_privacy_note: typeof d.gecsbp146_privacy_note === "string" ? d.gecsbp146_privacy_note : undefined,
    professional_directory_count: Number(d.professional_directory_count ?? 0),
    certified_professionals_count: Number(d.certified_professionals_count ?? 0),
    certification_reviews_scheduled: Number(d.certification_reviews_scheduled ?? 0),
    certification_reviews_in_progress: Number(d.certification_reviews_in_progress ?? 0),
    certification_pathways_count: Number(d.certification_pathways_count ?? 0),
    professional_standards_count: Number(d.professional_standards_count ?? 0),
    professional_directory_entries: parseProfessionalDirectory(d.professional_directory_entries),
    certification_reviews: parseCertificationReviews(d.certification_reviews),
  };
}
