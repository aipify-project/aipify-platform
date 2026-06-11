import type { BusinessDnaCenterBundle, ProfileStatus } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function parseBusinessDnaCenter(data: unknown): BusinessDnaCenterBundle {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  const profile = d.profile as Record<string, unknown> | undefined;

  return {
    has_customer: Boolean(d.has_customer),
    profile: profile
      ? {
          id: String(profile.id ?? ""),
          company_name: String(profile.company_name ?? ""),
          industry: String(profile.industry ?? ""),
          business_description: String(profile.business_description ?? ""),
          primary_language: String(profile.primary_language ?? "en"),
          supported_languages: asArray<string>(profile.supported_languages),
          tone_of_voice: String(profile.tone_of_voice ?? ""),
          support_style: String(profile.support_style ?? ""),
          risk_level: String(profile.risk_level ?? "balanced"),
          profile_status: (profile.profile_status as ProfileStatus) ?? "draft",
          approved_at: profile.approved_at as string | null | undefined,
        }
      : undefined,
    settings: d.settings as BusinessDnaCenterBundle["settings"],
    health: d.health as BusinessDnaCenterBundle["health"],
    products: asArray(d.products),
    workflows: asArray(d.workflows),
    knowledge: asArray(d.knowledge),
    templates: asArray(d.templates),
    tone_profiles: asArray(d.tone_profiles),
    escalation_rules: asArray(d.escalation_rules),
    knowledge_sources: asArray(d.knowledge_sources),
    template_suggestions: asArray(d.template_suggestions),
    automation_readiness: d.automation_readiness as BusinessDnaCenterBundle["automation_readiness"],
    recent_drafts: asArray(d.recent_drafts),
    audit_log: asArray(d.audit_log),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    integrations: d.integrations as Record<string, string>,
  };
}
