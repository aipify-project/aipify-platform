import type {
  EcosystemIntelligenceCard,
  EcosystemIntelligenceDashboard,
  EcosystemBriefingResult,
  EcosystemIntelligenceExternalRelationshipBlueprint,
  ImplementationBlueprint,
  BlueprintObjective,
  BlueprintGuidanceBlock,
  BlueprintPrincipleBlock,
  SelfLoveConnection,
  TrustConnection,
  AbosSuccessCriterion,
  IntegrationLink,
  EcosystemBlueprintEngagementSummary,
} from "./types";

function asObject(data: unknown): Record<string, unknown> | undefined {
  return typeof data === "object" && data !== null ? (data as Record<string, unknown>) : undefined;
}

function parseImplementationBlueprint(data: unknown): ImplementationBlueprint | undefined {
  const d = asObject(data);
  if (!d) return undefined;
  return {
    phase: d.phase as string | undefined,
    doc: d.doc as string | undefined,
    engine_phase: d.engine_phase as string | undefined,
    route: d.route as string | undefined,
    mapping_note: d.mapping_note as string | undefined,
  };
}

function parseObjectives(data: unknown): BlueprintObjective[] {
  return Array.isArray(data) ? (data as BlueprintObjective[]) : [];
}

function parseGuidanceBlock(data: unknown): BlueprintGuidanceBlock | undefined {
  const d = asObject(data);
  if (!d) return undefined;
  return d as BlueprintGuidanceBlock;
}

function parsePrincipleBlock(data: unknown): BlueprintPrincipleBlock | undefined {
  const d = asObject(data);
  if (!d) return undefined;
  return d as BlueprintPrincipleBlock;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  const d = asObject(data);
  if (!d) return undefined;
  return d as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  const d = asObject(data);
  if (!d) return undefined;
  return d as TrustConnection;
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] {
  return Array.isArray(data) ? (data as AbosSuccessCriterion[]) : [];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] {
  return Array.isArray(data) ? (data as IntegrationLink[]) : [];
}

function parseEngagementSummary(data: unknown): EcosystemBlueprintEngagementSummary | undefined {
  const d = asObject(data);
  if (!d) return undefined;
  return d as EcosystemBlueprintEngagementSummary;
}

function parseBlueprintBlock(data: unknown): EcosystemIntelligenceExternalRelationshipBlueprint | undefined {
  const d = asObject(data);
  if (!d) return undefined;
  return {
    implementation_blueprint_phase88: parseImplementationBlueprint(d.implementation_blueprint_phase88),
    ecosystem_intelligence_external_relationship_note: d.ecosystem_intelligence_external_relationship_note as string | undefined,
    distinction_note: d.distinction_note as string | undefined,
    mission: d.mission as string | undefined,
    philosophy: d.philosophy as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    vision: d.vision as string | undefined,
    objectives: parseObjectives(d.objectives),
    blueprint_relationship_categories: parseGuidanceBlock(d.blueprint_relationship_categories),
    relationship_insights: parseGuidanceBlock(d.relationship_insights),
    partnership_health: parseGuidanceBlock(d.partnership_health),
    customer_relationship_intelligence: parseGuidanceBlock(d.customer_relationship_intelligence),
    community_connection: parseGuidanceBlock(d.community_connection),
    companion_guidance: parseGuidanceBlock(d.companion_guidance),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    leadership_insights: parseGuidanceBlock(d.leadership_insights),
    trust_connection: parseTrustConnection(d.trust_connection),
    limitation_principles: parsePrincipleBlock(d.limitation_principles),
    dogfooding: asObject(d.dogfooding),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : [],
    integration_links: parseIntegrationLinks(d.integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseEcosystemIntelligenceCard(data: unknown): EcosystemIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    ecosystem_score: d.ecosystem_score as number | undefined,
    ecosystem_band: d.ecosystem_band as string | undefined,
    ecosystem_band_label: d.ecosystem_band_label as string | undefined,
    open_risks: d.open_risks as number | undefined,
    philosophy: d.philosophy as string | undefined,
    consent_required: d.consent_required as boolean | undefined,
    implementation_blueprint_phase88: parseImplementationBlueprint(d.implementation_blueprint_phase88),
    blueprint_mission: d.blueprint_mission as string | undefined,
    blueprint_abos_principle: d.blueprint_abos_principle as string | undefined,
    blueprint_vision: d.blueprint_vision as string | undefined,
    stewardship_note: d.stewardship_note as string | undefined,
    blueprint_engagement_summary: parseEngagementSummary(d.blueprint_engagement_summary),
    blueprint_note: d.blueprint_note as string | undefined,
  };
}

export function parseEcosystemIntelligenceDashboard(data: unknown): EcosystemIntelligenceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    consent_required: d.consent_required as boolean | undefined,
    human_governance_required: d.human_governance_required as boolean | undefined,
    intelligence_enabled: d.intelligence_enabled as boolean | undefined,
    external_monitoring_consent: d.external_monitoring_consent as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    ecosystem_score: d.ecosystem_score as number | undefined,
    ecosystem_band: d.ecosystem_band as string | undefined,
    ecosystem_band_label: d.ecosystem_band_label as string | undefined,
    score_components: d.score_components as Record<string, number> | undefined,
    dependency_score: d.dependency_score as number | undefined,
    resilience_score: d.resilience_score as number | undefined,
    partner_score: d.partner_score as number | undefined,
    relationships: Array.isArray(d.relationships)
      ? (d.relationships as EcosystemIntelligenceDashboard["relationships"])
      : [],
    critical_dependencies: Array.isArray(d.critical_dependencies)
      ? (d.critical_dependencies as EcosystemIntelligenceDashboard["critical_dependencies"])
      : [],
    external_risks: Array.isArray(d.external_risks)
      ? (d.external_risks as EcosystemIntelligenceDashboard["external_risks"])
      : [],
    partnership_opportunities: Array.isArray(d.partnership_opportunities)
      ? (d.partnership_opportunities as EcosystemIntelligenceDashboard["partnership_opportunities"])
      : [],
    briefings: Array.isArray(d.briefings)
      ? (d.briefings as EcosystemIntelligenceDashboard["briefings"])
      : [],
    relationship_categories: Array.isArray(d.relationship_categories)
      ? (d.relationship_categories as EcosystemIntelligenceDashboard["relationship_categories"])
      : [],
    review_frequencies: Array.isArray(d.review_frequencies)
      ? (d.review_frequencies as EcosystemIntelligenceDashboard["review_frequencies"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
    ecosystem_intelligence_external_relationship_blueprint: parseBlueprintBlock(
      d.ecosystem_intelligence_external_relationship_blueprint
    ),
  };
}

export function parseEcosystemBriefingResult(data: unknown): EcosystemBriefingResult {
  return (data ?? {}) as EcosystemBriefingResult;
}
