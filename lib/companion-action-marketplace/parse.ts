import { ACTION_MARKETPLACE_CATEGORIES } from "./constants";
import type { ActionProvider, CompanionActionMarketplaceCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseProvider(raw: unknown): ActionProvider {
  const row = asRecord(raw);
  return {
    provider_key: String(row.provider_key ?? ""),
    provider_name: String(row.provider_name ?? ""),
    category: String(row.category ?? ""),
    governance_level: Number(row.governance_level ?? 2),
    integration_status: String(row.integration_status ?? "active"),
    health_score: row.health_score != null ? Number(row.health_score) : null,
    installed: Boolean(row.installed ?? row.is_installed),
    countries_supported: Array.isArray(row.countries_supported)
      ? row.countries_supported.map(String)
      : null,
  };
}

function parseCatalog(raw: unknown): CompanionActionMarketplaceCenter["catalog_by_category"] {
  const row = asRecord(raw);
  const catalog = {} as CompanionActionMarketplaceCenter["catalog_by_category"];
  for (const category of ACTION_MARKETPLACE_CATEGORIES) {
    catalog[category] = Array.isArray(row[category]) ? row[category].map(parseProvider) : [];
  }
  return catalog;
}

export function parseCompanionActionMarketplaceCenter(
  raw: unknown,
): CompanionActionMarketplaceCenter {
  const row = asRecord(raw);
  const prefsRaw = asRecord(row.user_preferences);

  return {
    catalog_by_category: parseCatalog(row.catalog_by_category ?? row.available_by_category),
    installed_providers: Array.isArray(row.installed_providers)
      ? row.installed_providers.map(parseProvider)
      : Array.isArray(row.installed)
        ? row.installed.map(parseProvider)
        : [],
    recommended: Array.isArray(row.recommended)
      ? row.recommended.map((rec) => {
          const r = asRecord(rec);
          return {
            provider_key: String(r.provider_key ?? ""),
            provider_name: r.provider_name ? String(r.provider_name) : undefined,
            message: String(r.message ?? ""),
            status: String(r.status ?? "pending"),
          };
        })
      : [],
    governance_warnings: Array.isArray(row.governance_warnings)
      ? row.governance_warnings.map((w) => {
          const item = asRecord(w);
          return {
            provider_key: String(item.provider_key ?? ""),
            message: String(item.message ?? ""),
            severity: item.severity ? String(item.severity) : undefined,
          };
        })
      : [],
    usage_trends: row.usage_trends ? asRecord(row.usage_trends) : null,
    user_preferences:
      Object.keys(prefsRaw).length > 0
        ? {
            usage_context: String(prefsRaw.usage_context ?? "both"),
            spending_limits: prefsRaw.spending_limits ? asRecord(prefsRaw.spending_limits) : null,
            approval_requirements: prefsRaw.approval_requirements
              ? asRecord(prefsRaw.approval_requirements)
              : null,
            preferred_providers: Array.isArray(prefsRaw.preferred_providers)
              ? prefsRaw.preferred_providers.map(String)
              : null,
          }
        : null,
    org_controls: row.org_controls ? asRecord(row.org_controls) : null,
    action_history: Array.isArray(row.action_history)
      ? row.action_history.map((h) => {
          const item = asRecord(h);
          return {
            request_key: String(item.request_key ?? ""),
            action_category: String(item.action_category ?? ""),
            provider_key: String(item.provider_key ?? ""),
            status: String(item.status ?? ""),
            outcome_summary: item.outcome_summary ? String(item.outcome_summary) : null,
            created_at: String(item.created_at ?? ""),
          };
        })
      : [],
    execution_flow: Array.isArray(row.execution_flow)
      ? row.execution_flow.map((step) => {
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
    can_record: Boolean(row.can_record),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
