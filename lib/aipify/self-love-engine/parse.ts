import type {
  SelfLoveApplicationArea,
  SelfLoveCommunicationExample,
  SelfLoveEngineCard,
  SelfLoveEngineDashboard,
  SelfLoveOrgSettings,
  SelfLoveRecommendation,
  SelfLoveSuccessCriterion,
  SelfLoveUserPreferences,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseOrgSettings(data: unknown): SelfLoveOrgSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveOrgSettings;
}

function parseUserPreferences(data: unknown): SelfLoveUserPreferences | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveUserPreferences;
}

export function parseSelfLoveEngineCard(data: unknown): SelfLoveEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as SelfLoveEngineCard;
}

export function parseSelfLoveEngineDashboard(data: unknown): SelfLoveEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    application_areas: parseRecordList<SelfLoveApplicationArea>(d.application_areas),
    communication_examples: parseRecordList<SelfLoveCommunicationExample>(d.communication_examples),
    boundaries: Array.isArray(d.boundaries) ? (d.boundaries as string[]) : undefined,
    org_settings: parseOrgSettings(d.org_settings),
    user_preferences: parseUserPreferences(d.user_preferences),
    preference_summary:
      typeof d.preference_summary === "object" && d.preference_summary
        ? (d.preference_summary as Record<string, unknown>)
        : undefined,
    recent_recommendations: parseRecordList<SelfLoveRecommendation>(d.recent_recommendations),
    system_health_signals:
      typeof d.system_health_signals === "object" && d.system_health_signals
        ? (d.system_health_signals as Record<string, unknown>)
        : undefined,
    success_criteria: parseRecordList<SelfLoveSuccessCriterion>(d.success_criteria),
    dogfooding:
      typeof d.dogfooding === "object" && d.dogfooding
        ? (d.dogfooding as Record<string, unknown>)
        : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, unknown>)
        : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as SelfLoveEngineDashboard;
}

export function parseSelfLoveUserPreferences(data: unknown): SelfLoveUserPreferences {
  const d = (data ?? {}) as Record<string, unknown>;
  return parseUserPreferences(d) ?? (d as SelfLoveUserPreferences);
}
