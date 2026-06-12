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
    implementation_blueprint_phase14:
      typeof d.implementation_blueprint_phase14 === "object" && d.implementation_blueprint_phase14
        ? (d.implementation_blueprint_phase14 as Record<string, unknown>)
        : undefined,
    evolution_objectives: Array.isArray(d.evolution_objectives)
      ? (d.evolution_objectives as string[])
      : undefined,
    health_indicators:
      typeof d.health_indicators === "object" && d.health_indicators
        ? (d.health_indicators as KnowledgeCenterEngineDashboard["health_indicators"])
        : undefined,
    proactive_recommendations: Array.isArray(d.proactive_recommendations)
      ? (d.proactive_recommendations as KnowledgeCenterEngineDashboard["proactive_recommendations"])
      : undefined,
    creation_opportunities: Array.isArray(d.creation_opportunities)
      ? (d.creation_opportunities as KnowledgeCenterEngineDashboard["creation_opportunities"])
      : undefined,
    self_love_connection:
      typeof d.self_love_connection === "object" && d.self_love_connection
        ? (d.self_love_connection as KnowledgeCenterEngineDashboard["self_love_connection"])
        : undefined,
    organizational_memory_connection:
      typeof d.organizational_memory_connection === "object" && d.organizational_memory_connection
        ? (d.organizational_memory_connection as KnowledgeCenterEngineDashboard["organizational_memory_connection"])
        : undefined,
    trust_connection:
      typeof d.trust_connection === "object" && d.trust_connection
        ? (d.trust_connection as KnowledgeCenterEngineDashboard["trust_connection"])
        : undefined,
    evolution_success_criteria: Array.isArray(d.evolution_success_criteria)
      ? (d.evolution_success_criteria as KnowledgeCenterEngineDashboard["evolution_success_criteria"])
      : undefined,
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    integration_links: Array.isArray(d.integration_links)
      ? (d.integration_links as KnowledgeCenterEngineDashboard["integration_links"])
      : undefined,
    implementation_blueprint_phase71:
      typeof d.implementation_blueprint_phase71 === "object" && d.implementation_blueprint_phase71
        ? (d.implementation_blueprint_phase71 as Record<string, unknown>)
        : undefined,
    enterprise_knowledge_fabric_note:
      typeof d.enterprise_knowledge_fabric_note === "string" ? d.enterprise_knowledge_fabric_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    fabric_mission: typeof d.fabric_mission === "string" ? d.fabric_mission : undefined,
    fabric_philosophy: typeof d.fabric_philosophy === "string" ? d.fabric_philosophy : undefined,
    fabric_abos_principle: typeof d.fabric_abos_principle === "string" ? d.fabric_abos_principle : undefined,
    fabric_objectives: Array.isArray(d.fabric_objectives)
      ? (d.fabric_objectives as KnowledgeCenterEngineDashboard["fabric_objectives"])
      : undefined,
    knowledge_sources: Array.isArray(d.knowledge_sources)
      ? (d.knowledge_sources as KnowledgeCenterEngineDashboard["knowledge_sources"])
      : undefined,
    knowledge_discovery:
      typeof d.knowledge_discovery === "object" && d.knowledge_discovery
        ? (d.knowledge_discovery as KnowledgeCenterEngineDashboard["knowledge_discovery"])
        : undefined,
    contextual_intelligence:
      typeof d.contextual_intelligence === "object" && d.contextual_intelligence
        ? (d.contextual_intelligence as KnowledgeCenterEngineDashboard["contextual_intelligence"])
        : undefined,
    fabric_knowledge_governance:
      typeof d.fabric_knowledge_governance === "object" && d.fabric_knowledge_governance
        ? (d.fabric_knowledge_governance as Record<string, unknown>)
        : undefined,
    fabric_knowledge_gaps:
      typeof d.fabric_knowledge_gaps === "object" && d.fabric_knowledge_gaps
        ? (d.fabric_knowledge_gaps as KnowledgeCenterEngineDashboard["fabric_knowledge_gaps"])
        : undefined,
    organizational_continuity:
      typeof d.organizational_continuity === "object" && d.organizational_continuity
        ? (d.organizational_continuity as Record<string, unknown>)
        : undefined,
    fabric_self_love_connection:
      typeof d.fabric_self_love_connection === "object" && d.fabric_self_love_connection
        ? (d.fabric_self_love_connection as KnowledgeCenterEngineDashboard["fabric_self_love_connection"])
        : undefined,
    leadership_insights:
      typeof d.leadership_insights === "object" && d.leadership_insights
        ? (d.leadership_insights as Record<string, unknown>)
        : undefined,
    fabric_trust_connection:
      typeof d.fabric_trust_connection === "object" && d.fabric_trust_connection
        ? (d.fabric_trust_connection as Record<string, unknown>)
        : undefined,
    fabric_dogfooding:
      typeof d.fabric_dogfooding === "object" && d.fabric_dogfooding
        ? (d.fabric_dogfooding as Record<string, unknown>)
        : undefined,
    engagement_summary:
      typeof d.engagement_summary === "object" && d.engagement_summary
        ? (d.engagement_summary as KnowledgeCenterEngineDashboard["engagement_summary"])
        : undefined,
    fabric_success_criteria: Array.isArray(d.fabric_success_criteria)
      ? (d.fabric_success_criteria as KnowledgeCenterEngineDashboard["fabric_success_criteria"])
      : undefined,
    fabric_vision_phrases: Array.isArray(d.fabric_vision_phrases)
      ? (d.fabric_vision_phrases as string[])
      : undefined,
    fabric_integration_links: Array.isArray(d.fabric_integration_links)
      ? (d.fabric_integration_links as KnowledgeCenterEngineDashboard["fabric_integration_links"])
      : undefined,
    ...d,
  } as KnowledgeCenterEngineDashboard;
}
