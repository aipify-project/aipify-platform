import type {
  OrganizationalResilienceEngineCard,
  OrganizationalResilienceEngineDashboard,
  ResiliencePlanRecord,
  ResilienceReviewRecord,
  ResilienceSimulationRecord,
  ResilienceVulnerabilityRecord,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

export function parseOrganizationalResilienceEngineCard(
  data: unknown
): OrganizationalResilienceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as OrganizationalResilienceEngineCard;
}

export function parseOrganizationalResilienceEngineDashboard(
  data: unknown
): OrganizationalResilienceEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    plans: parseRecordList<ResiliencePlanRecord>(d.plans),
    simulations: parseRecordList<ResilienceSimulationRecord>(d.simulations),
    vulnerabilities: parseRecordList<ResilienceVulnerabilityRecord>(d.vulnerabilities),
    reviews: parseRecordList<ResilienceReviewRecord>(d.reviews),
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
  } as OrganizationalResilienceEngineDashboard;
}
