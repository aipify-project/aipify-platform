import type {
  DecisionSupportExample,
  ExampleValue,
  OrganizationStatedValue,
  PurposeFrameworkItem,
  PurposeValuesEngineCard,
  PurposeValuesEngineDashboard,
  PurposeValuesExport,
  PurposeValuesSettings,
  ValuesAlignmentSignal,
  ValuesAssistanceExample,
  ValuesReflection,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): PurposeValuesSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PurposeValuesSettings;
}

export function parsePurposeValuesEngineCard(data: unknown): PurposeValuesEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as PurposeValuesEngineCard;
}

export function parsePurposeValuesEngineDashboard(data: unknown): PurposeValuesEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    purpose_framework: parseRecordList<PurposeFrameworkItem>(d.purpose_framework),
    example_values: parseRecordList<ExampleValue>(d.example_values),
    values_aware_assistance_examples: parseRecordList<ValuesAssistanceExample>(
      d.values_aware_assistance_examples
    ),
    decision_support_examples: parseRecordList<DecisionSupportExample>(d.decision_support_examples),
    culture_support_areas: Array.isArray(d.culture_support_areas)
      ? (d.culture_support_areas as string[])
      : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_engine_note: typeof d.trust_engine_note === "string" ? d.trust_engine_note : undefined,
    growth_evolution_note:
      typeof d.growth_evolution_note === "string" ? d.growth_evolution_note : undefined,
    settings: parseSettings(d.settings),
    stated_values: parseRecordList<OrganizationStatedValue>(d.stated_values),
    recent_signals: parseRecordList<ValuesAlignmentSignal>(d.recent_signals),
    pending_reflections: parseRecordList<ValuesReflection>(d.pending_reflections),
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
  } as PurposeValuesEngineDashboard;
}

export function parseOrganizationStatedValues(data: unknown): OrganizationStatedValue[] {
  return parseRecordList<OrganizationStatedValue>(data) ?? [];
}

export function parsePurposeValuesExport(data: unknown): PurposeValuesExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    settings: parseSettings(d.settings),
    purpose_framework: parseRecordList<PurposeFrameworkItem>(d.purpose_framework),
    stated_values: parseRecordList<OrganizationStatedValue>(d.stated_values),
    recent_signals: parseRecordList<ValuesAlignmentSignal>(d.recent_signals),
    pending_reflections: parseRecordList<ValuesReflection>(d.pending_reflections),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as PurposeValuesExport;
}
