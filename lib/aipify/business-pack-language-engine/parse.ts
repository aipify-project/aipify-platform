import type {
  BusinessPackLanguageCenter,
  BusinessPackLanguageEngineDashboard,
  PackLanguageRow,
} from "./types";

function parseLanguageRows(value: unknown): PackLanguageRow[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (row): row is PackLanguageRow =>
      typeof row === "object" && row !== null && typeof (row as PackLanguageRow).locale === "string",
  );
}

export function parseBusinessPackLanguageCenter(data: unknown): BusinessPackLanguageCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) {
    return { found: false, pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined };
  }
  const overview = row.overview as Record<string, unknown> | undefined;
  return {
    found: true,
    pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    definition: row.definition as BusinessPackLanguageCenter["definition"],
    overview: overview
      ? {
          installed_languages: parseLanguageRows(overview.installed_languages),
          available_languages: parseLanguageRows(overview.available_languages),
          default_language: String(overview.default_language ?? "en"),
          default_language_label: String(overview.default_language_label ?? "English"),
          translation_completion_percent: Number(overview.translation_completion_percent ?? 0),
          installation_complete: overview.installation_complete === true,
          resources_generated_at:
            typeof overview.resources_generated_at === "string" ? overview.resources_generated_at : null,
        }
      : undefined,
    installation_flow: Array.isArray(row.installation_flow) ? (row.installation_flow as string[]) : [],
    fallback_rules: Array.isArray(row.fallback_rules) ? (row.fallback_rules as string[]) : [],
    notifications: Array.isArray(row.notifications)
      ? (row.notifications as BusinessPackLanguageCenter["notifications"])
      : [],
    governance_note: typeof row.governance_note === "string" ? row.governance_note : undefined,
    language_center_route: typeof row.language_center_route === "string" ? row.language_center_route : undefined,
    landing_route: typeof row.landing_route === "string" ? row.landing_route : undefined,
  };
}

export function parseBusinessPackLanguageEngineDashboard(data: unknown): BusinessPackLanguageEngineDashboard | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.has_access !== true) return { has_access: false };
  return {
    has_access: true,
    is_platform_admin: row.is_platform_admin === true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    mandatory_languages: Array.isArray(row.mandatory_languages) ? (row.mandatory_languages as string[]) : [],
    optional_languages: Array.isArray(row.optional_languages) ? (row.optional_languages as string[]) : [],
    installation_flow: Array.isArray(row.installation_flow) ? (row.installation_flow as string[]) : [],
    localization_scope: Array.isArray(row.localization_scope) ? (row.localization_scope as string[]) : [],
    governance: (row.governance as Record<string, string>) ?? {},
    forbidden: Array.isArray(row.forbidden) ? (row.forbidden as string[]) : [],
    summary: (row.summary as Record<string, number>) ?? {},
    definitions: Array.isArray(row.definitions) ? (row.definitions as Array<Record<string, unknown>>) : [],
    recent_audit: Array.isArray(row.recent_audit) ? (row.recent_audit as Array<Record<string, unknown>>) : [],
    success_criteria: Array.isArray(row.success_criteria) ? (row.success_criteria as string[]) : [],
  };
}

export function packLanguageRoute(packKey: string): string {
  return `/app/marketplace/packs/${packKey}/languages`;
}
