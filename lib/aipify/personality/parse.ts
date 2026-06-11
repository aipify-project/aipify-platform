import type {
  PersonalityCard,
  PersonalityDashboard,
  PersonalityMessage,
  PersonalitySettingsResult,
} from "./types";

export function parsePersonalityMessage(data: unknown): PersonalityMessage {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    message: d.message as string | undefined,
    context: d.context as string | undefined,
    template_key: d.template_key as string | undefined,
    personality_mode: d.personality_mode as string | undefined,
    humor_allowed: d.humor_allowed as boolean | undefined,
    emoji_enabled: d.emoji_enabled as boolean | undefined,
    golden_rule: d.golden_rule as string | undefined,
    error: d.error as string | undefined,
  };
}

export function parsePersonalityCard(data: unknown): PersonalityCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    personality_mode: d.personality_mode as string | undefined,
    humor_enabled: d.humor_enabled as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    default_mode: d.default_mode as string | undefined,
  };
}

export function parsePersonalityDashboard(data: unknown): PersonalityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    personality_mode: d.personality_mode as string | undefined,
    humor_enabled: d.humor_enabled as boolean | undefined,
    emoji_enabled: d.emoji_enabled as boolean | undefined,
    max_emojis_normal: d.max_emojis_normal as number | undefined,
    max_emojis_celebration: d.max_emojis_celebration as number | undefined,
    humor_currently_allowed: d.humor_currently_allowed as boolean | undefined,
    crisis_mode_active: d.crisis_mode_active as boolean | undefined,
    golden_rule: d.golden_rule as string | undefined,
    philosophy: d.philosophy as string | undefined,
    personality_modes: d.personality_modes as PersonalityDashboard["personality_modes"],
    humor_appropriate: d.humor_appropriate as string[] | undefined,
    humor_never: d.humor_never as string[] | undefined,
    emoji_guidelines: d.emoji_guidelines as PersonalityDashboard["emoji_guidelines"],
    example_messages: Array.isArray(d.example_messages)
      ? (d.example_messages as PersonalityMessage[])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
    safeguards: d.safeguards as Record<string, boolean> | undefined,
  };
}

export function parsePersonalitySettingsResult(data: unknown): PersonalitySettingsResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    personality_mode: d.personality_mode as string | undefined,
    humor_enabled: d.humor_enabled as boolean | undefined,
    emoji_enabled: d.emoji_enabled as boolean | undefined,
    golden_rule: d.golden_rule as string | undefined,
  };
}
