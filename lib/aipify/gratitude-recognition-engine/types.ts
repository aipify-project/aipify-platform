export type GratitudeMomentTypeInfo = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type RedRoseExchangeLine = {
  role?: string;
  text?: string;
  [key: string]: unknown;
};

export type RedRoseMoment = {
  trigger_phrase?: string;
  example_exchange?: RedRoseExchangeLine[];
  feature_description?: string;
  digital_rose_symbol?: string;
  [key: string]: unknown;
};

export type BoundaryPhrases = {
  avoid?: string[] | unknown[];
  prefer?: string[] | unknown[];
  [key: string]: unknown;
};

export type GratitudeMoment = {
  id?: string;
  moment_type?: string;
  summary?: string;
  recognition_target_role?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type RecentRosesSummary = {
  count?: number;
  last_sent_at?: string | null;
  [key: string]: unknown;
};

export type SuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
  [key: string]: unknown;
};

export type RecognitionCategory = {
  key?: string;
  label?: string;
  focus?: string[];
  moment_type_keys?: string[];
  examples?: string[];
  [key: string]: unknown;
};

export type BellMomentsBlueprint = {
  emoji?: string;
  label?: string;
  principle?: string;
  frequency_note?: string;
  examples?: Array<{ key?: string; text?: string; [key: string]: unknown }>;
  disabled_when?: string[];
  [key: string]: unknown;
};

export type RecognitionRosesBlueprint = {
  emoji?: string;
  label?: string;
  principle?: string;
  boundary_note?: string;
  examples?: Array<{ key?: string; text?: string; [key: string]: unknown }>;
  digital_rose_symbol?: string;
  [key: string]: unknown;
};

export type SelfRecognitionBlueprint = {
  principle?: string;
  examples?: string[];
  target_role?: string;
  self_love_note?: string;
  [key: string]: unknown;
};

export type SelfLoveConnection = {
  principle?: string;
  not_a_toggle?: boolean;
  influences?: string[];
  naming_doc?: string;
  boundary_note?: string;
  [key: string]: unknown;
};

export type TrustConnection = {
  principle?: string;
  prefer?: string[];
  avoid?: string[];
  audit_note?: string;
  [key: string]: unknown;
};

export type OrgConfigurationBoundaries = {
  configurable?: Array<{ key?: string; label?: string; via?: string; [key: string]: unknown }>;
  consistent?: string[];
  boundary_note?: string;
  [key: string]: unknown;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  [key: string]: unknown;
};

export type GratitudeRecognitionSettings = {
  organization_id?: string;
  enabled?: boolean;
  digital_rose_enabled?: boolean;
  gratitude_moments_enabled?: boolean;
  redirect_romantic_language?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type GratitudeRecognitionCard = {
  has_organization: boolean;
  philosophy?: string;
  moment_count?: number;
  rose_count?: number;
  pending_moments?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type GratitudeRecognitionDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  gratitude_recognition_engine_note?: string;
  recognition_categories?: RecognitionCategory[];
  bell_moments?: BellMomentsBlueprint;
  recognition_roses?: RecognitionRosesBlueprint;
  self_recognition?: SelfRecognitionBlueprint;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  org_configuration_boundaries?: OrgConfigurationBoundaries;
  dogfooding?: Record<string, unknown>;
  success_criteria?: SuccessCriterion[];
  vision_phrases?: string[];
  gratitude_moment_types?: GratitudeMomentTypeInfo[];
  red_rose_moment?: RedRoseMoment;
  boundary_phrases?: BoundaryPhrases;
  self_love_note?: string;
  trust_note?: string;
  settings?: GratitudeRecognitionSettings;
  recent_moments?: GratitudeMoment[];
  recent_roses?: RecentRosesSummary;
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type GratitudeRecognitionExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  gratitude_moment_types?: GratitudeMomentTypeInfo[];
  red_rose_moment?: RedRoseMoment;
  boundary_phrases?: BoundaryPhrases;
  self_love_note?: string;
  trust_note?: string;
  settings?: GratitudeRecognitionSettings;
  recent_moments?: GratitudeMoment[];
  recent_roses?: RecentRosesSummary;
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type DigitalRoseResult = {
  success?: boolean;
  rose_id?: string;
  recipient_display_label?: string;
  message_summary?: string;
  rose_sent_at?: string;
  [key: string]: unknown;
};
