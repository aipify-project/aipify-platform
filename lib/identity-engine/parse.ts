import {
  COMMUNICATION_STYLES,
  IDENTITY_MODES,
  IDENTITY_TONES,
  NAME_USAGE_OPTIONS,
  NOTIFICATION_STYLES,
  PROACTIVITY_LEVELS,
  RESPONSE_LENGTHS,
  SOCIAL_STYLES,
  type CommunicationStyle,
  type IdentityMode,
  type IdentityTone,
  type NameUsage,
  type NotificationStyle,
  type ProactivityLevel,
  type ResponseLength,
  type SocialInteractionStyle,
} from "./dimensions";
import type {
  IdentityBoundaries,
  IdentityCenterBundle,
  IdentityObservation,
  IdentityProfile,
  NotificationPreferences,
} from "./types";

function asEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const s = String(value ?? fallback);
  return (allowed as readonly string[]).includes(s) ? (s as T) : fallback;
}

function parseProfile(raw: unknown): IdentityProfile | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const p = raw as Record<string, unknown>;
  const notif = (p.notification_preferences ?? {}) as Record<string, unknown>;
  const bounds = (p.boundaries ?? {}) as Record<string, unknown>;

  return {
    id: String(p.id ?? ""),
    communication_style: asEnum(p.communication_style, COMMUNICATION_STYLES, "supportive"),
    proactivity_level: asEnum(p.proactivity_level, PROACTIVITY_LEVELS, "balanced"),
    tone: asEnum(p.tone, IDENTITY_TONES, "supportive"),
    name_usage: asEnum(p.name_usage, NAME_USAGE_OPTIONS, "occasional"),
    notification_style: asEnum(p.notification_style, NOTIFICATION_STYLES, "balanced"),
    identity_mode: asEnum(p.identity_mode, IDENTITY_MODES, "supportive"),
    social_interaction_style: asEnum(p.social_interaction_style, SOCIAL_STYLES, "trusted_organizer"),
    response_length: asEnum(p.response_length, RESPONSE_LENGTHS, "balanced"),
    notification_preferences: {
      push: Boolean(notif.push ?? true),
      email: Boolean(notif.email ?? false),
      calendar: Boolean(notif.calendar ?? false),
      in_app: Boolean(notif.in_app ?? true),
      daily_summaries: Boolean(notif.daily_summaries ?? false),
    },
    boundaries: {
      no_repeated_contact: Boolean(bounds.no_repeated_contact ?? true),
      no_excessive_notifications: Boolean(bounds.no_excessive_notifications ?? true),
      no_emotional_pressure: Boolean(bounds.no_emotional_pressure ?? true),
      no_dependency_encouragement: Boolean(bounds.no_dependency_encouragement ?? true),
      no_guilt: Boolean(bounds.no_guilt ?? true),
    },
    onboarding_completed: Boolean(p.onboarding_completed ?? false),
    created_at: String(p.created_at ?? ""),
    updated_at: String(p.updated_at ?? ""),
  };
}

function parseObservation(raw: unknown): IdentityObservation | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  return {
    id: String(o.id ?? ""),
    observation_type: String(o.observation_type ?? ""),
    description: String(o.description ?? ""),
    confidence_score: Number(o.confidence_score ?? 0),
    suggested_change:
      o.suggested_change && typeof o.suggested_change === "object"
        ? (o.suggested_change as Record<string, unknown>)
        : undefined,
    status: o.status ? String(o.status) : undefined,
    created_at: String(o.created_at ?? ""),
  };
}

export function parseIdentityCenter(data: unknown): IdentityCenterBundle {
  if (!data || typeof data !== "object") return { has_customer: false };
  const d = data as Record<string, unknown>;

  return {
    has_customer: Boolean(d.has_customer),
    user_name: d.user_name ? String(d.user_name) : undefined,
    profile: parseProfile(d.profile),
    explainability: d.explainability ? String(d.explainability) : undefined,
    boundary_principles: Array.isArray(d.boundary_principles)
      ? (d.boundary_principles as string[])
      : undefined,
    privacy_note: d.privacy_note ? String(d.privacy_note) : undefined,
    pending_observations: Array.isArray(d.pending_observations)
      ? d.pending_observations
          .map(parseObservation)
          .filter((x): x is IdentityObservation => x !== null)
      : [],
    interaction_history: Array.isArray(d.interaction_history)
      ? d.interaction_history
          .map(parseObservation)
          .filter((x): x is IdentityObservation => x !== null)
      : [],
    onboarding_questions: Array.isArray(d.onboarding_questions)
      ? (d.onboarding_questions as string[])
      : undefined,
    integrations:
      d.integrations && typeof d.integrations === "object"
        ? (d.integrations as Record<string, string>)
        : undefined,
  };
}
