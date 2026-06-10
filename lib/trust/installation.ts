import { INSTALLATION_SECURITY_CHECKS } from "./engine";

export type InstallationSecurityContext = {
  tenantId?: string;
  installationId?: string;
  installationToken?: string;
  domain?: string;
  subscriptionActive?: boolean;
  permissionScope?: string;
};

export type InstallationSecurityResult =
  | { valid: true }
  | { valid: false; failedCheck: (typeof INSTALLATION_SECURITY_CHECKS)[number] };

/**
 * Validates installation security requirements (Phase 19 §11–12).
 * Invalid installations must refuse execution.
 */
export function validateInstallationSecurity(
  ctx: InstallationSecurityContext
): InstallationSecurityResult {
  if (!ctx.tenantId) {
    return { valid: false, failedCheck: "tenant_id" };
  }
  if (!ctx.installationId) {
    return { valid: false, failedCheck: "installation_id" };
  }
  if (!ctx.installationToken || ctx.installationToken.length < 20) {
    return { valid: false, failedCheck: "installation_token" };
  }
  if (!ctx.domain) {
    return { valid: false, failedCheck: "registered_domains" };
  }
  if (ctx.subscriptionActive !== true) {
    return { valid: false, failedCheck: "subscription_status" };
  }
  if (!ctx.permissionScope) {
    return { valid: false, failedCheck: "permission_scope" };
  }
  return { valid: true };
}

export function normalizeRegisteredDomain(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "");
}

export function isDomainAuthorized(
  requestDomain: string,
  registeredDomains: string[]
): boolean {
  const normalized = normalizeRegisteredDomain(requestDomain);
  return registeredDomains.some(
    (registered) => normalizeRegisteredDomain(registered) === normalized
  );
}
