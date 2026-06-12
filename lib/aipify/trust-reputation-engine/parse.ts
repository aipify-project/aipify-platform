import type {
  OrganizationTrustOutcome,
  OrganizationTrustProfile,
  OrganizationTrustSignal,
  TrustReputationEngineCard,
  TrustReputationEngineDashboard,
  TrustReputationExport,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSections(data: unknown): TrustReputationEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    trust_profiles: parseRecordList<OrganizationTrustProfile>(s.trust_profiles),
    trust_trends: parseRecordList<Record<string, unknown>>(s.trust_trends),
    trusted_workflows: parseRecordList<OrganizationTrustProfile>(s.trusted_workflows),
    approval_quality: parseRecordList<Record<string, unknown>>(s.approval_quality),
    reputation_indicators: parseRecordList<OrganizationTrustSignal>(s.reputation_indicators),
    recent_outcomes: parseRecordList<OrganizationTrustOutcome>(s.recent_outcomes),
  };
}

export function parseTrustReputationEngineCard(data: unknown): TrustReputationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as TrustReputationEngineCard;
}

export function parseTrustReputationEngineDashboard(
  data: unknown
): TrustReputationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
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
  } as TrustReputationEngineDashboard;
}

export function parseTrustReputationExport(data: unknown): TrustReputationExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    profiles: parseRecordList<OrganizationTrustProfile>(d.profiles),
    recent_signals: parseRecordList<OrganizationTrustSignal>(d.recent_signals),
    outcomes: parseRecordList<OrganizationTrustOutcome>(d.outcomes),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as TrustReputationExport;
}
