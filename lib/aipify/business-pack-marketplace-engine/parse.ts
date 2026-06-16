import type {
  BusinessPackMarketplaceEngineDashboard,
  BusinessPackMarketplaceHome,
  BusinessPackMarketplaceInstall,
  MarketplacePackListing,
  ContinueSetupItem,
} from "./types";

function parseListing(value: unknown): MarketplacePackListing | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.pack_key !== "string") return null;
  return {
    pack_key: row.pack_key,
    pack_name: String(row.pack_name ?? row.pack_key),
    pack_logo_url: typeof row.pack_logo_url === "string" ? row.pack_logo_url : null,
    category: String(row.category ?? "operations"),
    version: String(row.version ?? "1.0.0"),
    status: String(row.status ?? "active"),
    status_badge: String(row.status_badge ?? row.status ?? "active"),
    short_description: String(row.short_description ?? ""),
    starting_price: String(row.starting_price ?? ""),
    starting_price_monthly:
      row.starting_price_monthly == null ? null : Number(row.starting_price_monthly),
    trial_available: row.trial_available === true,
    install_available: row.install_available !== false,
    card_status: String(row.card_status ?? "available"),
    installed: row.installed === true,
    upgrade_required: row.upgrade_required === true,
    trial_days_left: row.trial_days_left == null ? null : Number(row.trial_days_left),
    supported_languages: Array.isArray(row.supported_languages)
      ? (row.supported_languages as string[])
      : [],
    landing_route: String(row.landing_route ?? `/app/marketplace/packs/${row.pack_key}`),
    install_route: String(row.install_route ?? `/app/marketplace/packs/${row.pack_key}/install`),
    license_route: String(row.license_route ?? `/app/marketplace/packs/${row.pack_key}/license`),
    knowledge_route: String(row.knowledge_route ?? `/app/marketplace/packs/${row.pack_key}/knowledge`),
    workspace_route: typeof row.workspace_route === "string" ? row.workspace_route : null,
  };
}

function parseListings(value: unknown): MarketplacePackListing[] {
  if (!Array.isArray(value)) return [];
  return value.map(parseListing).filter((item): item is MarketplacePackListing => item !== null);
}

export function parseBusinessPackMarketplaceHome(data: unknown): BusinessPackMarketplaceHome | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  const sections = row.sections as Record<string, unknown> | undefined;
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    commercial_principles: Array.isArray(row.commercial_principles)
      ? (row.commercial_principles as string[])
      : [],
    locale: typeof row.locale === "string" ? row.locale : "en",
    categories: Array.isArray(row.categories) ? (row.categories as string[]) : [],
    installation_flow: Array.isArray(row.installation_flow) ? (row.installation_flow as string[]) : [],
    home_sections: Array.isArray(row.home_sections)
      ? (row.home_sections as BusinessPackMarketplaceHome["home_sections"])
      : [],
    sections: sections
      ? {
          recommended_for_you: parseListings(sections.recommended_for_you),
          installed: parseListings(sections.installed),
          popular: parseListings(sections.popular),
          recently_added: parseListings(sections.recently_added),
          continue_setup: Array.isArray(sections.continue_setup)
            ? (sections.continue_setup as ContinueSetupItem[])
            : [],
          upgrade_opportunities: parseListings(sections.upgrade_opportunities),
        }
      : undefined,
    all_listings: parseListings(row.all_listings),
    governance_note: typeof row.governance_note === "string" ? row.governance_note : undefined,
    marketplace_route: typeof row.marketplace_route === "string" ? row.marketplace_route : undefined,
  };
}

export function parseBusinessPackMarketplaceInstall(data: unknown): BusinessPackMarketplaceInstall | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined,
    listing: parseListing(row.listing) ?? undefined,
    workflow_step: typeof row.workflow_step === "string" ? row.workflow_step : undefined,
    steps_completed: Array.isArray(row.steps_completed) ? (row.steps_completed as string[]) : [],
    installation_flow: Array.isArray(row.installation_flow) ? (row.installation_flow as string[]) : [],
    step_routes: (row.step_routes as Record<string, string>) ?? {},
    activation_blocked_pending_legal: row.activation_blocked_pending_legal === true,
    commercial_principles: Array.isArray(row.commercial_principles)
      ? (row.commercial_principles as string[])
      : [],
  };
}

export function parseBusinessPackMarketplaceEngineDashboard(
  data: unknown,
): BusinessPackMarketplaceEngineDashboard | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.has_access !== true) return { has_access: false };
  return {
    has_access: true,
    is_platform_admin: row.is_platform_admin === true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    commercial_principles: Array.isArray(row.commercial_principles)
      ? (row.commercial_principles as string[])
      : [],
    categories: Array.isArray(row.categories) ? (row.categories as string[]) : [],
    installation_flow: Array.isArray(row.installation_flow) ? (row.installation_flow as string[]) : [],
    governance: (row.governance as Record<string, string>) ?? {},
    forbidden: Array.isArray(row.forbidden) ? (row.forbidden as string[]) : [],
    summary: (row.summary as Record<string, number>) ?? {},
    listings: Array.isArray(row.listings) ? (row.listings as Array<Record<string, unknown>>) : [],
    top_viewed: Array.isArray(row.top_viewed) ? (row.top_viewed as Array<Record<string, unknown>>) : [],
    recent_audit: Array.isArray(row.recent_audit) ? (row.recent_audit as Array<Record<string, unknown>>) : [],
    success_criteria: Array.isArray(row.success_criteria) ? (row.success_criteria as string[]) : [],
  };
}

export function businessPackMarketplaceRoute(): string {
  return "/app/marketplace/business-packs";
}
