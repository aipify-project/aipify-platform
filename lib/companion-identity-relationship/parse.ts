import type { CompanionIdentityRelationshipCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseCompanionIdentityRelationshipCenter(
  raw: unknown,
): CompanionIdentityRelationshipCenter {
  const row = asRecord(raw);
  const settingsRaw = asRecord(row.settings ?? row.identity_settings);

  const settings =
    Object.keys(settingsRaw).length > 0
      ? {
          companion_display_name: String(settingsRaw.companion_display_name ?? "Aipify"),
          official_name: String(settingsRaw.official_name ?? "Aipify"),
          relationship_mode: String(settingsRaw.relationship_mode ?? "hybrid"),
          tone_preference: String(settingsRaw.tone_preference ?? "conversational"),
          proactivity_level: String(settingsRaw.proactivity_level ?? "moderate"),
          humor_preference: String(settingsRaw.humor_preference ?? "subtle"),
          notification_style: String(settingsRaw.notification_style ?? "calm"),
          encouragement_preference: String(settingsRaw.encouragement_preference ?? "moderate"),
          briefing_style: String(settingsRaw.briefing_style ?? "concise"),
          personalization_enabled: Boolean(settingsRaw.personalization_enabled ?? true),
          boundary_settings: settingsRaw.boundary_settings
            ? asRecord(settingsRaw.boundary_settings)
            : null,
        }
      : null;

  const trustRaw = row.trust_indicators ?? row.trust_signals;
  const milestonesRaw = row.milestones ?? row.relationship_milestones;
  const reviewsRaw = row.pending_reviews ?? row.relationship_reviews;

  return {
    settings,
    trust_indicators: Array.isArray(trustRaw)
      ? trustRaw.map((s: unknown) => {
          const item = asRecord(s);
          return {
            signal_key: String(item.signal_key ?? ""),
            label: String(item.label ?? ""),
            score: Number(item.score ?? 0),
            trend: String(item.trend ?? "stable"),
          };
        })
      : [],
    milestones: Array.isArray(milestonesRaw)
      ? milestonesRaw.map((m: unknown) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            title: String(item.title ?? ""),
            milestone_type: String(item.milestone_type ?? ""),
            achieved_at: item.achieved_at ? String(item.achieved_at) : null,
            trust_score_delta:
              item.trust_score_delta != null ? Number(item.trust_score_delta) : null,
          };
        })
      : [],
    pending_reviews: Array.isArray(reviewsRaw)
      ? reviewsRaw
          .filter((r: unknown) => asRecord(r).status === "pending" || !asRecord(r).status)
          .map((r: unknown) => {
            const item = asRecord(r);
            return {
              review_key: String(item.review_key ?? ""),
              question: String(item.question ?? ""),
              status: String(item.status ?? "pending"),
              user_response: item.user_response ? String(item.user_response) : null,
            };
          })
      : [],
    personalization_status: Array.isArray(row.personalization_status)
      ? row.personalization_status.map((p: unknown) => {
          const item = asRecord(p);
          return {
            preference_key: String(item.preference_key ?? ""),
            category: String(item.category ?? ""),
            value: item.value ? asRecord(item.value) : null,
            adapted_at: item.adapted_at ? String(item.adapted_at) : null,
          };
        })
      : [],
    introduction_framework: row.introduction_framework
      ? String(row.introduction_framework)
      : null,
    blueprint: row.blueprint ? asRecord(row.blueprint) : null,
    links: row.links
      ? Object.fromEntries(
          Object.entries(asRecord(row.links)).map(([key, value]) => [key, String(value)]),
        )
      : null,
    can_manage: Boolean(row.can_manage),
    can_record: Boolean(row.can_record),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
