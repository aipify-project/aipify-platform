import type {
  PermissionAccessGovernanceCenter,
  PermissionGrant,
  PermissionHistoryEntry,
  PermissionRequest,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseGrant(raw: unknown): PermissionGrant {
  const row = asRecord(raw);
  return {
    grant_key: String(row.grant_key ?? ""),
    resource_name: String(row.resource_name ?? ""),
    permission_label: String(row.permission_label ?? ""),
    category: String(row.category ?? ""),
    permission_level: Number(row.permission_level ?? 1),
    purpose: String(row.purpose ?? ""),
    risk_level: String(row.risk_level ?? "low"),
    granted_by_label: String(row.granted_by_label ?? ""),
    granted_at: row.granted_at ? String(row.granted_at) : null,
    expires_at: row.expires_at ? String(row.expires_at) : null,
    expiration_type: String(row.expiration_type ?? "permanent"),
    what_aipify_can_do: row.what_aipify_can_do ? String(row.what_aipify_can_do) : null,
    what_aipify_cannot_do: row.what_aipify_cannot_do ? String(row.what_aipify_cannot_do) : null,
    revoke_instructions: row.revoke_instructions ? String(row.revoke_instructions) : null,
    status: String(row.status ?? "active"),
    high_impact: Boolean(row.high_impact),
    last_used_at: row.last_used_at ? String(row.last_used_at) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseRequest(raw: unknown): PermissionRequest {
  const row = asRecord(raw);
  return {
    request_key: String(row.request_key ?? ""),
    resource_name: String(row.resource_name ?? ""),
    permission_label: String(row.permission_label ?? ""),
    category: String(row.category ?? ""),
    permission_level: Number(row.permission_level ?? 2),
    why_needed: String(row.why_needed ?? ""),
    what_aipify_can_do: String(row.what_aipify_can_do ?? ""),
    what_aipify_cannot_do: String(row.what_aipify_cannot_do ?? ""),
    revoke_instructions: String(row.revoke_instructions ?? ""),
    risk_level: String(row.risk_level ?? "moderate"),
    status: String(row.status ?? "pending"),
    expiration_type: String(row.expiration_type ?? "temporary"),
    expires_at: row.expires_at ? String(row.expires_at) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseHistory(raw: unknown): PermissionHistoryEntry {
  const row = asRecord(raw);
  return {
    history_key: String(row.history_key ?? ""),
    resource_name: String(row.resource_name ?? ""),
    event_type: String(row.event_type ?? ""),
    actor_label: String(row.actor_label ?? ""),
    reason: row.reason ? String(row.reason) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

export function parsePermissionAccessGovernanceCenter(
  raw: unknown,
): PermissionAccessGovernanceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            active_count: Number(dash.active_count ?? 0),
            recent_granted_count: Number(dash.recent_granted_count ?? 0),
            high_impact_count: Number(dash.high_impact_count ?? 0),
            revoked_count: Number(dash.revoked_count ?? 0),
            pending_requests_count: Number(dash.pending_requests_count ?? 0),
            companion_active_count: Number(dash.companion_active_count ?? 0),
            governance_compliance_rate: Number(dash.governance_compliance_rate ?? 0),
            avg_review_days: Number(dash.avg_review_days ?? 0),
          }
        : null,
    active_permissions: Array.isArray(row.active_permissions)
      ? row.active_permissions.map(parseGrant)
      : [],
    recent_granted: Array.isArray(row.recent_granted) ? row.recent_granted.map(parseGrant) : [],
    high_impact: Array.isArray(row.high_impact) ? row.high_impact.map(parseGrant) : [],
    revoked: Array.isArray(row.revoked) ? row.revoked.map(parseGrant) : [],
    pending_requests: Array.isArray(row.pending_requests)
      ? row.pending_requests.map(parseRequest)
      : [],
    companion_overview: Array.isArray(row.companion_overview)
      ? row.companion_overview.map(parseGrant)
      : [],
    recent_history: Array.isArray(row.recent_history)
      ? row.recent_history.map(parseHistory)
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
    executive_reporting: row.executive_reporting ? asRecord(row.executive_reporting) : null,
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_record: Boolean(row.can_record),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
