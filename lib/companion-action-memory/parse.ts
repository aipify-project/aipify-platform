import type { CompanionActionMemoryCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseMemoryEntry(raw: unknown): CompanionActionMemoryCenter["remembered_preferences"][0] {
  const row = asRecord(raw);
  return {
    memory_key: String(row.memory_key ?? ""),
    category: String(row.category ?? ""),
    description: String(row.description ?? ""),
    origin_event: row.origin_event ? String(row.origin_event) : null,
    last_used_at: row.last_used_at ? String(row.last_used_at) : null,
    confidence_level: String(row.confidence_level ?? "learned_once"),
    user_confirmed: Boolean(row.user_confirmed),
    status: String(row.status ?? "active"),
  };
}

export function parseCompanionActionMemoryCenter(raw: unknown): CompanionActionMemoryCenter {
  const row = asRecord(raw);
  const settingsRaw = asRecord(row.settings);

  const settings =
    Object.keys(settingsRaw).length > 0
      ? {
          memory_enabled: Boolean(settingsRaw.memory_enabled ?? true),
          enabled_categories: Array.isArray(settingsRaw.enabled_categories)
            ? settingsRaw.enabled_categories.map(String)
            : [],
          disabled_categories: Array.isArray(settingsRaw.disabled_categories)
            ? settingsRaw.disabled_categories.map(String)
            : [],
        }
      : null;

  return {
    settings,
    remembered_preferences: Array.isArray(row.remembered_preferences)
      ? row.remembered_preferences.map(parseMemoryEntry)
      : Array.isArray(row.memory_registry)
        ? row.memory_registry.map(parseMemoryEntry)
        : [],
    recent_patterns: Array.isArray(row.recent_patterns)
      ? row.recent_patterns.map(parseMemoryEntry)
      : [],
    suggestions: Array.isArray(row.suggestions)
      ? row.suggestions.map((s) => {
          const item = asRecord(s);
          return {
            suggestion_key: String(item.suggestion_key ?? ""),
            memory_key: item.memory_key ? String(item.memory_key) : null,
            message: String(item.message ?? ""),
            status: String(item.status ?? "pending"),
          };
        })
      : [],
    validations: Array.isArray(row.validations)
      ? row.validations.map((v) => {
          const item = asRecord(v);
          return {
            validation_key: String(item.validation_key ?? ""),
            message: String(item.message ?? ""),
            trigger_type: String(item.trigger_type ?? ""),
            status: String(item.status ?? "pending"),
          };
        })
      : [],
    categories_enabled: Array.isArray(row.categories_enabled)
      ? row.categories_enabled.map(String)
      : settings?.enabled_categories ?? [],
    blueprint: row.blueprint ? asRecord(row.blueprint) : null,
    links: row.links
      ? Object.fromEntries(
          Object.entries(asRecord(row.links)).map(([key, value]) => [key, String(value)]),
        )
      : null,
    can_manage: Boolean(row.can_manage),
    can_record: Boolean(row.can_record),
    can_delete: Boolean(row.can_delete),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
