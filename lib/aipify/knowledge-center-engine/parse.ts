import type { KnowledgeCenterEngineCard, KnowledgeCenterEngineDashboard } from "./types";

export function parseKnowledgeCenterEngineCard(data: unknown): KnowledgeCenterEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    published_articles: Number(d.published_articles ?? 0),
    drafts_awaiting_review: Number(d.drafts_awaiting_review ?? 0),
    faq_count: Number(d.faq_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    implementation_blueprint:
      typeof d.implementation_blueprint === "string" ? d.implementation_blueprint : undefined,
    ...d,
  } as KnowledgeCenterEngineCard;
}

export function parseKnowledgeCenterEngineDashboard(data: unknown): KnowledgeCenterEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    implementation_blueprint:
      typeof d.implementation_blueprint === "object" && d.implementation_blueprint
        ? (d.implementation_blueprint as Record<string, unknown>)
        : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    kc_objectives: Array.isArray(d.kc_objectives) ? (d.kc_objectives as string[]) : undefined,
    knowledge_types: Array.isArray(d.knowledge_types)
      ? (d.knowledge_types as KnowledgeCenterEngineDashboard["knowledge_types"])
      : undefined,
    article_structure: Array.isArray(d.article_structure)
      ? (d.article_structure as string[])
      : undefined,
    visibility_levels: Array.isArray(d.visibility_levels)
      ? (d.visibility_levels as KnowledgeCenterEngineDashboard["visibility_levels"])
      : undefined,
    knowledge_evolution:
      typeof d.knowledge_evolution === "object" && d.knowledge_evolution
        ? (d.knowledge_evolution as KnowledgeCenterEngineDashboard["knowledge_evolution"])
        : undefined,
    companion_integration:
      typeof d.companion_integration === "object" && d.companion_integration
        ? (d.companion_integration as Record<string, unknown>)
        : undefined,
    dogfooding:
      typeof d.dogfooding === "object" && d.dogfooding
        ? (d.dogfooding as Record<string, unknown>)
        : undefined,
    success_criteria: Array.isArray(d.success_criteria)
      ? (d.success_criteria as KnowledgeCenterEngineDashboard["success_criteria"])
      : undefined,
    blueprint_integration_links: Array.isArray(d.blueprint_integration_links)
      ? (d.blueprint_integration_links as KnowledgeCenterEngineDashboard["blueprint_integration_links"])
      : undefined,
    organization:
      typeof d.organization === "object" && d.organization
        ? (d.organization as Record<string, unknown>)
        : undefined,
    published_articles: Number(d.published_articles ?? 0),
    drafts_awaiting_review: Number(d.drafts_awaiting_review ?? 0),
    faq_count: Number(d.faq_count ?? 0),
    categories: Array.isArray(d.categories)
      ? (d.categories as KnowledgeCenterEngineDashboard["categories"])
      : [],
    published_list: Array.isArray(d.published_list)
      ? (d.published_list as KnowledgeCenterEngineDashboard["published_list"])
      : [],
    awaiting_review: Array.isArray(d.awaiting_review)
      ? (d.awaiting_review as KnowledgeCenterEngineDashboard["awaiting_review"])
      : [],
    outdated_alerts: Array.isArray(d.outdated_alerts)
      ? (d.outdated_alerts as KnowledgeCenterEngineDashboard["outdated_alerts"])
      : [],
    most_viewed: Array.isArray(d.most_viewed)
      ? (d.most_viewed as KnowledgeCenterEngineDashboard["most_viewed"])
      : [],
    needs_update: Array.isArray(d.needs_update)
      ? (d.needs_update as KnowledgeCenterEngineDashboard["needs_update"])
      : [],
    recent_faqs: Array.isArray(d.recent_faqs)
      ? (d.recent_faqs as KnowledgeCenterEngineDashboard["recent_faqs"])
      : [],
    import_formats: Array.isArray(d.import_formats) ? (d.import_formats as string[]) : undefined,
    ...d,
  } as KnowledgeCenterEngineDashboard;
}
