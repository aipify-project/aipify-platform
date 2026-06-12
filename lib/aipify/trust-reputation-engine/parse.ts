import type {
  AbosSuccessCriterion,
  BlueprintBoundaries,
  BoundaryPrinciples,
  CompanionExample,
  CompanionReliability,
  CompanionResponsibilities,
  DogfoodingBlueprint,
  EarlyWarningSignal,
  ExamplePhrase,
  GrowthPartnerTrustModel,
  IntegrationLink,
  OrganizationalTrust,
  OrganizationTrustOutcome,
  OrganizationTrustProfile,
  OrganizationTrustSignal,
  RecognitionTypesBlueprint,
  RelationshipObjective,
  RelationshipPrinciple,
  SelfLoveConnection,
  TrustEngagementSummary,
  TrustInsightQuestion,
  TrustReputationEngineCard,
  TrustReputationEngineDashboard,
  TrustReputationExport,
  TrustSignalsBlueprint,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSections(data: unknown): TrustReputationEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    trust_profiles: parseRecordList<OrganizationTrustProfile>(s.trust_profiles),
    trust_trends: parseRecordList<Record<string, unknown>>(s.trust_trends),
    trusted_workflows: parseRecordList<OrganizationTrustProfile>(s.trusted_workflows),
    approval_quality: parseRecordList<Record<string, unknown>>(s.approval_quality),
    reputation_indicators: parseRecordList<OrganizationTrustSignal>(s.reputation_indicators),
    recent_outcomes: parseRecordList<OrganizationTrustOutcome>(s.recent_outcomes),
  };
}

function parseRelationshipObjectives(data: unknown): RelationshipObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as RelationshipObjective[];
}

function parseRelationshipPrinciples(data: unknown): RelationshipPrinciple[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as RelationshipPrinciple[];
}

function parseExamplePhrases(data: unknown): ExamplePhrase[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as ExamplePhrase[];
}

function parseCompanionExamples(data: unknown): CompanionExample[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as CompanionExample[];
}

function parseBlueprintBoundaries(data: unknown): BlueprintBoundaries | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BlueprintBoundaries;
}

function parseTrustSignals(data: unknown): TrustSignalsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustSignalsBlueprint;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseDogfooding(data: unknown): DogfoodingBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DogfoodingBlueprint;
}

function parseEngagementSummary(data: unknown): TrustEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustEngagementSummary;
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parseStringArray(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseCompanionReliability(data: unknown): CompanionReliability | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionReliability;
}

function parseBoundaryPrinciples(data: unknown): BoundaryPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BoundaryPrinciples;
}

function parseOrganizationalTrust(data: unknown): OrganizationalTrust | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OrganizationalTrust;
}

function parseTrustInsightQuestions(data: unknown): TrustInsightQuestion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as TrustInsightQuestion[];
}

function parseEarlyWarningSignals(data: unknown): EarlyWarningSignal[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as EarlyWarningSignal[];
}

function parseRecognitionTypes(data: unknown): RecognitionTypesBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as RecognitionTypesBlueprint;
}

function parseCompanionResponsibilities(data: unknown): CompanionResponsibilities | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionResponsibilities;
}

function parseGrowthPartnerTrustModel(data: unknown): GrowthPartnerTrustModel | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GrowthPartnerTrustModel;
}

export function parseTrustReputationEngineCard(data: unknown): TrustReputationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    active_profiles: typeof d.active_profiles === "number" ? d.active_profiles : undefined,
    trusted_profiles: typeof d.trusted_profiles === "number" ? d.trusted_profiles : undefined,
    under_review_profiles:
      typeof d.under_review_profiles === "number" ? d.under_review_profiles : undefined,
    avg_trust_score: typeof d.avg_trust_score === "number" ? d.avg_trust_score : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    implementation_blueprint:
      typeof d.implementation_blueprint === "object" && d.implementation_blueprint
        ? (d.implementation_blueprint as TrustReputationEngineCard["implementation_blueprint"])
        : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    ...d,
  } as TrustReputationEngineCard;
}

