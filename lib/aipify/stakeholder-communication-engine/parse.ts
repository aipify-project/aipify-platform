import type {
  CommunicationCampaign,
  CommunicationCampaignExportPayload,
  CommunicationDelivery,
  CommunicationEngagement,
  CommunicationOutcome,
  StakeholderCommunicationEngineCard,
  StakeholderCommunicationEngineDashboard,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseStakeholderCommunicationEngineCard(
  data: unknown
): StakeholderCommunicationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as StakeholderCommunicationEngineCard;
}

export function parseStakeholderCommunicationEngineDashboard(
  data: unknown
): StakeholderCommunicationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    campaigns: parseRecordList<CommunicationCampaign>(d.campaigns),
    deliveries: parseRecordList<CommunicationDelivery>(d.deliveries),
    engagement: parseRecordList<CommunicationEngagement>(d.engagement),
    outcomes: parseRecordList<CommunicationOutcome>(d.outcomes),
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as StakeholderCommunicationEngineDashboard;
}

export function parseCommunicationCampaignExportPayload(
  data: unknown
): CommunicationCampaignExportPayload {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    campaigns: parseRecordList<CommunicationCampaign>(d.campaigns),
    deliveries: parseRecordList<CommunicationDelivery>(d.deliveries),
    outcomes: parseRecordList<CommunicationOutcome>(d.outcomes),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    ...d,
  } as CommunicationCampaignExportPayload;
}
