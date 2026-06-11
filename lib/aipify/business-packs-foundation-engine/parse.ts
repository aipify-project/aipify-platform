import type {
  BusinessPackReview,
  BusinessPacksFoundationEngineCard,
  BusinessPacksFoundationEngineDashboard,
  BusinessPackRecord,
} from "./types";

function parsePackList(data: unknown): BusinessPackRecord[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BusinessPackRecord[];
}

export function parseBusinessPacksFoundationEngineCard(data: unknown): BusinessPacksFoundationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as BusinessPacksFoundationEngineCard;
}

export function parseBusinessPacksFoundationEngineDashboard(data: unknown): BusinessPacksFoundationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    active_packs: Array.isArray(d.active_packs) ? (d.active_packs as BusinessPacksFoundationEngineDashboard["active_packs"]) : undefined,
    available_packs: parsePackList(d.available_packs),
    recommended_packs: parsePackList(d.recommended_packs),
    future_packs: Array.isArray(d.future_packs) ? (d.future_packs as Array<Record<string, unknown>>) : undefined,
    recent_activation_logs: Array.isArray(d.recent_activation_logs)
      ? (d.recent_activation_logs as Array<Record<string, unknown>>)
      : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    ...d,
  } as BusinessPacksFoundationEngineDashboard;
}

export function parseBusinessPackReview(data: unknown): BusinessPackReview {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    pack: typeof d.pack === "object" && d.pack ? (d.pack as BusinessPackRecord) : undefined,
    review: typeof d.review === "object" && d.review ? (d.review as Record<string, unknown>) : undefined,
    already_active: Boolean(d.already_active),
    industry_blueprint_note: typeof d.industry_blueprint_note === "string" ? d.industry_blueprint_note : undefined,
    ...d,
  } as BusinessPackReview;
}
