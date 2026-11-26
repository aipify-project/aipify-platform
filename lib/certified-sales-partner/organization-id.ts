/** Pure helpers for organization id extraction from RPC/API payloads. */
export function extractOrganizationId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const row = payload as Record<string, unknown>;
  for (const key of ["organization_id", "organizationId", "org_id", "customer_org_id", "id"]) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  if (row.organization && typeof row.organization === "object") {
    const nested = row.organization as Record<string, unknown>;
    if (typeof nested.id === "string" && nested.id.trim()) return nested.id.trim();
  }
  return null;
}
