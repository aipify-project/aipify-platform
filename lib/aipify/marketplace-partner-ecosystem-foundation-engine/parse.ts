import type {
  MarketplacePartnerEcosystemFoundationEngineCard,
  MarketplacePartnerEcosystemFoundationEngineDashboard,
  MarketplaceOfferingRecord,
  PartnerRecord,
} from "./types";

function parsePartnerList(data: unknown): PartnerRecord[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as PartnerRecord[];
}

function parseOfferingList(data: unknown): MarketplaceOfferingRecord[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as MarketplaceOfferingRecord[];
}

export function parseMarketplacePartnerEcosystemFoundationEngineCard(
  data: unknown
): MarketplacePartnerEcosystemFoundationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as MarketplacePartnerEcosystemFoundationEngineCard;
}

export function parseMarketplacePartnerEcosystemFoundationEngineDashboard(
  data: unknown
): MarketplacePartnerEcosystemFoundationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    approved_partners: parsePartnerList(d.approved_partners),
    pending_partners: parsePartnerList(d.pending_partners),
    offerings: parseOfferingList(d.offerings),
    certification_breakdown:
      typeof d.certification_breakdown === "object" && d.certification_breakdown
        ? (d.certification_breakdown as Record<string, unknown>)
        : undefined,
    quality_indicators:
      typeof d.quality_indicators === "object" && d.quality_indicators
        ? (d.quality_indicators as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, unknown>)
        : undefined,
    recent_activity: Array.isArray(d.recent_activity) ? (d.recent_activity as Array<Record<string, unknown>>) : undefined,
    ...d,
  } as MarketplacePartnerEcosystemFoundationEngineDashboard;
}
