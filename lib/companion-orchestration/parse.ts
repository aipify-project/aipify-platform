import type {
  CompanionOrchestrationCenter,
  CompanionRegistryEntry,
  OrchestrationConflict,
  OrchestrationEvent,
  OrchestrationHealthMetrics,
  OrchestrationResult,
  OrchestrationSettings,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseRegistryEntry(raw: unknown): CompanionRegistryEntry {
  const row = asRecord(raw);
  return {
    companion_key: String(row.companion_key ?? ""),
    display_label: String(row.display_label ?? ""),
    status: String(row.status ?? "enabled"),
    priority_level: Number(row.priority_level ?? 3),
    usage_count: Number(row.usage_count ?? 0),
    effectiveness_score: Number(row.effectiveness_score ?? 0),
    recommendation_acceptance_rate: Number(row.recommendation_acceptance_rate ?? 0),
    last_activated_at: row.last_activated_at ? String(row.last_activated_at) : null,
  };
}

function parseEvent(raw: unknown): OrchestrationEvent {
  const row = asRecord(raw);
  return {
    event_key: String(row.event_key ?? ""),
    request_summary: row.request_summary ? String(row.request_summary) : null,
    activated_companion_keys: Array.isArray(row.activated_companion_keys)
      ? row.activated_companion_keys.map(String)
      : [],
    coordinated_response: String(row.coordinated_response ?? ""),
    conflict_detected: Boolean(row.conflict_detected),
    conflict_resolution: row.conflict_resolution ? String(row.conflict_resolution) : null,
    priority_applied: row.priority_applied != null ? Number(row.priority_applied) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseConflict(raw: unknown): OrchestrationConflict {
  const row = asRecord(raw);
  return {
    conflict_key: String(row.conflict_key ?? ""),
    companion_a: String(row.companion_a ?? ""),
    companion_b: String(row.companion_b ?? ""),
    conflict_summary: String(row.conflict_summary ?? ""),
    resolution_status: String(row.resolution_status ?? ""),
    resolution_message: row.resolution_message ? String(row.resolution_message) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseSettings(raw: unknown): OrchestrationSettings | null {
  const row = asRecord(raw);
  if (Object.keys(row).length === 0) return null;
  return {
    orchestration_enabled: Boolean(row.orchestration_enabled ?? true),
    sensitivity: String(row.sensitivity ?? "balanced"),
    notification_level: String(row.notification_level ?? "important"),
    enterprise_policy_mode: String(row.enterprise_policy_mode ?? "tenant_controlled"),
  };
}

function parseHealthMetrics(raw: unknown): OrchestrationHealthMetrics | null {
  const row = asRecord(raw);
  if (Object.keys(row).length === 0) return null;
  return {
    active_companions: Number(row.active_companions ?? 0),
    total_companions: Number(row.total_companions ?? 0),
    orchestration_events_30d: Number(row.orchestration_events_30d ?? 0),
    conflicts_resolved: Number(row.conflicts_resolved ?? 0),
    avg_effectiveness: Number(row.avg_effectiveness ?? 0),
    avg_acceptance_rate: Number(row.avg_acceptance_rate ?? 0),
    multi_companion_events: Number(row.multi_companion_events ?? 0),
  };
}

export function parseCompanionOrchestrationCenter(raw: unknown): CompanionOrchestrationCenter {
  const row = asRecord(raw);

  return {
    settings: parseSettings(row.settings),
    registry: Array.isArray(row.registry) ? row.registry.map(parseRegistryEntry) : [],
    recent_events: Array.isArray(row.recent_events) ? row.recent_events.map(parseEvent) : [],
    recent_conflicts: Array.isArray(row.recent_conflicts)
      ? row.recent_conflicts.map(parseConflict)
      : [],
    health_metrics: parseHealthMetrics(row.health_metrics),
    priority_levels: Array.isArray(row.priority_levels)
      ? row.priority_levels.map((item) => {
          const level = asRecord(item);
          return {
            level: Number(level.level ?? 0),
            label: String(level.label ?? ""),
            description: String(level.description ?? ""),
          };
        })
      : [],
    links: row.links
      ? Object.fromEntries(
          Object.entries(asRecord(row.links)).map(([key, value]) => [key, String(value)]),
        )
      : null,
    can_manage: Boolean(row.can_manage),
    can_record: Boolean(row.can_record),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}

export function parseOrchestrationResult(raw: unknown): OrchestrationResult {
  const row = asRecord(raw);
  return {
    event_key: String(row.event_key ?? ""),
    request_summary: String(row.request_summary ?? ""),
    activated_companion_keys: Array.isArray(row.activated_companion_keys)
      ? row.activated_companion_keys.map(String)
      : [],
    coordinated_response: String(row.coordinated_response ?? ""),
    conflict_detected: Boolean(row.conflict_detected),
    conflict_resolution: row.conflict_resolution ? String(row.conflict_resolution) : null,
    priority_applied: row.priority_applied != null ? Number(row.priority_applied) : null,
    user_facing_brand: String(row.user_facing_brand ?? "Aipify"),
  };
}
