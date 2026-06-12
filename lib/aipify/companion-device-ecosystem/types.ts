export type DeviceRoadmapPhase = {
  phase?: number;
  key?: string;
  label?: string;
  status?: string;
  description?: string;
  routes?: string[];
};

export type EcosystemObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type ContinuityExample = {
  emoji?: string;
  key?: string;
  example?: string;
};

export type VoiceCompanionPrinciples = {
  status?: string;
  principles?: string[];
  example_phrases?: string[];
};

export type WearableExperiences = {
  status?: string;
  experiences?: Array<{ key?: string; label?: string; description?: string }>;
  boundary?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  route?: string;
  phase?: string;
  boundary?: string;
};

export type TrustConnection = {
  principle?: string;
  organizations_should_understand?: string[];
  metadata_only?: boolean;
  transparency_note?: string;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  description?: string;
};

export type SuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type EcosystemSummary = {
  connected_devices?: number;
  online_devices?: number;
  continuity_enabled?: boolean;
  wearable_notifications?: boolean;
  voice_enabled?: boolean;
  desktop_ready?: boolean;
  mobile_ready?: boolean;
  tablet_scaffold?: boolean;
  emerging_scaffold?: boolean;
  companion_presence_source?: boolean;
  privacy_note?: string;
};

export type CompanionDeviceEcosystemCard = {
  has_organization: boolean;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  blueprint_phase?: number;
  engine_phase?: string;
  route?: string;
  connected_devices?: number;
  online_devices?: number;
  continuity_enabled?: boolean;
  enabled?: boolean;
  [key: string]: unknown;
};

export type CompanionDeviceEcosystemDashboard = {
  has_organization: boolean;
  implementation_blueprint_phase36?: Record<string, unknown>;
  mission?: string;
  philosophy?: string;
  objectives?: EcosystemObjective[];
  device_priority_roadmap?: DeviceRoadmapPhase[];
  companion_continuity?: ContinuityExample[];
  voice_companion_principles?: VoiceCompanionPrinciples;
  wearable_experiences?: WearableExperiences;
  device_self_love_connection?: SelfLoveConnection;
  device_trust_connection?: TrustConnection;
  device_dogfooding?: Record<string, unknown>;
  device_success_criteria?: SuccessCriterion[];
  device_vision_phrases?: string[];
  device_abos_principle?: string;
  device_distinction_note?: string;
  device_integration_links?: IntegrationLink[];
  ecosystem_summary?: EcosystemSummary;
  settings?: Record<string, unknown>;
  privacy_note?: string;
  [key: string]: unknown;
};
