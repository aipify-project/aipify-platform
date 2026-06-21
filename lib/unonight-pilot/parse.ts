import type {
  PilotDataSourceSummary,
  PilotShadowRecommendation,
  PilotSyncRunSummary,
  UnonightPilotCommandBrief,
  UnonightPilotHealthDashboard,
  UnonightPilotSettings,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function parseSettings(raw: unknown): UnonightPilotSettings | undefined {
  const row = asRecord(raw);
  if (!row) return undefined;
  return {
    pilot_mode: String(row.pilot_mode ?? "unonight_read_only") as UnonightPilotSettings["pilot_mode"],
    enabled: Boolean(row.enabled),
    read_only: Boolean(row.read_only),
    shadow_mode: Boolean(row.shadow_mode),
    health_state: String(row.health_state ?? "disabled") as UnonightPilotSettings["health_state"],
    kill_switch: Boolean(row.kill_switch),
    last_successful_sync: row.last_successful_sync ? String(row.last_successful_sync) : null,
    last_discovery_run: row.last_discovery_run ? String(row.last_discovery_run) : null,
    approved_at: row.approved_at ? String(row.approved_at) : null,
  };
}

function parseDataSources(raw: unknown): PilotDataSourceSummary[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = asRecord(item) ?? {};
    return {
      source_key: String(row.source_key ?? ""),
      display_name: String(row.display_name ?? ""),
      allowed: Boolean(row.allowed),
      sync_status: String(row.sync_status ?? "idle") as PilotDataSourceSummary["sync_status"],
      last_sync_at: row.last_sync_at ? String(row.last_sync_at) : null,
      last_error: row.last_error ? String(row.last_error) : null,
      denied_fields_count: typeof row.denied_fields_count === "number" ? row.denied_fields_count : undefined,
      freshness_state: row.freshness_state as PilotDataSourceSummary["freshness_state"],
    };
  });
}

function parseSyncRuns(raw: unknown): PilotSyncRunSummary[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = asRecord(item) ?? {};
    return {
      id: String(row.id ?? ""),
      source_key: String(row.source_key ?? ""),
      run_type: String(row.run_type ?? ""),
      status: String(row.status ?? ""),
      records_ingested: Number(row.records_ingested ?? 0),
      records_skipped: Number(row.records_skipped ?? 0),
      denied_field_hits: Number(row.denied_field_hits ?? 0),
      started_at: String(row.started_at ?? ""),
      completed_at: row.completed_at ? String(row.completed_at) : null,
      error_message: row.error_message ? String(row.error_message) : null,
    };
  });
}

export function parseUnonightPilotHealthDashboard(data: unknown): UnonightPilotHealthDashboard {
  const row = asRecord(data);
  if (!row) return { found: false };
  return {
    found: Boolean(row.found),
    organization_id: row.organization_id ? String(row.organization_id) : undefined,
    reason: row.reason ? String(row.reason) : undefined,
    settings: parseSettings(row.settings),
    data_sources: parseDataSources(row.data_sources),
    recent_sync_runs: parseSyncRuns(row.recent_sync_runs),
    discovery_reports: Array.isArray(row.discovery_reports)
      ? row.discovery_reports.map((item) => {
          const d = asRecord(item) ?? {};
          return {
            report_key: String(d.report_key ?? ""),
            status: String(d.status ?? ""),
            sources_detected: d.sources_detected,
            aggregate_metrics: asRecord(d.aggregate_metrics) ?? {},
            created_at: String(d.created_at ?? ""),
          };
        })
      : [],
    shadow_recommendations_prepared:
      typeof row.shadow_recommendations_prepared === "number"
        ? row.shadow_recommendations_prepared
        : undefined,
    audit_logs: Array.isArray(row.audit_logs)
      ? row.audit_logs.map((item) => {
          const a = asRecord(item) ?? {};
          return {
            action: String(a.action ?? ""),
            actor_type: String(a.actor_type ?? ""),
            created_at: String(a.created_at ?? ""),
            details: asRecord(a.details) ?? {},
          };
        })
      : [],
    privacy_note: row.privacy_note ? String(row.privacy_note) : undefined,
  };
}

export function parseUnonightPilotCommandBrief(data: unknown): UnonightPilotCommandBrief {
  const row = asRecord(data);
  if (!row) return { found: false };
  return {
    found: Boolean(row.found),
    pilot_active: row.pilot_active !== undefined ? Boolean(row.pilot_active) : undefined,
    read_only: row.read_only !== undefined ? Boolean(row.read_only) : undefined,
    shadow_mode: row.shadow_mode !== undefined ? Boolean(row.shadow_mode) : undefined,
    health_state: row.health_state as UnonightPilotCommandBrief["health_state"],
    kill_switch: row.kill_switch !== undefined ? Boolean(row.kill_switch) : undefined,
    last_successful_sync: row.last_successful_sync ? String(row.last_successful_sync) : null,
    last_discovery_run: row.last_discovery_run ? String(row.last_discovery_run) : null,
    data_sources: parseDataSources(row.data_sources),
    shadow_recommendations: Array.isArray(row.shadow_recommendations)
      ? row.shadow_recommendations.map((item) => {
          const r = asRecord(item) ?? {};
          return {
            id: String(r.id ?? ""),
            title: String(r.title ?? ""),
            summary: String(r.summary ?? ""),
            confidence: String(r.confidence ?? "moderate") as PilotShadowRecommendation["confidence"],
            prepared_at: String(r.prepared_at ?? ""),
            label_key: String(r.label_key ?? "customerApp.unonightPilot621.shadowRecommendationPrepared"),
            executed: false,
          };
        })
      : [],
    recent_signals: Array.isArray(row.recent_signals)
      ? row.recent_signals.map((item) => {
          const s = asRecord(item) ?? {};
          return {
            signal_type: String(s.signal_type ?? ""),
            title: String(s.title ?? ""),
            summary: s.summary ? String(s.summary) : null,
            observed_at: String(s.observed_at ?? ""),
            metrics: asRecord(s.metrics) ?? {},
          };
        })
      : [],
    since_last_login_mode: row.since_last_login_mode as UnonightPilotCommandBrief["since_last_login_mode"],
    principle: row.principle ? String(row.principle) : undefined,
    reason: row.reason ? String(row.reason) : undefined,
  };
}
