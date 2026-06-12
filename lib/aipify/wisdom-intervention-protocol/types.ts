export type InterventionAppliesItem = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type ResponseStyleExample = {
  scenario?: string;
  example?: string;
  [key: string]: unknown;
};

export type SleepOnItExample = {
  theme?: string;
  example?: string;
  [key: string]: unknown;
};

export type InterventionBoundaries = {
  may?: string[] | unknown[];
  may_not?: string[] | unknown[];
  [key: string]: unknown;
};

export type SelfLoveRosePhrase = {
  phrase?: string;
  rose?: boolean;
  [key: string]: unknown;
};

export type WisdomInterventionPrompt = {
  id?: string;
  prompt_key?: string;
  message_template?: string;
  sleep_on_it?: boolean;
  status?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type WisdomInterventionSignal = {
  id?: string;
  signal_type?: string;
  summary?: string;
  suggested_intervention?: string;
  user_action?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type WisdomInterventionSettings = {
  organization_id?: string;
  enabled?: boolean;
  sleep_on_it_enabled?: boolean;
  late_night_nudge_enabled?: boolean;
  caps_aggression_detection_enabled?: boolean;
  user_autonomy_note?: string;
  optional_display_name_for_nudges?: string | null;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type RecentSummary = {
  signals_last_30_days?: number;
  postponed_or_revised?: number;
  dismissed?: number;
  [key: string]: unknown;
};

export type WisdomInterventionCard = {
  has_organization: boolean;
  philosophy?: string;
  signal_count?: number;
  postponed_count?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type WisdomInterventionDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  when_to_intervene?: InterventionAppliesItem[];
  response_style_examples?: ResponseStyleExample[];
  sleep_on_it_examples?: SleepOnItExample[];
  self_love_note?: string;
  wisdom_engine_note?: string;
  boundaries?: InterventionBoundaries;
  trust_note?: string;
  pause_reflection_philosophy?: string;
  human_moment_note?: string;
  pause_communication_examples?: ResponseStyleExample[];
  self_love_rose_phrases?: SelfLoveRosePhrase[];
  pause_abos_principle?: string;
  combined_protocol_note?: string;
  settings?: WisdomInterventionSettings;
  active_prompts?: WisdomInterventionPrompt[];
  recent_signals?: WisdomInterventionSignal[];
  recent_summary?: RecentSummary;
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type WisdomInterventionExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  when_to_intervene?: InterventionAppliesItem[];
  response_style_examples?: ResponseStyleExample[];
  sleep_on_it_examples?: SleepOnItExample[];
  self_love_note?: string;
  wisdom_engine_note?: string;
  boundaries?: InterventionBoundaries;
  trust_note?: string;
  pause_reflection_philosophy?: string;
  human_moment_note?: string;
  pause_communication_examples?: ResponseStyleExample[];
  self_love_rose_phrases?: SelfLoveRosePhrase[];
  pause_abos_principle?: string;
  combined_protocol_note?: string;
  settings?: WisdomInterventionSettings;
  recent_signals?: WisdomInterventionSignal[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type WisdomInterventionOutcome = {
  success?: boolean;
  signal_id?: string;
  signal_type?: string;
  user_action?: string | null;
  [key: string]: unknown;
};

export type WisdomInterventionSuggestion = {
  enabled?: boolean;
  blocking?: boolean;
  skipped?: boolean;
  reason?: string;
  signal_type?: string | null;
  prompt_key?: string;
  sleep_on_it?: boolean;
  message?: string | null;
  user_autonomy_note?: string;
  may_proceed?: boolean;
  [key: string]: unknown;
};
