import type {
  QualityDashboard,
  QualityIncident,
  QualityRecommendation,
  QualityReport,
  QualityScanRun,
  QualitySettings,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseQualityDashboard(raw: unknown): QualityDashboard {
  if (!raw || typeof raw !== "object") return { has_customer: false };
  const r = raw as Record<string, unknown>;
  const widgets = asRecord(r.widgets);
  return {
    has_customer: Boolean(r.has_customer),
    has_access: r.has_access !== undefined ? Boolean(r.has_access) : undefined,
    upgrade_required: r.upgrade_required !== undefined ? Boolean(r.upgrade_required) : undefined,
    plan: r.plan ? String(r.plan) : undefined,
    observation_mode: r.observation_mode !== undefined ? Boolean(r.observation_mode) : undefined,
    auto_fix_enabled: r.auto_fix_enabled !== undefined ? Boolean(r.auto_fix_enabled) : undefined,
    widgets: r.widgets
      ? {
          open_incidents: Number(widgets.open_incidents ?? 0),
          critical_incidents: Number(widgets.critical_incidents ?? 0),
          broken_links: Number(widgets.broken_links ?? 0),
          failed_workflows: Number(widgets.failed_workflows ?? 0),
          integration_issues: Number(widgets.integration_issues ?? 0),
          knowledge_gaps: Number(widgets.knowledge_gaps ?? 0),
          recommended_actions: Number(widgets.recommended_actions ?? 0),
        }
      : undefined,
    recent_incidents: parseQualityIncidents(r.recent_incidents),
    recent_scans: parseQualityScans(r.recent_scans),
    recommended_actions: parseQualityRecommendations(r.recommended_actions),
    privacy_note: r.privacy_note ? String(r.privacy_note) : undefined,
  };
}

export function parseQualityIncidents(raw: unknown): QualityIncident[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: String(r.id ?? ""),
      incident_key: String(r.incident_key ?? ""),
      title: String(r.title ?? ""),
      severity: String(r.severity ?? "medium") as QualityIncident["severity"],
      status: String(r.status ?? "open") as QualityIncident["status"],
      category: r.category ? String(r.category) : null,
      scanner_type: r.scanner_type ? String(r.scanner_type) : null,
      expected_behavior: String(r.expected_behavior ?? ""),
      observed_behavior: String(r.observed_behavior ?? ""),
      impact: String(r.impact ?? ""),
      evidence: asRecord(r.evidence),
      suggested_fix: String(r.suggested_fix ?? ""),
      priority: String(r.priority ?? "medium"),
      knowledge_gap_id: r.knowledge_gap_id ? String(r.knowledge_gap_id) : null,
      created_at: String(r.created_at ?? ""),
      resolved_at: r.resolved_at ? String(r.resolved_at) : null,
    };
  });
}

export function parseQualityReports(raw: unknown): QualityReport[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: String(r.id ?? ""),
      incident_id: r.incident_id ? String(r.incident_id) : null,
      title: String(r.title ?? ""),
      report_body: String(r.report_body ?? ""),
      status: String(r.status ?? "draft"),
      created_at: String(r.created_at ?? ""),
    };
  });
}

export function parseQualityScans(raw: unknown): QualityScanRun[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: String(r.id ?? ""),
      scan_type: String(r.scan_type ?? ""),
      status: String(r.status ?? ""),
      summary: r.summary ? String(r.summary) : null,
      checks_passed: Number(r.checks_passed ?? 0),
      checks_failed: Number(r.checks_failed ?? 0),
      incidents_created: Number(r.incidents_created ?? 0),
      completed_at: r.completed_at ? String(r.completed_at) : null,
      created_at: r.created_at ? String(r.created_at) : undefined,
    };
  });
}

export function parseQualityRecommendations(raw: unknown): QualityRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: String(r.id ?? ""),
      recommendation_text: String(r.recommendation_text ?? ""),
      priority: String(r.priority ?? "medium"),
      requires_approval: Boolean(r.requires_approval),
      incident_id: r.incident_id ? String(r.incident_id) : null,
    };
  });
}

export function parseQualitySettings(raw: unknown): QualitySettings | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    observation_mode: Boolean(r.observation_mode ?? true),
    auto_fix_enabled: Boolean(r.auto_fix_enabled ?? false),
    notify_developers: Boolean(r.notify_developers ?? true),
    create_admin_tasks: Boolean(r.create_admin_tasks ?? true),
    open_knowledge_gaps: Boolean(r.open_knowledge_gaps ?? true),
    scan_interval_hours: Number(r.scan_interval_hours ?? 24),
    enabled_scanners: Array.isArray(r.enabled_scanners)
      ? r.enabled_scanners.map(String)
      : [],
  };
}
