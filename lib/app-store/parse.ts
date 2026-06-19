import type {
  AppStoreHome,
  AppStorePackDetail,
  AppStorePackListing,
  CustomerLicenseDashboard,
  PlatformAppStoreRevenue,
} from "./types";

function parseListing(value: unknown): AppStorePackListing | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.pack_key !== "string") return null;
  const modules = Array.isArray(row.included_modules)
    ? (row.included_modules as Record<string, unknown>[]).map((m) => ({
        module_key: String(m.module_key ?? ""),
        module_name: String(m.module_name ?? m.module_key ?? ""),
        route_href: typeof m.route_href === "string" ? m.route_href : null,
      }))
    : [];
  return {
    pack_key: row.pack_key,
    pack_name: String(row.pack_name ?? row.pack_key),
    pack_logo_url: typeof row.pack_logo_url === "string" ? row.pack_logo_url : null,
    category: String(row.category ?? "operations"),
    version: String(row.version ?? "1.0.0"),
    status: String(row.status ?? "active"),
    short_description: String(row.short_description ?? ""),
    starting_price: String(row.starting_price ?? ""),
    starting_price_monthly: row.starting_price_monthly == null ? null : Number(row.starting_price_monthly),
    trial_available: row.trial_available === true,
    install_available: row.install_available !== false,
    card_status: String(row.card_status ?? "available"),
    installed: row.installed === true,
    upgrade_required: row.upgrade_required === true,
    trial_days_left: row.trial_days_left == null ? null : Number(row.trial_days_left),
    included_modules: modules,
    license_requirements: String(row.license_requirements ?? ""),
    detail_route: String(row.detail_route ?? `/app/store/${row.pack_key}`),
    install_route: String(row.install_route ?? `/app/store/${row.pack_key}?install=1`),
    landing_route: String(row.landing_route ?? `/app/store/${row.pack_key}`),
    workspace_route: typeof row.workspace_route === "string" ? row.workspace_route : null,
  };
}

function parseListings(value: unknown): AppStorePackListing[] {
  if (!Array.isArray(value)) return [];
  return value.map(parseListing).filter((item): item is AppStorePackListing => item !== null);
}

export function parseAppStoreHome(data: unknown): AppStoreHome | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  const sections = row.sections as Record<string, unknown> | undefined;
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    locale: typeof row.locale === "string" ? row.locale : "en",
    categories: Array.isArray(row.categories) ? (row.categories as string[]) : [],
    seat_tiers: Array.isArray(row.seat_tiers)
      ? (row.seat_tiers as AppStoreHome["seat_tiers"])
      : [],
    installation_flow: Array.isArray(row.installation_flow) ? (row.installation_flow as string[]) : [],
    sections: sections
      ? {
          installed: parseListings(sections.installed),
          marketplace: parseListings(sections.marketplace),
          recommended: parseListings(sections.recommended),
          popular: parseListings(sections.popular),
          recently_added: parseListings(sections.recently_added),
          my_licenses: Array.isArray(sections.my_licenses) ? sections.my_licenses : [],
        }
      : undefined,
    governance_note: typeof row.governance_note === "string" ? row.governance_note : undefined,
    module_access_route: typeof row.module_access_route === "string" ? row.module_access_route : undefined,
    licenses_route: typeof row.licenses_route === "string" ? row.licenses_route : undefined,
  };
}

export function parseAppStorePackDetail(data: unknown): AppStorePackDetail | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false, pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined };
  const listing = parseListing(row.listing);
  return {
    found: true,
    pack_key: typeof row.pack_key === "string" ? row.pack_key : listing?.pack_key,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    listing: listing ?? undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    modules_included: Array.isArray(row.modules_included)
      ? (row.modules_included as AppStorePackDetail["modules_included"])
      : [],
    license_requirements: typeof row.license_requirements === "string" ? row.license_requirements : undefined,
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    who_is_it_for: typeof row.who_is_it_for === "string" ? row.who_is_it_for : undefined,
    permissions_added: Array.isArray(row.permissions_added)
      ? (row.permissions_added as AppStorePackDetail["permissions_added"])
      : [],
    pricing: row.pricing as AppStorePackDetail["pricing"],
    faq: Array.isArray(row.faq) ? (row.faq as AppStorePackDetail["faq"]) : [],
    version_history: Array.isArray(row.version_history)
      ? (row.version_history as AppStorePackDetail["version_history"])
      : [],
    supported_actions: Array.isArray(row.supported_actions) ? (row.supported_actions as string[]) : [],
    module_access_route: typeof row.module_access_route === "string" ? row.module_access_route : undefined,
    available_domains: Array.isArray(row.available_domains)
      ? (row.available_domains as AppStorePackDetail["available_domains"])
      : [],
    domain_required: row.domain_required === true,
    domains_route: typeof row.domains_route === "string" ? row.domains_route : undefined,
  };
}

export function parseCustomerLicenseDashboard(data: unknown): CustomerLicenseDashboard | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    current_plan: row.current_plan as CustomerLicenseDashboard["current_plan"],
    business_packs: Array.isArray(row.business_packs) ? row.business_packs : [],
    user_licenses: Array.isArray(row.user_licenses)
      ? (row.user_licenses as CustomerLicenseDashboard["user_licenses"])
      : [],
    consumption: row.consumption as CustomerLicenseDashboard["consumption"],
    supported_actions: Array.isArray(row.supported_actions) ? (row.supported_actions as string[]) : [],
    app_store_route: typeof row.app_store_route === "string" ? row.app_store_route : undefined,
    module_access_route: typeof row.module_access_route === "string" ? row.module_access_route : undefined,
  };
}

export function parsePlatformAppStoreRevenue(data: unknown): PlatformAppStoreRevenue | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    summary: row.summary as Record<string, number> | undefined,
    most_installed_packs: Array.isArray(row.most_installed_packs) ? row.most_installed_packs : [],
    revenue_per_pack: Array.isArray(row.revenue_per_pack) ? row.revenue_per_pack : [],
    growth: row.growth as Record<string, number> | undefined,
  };
}

export const APP_STORE_CARD_STATUS_STYLE: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  installed: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  trial_available: "bg-sky-50 text-sky-800 ring-sky-200",
  upgrade_required: "bg-amber-50 text-amber-900 ring-amber-200",
  coming_soon: "bg-gray-50 text-gray-600 ring-gray-200",
  deprecated: "bg-gray-50 text-gray-600 ring-gray-200",
};
