import {
  isSuperAdminHost,
  normalizeHost,
  resolvePostLoginPath,
} from "@/lib/portals";

export { isSuperAdminHost, normalizeHost };

export function superAdminLoginRedirectPath(
  host: string | null | undefined,
  platformRole: string | null | undefined
): string {
  return resolvePostLoginPath(host, platformRole);
}
