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

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationBlueprint = {
  phase?: number;
  title?: string;
  extends?: string;
  includes?: string;
  distinct_from?: string;
  doc?: string;
};

export type InterventionScenario = {
  label?: string;
  triggers?: string[];
  examples?: string[];
};

export type InterventionScenarios = {
  communication?: InterventionScenario;
  decision?: InterventionScenario;
  operational?: InterventionScenario;
};

export type CommunicationExample = {
  emoji?: string;
  category?: string;
  example?: string;
};

export type SleepOnItPrinciple = {
  principle?: string;
  practices?: string[];
  note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  examples?: string[];
  route?: string;
  phase?: string;
  boundary?: string;
};

export type TrustConnection = {
  principle?: string;
  qualities?: string[];
  metadata_only?: boolean;
  autonomy_note?: string;
};

export type VisionPhrase = {
  emoji?: string;
  phrase?: string;
};

export type DogfoodingFocus = {
  slug?: string;
  role?: string;
  focus?: string[];
};

export type Dogfooding = {
  principle?: string;
  aipify_group?: DogfoodingFocus;
  unonight?: DogfoodingFocus;
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
  mission?: string;
  abos_principle?: string;
  signal_count?: number;
  postponed_count?: number;
  enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprint;
  wisdom_intervention_note?: string;
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
  implementation_blueprint?: ImplementationBlueprint;
  wisdom_intervention_note?: string;
  intervention_principles?: string[];
  intervention_scenarios?: InterventionScenarios;
  communication_examples?: CommunicationExample[];
  sleep_on_it_principle?: SleepOnItPrinciple;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  vision_phrases?: VisionPhrase[];
  dogfooding?: Dogfooding;
  success_criteria?: AbosSuccessCriterion[];
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
