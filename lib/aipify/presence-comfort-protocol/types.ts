export type ProtocolAppliesItem = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type ComfortRoseExample = {
  phrase?: string;
  intent?: string;
  rose?: boolean;
  [key: string]: unknown;
};

export type BoundaryPhrases = {
  avoid?: string[] | unknown[];
  prefer?: string[] | unknown[];
  [key: string]: unknown;
};

export type SelfLoveExample = {
  theme?: string;
  example?: string;
  [key: string]: unknown;
};

export type ComfortRoseMoment = {
  id?: string;
  moment_type?: string;
  comfort_message?: string;
  rose_used?: boolean;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type PresenceComfortSettings = {
  organization_id?: string;
  enabled?: boolean;
  comfort_roses_enabled?: boolean;
  encourage_human_connection?: boolean;
  protocol_sensitivity?: string;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type RecentSummary = {
  protocol_events_last_30_days?: number;
  comfort_roses_used?: number;
  human_connection_redirects?: number;
  [key: string]: unknown;
};

export type PresenceComfortCard = {
  has_organization: boolean;
  philosophy?: string;
  moment_count?: number;
  protocol_event_count?: number;
  pending_moments?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type PresenceComfortDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  when_protocol_applies?: ProtocolAppliesItem[];
  communication_principles?: string[];
  comfort_rose_examples?: ComfortRoseExample[];
  boundary_phrases?: BoundaryPhrases;
  self_love_examples?: SelfLoveExample[];
  human_connection_prompts?: string[];
  gratitude_recognition_note?: string;
  trust_note?: string;
  settings?: PresenceComfortSettings;
  recent_moments?: ComfortRoseMoment[];
  recent_summary?: RecentSummary;
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type PresenceComfortExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  when_protocol_applies?: ProtocolAppliesItem[];
  communication_principles?: string[];
  comfort_rose_examples?: ComfortRoseExample[];
  boundary_phrases?: BoundaryPhrases;
  self_love_examples?: SelfLoveExample[];
  human_connection_prompts?: string[];
  gratitude_recognition_note?: string;
  trust_note?: string;
  settings?: PresenceComfortSettings;
  recent_moments?: ComfortRoseMoment[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ComfortMomentResult = {
  success?: boolean;
  moment_id?: string;
  moment_type?: string;
  comfort_message?: string;
  rose_used?: boolean;
  [key: string]: unknown;
};
