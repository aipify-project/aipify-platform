import type {
  AipifyFirstLanguagePolicy,
  CapabilityGapExamples,
  CompanionIdentityEngineCard,
  CompanionIdentityEngineDashboard,
  CompanionIdentityExport,
  CompanionIdentitySettings,
  CompanionNamingPolicy,
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

function parseCompanionNamingPolicy(data: unknown): CompanionNamingPolicy | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    doc: typeof d.doc === "string" ? d.doc : undefined,
    principle: typeof d.principle === "string" ? d.principle : undefined,
    label_replacements: parseRecordList(d.label_replacements),
    support_panel_examples: parseRecordList(d.support_panel_examples),
    companion_philosophy: Array.isArray(d.companion_philosophy)
      ? (d.companion_philosophy as string[])
      : undefined,
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    faq_items: parseRecordList(d.faq_items),
    ...d,
  } as CompanionNamingPolicy;
}

function parseAipifyFirstLanguagePolicy(data: unknown): AipifyFirstLanguagePolicy | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    doc: typeof d.doc === "string" ? d.doc : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    core_principle: typeof d.core_principle === "string" ? d.core_principle : undefined,
    marketing_principle: typeof d.marketing_principle === "string" ? d.marketing_principle : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    label_replacements: parseRecordList(d.label_replacements),
    applies_to_surfaces: Array.isArray(d.applies_to_surfaces)
      ? (d.applies_to_surfaces as string[])
      : undefined,
    technical_exceptions: Array.isArray(d.technical_exceptions)
      ? (d.technical_exceptions as string[])
      : undefined,
    companion_phrases: Array.isArray(d.companion_phrases)
      ? (d.companion_phrases as string[])
      : undefined,
    implementation_requirements: Array.isArray(d.implementation_requirements)
      ? (d.implementation_requirements as string[])
      : undefined,
    faq_items: parseRecordList(d.faq_items),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    support_panel_examples: parseRecordList(d.support_panel_examples),
    companion_naming_policy: parseCompanionNamingPolicy(d.companion_naming_policy),
    cross_links: Array.isArray(d.cross_links) ? (d.cross_links as string[]) : undefined,
    ilm_corpus: typeof d.ilm_corpus === "string" ? d.ilm_corpus : undefined,
    ilm_module: typeof d.ilm_module === "string" ? d.ilm_module : undefined,
    kc_faq: typeof d.kc_faq === "string" ? d.kc_faq : undefined,
    ...d,
  } as AipifyFirstLanguagePolicy;
}

export function parseCompanionIdentityEngineCard(data: unknown): CompanionIdentityEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    companion_naming_policy: parseCompanionNamingPolicy(d.companion_naming_policy),
    aipify_first_language_policy: parseAipifyFirstLanguagePolicy(d.aipify_first_language_policy),
    ...d,
  } as CompanionIdentityEngineCard;
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
    companion_naming_policy: parseCompanionNamingPolicy(d.companion_naming_policy),
    aipify_first_language_policy: parseAipifyFirstLanguagePolicy(d.aipify_first_language_policy),
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
