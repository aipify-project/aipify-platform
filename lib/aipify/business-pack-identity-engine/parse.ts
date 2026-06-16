import type {
  BusinessPackIdentityEngineDashboard,
  BusinessPackIdentityLanding,
  BusinessPackIdentityRecord,
} from "./types";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function parseIdentityRecord(value: unknown): BusinessPackIdentityRecord | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.pack_key !== "string" || typeof row.pack_name !== "string") return null;
  return {
    pack_key: row.pack_key,
    pack_name: row.pack_name,
    pack_category: (row.pack_category as BusinessPackIdentityRecord["pack_category"]) ?? "operations",
    version: typeof row.version === "string" ? row.version : "1.0.0",
    status: (row.status as BusinessPackIdentityRecord["status"]) ?? "active",
    pack_logo_url: typeof row.pack_logo_url === "string" ? row.pack_logo_url : null,
    pack_cover_image_url: typeof row.pack_cover_image_url === "string" ? row.pack_cover_image_url : null,
    short_description: typeof row.short_description === "string" ? row.short_description : "",
    long_description: typeof row.long_description === "string" ? row.long_description : "",
    intended_audience: typeof row.intended_audience === "string" ? row.intended_audience : "",
    key_benefits: asStringArray(row.key_benefits),
    business_value_statement: typeof row.business_value_statement === "string" ? row.business_value_statement : "",
    primary_use_cases: asStringArray(row.primary_use_cases),
    expected_outcomes: asStringArray(row.expected_outcomes),
    business_value: (row.business_value as BusinessPackIdentityRecord["business_value"]) ?? {},
    features: asStringArray(row.features),
    workspace_route: typeof row.workspace_route === "string" ? row.workspace_route : null,
    landing_route: typeof row.landing_route === "string" ? row.landing_route : `/app/marketplace/packs/${row.pack_key}`,
    knowledge_center_category: typeof row.knowledge_center_category === "string" ? row.knowledge_center_category : null,
    install_allowed: row.install_allowed === true,
    upgrade_route: typeof row.upgrade_route === "string" ? row.upgrade_route : null,
    release_notes_url: typeof row.release_notes_url === "string" ? row.release_notes_url : null,
    licensing_summary: typeof row.licensing_summary === "string" ? row.licensing_summary : null,
    catalog_pack_key: typeof row.catalog_pack_key === "string" ? row.catalog_pack_key : null,
  };
}

export function parseBusinessPackIdentityLanding(data: unknown): BusinessPackIdentityLanding | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) {
    return { found: false, pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined };
  }
  const identity = parseIdentityRecord(row.identity);
  if (!identity) return null;
  const layout = row.layout as BusinessPackIdentityLanding["layout"];
  const actions = row.actions as BusinessPackIdentityLanding["actions"];
  return {
    found: true,
    identity,
    layout,
    actions,
    governance_note: typeof row.governance_note === "string" ? row.governance_note : undefined,
    versioning_note: typeof row.versioning_note === "string" ? row.versioning_note : undefined,
  };
}

export function parseBusinessPackIdentityEngineDashboard(data: unknown): BusinessPackIdentityEngineDashboard | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.has_access !== true) return { has_access: false };
  const packs = Array.isArray(row.packs)
    ? row.packs.map(parseIdentityRecord).filter((p): p is BusinessPackIdentityRecord => p !== null)
    : [];
  return {
    has_access: true,
    is_platform_admin: row.is_platform_admin === true,
    can_manage: row.can_manage === true,
    positioning: typeof row.positioning === "string" ? row.positioning : undefined,
    categories: asStringArray(row.categories),
    statuses: Array.isArray(row.statuses) ? (row.statuses as BusinessPackIdentityEngineDashboard["statuses"]) : [],
    version_format: typeof row.version_format === "string" ? row.version_format : undefined,
    governance: (row.governance as Record<string, string>) ?? {},
    forbidden: asStringArray(row.forbidden),
    success_criteria: (row.success_criteria as Record<string, number>) ?? {},
    packs,
    recent_audit: Array.isArray(row.recent_audit) ? (row.recent_audit as Array<Record<string, unknown>>) : [],
    landing_experience: asStringArray(row.landing_experience),
  };
}
