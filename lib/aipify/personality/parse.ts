import type {
  PersonalityCard,
  PersonalityDashboard,
  PersonalityMessage,
  PersonalitySettingsResult,
  ExampleExchange,
  HumorPrinciples,
  TrustBoundary,
  IntegrationLink,
  PlayfulMomentsSeed,
  RecurringJoke,
  BellMomentResult,
} from "./types";

function parsePlayfulMomentsSeed(data: unknown): PlayfulMomentsSeed | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  return {
    core_idea: d.core_idea as string | undefined,
    bell_personality_moments: Array.isArray(d.bell_personality_moments)
      ? (d.bell_personality_moments as PlayfulMomentsSeed["bell_personality_moments"])
      : undefined,
    when_to_use: Array.isArray(d.when_to_use) ? (d.when_to_use as string[]) : undefined,
    when_not_to_use: Array.isArray(d.when_not_to_use) ? (d.when_not_to_use as string[]) : undefined,
    memory_principle: d.memory_principle as string | undefined,
    self_love_examples: Array.isArray(d.self_love_examples)
      ? (d.self_love_examples as string[])
      : undefined,
    abos_connection: d.abos_connection as string | undefined,
    final_principle: d.final_principle as string | undefined,
    fox_exchange: d.fox_exchange as PlayfulMomentsSeed["fox_exchange"],
  };
}

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
    mission: d.mission as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    vision: d.vision as string | undefined,
    default_mode: d.default_mode as string | undefined,
    distinction_note: d.distinction_note as string | undefined,
    playful_moments_enabled: d.playful_moments_enabled as boolean | undefined,
    bell_moments_enabled: d.bell_moments_enabled as boolean | undefined,
    playful_moments_seed: parsePlayfulMomentsSeed(d.playful_moments_seed),
  };
}

export function parsePersonalityDashboard(data: unknown): PersonalityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const humorPrinciples = d.humor_principles as HumorPrinciples | undefined;
  return {
    has_customer: Boolean(d.has_customer),
    personality_mode: d.personality_mode as string | undefined,
    humor_enabled: d.humor_enabled as boolean | undefined,
    emoji_enabled: d.emoji_enabled as boolean | undefined,
    playful_moments_enabled: d.playful_moments_enabled as boolean | undefined,
    bell_moments_enabled: d.bell_moments_enabled as boolean | undefined,
    recurring_jokes: Array.isArray(d.recurring_jokes)
      ? (d.recurring_jokes as RecurringJoke[])
      : undefined,
    playful_memory_prefs: d.playful_memory_prefs as Record<string, unknown> | undefined,
    playful_currently_allowed: d.playful_currently_allowed as boolean | undefined,
    max_emojis_normal: d.max_emojis_normal as number | undefined,
    max_emojis_celebration: d.max_emojis_celebration as number | undefined,
    humor_currently_allowed: d.humor_currently_allowed as boolean | undefined,
    crisis_mode_active: d.crisis_mode_active as boolean | undefined,
    golden_rule: d.golden_rule as string | undefined,
    philosophy: d.philosophy as string | undefined,
    mission: d.mission as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    vision: d.vision as string | undefined,
    personality_modes: d.personality_modes as PersonalityDashboard["personality_modes"],
    humor_appropriate: d.humor_appropriate as string[] | undefined,
    humor_never: d.humor_never as string[] | undefined,
    humor_principles: humorPrinciples
      ? {
          should: Array.isArray(humorPrinciples.should) ? humorPrinciples.should : undefined,
          should_never: Array.isArray(humorPrinciples.should_never)
            ? humorPrinciples.should_never
            : undefined,
        }
      : undefined,
    personal_connection_notes: d.personal_connection_notes as string[] | undefined,
    example_exchanges: Array.isArray(d.example_exchanges)
      ? (d.example_exchanges as ExampleExchange[])
      : [],
    self_love_note: d.self_love_note as string | undefined,
    trust_boundaries: Array.isArray(d.trust_boundaries)
      ? (d.trust_boundaries as TrustBoundary[])
      : [],
    emoji_guidelines: d.emoji_guidelines as PersonalityDashboard["emoji_guidelines"],
    example_messages: Array.isArray(d.example_messages)
      ? (d.example_messages as PersonalityMessage[])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
    integration_links: Array.isArray(d.integration_links)
      ? (d.integration_links as IntegrationLink[])
      : [],
    safeguards: d.safeguards as Record<string, boolean> | undefined,
    distinction_note: d.distinction_note as string | undefined,
    playful_moments_seed: parsePlayfulMomentsSeed(d.playful_moments_seed),
  };
}

export function parseBellMoment(data: unknown): BellMomentResult | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.text && !d.emoji) return null;
  return {
    context: d.context as string | undefined,
    emoji: d.emoji as string | undefined,
    text: d.text as string | undefined,
    signature: d.signature as string | undefined,
    metadata_only: d.metadata_only as boolean | undefined,
  };
}

export function parsePersonalitySettingsResult(data: unknown): PersonalitySettingsResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    personality_mode: d.personality_mode as string | undefined,
    humor_enabled: d.humor_enabled as boolean | undefined,
    emoji_enabled: d.emoji_enabled as boolean | undefined,
    playful_moments_enabled: d.playful_moments_enabled as boolean | undefined,
    bell_moments_enabled: d.bell_moments_enabled as boolean | undefined,
    recurring_jokes: Array.isArray(d.recurring_jokes)
      ? (d.recurring_jokes as RecurringJoke[])
      : undefined,
    playful_memory_prefs: d.playful_memory_prefs as Record<string, unknown> | undefined,
    golden_rule: d.golden_rule as string | undefined,
  };
}
