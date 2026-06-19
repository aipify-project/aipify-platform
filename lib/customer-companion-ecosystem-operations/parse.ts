import type {
  CompanionEcosystemCenter,
  EcosystemApproval,
  EcosystemRequest,
} from "./types";

function parseApproval(raw: Record<string, unknown>): EcosystemApproval {
  return {
    approval_key: String(raw.approval_key ?? ""),
    approval_title: String(raw.approval_title ?? ""),
    request_key: raw.request_key ? String(raw.request_key) : undefined,
    approval_status: raw.approval_status ? String(raw.approval_status) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

function parseRequest(raw: Record<string, unknown>): EcosystemRequest {
  return {
    request_key: String(raw.request_key ?? ""),
    service_title: String(raw.service_title ?? ""),
    provider_key: raw.provider_key ? String(raw.provider_key) : undefined,
    provider_name: raw.provider_name ? String(raw.provider_name) : undefined,
    request_status: raw.request_status ? String(raw.request_status) : undefined,
    domain_scope: raw.domain_scope ? String(raw.domain_scope) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
    recorded_at: raw.recorded_at ? String(raw.recorded_at) : undefined,
  };
}

export function parseCompanionEcosystemCenter(raw: Record<string, unknown>): CompanionEcosystemCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  const approvals = Array.isArray(raw.approvals)
    ? (raw.approvals as Record<string, unknown>[]).map(parseApproval)
    : [];
  const requests = Array.isArray(raw.requests)
    ? (raw.requests as Record<string, unknown>[]).map(parseRequest)
    : [];

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as CompanionEcosystemCenter["organization"],
    overview: raw.overview as CompanionEcosystemCenter["overview"],
    providers: Array.isArray(raw.providers) ? (raw.providers as Record<string, unknown>[]) : [],
    services: Array.isArray(raw.services) ? (raw.services as Record<string, unknown>[]) : [],
    marketplace: raw.marketplace as Record<string, unknown>,
    requests,
    approvals,
    ratings: Array.isArray(raw.ratings) ? (raw.ratings as Record<string, unknown>[]) : [],
    reports: raw.reports as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as CompanionEcosystemCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
