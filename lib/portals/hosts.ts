export const CUSTOMER_PORTAL_DOMAIN = "app.aipify.ai";

const CUSTOMER_PORTAL_HOSTS = new Set([CUSTOMER_PORTAL_DOMAIN, "app.localhost"]);
const MARKETING_APEX_HOSTS = new Set(["aipify.ai", "www.aipify.ai", "localhost"]);
const SUPER_ADMIN_HOSTS = new Set(["super.aipify.ai", "super.localhost"]);

export function normalizeHost(host: string | null | undefined): string {
  return (host ?? "").split(":")[0].toLowerCase();
}

export function isCustomerPortalHost(host: string | null | undefined): boolean {
  const normalized = normalizeHost(host);
  if (!normalized) return false;
  if (CUSTOMER_PORTAL_HOSTS.has(normalized)) return true;
  return normalized.startsWith("app.");
}

export function isMarketingApexHost(host: string | null | undefined): boolean {
  const normalized = normalizeHost(host);
  if (!normalized) return false;
  if (isCustomerPortalHost(host) || isSuperAdminHost(host)) return false;
  if (MARKETING_APEX_HOSTS.has(normalized)) return true;
  return normalized === "localhost";
}

export function isSuperAdminHost(host: string | null | undefined): boolean {
  const normalized = normalizeHost(host);
  if (!normalized) return false;
  if (SUPER_ADMIN_HOSTS.has(normalized)) return true;
  return normalized.startsWith("super.");
}

export function resolvePortalFromHost(
  host: string | null | undefined
): "customer" | "platform" | "superAdmin" | null {
  if (isSuperAdminHost(host)) return "superAdmin";
  if (isCustomerPortalHost(host)) return "customer";
  return null;
}
