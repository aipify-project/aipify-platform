import type {
  AbosSuccessCriterion,
  BlueprintBoundaries,
  CompanionExample,
  DogfoodingBlueprint,
  ExamplePhrase,
  IntegrationLink,
  OrganizationTrustOutcome,
  OrganizationTrustProfile,
  OrganizationTrustSignal,
  RelationshipObjective,
  RelationshipPrinciple,
  SelfLoveConnection,
  TrustEngagementSummary,
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
