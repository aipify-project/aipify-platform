import type {
  PartnerEngagement,
  PartnerRecord,
  PartnerSuccessEngineCard,
  PartnerSuccessEngineDashboard,
  PartnerSuccessExport,
  PartnerSuccessOutcome,
  PartnerSuccessSettings,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): PartnerSuccessSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PartnerSuccessSettings;
}

function parseSections(data: unknown): PartnerSuccessEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    customer_health:
      typeof s.customer_health === "object" && s.customer_health
        ? (s.customer_health as Record<string, unknown>)
        : undefined,
    onboarding: parseRecordList<Record<string, unknown>>(s.onboarding),
    adoption: parseRecordList<Record<string, unknown>>(s.adoption),
    risks: parseRecordList<Record<string, unknown>>(s.risks),
    renewal_readiness: parseRecordList<Record<string, unknown>>(s.renewal_readiness),
    opportunities: parseRecordList<Record<string, unknown>>(s.opportunities),
  };
}

export function parsePartnerSuccessEngineCard(data: unknown): PartnerSuccessEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as PartnerSuccessEngineCard;
}

export function parsePartnerSuccessEngineDashboard(data: unknown): PartnerSuccessEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    settings: parseSettings(d.settings),
    sections: parseSections(d.sections),
    partners: parseRecordList<PartnerRecord>(d.partners),
    engagements: parseRecordList<PartnerEngagement>(d.engagements),
    outcomes: parseRecordList<PartnerSuccessOutcome>(d.outcomes),
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as PartnerSuccessEngineDashboard;
}

export function parsePartnerSuccessExport(data: unknown): PartnerSuccessExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    settings: parseSettings(d.settings),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    partners: parseRecordList<PartnerRecord>(d.partners),
    engagements: parseRecordList<PartnerEngagement>(d.engagements),
    outcomes: parseRecordList<PartnerSuccessOutcome>(d.outcomes),
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as PartnerSuccessExport;
}
