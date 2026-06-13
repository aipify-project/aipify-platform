import { MARKETPLACE_CATEGORIES } from "./constants";
import type {
  MarketplaceActionCapability,
  MarketplaceActionEcosystemCenter,
  MarketplaceCatalogByCategory,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseInstalled(raw: unknown): MarketplaceActionCapability["installed"] {
  if (!raw || typeof raw !== "object") return null;
  const row = asRecord(raw);
  return {
    status: String(row.status ?? ""),
    governance_level: Number(row.governance_level ?? 1),
    approval_completed: Boolean(row.approval_completed),
    installed_at: row.installed_at ? String(row.installed_at) : null,
  };
}

function parseCapability(raw: unknown): MarketplaceActionCapability {
  const row = asRecord(raw);
  return {
    capability_key: String(row.capability_key ?? ""),
    skill_name: String(row.skill_name ?? row.name ?? ""),
    provider_name: String(row.provider_name ?? ""),
    category: String(row.category ?? ""),
    description: String(row.description ?? ""),
    required_package: String(row.required_package ?? "professional"),
    governance_level: Number(row.governance_level ?? 2),
    rating: row.rating != null ? Number(row.rating) : null,
    pricing_model: row.pricing_model ? String(row.pricing_model) : null,
    package_allowed: row.package_allowed != null ? Boolean(row.package_allowed) : null,
    permissions_required: row.permissions_required ?? null,
    installed: parseInstalled(row.installed),
    is_active: row.is_active !== false,
  };
}

function parseCatalogByCategory(raw: unknown): MarketplaceCatalogByCategory {
  const row = asRecord(raw);
  const catalog = {} as MarketplaceCatalogByCategory;
  for (const category of MARKETPLACE_CATEGORIES) {
    catalog[category] = Array.isArray(row[category])
      ? row[category].map(parseCapability)
      : [];
  }
  return catalog;
}

export function parseMarketplaceActionEcosystemCenter(raw: unknown): MarketplaceActionEcosystemCenter {
  const row = asRecord(raw);

  return {
    catalog_by_category: parseCatalogByCategory(row.catalog_by_category),
    installed: Array.isArray(row.installed) ? row.installed.map(parseCapability) : [],
    recommended: Array.isArray(row.recommended)
      ? row.recommended.map((rec) => {
          const r = asRecord(rec);
          return {
            capability_key: String(r.capability_key ?? r.key ?? ""),
            skill_name: r.skill_name ? String(r.skill_name) : undefined,
            message: String(r.message ?? ""),
            status: String(r.status ?? "pending"),
            based_on_observed_value:
              r.based_on_observed_value != null ? Boolean(r.based_on_observed_value) : undefined,
            package_allowed: r.package_allowed != null ? Boolean(r.package_allowed) : undefined,
          };
        })
      : [],
    recently_updated: Array.isArray(row.recently_updated)
      ? row.recently_updated.map(parseCapability)
      : [],
    governance_warnings: Array.isArray(row.governance_warnings)
      ? row.governance_warnings.map((w) => {
          const item = asRecord(w);
          return {
            capability_key: String(item.capability_key ?? ""),
            message: String(item.message ?? ""),
            severity: item.severity ? String(item.severity) : undefined,
          };
        })
      : [],
    usage_insights: row.usage_insights ? asRecord(row.usage_insights) : null,
    installation_flow: Array.isArray(row.installation_flow)
      ? row.installation_flow.map((step) => {
          const s = asRecord(step);
          return {
            step: String(s.step ?? s.key ?? s.label ?? ""),
            description: String(s.description ?? ""),
          };
        })
      : null,
    blueprint: row.blueprint ? asRecord(row.blueprint) : null,
    links: row.links
      ? Object.fromEntries(
          Object.entries(asRecord(row.links)).map(([key, value]) => [key, String(value)]),
        )
      : null,
    can_manage: Boolean(row.can_manage),
    can_activate: Boolean(row.can_activate),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
