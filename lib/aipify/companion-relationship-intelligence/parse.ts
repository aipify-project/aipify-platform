import type {
  RecognitionOpportunity,
  RelationshipIntelligenceDashboard,
  RelationshipInteraction,
  RelationshipOpportunity,
  RelationshipProfile,
  RelationshipReminder,
  RelationshipTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

function parseProfiles(raw: unknown): RelationshipProfile[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      contact_name: str(d.contact_name),
      organization_name: str(d.organization_name),
      contact_role: str(d.contact_role) || undefined,
      relationship_type: str(d.relationship_type),
      health_level: str(d.health_level),
      health_score: num(d.health_score),
      engagement_level: str(d.engagement_level),
      last_interaction_at: str(d.last_interaction_at) || null,
      recommended_action: str(d.recommended_action) || undefined,
      owner_label: str(d.owner_label) || undefined,
      department: str(d.department) || undefined,
      insight: str(d.insight) || undefined,
      signals: typeof d.signals === "object" && d.signals ? (d.signals as Record<string, unknown>) : undefined,
    };
  });
}

export function parseRelationshipIntelligenceDashboard(data: unknown): RelationshipIntelligenceDashboard {
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
        } satisfies RelationshipTimelineEvent;
      })
    : [];
  return {
    found: bool(d.found),
    has_relationships: bool(d.has_relationships),
    role: str(d.role) || undefined,
    can_team: bool(d.can_team),
    can_organization: bool(d.can_organization),
    can_executive: bool(d.can_executive),
    relationship_health_score: num(d.relationship_health_score),
    strategic_count: num(d.strategic_count),
    attention_count: num(d.attention_count),
    profiles: parseProfiles(d.profiles),
    timeline,
    usage_example: str(d.usage_example),
    privacy_note: str(d.privacy_note),
    principle: str(d.principle),
  };
}

export function parseRelationshipProfileDetail(data: unknown): {
  found: boolean;
  profile?: RelationshipProfile;
  interactions: RelationshipInteraction[];
} {
  if (!data || typeof data !== "object") return { found: false, interactions: [] };
  const d = data as Record<string, unknown>;
  const profile = d.profile ? parseProfiles([d.profile])[0] : undefined;
  const interactions = Array.isArray(d.interactions)
    ? d.interactions.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id),
          interaction_type: str(x.interaction_type),
          title: str(x.title),
          description: str(x.description),
          interaction_date: str(x.interaction_date),
        };
      })
    : [];
  return { found: bool(d.found), profile, interactions };
}

export function parseRelationshipOpportunities(data: unknown): {
  found: boolean;
  opportunities: RelationshipOpportunity[];
} {
  if (!data || typeof data !== "object") return { found: false, opportunities: [] };
  const d = data as Record<string, unknown>;
  const opportunities = Array.isArray(d.opportunities)
    ? d.opportunities.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id),
          profile_id: str(x.profile_id) || null,
          opportunity_type: str(x.opportunity_type),
          title: str(x.title),
          description: str(x.description),
          priority: str(x.priority),
          status: str(x.status),
        };
      })
    : [];
  return { found: bool(d.found), opportunities };
}

export function parseRelationshipReminders(data: unknown): {
  found: boolean;
  reminders: RelationshipReminder[];
  recognition: RecognitionOpportunity[];
} {
  if (!data || typeof data !== "object") return { found: false, reminders: [], recognition: [] };
  const d = data as Record<string, unknown>;
  const reminders = Array.isArray(d.reminders)
    ? d.reminders.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id),
          profile_id: str(x.profile_id) || null,
          reminder_type: str(x.reminder_type),
          title: str(x.title),
          due_date: str(x.due_date),
          status: str(x.status),
        };
      })
    : [];
  const recognition = Array.isArray(d.recognition)
    ? d.recognition.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id),
          profile_id: str(x.profile_id) || null,
          recognition_type: str(x.recognition_type),
          title: str(x.title),
          description: str(x.description),
          status: str(x.status),
        };
      })
    : [];
  return { found: bool(d.found), reminders, recognition };
}

export function parseRelationshipNoteAction(data: unknown): { ok: boolean; profile_id?: string; error?: string } {
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;
  return {
    ok: bool(d.ok),
    profile_id: str(d.profile_id) || undefined,
    error: str(d.error) || undefined,
  };
}
