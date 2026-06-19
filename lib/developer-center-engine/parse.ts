export type DeveloperCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  developers?: Record<string, unknown>[];
  projects?: Record<string, unknown>[];
  sdk_modules?: Record<string, unknown>[];
  pack_manifests?: Record<string, unknown>[];
  pack_permissions?: Record<string, unknown>[];
  test_sandboxes?: Record<string, unknown>[];
  validation_runs?: Record<string, unknown>[];
  api_endpoints?: Record<string, unknown>[];
  api_keys?: Record<string, unknown>[];
  pack_dependencies?: Record<string, unknown>[];
  documentation?: Record<string, unknown>[];
  pack_versions?: Record<string, unknown>[];
  pack_certifications?: Record<string, unknown>[];
  marketplace_listings?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
  rows?: Record<string, unknown>[];
};

export function parseDeveloperCenter(raw: unknown): DeveloperCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  const arr = (key: string) =>
    Array.isArray(row[key]) ? (row[key] as Record<string, unknown>[]) : [];
  const obj = (key: string) =>
    typeof row[key] === "object" && row[key] ? (row[key] as Record<string, number | string>) : {};

  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    executive_dashboard: obj("executive_dashboard"),
    stats: obj("stats"),
    companion_recommendations: arr("companion_recommendations"),
    developers: arr("developers"),
    projects: arr("projects"),
    sdk_modules: arr("sdk_modules"),
    pack_manifests: arr("pack_manifests"),
    pack_permissions: arr("pack_permissions"),
    test_sandboxes: arr("test_sandboxes"),
    validation_runs: arr("validation_runs"),
    api_endpoints: arr("api_endpoints"),
    api_keys: arr("api_keys"),
    pack_dependencies: arr("pack_dependencies"),
    documentation: arr("documentation"),
    pack_versions: arr("pack_versions"),
    pack_certifications: arr("pack_certifications"),
    marketplace_listings: arr("marketplace_listings"),
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: arr("audit_recent"),
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
    rows: arr("rows"),
  };
}