export function parseTrustReputationEngineDashboard(
  data: unknown
): TrustReputationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: parseStringArray(d.principles),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    trust_relationship_note:
      typeof d.trust_relationship_note === "string" ? d.trust_relationship_note : undefined,
    companion_relationship_trust_note:
      typeof d.companion_relationship_trust_note === "string"
        ? d.companion_relationship_trust_note
        : undefined,
    trust_reputation_relationship_note:
      typeof d.trust_reputation_relationship_note === "string"
        ? d.trust_reputation_relationship_note
        : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    implementation_blueprint:
      typeof d.implementation_blueprint === "object" && d.implementation_blueprint
        ? (d.implementation_blueprint as TrustReputationEngineDashboard["implementation_blueprint"])
        : undefined,
    relationship_objectives: parseRelationshipObjectives(d.relationship_objectives),
    relationship_principles: parseRelationshipPrinciples(d.relationship_principles),
    example_phrases: parseExamplePhrases(d.example_phrases),
    trust_signals: parseTrustSignals(d.trust_signals),
    companion_examples: parseCompanionExamples(d.companion_examples),
    blueprint_boundaries: parseBlueprintBoundaries(d.blueprint_boundaries),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    dogfooding: parseDogfooding(d.dogfooding),
    blueprint_integration_links: parseIntegrationLinks(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    implementation_blueprint_phase26:
      typeof d.implementation_blueprint_phase26 === "object" && d.implementation_blueprint_phase26
        ? (d.implementation_blueprint_phase26 as TrustReputationEngineDashboard["implementation_blueprint_phase26"])
        : undefined,
    implementation_blueprint_phase57:
      typeof d.implementation_blueprint_phase57 === "object" && d.implementation_blueprint_phase57
        ? (d.implementation_blueprint_phase57 as TrustReputationEngineDashboard["implementation_blueprint_phase57"])
        : undefined,
    companion_objectives: parseRelationshipObjectives(d.companion_objectives),
    trust_principles: parseRelationshipPrinciples(d.trust_principles),
    avoid_practices: parseStringArray(d.avoid_practices),
    relationship_continuity: parseCompanionExamples(d.relationship_continuity),
    companion_reliability: parseCompanionReliability(d.companion_reliability),
    companion_self_love: parseSelfLoveConnection(d.companion_self_love),
    boundary_principles: parseBoundaryPrinciples(d.boundary_principles),
    trust_signal_indicators: parseTrustSignals(d.trust_signal_indicators),
    organizational_trust: parseOrganizationalTrust(d.organizational_trust),
    dogfooding_phase57: parseDogfooding(d.dogfooding_phase57),
    companion_integration_links: parseIntegrationLinks(d.companion_integration_links),
    companion_success_criteria: parseSuccessCriteria(d.companion_success_criteria),
    companion_vision_phrases: parseStringArray(d.companion_vision_phrases),
    phase116_objectives: parseRelationshipObjectives(d.phase116_objectives),
    trust_framework_dimensions: parseRelationshipObjectives(d.trust_framework_dimensions),
    relationship_health_categories: parseRelationshipObjectives(d.relationship_health_categories),
    reputation_profile_types: parseRelationshipObjectives(d.reputation_profile_types),
    trust_insights_questions: parseTrustInsightQuestions(d.trust_insights_questions),
    early_warning_signals: parseEarlyWarningSignals(d.early_warning_signals),
    recognition_types: parseRecognitionTypes(d.recognition_types),
    trust_recovery_framework: parseRelationshipObjectives(d.trust_recovery_framework),
    companion_responsibilities: parseCompanionResponsibilities(d.companion_responsibilities),
    growth_partner_trust_model: parseGrowthPartnerTrustModel(d.growth_partner_trust_model),
    enterprise_trust_governance: parseRelationshipObjectives(d.enterprise_trust_governance),
    privacy_ethics_principles: parseRelationshipPrinciples(d.privacy_ethics_principles),
    self_love_in_relationships: parseSelfLoveConnection(d.self_love_in_relationships),
    phase116_integration_links: parseIntegrationLinks(d.phase116_integration_links),
    limitation_principles: parseStringArray(d.limitation_principles),
    companion_adaptation: parseCompanionExamples(d.companion_adaptation),
    phase116_success_metrics: parseRelationshipObjectives(d.phase116_success_metrics),
    phase116_success_criteria: parseSuccessCriteria(d.phase116_success_criteria),
    ...d,
  } as TrustReputationEngineDashboard;
}

export function parseTrustReputationExport(data: unknown): TrustReputationExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    profiles: parseRecordList<OrganizationTrustProfile>(d.profiles),
    recent_signals: parseRecordList<OrganizationTrustSignal>(d.recent_signals),
    outcomes: parseRecordList<OrganizationTrustOutcome>(d.outcomes),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as TrustReputationExport;
}
