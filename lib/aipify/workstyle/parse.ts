import type { PersonalizationSettings, WorkstyleCard, WorkstyleGreeting } from "./types";

export function parseWorkstyleCard(data: unknown): WorkstyleCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    communication_style: d.communication_style as string | undefined,
    personalization_enabled: d.personalization_enabled as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    user_control_mandatory: d.user_control_mandatory as boolean | undefined,
  };
}

export function parsePersonalizationSettings(data: unknown): PersonalizationSettings {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    user_control_mandatory: d.user_control_mandatory as boolean | undefined,
    no_surveillance: d.no_surveillance as boolean | undefined,
    profile: d.profile as PersonalizationSettings["profile"],
    org_policy: d.org_policy as Record<string, unknown> | undefined,
    preferences: Array.isArray(d.preferences) ? (d.preferences as PersonalizationSettings["preferences"]) : [],
    suggestions: Array.isArray(d.suggestions) ? (d.suggestions as PersonalizationSettings["suggestions"]) : [],
    dimensions: d.dimensions as Record<string, string[]> | undefined,
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseWorkstyleGreeting(data: unknown): WorkstyleGreeting {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    message: d.message as string | undefined,
    communication_style: d.communication_style as string | undefined,
    desktop_style: d.desktop_style as string | undefined,
    personalization_enabled: d.personalization_enabled as boolean | undefined,
    user_control_mandatory: d.user_control_mandatory as boolean | undefined,
  };
}
