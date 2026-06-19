export type CompanionIdentityCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  core_identity?: Record<string, unknown>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  personality_traits?: Record<string, unknown>[];
  communication_profiles?: Record<string, unknown>[];
  adaptive_communication?: Record<string, unknown>[];
  style_profiles?: Record<string, unknown>[];
  humor_settings?: Record<string, unknown>[];
  introductions?: Record<string, unknown>[];
  executive_modes?: Record<string, unknown>[];
  preferences?: Record<string, unknown>[];
  themes?: Record<string, unknown>[];
  behavior_rules?: Record<string, unknown>[];
  wellbeing_signals?: Record<string, unknown>[];
  tone_governance?: Record<string, unknown>[];
  relationship_development?: Record<string, unknown>[];
  org_personality_profiles?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
};

export function parseCompanionIdentityCenter(raw: unknown): CompanionIdentityCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    core_identity:
      typeof row.core_identity === "object" && row.core_identity
        ? (row.core_identity as Record<string, unknown>)
        : {},
    stats: typeof row.stats === "object" && row.stats ? (row.stats as Record<string, number | string>) : {},
    companion_recommendations: Array.isArray(row.companion_recommendations)
      ? (row.companion_recommendations as Record<string, unknown>[])
      : [],
    personality_traits: Array.isArray(row.personality_traits)
      ? (row.personality_traits as Record<string, unknown>[])
      : [],
    communication_profiles: Array.isArray(row.communication_profiles)
      ? (row.communication_profiles as Record<string, unknown>[])
      : [],
    adaptive_communication: Array.isArray(row.adaptive_communication)
      ? (row.adaptive_communication as Record<string, unknown>[])
      : [],
    style_profiles: Array.isArray(row.style_profiles) ? (row.style_profiles as Record<string, unknown>[]) : [],
    humor_settings: Array.isArray(row.humor_settings) ? (row.humor_settings as Record<string, unknown>[]) : [],
    introductions: Array.isArray(row.introductions) ? (row.introductions as Record<string, unknown>[]) : [],
    executive_modes: Array.isArray(row.executive_modes) ? (row.executive_modes as Record<string, unknown>[]) : [],
    preferences: Array.isArray(row.preferences) ? (row.preferences as Record<string, unknown>[]) : [],
    themes: Array.isArray(row.themes) ? (row.themes as Record<string, unknown>[]) : [],
    behavior_rules: Array.isArray(row.behavior_rules) ? (row.behavior_rules as Record<string, unknown>[]) : [],
    wellbeing_signals: Array.isArray(row.wellbeing_signals)
      ? (row.wellbeing_signals as Record<string, unknown>[])
      : [],
    tone_governance: Array.isArray(row.tone_governance) ? (row.tone_governance as Record<string, unknown>[]) : [],
    relationship_development: Array.isArray(row.relationship_development)
      ? (row.relationship_development as Record<string, unknown>[])
      : [],
    org_personality_profiles: Array.isArray(row.org_personality_profiles)
      ? (row.org_personality_profiles as Record<string, unknown>[])
      : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
  };
}

export function filterProfilesByType(
  profiles: Record<string, unknown>[] | undefined,
  profileType: string
): Record<string, unknown>[] {
  return (profiles ?? []).filter((p) => String(p.profile_type) === profileType);
}
