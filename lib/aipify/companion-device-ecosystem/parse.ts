import type {
  CompanionDeviceEcosystemCard,
  CompanionDeviceEcosystemDashboard,
  ContinuityExample,
  DeviceRoadmapPhase,
  EcosystemObjective,
  EcosystemSummary,
  IntegrationLink,
  SelfLoveConnection,
  SuccessCriterion,
  TrustConnection,
  VoiceCompanionPrinciples,
  WearableExperiences,
} from "./types";

function parseList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseObject<T extends Record<string, unknown>>(data: unknown): T | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as T;
}

export function parseCompanionDeviceEcosystemDashboard(
  data: unknown
): CompanionDeviceEcosystemDashboard {
  if (typeof data !== "object" || !data) {
    return { has_organization: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    implementation_blueprint_phase36: parseObject(d.implementation_blueprint_phase36),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    objectives: parseList<EcosystemObjective>(d.objectives),
    device_priority_roadmap: parseList<DeviceRoadmapPhase>(d.device_priority_roadmap),
    companion_continuity: parseList<ContinuityExample>(d.companion_continuity),
    voice_companion_principles: parseObject<VoiceCompanionPrinciples>(d.voice_companion_principles),
    wearable_experiences: parseObject<WearableExperiences>(d.wearable_experiences),
    device_self_love_connection: parseObject<SelfLoveConnection>(d.device_self_love_connection),
    device_trust_connection: parseObject<TrustConnection>(d.device_trust_connection),
    device_dogfooding: parseObject(d.device_dogfooding),
    device_success_criteria: parseList<SuccessCriterion>(d.device_success_criteria),
    device_vision_phrases: Array.isArray(d.device_vision_phrases)
      ? (d.device_vision_phrases as string[])
      : undefined,
    device_abos_principle:
      typeof d.device_abos_principle === "string" ? d.device_abos_principle : undefined,
    device_distinction_note:
      typeof d.device_distinction_note === "string" ? d.device_distinction_note : undefined,
    device_integration_links: parseList<IntegrationLink>(d.device_integration_links),
    ecosystem_summary: parseObject<EcosystemSummary>(d.ecosystem_summary),
    settings: parseObject(d.settings),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}

export function parseCompanionDeviceEcosystemCard(data: unknown): CompanionDeviceEcosystemCard {
  if (typeof data !== "object" || !data) {
    return { has_organization: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    blueprint_phase: typeof d.blueprint_phase === "number" ? d.blueprint_phase : undefined,
    engine_phase: typeof d.engine_phase === "string" ? d.engine_phase : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
    connected_devices: typeof d.connected_devices === "number" ? d.connected_devices : undefined,
    online_devices: typeof d.online_devices === "number" ? d.online_devices : undefined,
    continuity_enabled:
      typeof d.continuity_enabled === "boolean" ? d.continuity_enabled : undefined,
    enabled: typeof d.enabled === "boolean" ? d.enabled : undefined,
  };
}
