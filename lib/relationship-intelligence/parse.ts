import { isPersonType } from "./person-types";
import type {
  ConversationNote,
  RelationshipCenterBundle,
  RelationshipPerson,
  RelationshipSettings,
  TimelineEvent,
} from "./types";

function parseTimeline(raw: unknown): TimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = item as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      event_type: String(r.event_type ?? ""),
      title: String(r.title ?? ""),
      description: String(r.description ?? ""),
      event_date: r.event_date ? String(r.event_date) : null,
    };
  });
}

function parseNotes(raw: unknown): ConversationNote[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = item as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      topic: String(r.topic ?? ""),
      tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
      created_at: String(r.created_at ?? ""),
    };
  });
}

function parsePerson(raw: unknown): RelationshipPerson | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const personType = String(r.person_type ?? "friend");
  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    relationship: r.relationship ? String(r.relationship) : null,
    person_type: isPersonType(personType) ? personType : "friend",
    birthday: r.birthday ? String(r.birthday) : null,
    anniversary: r.anniversary ? String(r.anniversary) : null,
    notes: r.notes ? String(r.notes) : null,
    preferred_gifts: Array.isArray(r.preferred_gifts)
      ? (r.preferred_gifts as string[])
      : [],
    favorite_activities: Array.isArray(r.favorite_activities)
      ? (r.favorite_activities as string[])
      : [],
    communication_preferences: r.communication_preferences
      ? String(r.communication_preferences)
      : null,
    last_contact_at: r.last_contact_at ? String(r.last_contact_at) : null,
    status: String(r.status ?? "active"),
    timeline: parseTimeline(r.timeline),
    notes_list: parseNotes(r.notes),
  };
}

function parseSettings(raw: unknown): RelationshipSettings | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const s = raw as Record<string, unknown>;
  return {
    rsi_enabled: Boolean(s.rsi_enabled ?? true),
    ask_before_remembering: Boolean(s.ask_before_remembering ?? true),
    gift_suggestions_enabled: Boolean(s.gift_suggestions_enabled ?? true),
    follow_up_enabled: Boolean(s.follow_up_enabled ?? true),
    shared_memory_prepared: Boolean(s.shared_memory_prepared ?? false),
  };
}

export function parseRelationshipCenter(data: unknown): RelationshipCenterBundle {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;

  return {
    has_customer: Boolean(d.has_customer),
    settings: parseSettings(d.settings),
    ethical_boundaries: Array.isArray(d.ethical_boundaries)
      ? (d.ethical_boundaries as string[])
      : undefined,
    privacy_note: d.privacy_note ? String(d.privacy_note) : undefined,
    people: Array.isArray(d.people)
      ? d.people.map(parsePerson).filter((x): x is RelationshipPerson => x !== null)
      : [],
    upcoming_milestones: Array.isArray(d.upcoming_milestones)
      ? (d.upcoming_milestones as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return {
            id: String(r.id ?? ""),
            name: String(r.name ?? ""),
            type: String(r.type ?? ""),
            date: String(r.date ?? ""),
            message: String(r.message ?? ""),
          };
        })
      : [],
    social_reminders: Array.isArray(d.social_reminders)
      ? (d.social_reminders as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return { id: String(r.id ?? ""), message: String(r.message ?? "") };
        })
      : [],
    pending_follow_ups: Array.isArray(d.pending_follow_ups)
      ? (d.pending_follow_ups as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return {
            id: String(r.id ?? ""),
            title: String(r.title ?? ""),
            message: String(r.message ?? ""),
          };
        })
      : [],
    gift_opportunities: Array.isArray(d.gift_opportunities)
      ? (d.gift_opportunities as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return {
            person_id: String(r.person_id ?? ""),
            name: String(r.name ?? ""),
            message: String(r.message ?? ""),
            preferred_gifts: Array.isArray(r.preferred_gifts)
              ? (r.preferred_gifts as string[])
              : [],
            favorite_activities: Array.isArray(r.favorite_activities)
              ? (r.favorite_activities as string[])
              : [],
          };
        })
      : [],
    suggested_actions: Array.isArray(d.suggested_actions)
      ? (d.suggested_actions as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return { id: String(r.id ?? ""), message: String(r.message ?? "") };
        })
      : [],
    proactive_assistance: Array.isArray(d.proactive_assistance)
      ? (d.proactive_assistance as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return { id: String(r.id ?? ""), message: String(r.message ?? "") };
        })
      : [],
    shared_commitments: Array.isArray(d.shared_commitments)
      ? (d.shared_commitments as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return {
            id: String(r.id ?? ""),
            title: String(r.title ?? ""),
            memory_date: r.memory_date ? String(r.memory_date) : null,
          };
        })
      : [],
    shared_memory_architecture:
      d.shared_memory_architecture && typeof d.shared_memory_architecture === "object"
        ? (d.shared_memory_architecture as RelationshipCenterBundle["shared_memory_architecture"])
        : undefined,
  };
}
