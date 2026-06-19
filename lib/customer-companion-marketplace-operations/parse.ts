import type {
  CompanionMarketplaceCenter,
  MarketplaceGovernance,
  MarketplaceInstall,
} from "./types";

function parseInstall(raw: Record<string, unknown>): MarketplaceInstall {
  return {
    install_key: String(raw.install_key ?? ""),
    extension_key: String(raw.extension_key ?? ""),
    extension_name: String(raw.extension_name ?? ""),
    publisher_name: raw.publisher_name ? String(raw.publisher_name) : undefined,
    version: raw.version ? String(raw.version) : undefined,
    install_status: raw.install_status ? String(raw.install_status) : undefined,
    permissions_granted: Array.isArray(raw.permissions_granted) ? raw.permissions_granted : undefined,
    installed_at: raw.installed_at ? String(raw.installed_at) : undefined,
  };
}

function parseGovernance(raw: Record<string, unknown>): MarketplaceGovernance {
  return {
    governance_key: String(raw.governance_key ?? ""),
    governance_title: String(raw.governance_title ?? ""),
    governance_type: raw.governance_type ? String(raw.governance_type) : undefined,
    governance_status: raw.governance_status ? String(raw.governance_status) : undefined,
    extension_key: raw.extension_key ? String(raw.extension_key) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

export function parseCompanionMarketplaceCenter(raw: Record<string, unknown>): CompanionMarketplaceCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as CompanionMarketplaceCenter["organization"],
    overview: raw.overview as CompanionMarketplaceCenter["overview"],
    extensions: Array.isArray(raw.extensions) ? (raw.extensions as Record<string, unknown>[]) : [],
    installed: Array.isArray(raw.installed)
      ? (raw.installed as Record<string, unknown>[]).map(parseInstall)
      : [],
    updates: Array.isArray(raw.updates) ? (raw.updates as Record<string, unknown>[]) : [],
    publishers: Array.isArray(raw.publishers) ? (raw.publishers as Record<string, unknown>[]) : [],
    reviews: Array.isArray(raw.reviews) ? (raw.reviews as Record<string, unknown>[]) : [],
    categories: Array.isArray(raw.categories) ? (raw.categories as string[]) : [],
    governance: Array.isArray(raw.governance)
      ? (raw.governance as Record<string, unknown>[]).map(parseGovernance)
      : [],
    reports: raw.reports as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as CompanionMarketplaceCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
