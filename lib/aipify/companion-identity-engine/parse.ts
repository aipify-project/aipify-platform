import type {
  CapabilityGapExamples,
  CompanionIdentityEngineCard,
  CompanionIdentityEngineDashboard,
  CompanionIdentityExport,
  CompanionIdentitySettings,
  FoxExchangeExample,
  IdentityTrait,
  ModuleConsistencyEntry,
  SignatureElement,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): CompanionIdentitySettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionIdentitySettings;
}

function parseCapabilityGapExamples(data: unknown): CapabilityGapExamples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CapabilityGapExamples;
}

function parseFoxExchange(data: unknown): FoxExchangeExample | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as FoxExchangeExample;
}

export function parseCompanionIdentityEngineCard(data: unknown): CompanionIdentityEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as CompanionIdentityEngineCard;
}

export function parseCompanionIdentityEngineDashboard(data: unknown): CompanionIdentityEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    core_identity_traits: parseRecordList<IdentityTrait>(d.core_identity_traits),
    communication_style_rules: Array.isArray(d.communication_style_rules)
      ? (d.communication_style_rules as string[])
      : undefined,
    personality_traits: Array.isArray(d.personality_traits)
      ? (d.personality_traits as string[])
      : undefined,
    signature_elements: parseRecordList<SignatureElement>(d.signature_elements),
    fox_exchange: parseFoxExchange(d.fox_exchange),
    module_consistency: parseRecordList<ModuleConsistencyEntry>(d.module_consistency),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    learning_journey_philosophy:
      typeof d.learning_journey_philosophy === "string" ? d.learning_journey_philosophy : undefined,
    capability_gap_examples: parseCapabilityGapExamples(d.capability_gap_examples),
    growth_principle_phrases: Array.isArray(d.growth_principle_phrases)
      ? (d.growth_principle_phrases as string[])
      : undefined,
    vision_rose_phrase: typeof d.vision_rose_phrase === "string" ? d.vision_rose_phrase : undefined,
    learning_journey_standard_note:
      typeof d.learning_journey_standard_note === "string" ? d.learning_journey_standard_note : undefined,
    settings: parseSettings(d.settings),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, unknown>)
        : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as CompanionIdentityEngineDashboard;
}

export function parseCompanionIdentityExport(data: unknown): CompanionIdentityExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    core_identity_traits: parseRecordList<IdentityTrait>(d.core_identity_traits),
    communication_style_rules: Array.isArray(d.communication_style_rules)
      ? (d.communication_style_rules as string[])
      : undefined,
    personality_traits: Array.isArray(d.personality_traits)
      ? (d.personality_traits as string[])
      : undefined,
    signature_elements: parseRecordList<SignatureElement>(d.signature_elements),
    module_consistency: parseRecordList<ModuleConsistencyEntry>(d.module_consistency),
    settings: parseSettings(d.settings),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as CompanionIdentityExport;
}
