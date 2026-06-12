import type {
  CuriosityDiscoveryEngineCard,
  CuriosityDiscoveryEngineDashboard,
  CuriosityDiscoveryEngineExport,
  CuriosityDiscoveryEngineSettings,
  DiscoveryCategoryInfo,
  DiscoveryPrompt,
  DiscoveryQuestionExample,
  DiscoverySignal,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): CuriosityDiscoveryEngineSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CuriosityDiscoveryEngineSettings;
}

export function parseCuriosityDiscoveryEngineCard(data: unknown): CuriosityDiscoveryEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as CuriosityDiscoveryEngineCard;
}

export function parseCuriosityDiscoveryEngineDashboard(data: unknown): CuriosityDiscoveryEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    discovery_categories: parseRecordList<DiscoveryCategoryInfo>(d.discovery_categories),
    question_examples: parseRecordList<DiscoveryQuestionExample>(d.question_examples),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    settings: parseSettings(d.settings),
    recent_prompts: parseRecordList<DiscoveryPrompt>(d.recent_prompts),
    recent_signals: parseRecordList<DiscoverySignal>(d.recent_signals),
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
  } as CuriosityDiscoveryEngineDashboard;
}

export function parseCuriosityDiscoveryEngineExport(data: unknown): CuriosityDiscoveryEngineExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    discovery_categories: parseRecordList<DiscoveryCategoryInfo>(d.discovery_categories),
    question_examples: parseRecordList<DiscoveryQuestionExample>(d.question_examples),
    trust_note: typeof d.trust_note === "string" ? d.trust_note : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    settings: parseSettings(d.settings),
    recent_prompts: parseRecordList<DiscoveryPrompt>(d.recent_prompts),
    recent_signals: parseRecordList<DiscoverySignal>(d.recent_signals),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as CuriosityDiscoveryEngineExport;
}
