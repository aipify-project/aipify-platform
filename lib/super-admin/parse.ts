import type {
  SuperAdminControlCenter,
  SuperAdminGlobalStatus,
  SuperAdminPlatformStatus,
  SuperAdminSystemService,
  SuperAdminTrustSignals,
} from "./types";

function parsePlatformStatus(value: unknown): SuperAdminPlatformStatus | undefined {
  if (value === "operational" || value === "pending_setup" || value === "attention_required") {
    return value;
  }
  return undefined;
}

function parseGlobalStatus(value: unknown): SuperAdminGlobalStatus | undefined {
  if (value === "operational" || value === "warning" || value === "critical") {
    return value;
  }
  return undefined;
}

function parseTrustSignals(value: unknown): SuperAdminTrustSignals | undefined {
  if (!value || typeof value !== "object") return undefined;
  const data = value as Record<string, unknown>;
  return {
    backup_ok: data.backup_ok === true,
    two_factor_enforced: data.two_factor_enforced === true,
    audit_logging_active: data.audit_logging_active === true,
    compliance_monitoring_active: data.compliance_monitoring_active === true,
    backup_verified: data.backup_verified === true,
    security_posture: data.security_posture === "review" ? "review" : "strong",
    compliance_health_pct:
      typeof data.compliance_health_pct === "number" ? data.compliance_health_pct : undefined,
    incident_free_days:
      typeof data.incident_free_days === "number" ? data.incident_free_days : undefined,
    executive_visibility: data.executive_visibility !== false,
  };
}

function parseSystemServices(value: unknown): SuperAdminSystemService[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const services: SuperAdminSystemService[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id : null;
    const status = parsePlatformStatus(row.status);
    if (!id || !status) continue;
    services.push({
      id,
      status,
      last_check_seconds_ago:
        typeof row.last_check_seconds_ago === "number" ? row.last_check_seconds_ago : 0,
      response_time_ms:
        typeof row.response_time_ms === "number" ? row.response_time_ms : null,
      setup_steps_completed:
        typeof row.setup_steps_completed === "number" ? row.setup_steps_completed : undefined,
      setup_steps_total:
        typeof row.setup_steps_total === "number" ? row.setup_steps_total : undefined,
      uptime_trend_pct:
        typeof row.uptime_trend_pct === "number" ? row.uptime_trend_pct : undefined,
    });
  }
  return services.length > 0 ? services : undefined;
}

export function parseSuperAdminControlCenter(payload: unknown): SuperAdminControlCenter | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  if (data.has_access !== true) return null;

  return {
    has_access: true,
    data_state:
      data.data_state === "live" || data.data_state === "empty" || data.data_state === "degraded"
        ? data.data_state
        : undefined,
    setup_notice: data.setup_notice === true,
    admin_role: typeof data.admin_role === "string" ? data.admin_role : undefined,
    display_name: typeof data.display_name === "string" ? data.display_name : undefined,
    platform_health_score:
      typeof data.platform_health_score === "number" ? data.platform_health_score : undefined,
    platform_status: parsePlatformStatus(data.platform_status),
    global_status: parseGlobalStatus(data.global_status),
    system_uptime_pct:
      typeof data.system_uptime_pct === "number" ? data.system_uptime_pct : undefined,
    active_organizations:
      typeof data.active_organizations === "number" ? data.active_organizations : undefined,
    active_workspaces:
      typeof data.active_workspaces === "number" ? data.active_workspaces : undefined,
    aipify_actions_today:
      typeof data.aipify_actions_today === "number" ? data.aipify_actions_today : undefined,
    subscriptions_requiring_review:
      typeof data.subscriptions_requiring_review === "number"
        ? data.subscriptions_requiring_review
        : undefined,
    growth_partner_applications_pending:
      typeof data.growth_partner_applications_pending === "number"
        ? data.growth_partner_applications_pending
        : undefined,
    marketplace_reviews_pending:
      typeof data.marketplace_reviews_pending === "number"
        ? data.marketplace_reviews_pending
        : undefined,
    critical_incidents:
      typeof data.critical_incidents === "number" ? data.critical_incidents : undefined,
    payment_provider_incomplete: data.payment_provider_incomplete === true,
    trust_signals: parseTrustSignals(data.trust_signals),
    system_services: parseSystemServices(data.system_services),
    privacy_note: typeof data.privacy_note === "string" ? data.privacy_note : undefined,
    checked_at: typeof data.checked_at === "string" ? data.checked_at : undefined,
  };
}
