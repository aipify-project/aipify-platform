import type { KnowledgeCenterEngineCard, KnowledgeCenterEngineDashboard } from "./types";

export function parseKnowledgeCenterEngineCard(data: unknown): KnowledgeCenterEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    published_articles: Number(d.published_articles ?? 0),
    drafts_awaiting_review: Number(d.drafts_awaiting_review ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseKnowledgeCenterEngineDashboard(data: unknown): KnowledgeCenterEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
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
  };
}
