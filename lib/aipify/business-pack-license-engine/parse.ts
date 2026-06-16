import type { BusinessPackLicenseCenter, BusinessPackLicenseEngineDashboard, LicenseTier } from "./types";

function parseTiers(value: unknown): LicenseTier[] {
  if (!Array.isArray(value)) return [];
  return value.filter((t): t is LicenseTier => typeof t === "object" && t !== null && typeof (t as LicenseTier).key === "string");
}

export function parseBusinessPackLicenseCenter(data: unknown): BusinessPackLicenseCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) {
    return { found: false, pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined };
  }
  const def = row.definition as BusinessPackLicenseCenter["definition"];
  if (!def) return null;
  return {
    found: true,
    pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    definition: { ...def, tiers: parseTiers(def.tiers) },
    overview: row.overview as BusinessPackLicenseCenter["overview"],
    usage: row.usage as BusinessPackLicenseCenter["usage"],
    upgrade: row.upgrade
      ? { ...(row.upgrade as BusinessPackLicenseCenter["upgrade"]), available_tiers: parseTiers((row.upgrade as Record<string, unknown>).available_tiers) }
      : undefined,
    governance_note: typeof row.governance_note === "string" ? row.governance_note : undefined,
  };
}

export function parseBusinessPackLicenseEngineDashboard(data: unknown): BusinessPackLicenseEngineDashboard | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.has_access !== true) return { has_access: false };
  return {
    has_access: true,
    is_platform_admin: row.is_platform_admin === true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    upgrade_flow: Array.isArray(row.upgrade_flow) ? (row.upgrade_flow as string[]) : [],
    governance: (row.governance as Record<string, string>) ?? {},
    license_metrics: Array.isArray(row.license_metrics) ? (row.license_metrics as BusinessPackLicenseEngineDashboard["license_metrics"]) : [],
    summary: (row.summary as Record<string, number>) ?? {},
    definitions: Array.isArray(row.definitions) ? (row.definitions as Array<Record<string, unknown>>) : [],
    recent_audit: Array.isArray(row.recent_audit) ? (row.recent_audit as Array<Record<string, unknown>>) : [],
    success_criteria: Array.isArray(row.success_criteria) ? (row.success_criteria as string[]) : [],
  };
}

export function packLicenseRoute(packKey: string): string {
  return `/app/marketplace/packs/${packKey}/license`;
}
