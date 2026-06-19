import type {
  BusinessPack,
  InstalledPack,
  MarketplaceOperationsCenter,
  PackHealth,
  PackTrial,
  PackUpdate,
} from "./types";

function parsePack(row: Record<string, unknown>): BusinessPack {
  return {
    pack_key: String(row.pack_key ?? ""),
    pack_name: String(row.pack_name ?? ""),
    description: row.description ? String(row.description) : undefined,
    category: row.category ? String(row.category) : undefined,
    industry_key: row.industry_key ? String(row.industry_key) : undefined,
    version: row.version ? String(row.version) : undefined,
    pricing_model: row.pricing_model ? String(row.pricing_model) : undefined,
    starting_price_monthly: row.starting_price_monthly != null ? Number(row.starting_price_monthly) : undefined,
    trial_days: row.trial_days != null ? Number(row.trial_days) : undefined,
    dependencies: row.dependencies,
    status: row.status ? String(row.status) : undefined,
    is_featured: row.is_featured === true,
    release_notes: row.release_notes ? String(row.release_notes) : undefined,
    detail_href: row.detail_href ? String(row.detail_href) : undefined,
    install_href: row.install_href ? String(row.install_href) : undefined,
    dependency_check: row.dependency_check as BusinessPack["dependency_check"],
  };
}

function parseInstalled(row: Record<string, unknown>): InstalledPack {
  return {
    pack_key: String(row.pack_key ?? ""),
    pack_name: row.pack_name ? String(row.pack_name) : undefined,
    domain_id: row.domain_id ? String(row.domain_id) : undefined,
    domain: row.domain ? String(row.domain) : undefined,
    license_status: row.license_status ? String(row.license_status) : undefined,
    status: row.status ? String(row.status) : undefined,
    category: row.category ? String(row.category) : undefined,
    version: row.version ? String(row.version) : undefined,
    installed_at: row.installed_at ? String(row.installed_at) : undefined,
  };
}

export function parseMarketplaceOperationsCenter(row: Record<string, unknown>): MarketplaceOperationsCenter {
  const parsePacks = (value: unknown) =>
    Array.isArray(value) ? value.map((r) => parsePack(r as Record<string, unknown>)) : undefined;

  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    pack_statuses: Array.isArray(row.pack_statuses) ? row.pack_statuses.map(String) : undefined,
    categories: Array.isArray(row.categories) ? row.categories.map(String) : undefined,
    featured_packs: parsePacks(row.featured_packs),
    business_packs: parsePacks(row.business_packs),
    installed_packs: Array.isArray(row.installed_packs)
      ? row.installed_packs.map((r) => parseInstalled(r as Record<string, unknown>))
      : undefined,
    recommended_packs: parsePacks(row.recommended_packs),
    industry_packs: parsePacks(row.industry_packs),
    available_upgrades: Array.isArray(row.available_upgrades)
      ? row.available_upgrades.map((r) => {
          const u = r as Record<string, unknown>;
          return {
            id: String(u.id ?? ""),
            pack_key: String(u.pack_key ?? ""),
            from_version: u.from_version ? String(u.from_version) : undefined,
            to_version: u.to_version ? String(u.to_version) : undefined,
            update_type: u.update_type ? String(u.update_type) : undefined,
            release_notes: u.release_notes ? String(u.release_notes) : undefined,
          } satisfies PackUpdate;
        })
      : undefined,
    connectors: Array.isArray(row.connectors)
      ? row.connectors.map((c) => {
          const item = c as Record<string, unknown>;
          return {
            connector_key: item.connector_key ? String(item.connector_key) : undefined,
            connector_name: item.connector_name ? String(item.connector_name) : undefined,
            category: item.category ? String(item.category) : undefined,
          };
        })
      : undefined,
    licenses: row.licenses as Record<string, unknown> | undefined,
    domains: Array.isArray(row.domains)
      ? row.domains.map((d) => {
          const item = d as Record<string, unknown>;
          return {
            domain_id: item.domain_id ? String(item.domain_id) : undefined,
            domain: item.domain ? String(item.domain) : undefined,
            license_status: item.license_status ? String(item.license_status) : undefined,
            pack_count: item.pack_count != null ? Number(item.pack_count) : undefined,
          };
        })
      : undefined,
    purchases: Array.isArray(row.purchases)
      ? row.purchases.map((p) => {
          const item = p as Record<string, unknown>;
          return {
            pack_key: item.pack_key ? String(item.pack_key) : undefined,
            event_type: item.event_type ? String(item.event_type) : undefined,
            summary: item.summary ? String(item.summary) : undefined,
            created_at: item.created_at ? String(item.created_at) : undefined,
          };
        })
      : undefined,
    trials: Array.isArray(row.trials)
      ? row.trials.map((t) => {
          const item = t as Record<string, unknown>;
          return {
            id: String(item.id ?? ""),
            pack_key: String(item.pack_key ?? ""),
            domain_id: item.domain_id ? String(item.domain_id) : undefined,
            trial_days: item.trial_days != null ? Number(item.trial_days) : undefined,
            status: item.status ? String(item.status) : undefined,
            expires_at: item.expires_at ? String(item.expires_at) : undefined,
          } satisfies PackTrial;
        })
      : undefined,
    pack_health: Array.isArray(row.pack_health)
      ? row.pack_health.map((h) => {
          const item = h as Record<string, unknown>;
          return {
            pack_key: String(item.pack_key ?? ""),
            health_status: item.health_status ? String(item.health_status) : undefined,
            active_users: item.active_users != null ? Number(item.active_users) : undefined,
            error_count: item.error_count != null ? Number(item.error_count) : undefined,
            license_compliant: item.license_compliant === true,
            summary: item.summary ? String(item.summary) : undefined,
            checked_at: item.checked_at ? String(item.checked_at) : undefined,
          } satisfies PackHealth;
        })
      : undefined,
    reviews: Array.isArray(row.reviews)
      ? row.reviews.map((r) => {
          const item = r as Record<string, unknown>;
          return {
            id: String(item.id ?? ""),
            pack_key: String(item.pack_key ?? ""),
            rating: Number(item.rating ?? 0),
            review_text: item.review_text ? String(item.review_text) : undefined,
            feedback_type: item.feedback_type ? String(item.feedback_type) : undefined,
            created_at: item.created_at ? String(item.created_at) : undefined,
          };
        })
      : undefined,
    companion_advisor: row.companion_advisor as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    platform_governance: row.platform_governance as Record<string, unknown> | undefined,
    analytics: row.analytics as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            pack_key: e.pack_key ? String(e.pack_key) : undefined,
            section: e.section ? String(e.section) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}

export function parseMarketplaceSearchResults(row: Record<string, unknown>): BusinessPack[] {
  if (row.found !== true || !Array.isArray(row.results)) return [];
  return row.results.map((r) => parsePack(r as Record<string, unknown>));
}
