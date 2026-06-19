import type { TrustCenterOperations } from "./types";

export function parseTrustCenterOperations(data: unknown): TrustCenterOperations | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    principle: row.principle as string | undefined,
    section: row.section as string | undefined,
    organization: row.organization as TrustCenterOperations["organization"],
    overview: row.overview as TrustCenterOperations["overview"],
    identity_engine: row.identity_engine as TrustCenterOperations["identity_engine"],
    verification_engine: row.verification_engine as TrustCenterOperations["verification_engine"],
    device_trust_center: row.device_trust_center as TrustCenterOperations["device_trust_center"],
    session_management: row.session_management as TrustCenterOperations["session_management"],
    security_events: row.security_events as TrustCenterOperations["security_events"],
    identity_protection: row.identity_protection as string[] | undefined,
    two_factor_center: row.two_factor_center as Record<string, unknown> | undefined,
    partner_verification: row.partner_verification as Record<string, unknown>[] | undefined,
    organization_verification: row.organization_verification as Record<string, unknown>[] | undefined,
    audit_history: row.audit_history as TrustCenterOperations["audit_history"],
    permission_explorer: row.permission_explorer as TrustCenterOperations["permission_explorer"],
    companion_trust_advisor: row.companion_trust_advisor as Record<string, unknown> | undefined,
    compliance_integration: row.compliance_integration as Record<string, unknown>[] | undefined,
    security_score_engine: row.security_score_engine as Record<string, unknown> | undefined,
    platform_governor: row.platform_governor as Record<string, unknown> | undefined,
    execution_coordination: row.execution_coordination as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: row.audit_recent as TrustCenterOperations["audit_recent"],
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error as string | undefined,
  };
}
