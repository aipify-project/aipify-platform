import type {
  AbosSuccessCriterion,
  ApiCategories,
  ApiPlatformEngagementSummary,
  ApiPlatformEngineCard,
  ApiPlatformEngineDashboard,
  DeveloperExperience,
  DeveloperObjective,
  IntegrationLink,
  SecurityPrinciple,
  TrustConnectionBlueprint,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseApiCategories(data: unknown): ApiCategories | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ApiCategories;
}

function parseDeveloperExperience(data: unknown): DeveloperExperience | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DeveloperExperience;
}

function parseTrustConnection(data: unknown): TrustConnectionBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnectionBlueprint;
}

function parseEngagementSummary(data: unknown): ApiPlatformEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ApiPlatformEngagementSummary;
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

export function parseApiPlatformEngineDashboard(data: unknown): ApiPlatformEngineDashboard {
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
    api_keys: parseRecordList(d.api_keys),
    webhooks: parseRecordList(d.webhooks),
    recent_audit: parseRecordList(d.recent_audit),
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    developer_objectives: parseRecordList<DeveloperObjective>(d.developer_objectives),
    api_categories: parseApiCategories(d.api_categories),
    developer_experience: parseDeveloperExperience(d.developer_experience),
    security_principles: parseRecordList<SecurityPrinciple>(d.security_principles),
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

export function parseApiPlatformEngineCard(data: unknown): ApiPlatformEngineCard {
  if (typeof data !== "object" || !data) {
    return { has_organization: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_keys: typeof d.active_keys === "number" ? d.active_keys : undefined,
    active_webhooks: typeof d.active_webhooks === "number" ? d.active_webhooks : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    blueprint_phase: typeof d.blueprint_phase === "number" ? d.blueprint_phase : undefined,
    engine_phase: typeof d.engine_phase === "string" ? d.engine_phase : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
  };
}
