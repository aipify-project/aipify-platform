/**
 * Allowlisted Platform view of Super role-permission overview aggregates.
 * Never forwards recent_audit, organization_id, or raw RPC payloads.
 */

export type PlatformSuperRoleAccessOverview = {
  found: true;
  principle: string | null;
  privacy_note: string | null;
  governance_note: string | null;
  total_permissions: number;
  total_modules: number;
  organizations_with_grants: number;
  total_role_grants: number;
  user_overrides: number;
  custom_roles: number;
  templates: number;
};

function asNonNegInt(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const n = Math.trunc(value);
  return n >= 0 ? n : null;
}

function asOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Parse Core RPC / API payload into allowlisted aggregates only.
 * Returns null when the payload is missing, denied (`found: false`), or malformed.
 */
export function parsePlatformSuperRoleAccessOverview(
  data: unknown,
): PlatformSuperRoleAccessOverview | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;

  if (row.found === false) return null;
  // recent_audit / organization_id may exist on raw RPC payloads — never copied below.

  const catalog =
    row.catalog && typeof row.catalog === "object"
      ? (row.catalog as Record<string, unknown>)
      : null;
  const adoption =
    row.adoption && typeof row.adoption === "object"
      ? (row.adoption as Record<string, unknown>)
      : null;

  // Prefer nested catalog/adoption; also accept already-flattened API shape.
  const total_permissions =
    asNonNegInt(row.total_permissions) ?? asNonNegInt(catalog?.total_permissions);
  const total_modules =
    asNonNegInt(row.total_modules) ?? asNonNegInt(catalog?.total_modules);
  const organizations_with_grants =
    asNonNegInt(row.organizations_with_grants) ??
    asNonNegInt(adoption?.organizations_with_grants);
  const total_role_grants =
    asNonNegInt(row.total_role_grants) ?? asNonNegInt(adoption?.total_role_grants);
  const user_overrides =
    asNonNegInt(row.user_overrides) ?? asNonNegInt(adoption?.user_overrides);
  const custom_roles =
    asNonNegInt(row.custom_roles) ?? asNonNegInt(adoption?.custom_roles);
  const templates = asNonNegInt(row.templates);

  if (
    total_permissions === null ||
    total_modules === null ||
    organizations_with_grants === null ||
    total_role_grants === null ||
    user_overrides === null ||
    custom_roles === null ||
    templates === null
  ) {
    return null;
  }

  return {
    found: true,
    principle: asOptionalString(row.principle),
    privacy_note: asOptionalString(row.privacy_note),
    governance_note: asOptionalString(row.governance_note),
    total_permissions,
    total_modules,
    organizations_with_grants,
    total_role_grants,
    user_overrides,
    custom_roles,
    templates,
  };
}

/** Strip + allowlist for HTTP responses — never includes recent_audit. */
export function toPlatformSuperRoleAccessResponseBody(
  overview: PlatformSuperRoleAccessOverview,
): Record<string, unknown> {
  return {
    found: true,
    principle: overview.principle,
    privacy_note: overview.privacy_note,
    governance_note: overview.governance_note,
    total_permissions: overview.total_permissions,
    total_modules: overview.total_modules,
    organizations_with_grants: overview.organizations_with_grants,
    total_role_grants: overview.total_role_grants,
    user_overrides: overview.user_overrides,
    custom_roles: overview.custom_roles,
    templates: overview.templates,
  };
}

export function payloadContainsForbiddenRoleAccessFields(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const walk = (value: unknown): boolean => {
    if (!value || typeof value !== "object") return false;
    if (Array.isArray(value)) return value.some(walk);
    const obj = value as Record<string, unknown>;
    if ("recent_audit" in obj) return true;
    if ("organization_id" in obj) return true;
    return Object.values(obj).some(walk);
  };
  return walk(data);
}
