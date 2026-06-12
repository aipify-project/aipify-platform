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
