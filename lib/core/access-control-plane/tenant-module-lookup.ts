/**
 * Map an existing `is_tenant_module_enabled` result into the session module set.
 * Missing, error, and non-boolean payloads stay absent so callers fail closed.
 * This does not grant a module and does not accept a tenant id from the client.
 */

export const KOMPIS_BEDRIFT_MODULE_KEY = "kompis_bedrift" as const;
export const KOMPIS_BEDRIFT_DENIED_SENTINEL = "__kompis_bedrift_denied__" as const;
export const WEBSITE_KOMPIS_MODULE_KEY = "website_kompis" as const;
export const WEBSITE_KOMPIS_DENIED_SENTINEL = "__website_kompis_denied__" as const;

const DENIED_SENTINEL: Record<string, string> = {
  [WEBSITE_KOMPIS_MODULE_KEY]: WEBSITE_KOMPIS_DENIED_SENTINEL,
  [KOMPIS_BEDRIFT_MODULE_KEY]: KOMPIS_BEDRIFT_DENIED_SENTINEL,
};

export function applyTenantModuleLookup(
  keys: Set<string>,
  moduleKey: typeof WEBSITE_KOMPIS_MODULE_KEY | typeof KOMPIS_BEDRIFT_MODULE_KEY,
  result: { error: unknown; data: unknown }
): void {
  if (result.error) return;
  if (result.data === true) {
    keys.add(moduleKey);
    return;
  }
  if (result.data === false) {
    keys.add(DENIED_SENTINEL[moduleKey]);
  }
}

export function isKompisBedriftProductPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const path = pathname.split("?")[0]?.split("#")[0] ?? "";
  return path === "/app/kompis-bedrift" || path.startsWith("/app/kompis-bedrift/");
}
