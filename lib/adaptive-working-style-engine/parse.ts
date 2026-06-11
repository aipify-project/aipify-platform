import type { AwseCenterBundle, AwseUserPreferences } from "./types";

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function parseAwsePreferences(raw: unknown): AwseUserPreferences | null {
  const d = asObject(raw);
  if (!d.id) return null;
  return {
    id: asString(d.id),
    tenant_id: asString(d.tenant_id),
    user_id: asString(d.user_id),
    working_profile: asString(d.working_profile, "custom") as AwseUserPreferences["working_profile"],
    detail_level: asString(d.detail_level, "standard") as AwseUserPreferences["detail_level"],
    reminder_frequency: asString(
      d.reminder_frequency,
      "balanced"
    ) as AwseUserPreferences["reminder_frequency"],
    preferred_summary_time: asString(
      d.preferred_summary_time,
      "morning"
    ) as AwseUserPreferences["preferred_summary_time"],
    preferred_notification_categories: asObject(d.preferred_notification_categories),
    preferred_dashboard_layout: asObject(d.preferred_dashboard_layout),
    focus_mode_enabled: asBool(d.focus_mode_enabled),
    adaptive_learning_enabled: asBool(d.adaptive_learning_enabled),
    created_at: asString(d.created_at),
    updated_at: asString(d.updated_at),
  };
}

export function parseAwseCenter(raw: unknown): AwseCenterBundle {
  const d = asObject(raw);
  if (!d.has_customer) {
    return { has_customer: false };
  }

  const signals = Array.isArray(d.signals)
    ? d.signals.map((s) => {
        const row = asObject(s);
        return {
          id: asString(row.id),
          signal_type: asString(row.signal_type) as AwseCenterBundle["signals"] extends
            | (infer U)[]
            | undefined
            ? U extends { signal_type: infer ST }
              ? ST
              : never
            : never,
          signal_value: asString(row.signal_value),
          source_module: asString(row.source_module),
          created_at: asString(row.created_at),
        };
      })
    : [];

  const templates = Array.isArray(d.department_templates)
    ? d.department_templates.map((t) => {
        const row = asObject(t);
        return {
          id: asString(row.id),
          department_name: asString(row.department_name),
          working_profile: asString(row.working_profile, "custom") as AwseCenterBundle["department_templates"] extends
            | (infer U)[]
            | undefined
            ? U extends { working_profile: infer WP }
              ? WP
              : never
            : never,
          detail_level: asString(row.detail_level, "standard") as "compact" | "standard" | "detailed",
          reminder_frequency: asString(row.reminder_frequency, "balanced") as AwseUserPreferences["reminder_frequency"],
          role_names: Array.isArray(row.role_names)
            ? row.role_names.map((r) => asString(r)).filter(Boolean)
            : [],
          is_default: asBool(row.is_default),
        };
      })
    : [];

  const caps = asObject(d.capabilities);

  return {
    has_customer: true,
    preferences: parseAwsePreferences(d.preferences) ?? undefined,
    capabilities: {
      plan_key: asString(caps.plan_key, "starter"),
      manual_preferences_only: asBool(caps.manual_preferences_only, true),
      adaptive_learning_allowed: asBool(caps.adaptive_learning_allowed),
      enterprise_templates: asBool(caps.enterprise_templates),
      user_profiles: asBool(caps.user_profiles),
      daily_summary_customization: asBool(caps.daily_summary_customization),
    },
    signals,
    department_templates: templates,
    transparency_note: asString(d.transparency_note) || undefined,
    adaptation_suggestion: d.adaptation_suggestion === null ? null : asString(d.adaptation_suggestion) || undefined,
  };
}
