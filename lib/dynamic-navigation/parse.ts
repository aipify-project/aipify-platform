import type {
  CompanionNavigationContext,
  DynamicAppNavigation,
  DynamicPortalNavigation,
  NavigationPreferencesCenter,
  NavigationSearchResult,
} from "./types";

export function parseDynamicAppNavigation(data: unknown): DynamicAppNavigation | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    license_status: typeof row.license_status === "string" ? row.license_status : undefined,
    suspended: row.suspended === true,
    suspended_notice: typeof row.suspended_notice === "string" ? row.suspended_notice : null,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    visibility_rule: typeof row.visibility_rule === "string" ? row.visibility_rule : undefined,
    layout_mode: row.layout_mode === "flat" ? "flat" : "grouped",
    default_landing_href: typeof row.default_landing_href === "string" ? row.default_landing_href : undefined,
    categories: Array.isArray(row.categories) ? (row.categories as DynamicAppNavigation["categories"]) : [],
    personalization: row.personalization as DynamicAppNavigation["personalization"],
    mobile_nav_keys: Array.isArray(row.mobile_nav_keys) ? (row.mobile_nav_keys as string[]) : [],
    settings_route: typeof row.settings_route === "string" ? row.settings_route : undefined,
    preferences_route: typeof row.preferences_route === "string" ? row.preferences_route : undefined,
  };
}

export function parseDynamicPortalNavigation(data: unknown): DynamicPortalNavigation | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false, error: typeof row.error === "string" ? row.error : undefined };
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    categories: Array.isArray(row.categories) ? (row.categories as DynamicPortalNavigation["categories"]) : [],
  };
}

export function parseCompanionNavigationContext(data: unknown): CompanionNavigationContext | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    license_status: typeof row.license_status === "string" ? row.license_status : undefined,
    suspended: row.suspended === true,
    visible_modules: Array.isArray(row.visible_modules)
      ? (row.visible_modules as CompanionNavigationContext["visible_modules"])
      : [],
    principle: typeof row.principle === "string" ? row.principle : undefined,
  };
}

export function parseNavigationSearchResult(data: unknown): NavigationSearchResult | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    found: row.found !== false,
    query: typeof row.query === "string" ? row.query : null,
    items: Array.isArray(row.items) ? (row.items as NavigationSearchResult["items"]) : [],
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
  };
}

export function parseNavigationPreferencesCenter(data: unknown): NavigationPreferencesCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    navigation: row.navigation ? (parseDynamicAppNavigation(row.navigation) ?? undefined) : undefined,
    owner_preferences: Array.isArray(row.owner_preferences)
      ? (row.owner_preferences as NavigationPreferencesCenter["owner_preferences"])
      : [],
    departments: Array.isArray(row.departments)
      ? (row.departments as NavigationPreferencesCenter["departments"])
      : [],
  };
}
