const SUPER_ADMIN_HOSTS = new Set([
  "super.aipify.ai",
  "super.localhost",
]);

export function normalizeHost(host: string | null | undefined): string {
  return (host ?? "").split(":")[0].toLowerCase();
}

export function isSuperAdminHost(host: string | null | undefined): boolean {
  const normalized = normalizeHost(host);
  if (!normalized) return false;
  if (SUPER_ADMIN_HOSTS.has(normalized)) return true;
  return normalized.startsWith("super.");
}

export function superAdminLoginRedirectPath(
  host: string | null | undefined,
  platformRole: string | null | undefined
): string {
  if (platformRole === "super_admin" && isSuperAdminHost(host)) {
    return "/super";
  }
  if (platformRole) {
    return "/platform";
  }
  return "/app";
}
