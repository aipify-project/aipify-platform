import type { AipifyCoreActionResult, AipifyCorePlatformCard, AipifyCorePlatformDashboard } from "./types";

export function parseAipifyCorePlatformCard(data: unknown): AipifyCorePlatformCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    core_health_score: Number(d.core_health_score ?? 0),
    modules_enabled: Number(d.modules_enabled ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseAipifyCorePlatformDashboard(data: unknown): AipifyCorePlatformDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    auto_high_risk_disabled: Boolean(d.auto_high_risk_disabled ?? true),
    unonight_pilot_mode: Boolean(d.unonight_pilot_mode),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    core_enabled: Boolean(d.core_enabled ?? true),
    core_health_score: Number(d.core_health_score ?? 0),
    components_active: Number(d.components_active ?? 0),
    modules_enabled: Number(d.modules_enabled ?? 0),
    pending_tasks: Number(d.pending_tasks ?? 0),
    active_alerts: Number(d.active_alerts ?? 0),
    supported_roles: Array.isArray(d.supported_roles)
      ? (d.supported_roles as AipifyCorePlatformDashboard["supported_roles"])
      : [],
    core_components: Array.isArray(d.core_components)
      ? (d.core_components as AipifyCorePlatformDashboard["core_components"])
      : [],
    dashboard_widgets: Array.isArray(d.dashboard_widgets)
      ? (d.dashboard_widgets as AipifyCorePlatformDashboard["dashboard_widgets"])
      : [],
    tenant_modules: Array.isArray(d.tenant_modules)
      ? (d.tenant_modules as AipifyCorePlatformDashboard["tenant_modules"])
      : [],
    ai_action_framework: Array.isArray(d.ai_action_framework)
      ? (d.ai_action_framework as AipifyCorePlatformDashboard["ai_action_framework"])
      : [],
    integrations: Array.isArray(d.integrations)
      ? (d.integrations as AipifyCorePlatformDashboard["integrations"])
      : [],
    api_keys: Array.isArray(d.api_keys) ? (d.api_keys as AipifyCorePlatformDashboard["api_keys"]) : [],
    recent_audit_events: Array.isArray(d.recent_audit_events)
      ? (d.recent_audit_events as AipifyCorePlatformDashboard["recent_audit_events"])
      : [],
    pilot_principles: Array.isArray(d.pilot_principles) ? (d.pilot_principles as string[]) : undefined,
    integrations_map:
      typeof d.integrations_map === "object" && d.integrations_map
        ? (d.integrations_map as Record<string, string>)
        : undefined,
  };
}

export function parseAipifyCoreActionResult(data: unknown): AipifyCoreActionResult {
  return (data ?? {}) as AipifyCoreActionResult;
}
