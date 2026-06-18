export type HealthScore = {
  id?: string;
  score_key?: string;
  score_domain?: string;
  score_value?: number;
  trend_direction?: string;
  [key: string]: unknown;
};

export type CommandModule = {
  id?: string;
  module_key?: string;
  module_name?: string;
  module_type?: string;
  status?: string;
  health_score?: number;
  summary_metrics?: Record<string, unknown>;
  route_path?: string;
  [key: string]: unknown;
};

export type MissionFeedEvent = {
  id?: string;
  event_key?: string;
  event_type?: string;
  event_title?: string;
  event_summary?: string;
  severity?: string;
  source_module?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type AttentionItem = {
  id?: string;
  item_key?: string;
  item_title?: string;
  attention_type?: string;
  priority?: string;
  status?: string;
  recommendation?: string;
  [key: string]: unknown;
};

export type MissionBriefing = {
  id?: string;
  briefing_key?: string;
  briefing_title?: string;
  briefing_period?: string;
  executive_summary?: string;
  recommended_actions?: unknown;
  generated_at?: string;
  [key: string]: unknown;
};

export type IntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type CommandAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type EnterpriseCommandCenterMissionControl = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  strategic_intelligence_route?: string;
  presence_route?: string;
  executive_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  health_scores?: HealthScore[];
  command_modules?: CommandModule[];
  mission_feed?: MissionFeedEvent[];
  attention_items?: AttentionItem[];
  briefings?: MissionBriefing[];
  intelligence_signals?: IntelligenceSignal[];
  advisor_signals?: CommandAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  boardroom_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
