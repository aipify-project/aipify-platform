import type { PilotHealthState, PilotMode, PilotSyncStatus } from "./constants";

export type UnonightPilotSettings = {
  pilot_mode: PilotMode;
  enabled: boolean;
  read_only: boolean;
  shadow_mode: boolean;
  health_state: PilotHealthState;
  kill_switch: boolean;
  last_successful_sync: string | null;
  last_discovery_run: string | null;
  approved_at: string | null;
};

export type PilotDataSourceSummary = {
  source_key: string;
  display_name: string;
  allowed: boolean;
  sync_status: PilotSyncStatus;
  last_sync_at: string | null;
  last_error: string | null;
  denied_fields_count?: number;
  freshness_state?: "unknown" | "fresh" | "stale" | "outdated";
};

export type PilotSyncRunSummary = {
  id: string;
  source_key: string;
  run_type: string;
  status: string;
  records_ingested: number;
  records_skipped: number;
  denied_field_hits: number;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
};

export type PilotShadowRecommendation = {
  id: string;
  title: string;
  summary: string;
  confidence: "low" | "moderate" | "high";
  prepared_at: string;
  label_key: string;
  executed?: false;
};

export type PilotOrganizationSignal = {
  signal_type: string;
  title: string;
  summary: string | null;
  observed_at: string;
  metrics: Record<string, unknown>;
};

export type UnonightPilotHealthDashboard = {
  found: boolean;
  organization_id?: string;
  reason?: string;
  settings?: UnonightPilotSettings;
  data_sources?: PilotDataSourceSummary[];
  recent_sync_runs?: PilotSyncRunSummary[];
  discovery_reports?: Array<{
    report_key: string;
    status: string;
    sources_detected: unknown;
    aggregate_metrics: Record<string, unknown>;
    created_at: string;
  }>;
  shadow_recommendations_prepared?: number;
  audit_logs?: Array<{
    action: string;
    actor_type: string;
    created_at: string;
    details: Record<string, unknown>;
  }>;
  privacy_note?: string;
};

export type UnonightPilotCommandBrief = {
  found: boolean;
  pilot_active?: boolean;
  read_only?: boolean;
  shadow_mode?: boolean;
  health_state?: PilotHealthState;
  kill_switch?: boolean;
  last_successful_sync?: string | null;
  last_discovery_run?: string | null;
  data_sources?: PilotDataSourceSummary[];
  shadow_recommendations?: PilotShadowRecommendation[];
  recent_signals?: PilotOrganizationSignal[];
  since_last_login_mode?: "observed_by_aipify" | "completed_by_aipify";
  principle?: string;
  reason?: string;
};
