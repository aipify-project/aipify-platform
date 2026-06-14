import type { DatabaseGovernanceCenter, MigrationRegistryEntry } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseMigration(raw: unknown): MigrationRegistryEntry {
  const row = asRecord(raw);
  return {
    migration_key: String(row.migration_key ?? ""),
    migration_id: String(row.migration_id ?? ""),
    migration_name: String(row.migration_name ?? ""),
    environment: String(row.environment ?? "production"),
    author: String(row.author ?? ""),
    reviewer: row.reviewer ? String(row.reviewer) : null,
    status: String(row.status ?? "pending"),
    risk_level: String(row.risk_level ?? "medium"),
    rollback_notes: row.rollback_notes ? String(row.rollback_notes) : null,
    recovery_notes: row.recovery_notes ? String(row.recovery_notes) : null,
    validation_guidance: row.validation_guidance ? String(row.validation_guidance) : null,
    created_at: row.created_at ? String(row.created_at) : null,
    applied_at: row.applied_at ? String(row.applied_at) : null,
  };
}

export function parseDatabaseGovernanceCenter(raw: unknown): DatabaseGovernanceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            pending_migrations: Number(dash.pending_migrations ?? 0),
            failed_migrations: Number(dash.failed_migrations ?? 0),
            applied_migrations: Number(dash.applied_migrations ?? 0),
            last_successful_migration: dash.last_successful_migration
              ? String(dash.last_successful_migration)
              : null,
            open_validation_findings: Number(dash.open_validation_findings ?? 0),
            open_drift_events: Number(dash.open_drift_events ?? 0),
            environment_consistency_score: Number(dash.environment_consistency_score ?? 0),
            database_health_score: Number(dash.database_health_score ?? 0),
            database_health_band: String(dash.database_health_band ?? "healthy"),
            migration_success_rate: Number(dash.migration_success_rate ?? 0),
            deployment_confidence: Number(dash.deployment_confidence ?? 0),
          }
        : null,
    migrations: Array.isArray(row.migrations) ? row.migrations.map(parseMigration) : [],
    validation_findings: Array.isArray(row.validation_findings)
      ? row.validation_findings.map((f) => {
          const item = asRecord(f);
          return {
            finding_key: String(item.finding_key ?? ""),
            finding_type: String(item.finding_type ?? ""),
            object_name: String(item.object_name ?? ""),
            message: String(item.message ?? ""),
            severity: String(item.severity ?? "medium"),
          };
        })
      : [],
    drift_events: Array.isArray(row.drift_events)
      ? row.drift_events.map((d) => {
          const item = asRecord(d);
          return {
            drift_key: String(item.drift_key ?? ""),
            environment: String(item.environment ?? ""),
            message: String(item.message ?? ""),
            severity: String(item.severity ?? "watch"),
            status: String(item.status ?? "open"),
          };
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    environment_comparisons: Array.isArray(row.environment_comparisons)
      ? row.environment_comparisons.map((c) => {
          const item = asRecord(c);
          return {
            comparison_key: String(item.comparison_key ?? ""),
            environment_a: String(item.environment_a ?? ""),
            environment_b: String(item.environment_b ?? ""),
            migration_parity: String(item.migration_parity ?? "aligned"),
            schema_consistency: String(item.schema_consistency ?? "consistent"),
            version_alignment: String(item.version_alignment ?? "matched"),
            summary: String(item.summary ?? ""),
          };
        })
      : [],
    governance_reviews: Array.isArray(row.governance_reviews)
      ? row.governance_reviews.map((gr) => {
          const item = asRecord(gr);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            scheduled_for: item.scheduled_for ? String(item.scheduled_for) : null,
            completed_at: item.completed_at ? String(item.completed_at) : null,
          };
        })
      : [],
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
