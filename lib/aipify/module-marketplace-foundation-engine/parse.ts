import type { ModuleMarketplaceFoundationEngineCard, ModuleMarketplaceFoundationEngineDashboard } from "./types";

export function parseModuleMarketplaceFoundationEngineCard(data: unknown): ModuleMarketplaceFoundationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as ModuleMarketplaceFoundationEngineCard;
}

export function parseModuleMarketplaceFoundationEngineDashboard(data: unknown): ModuleMarketplaceFoundationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = Array.isArray(d.catalog) ? d.catalog as Array<Record<string, unknown>> : [];
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    catalog: list,
    ...d,
  } as ModuleMarketplaceFoundationEngineDashboard;
}
