import type {
  PersonalizationDashboard,
  PersonalizationInsight,
  PersonalizationPreference,
  PersonalizationProfile,
  PersonalizationTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

function parseProfile(raw: unknown): PersonalizationProfile | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    communication_styles: Array.isArray(d.communication_styles) ? d.communication_styles.map(String) : undefined,
    briefing_style: str(d.briefing_style) || undefined,
    notification_style: str(d.notification_style) || undefined,
    companion_personality: str(d.companion_personality) || undefined,
    adaptation_level: str(d.adaptation_level) || undefined,
    preferred_language: str(d.preferred_language) || undefined,
    secondary_language: str(d.secondary_language) || undefined,
    report_language: str(d.report_language) || undefined,
    notification_language: str(d.notification_language) || undefined,
    notify_email: typeof d.notify_email === "boolean" ? d.notify_email : undefined,
    notify_desktop: typeof d.notify_desktop === "boolean" ? d.notify_desktop : undefined,
    notify_mobile: typeof d.notify_mobile === "boolean" ? d.notify_mobile : undefined,
    notify_in_app: typeof d.notify_in_app === "boolean" ? d.notify_in_app : undefined,
    learning_preference: str(d.learning_preference) || undefined,
    workflow_preferences: d.workflow_preferences as Record<string, unknown> | undefined,
    personalization_score: num(d.personalization_score),
  };
}

function parsePrefs(raw: unknown): PersonalizationPreference[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      pref_key: str(d.pref_key),
      category: str(d.category),
      title: str(d.title),
      value: str(d.value),
      source_key: str(d.source_key),
      confidence: str(d.confidence),
      status: str(d.status),
      updated_at: str(d.updated_at),
    };
  });
}

export function parsePersonalizationDashboard(data: unknown): PersonalizationDashboard {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const timeline = Array.isArray(d.timeline)
    ? d.timeline.map((i) => {
        const e = i as Record<string, unknown>;
        return {
          id: str(e.id),
          event_type: str(e.event_type),
          description: str(e.description),
          created_at: str(e.created_at),
        } satisfies PersonalizationTimelineEvent;
      })
    : [];
  return {
    found: bool(d.found),
    can_self: bool(d.can_self),
    can_org_defaults: bool(d.can_org_defaults),
    can_manage_org: bool(d.can_manage_org),
    has_preferences: bool(d.has_preferences),
    personalization_score: num(d.personalization_score),
    active_preferences_count: num(d.active_preferences_count),
    profile: parseProfile(d.profile),
    preferences: parsePrefs(d.preferences),
    timeline,
    usage_examples: Array.isArray(d.usage_examples) ? d.usage_examples.map(String) : [],
    privacy_note: str(d.privacy_note),
    principle: str(d.principle),
  };
}

export function parsePersonalizationPreferences(data: unknown): { found: boolean; preferences: PersonalizationPreference[] } {
  if (!data || typeof data !== "object") return { found: false, preferences: [] };
  const d = data as Record<string, unknown>;
  return { found: bool(d.found), preferences: parsePrefs(d.preferences) };
}

export function parsePersonalizationInsights(data: unknown): { found: boolean; insights: PersonalizationInsight[] } {
  if (!data || typeof data !== "object") return { found: false, insights: [] };
  const d = data as Record<string, unknown>;
  const insights = Array.isArray(d.insights)
    ? d.insights.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id),
          title: str(x.title),
          summary: str(x.summary),
          insight_type: str(x.insight_type),
          created_at: str(x.created_at),
        } satisfies PersonalizationInsight;
      })
    : [];
  return { found: bool(d.found), insights };
}

export function parsePersonalizationAction(data: unknown): { ok: boolean; error?: string } {
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;
  return { ok: bool(d.ok), error: str(d.error) || undefined };
}
