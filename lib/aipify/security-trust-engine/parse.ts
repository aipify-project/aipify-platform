import type {
  AbosSuccessCriterion,
  AccessPrinciple,
  CompanionExample,
  IntegrationLink,
  ResilienceObjective,
  SecurityEngagementSummary,
  SecurityObjective,
  SecurityTrustEngineCard,
  SecurityTrustEngineDashboard,
  SelfLoveConnection,
  TrustConnectionBlueprint,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnectionBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnectionBlueprint;
}

function parseEngagementSummary(data: unknown): SecurityEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SecurityEngagementSummary;
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

export function parseSecurityTrustEngineDashboard(data: unknown): SecurityTrustEngineDashboard {
  if (typeof data !== "object" || !data) {
    return { has_organization: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    policies: parseRecordList(d.policies),
    access_reviews: parseRecordList(d.access_reviews),
    compliance_checks: parseRecordList(d.compliance_checks),
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    security_objectives: parseRecordList<SecurityObjective>(d.security_objectives),
    resilience_objectives: parseRecordList<ResilienceObjective>(d.resilience_objectives),
    access_principles: parseRecordList<AccessPrinciple>(d.access_principles),
    companion_examples: parseRecordList<CompanionExample>(d.companion_examples),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    trust_connection_blueprint: parseTrustConnection(d.trust_connection_blueprint),
    dogfooding_blueprint:
      typeof d.dogfooding_blueprint === "object" && d.dogfooding_blueprint
        ? (d.dogfooding_blueprint as Record<string, unknown>)
        : undefined,
    blueprint_integration_links: parseRecordList<IntegrationLink>(d.blueprint_integration_links),
    blueprint_vision_phrases: Array.isArray(d.blueprint_vision_phrases)
      ? (d.blueprint_vision_phrases as string[])
      : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_success_criteria: parseSuccessCriteria(d.blueprint_success_criteria),
    implementation_blueprint:
      typeof d.implementation_blueprint === "object" && d.implementation_blueprint
        ? (d.implementation_blueprint as Record<string, unknown>)
        : undefined,
  };
}

export function parseSecurityTrustEngineCard(data: unknown): SecurityTrustEngineCard {
  if (typeof data !== "object" || !data) {
    return { has_organization: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    compliance_score: typeof d.compliance_score === "number" ? d.compliance_score : undefined,
    pending_reviews: typeof d.pending_reviews === "number" ? d.pending_reviews : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    blueprint_phase: typeof d.blueprint_phase === "number" ? d.blueprint_phase : undefined,
    engine_phase: typeof d.engine_phase === "string" ? d.engine_phase : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
  };
}
