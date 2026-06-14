const CUSTOMER_PORTAL_HOSTS = new Set(["app.aipify.ai", "app.localhost"]);
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
