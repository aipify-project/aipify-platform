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

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
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
    principles: parseStringList(d.principles),
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
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    packaging_principles: parseStringList(d.packaging_principles),
    productization_packs: Array.isArray(d.productization_packs)
      ? (d.productization_packs as BusinessPacksFoundationEngineDashboard["productization_packs"])
      : undefined,
    modular_addons: Array.isArray(d.modular_addons)
      ? (d.modular_addons as BusinessPacksFoundationEngineDashboard["modular_addons"])
      : undefined,
    self_love_connection:
      typeof d.self_love_connection === "object" && d.self_love_connection
        ? (d.self_love_connection as BusinessPacksFoundationEngineDashboard["self_love_connection"])
        : undefined,
    trust_connection:
      typeof d.trust_connection === "object" && d.trust_connection
        ? (d.trust_connection as BusinessPacksFoundationEngineDashboard["trust_connection"])
        : undefined,
    website_presentation_principles:
      typeof d.website_presentation_principles === "object" && d.website_presentation_principles
        ? (d.website_presentation_principles as BusinessPacksFoundationEngineDashboard["website_presentation_principles"])
        : undefined,
    dogfooding:
      typeof d.dogfooding === "object" && d.dogfooding
        ? (d.dogfooding as BusinessPacksFoundationEngineDashboard["dogfooding"])
        : undefined,
    success_criteria: Array.isArray(d.success_criteria)
      ? (d.success_criteria as BusinessPacksFoundationEngineDashboard["success_criteria"])
      : undefined,
    vision_phrases: parseStringList(d.vision_phrases),
    integration_links: Array.isArray(d.integration_links)
      ? (d.integration_links as BusinessPacksFoundationEngineDashboard["integration_links"])
      : undefined,
    implementation_blueprint:
      typeof d.implementation_blueprint === "object" && d.implementation_blueprint
        ? (d.implementation_blueprint as BusinessPacksFoundationEngineDashboard["implementation_blueprint"])
        : undefined,
    commercial_packages_distinction:
      typeof d.commercial_packages_distinction === "object" && d.commercial_packages_distinction
        ? (d.commercial_packages_distinction as BusinessPacksFoundationEngineDashboard["commercial_packages_distinction"])
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
