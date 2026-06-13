import type { ApprovalProfilesCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseProfile(raw: unknown): ApprovalProfilesCenter["active_profiles"][0] {
  const row = asRecord(raw);
  return {
    profile_key: String(row.profile_key ?? ""),
    profile_name: String(row.profile_name ?? ""),
    profile_type: String(row.profile_type ?? ""),
    owner_label: row.owner_label ? String(row.owner_label) : null,
    approval_mode: String(row.approval_mode ?? "simplified"),
    review_state: String(row.review_state ?? "current"),
    status: String(row.status ?? "active"),
    spending_thresholds: row.spending_thresholds ? asRecord(row.spending_thresholds) : null,
    approved_categories: Array.isArray(row.approved_categories)
      ? row.approved_categories.map(String)
      : null,
  };
}

export function parseApprovalProfilesCenter(raw: unknown): ApprovalProfilesCenter {
  const row = asRecord(raw);
  const settingsRaw = asRecord(row.settings);

  return {
    settings:
      Object.keys(settingsRaw).length > 0
        ? {
            profiles_enabled: Boolean(settingsRaw.profiles_enabled ?? true),
            default_approval_mode: String(settingsRaw.default_approval_mode ?? "simplified"),
          }
        : null,
    active_profiles: Array.isArray(row.active_profiles)
      ? row.active_profiles.map(parseProfile)
      : Array.isArray(row.profiles)
        ? row.profiles.filter((p) => asRecord(p).status === "active").map(parseProfile)
        : [],
    pending_reviews: Array.isArray(row.pending_reviews)
      ? row.pending_reviews.map(parseProfile)
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((rec) => {
          const r = asRecord(rec);
          return {
            recommendation_key: String(r.recommendation_key ?? ""),
            message: String(r.message ?? ""),
            profile_type: r.profile_type ? String(r.profile_type) : null,
            status: String(r.status ?? "pending"),
          };
        })
      : [],
    approval_activity: Array.isArray(row.approval_activity)
      ? row.approval_activity.map((a) => {
          const item = asRecord(a);
          return {
            activity_key: String(item.activity_key ?? ""),
            profile_key: String(item.profile_key ?? ""),
            action_category: String(item.action_category ?? ""),
            approved_via_profile: Boolean(item.approved_via_profile),
            override_used: Boolean(item.override_used),
            time_saved_minutes: Number(item.time_saved_minutes ?? 0),
            created_at: String(item.created_at ?? ""),
          };
        })
      : [],
    time_savings: row.time_savings ? asRecord(row.time_savings) : null,
    governance_indicators: row.governance_indicators ? asRecord(row.governance_indicators) : null,
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
