import type { QualityScanResult } from "./types";

/** Maps incident types to Knowledge Center article slugs (source of truth in seed content). */
export const QUALITY_INCIDENT_KNOWLEDGE_SLUGS: Record<string, string> = {
  oversized_image: "why-large-images-matter",
  wrong_image_format: "recommended-image-formats",
  broken_image: "what-happens-when-quality-problem-found",
  missing_alt_text: "what-is-image-guardian",
  slow_page: "what-is-a-heavy-page",
  heavy_javascript: "what-is-a-heavy-page",
  layout_shift: "can-aipify-monitor-mobile-experiences",
  broken_link: "quality-broken-link-detection",
  mobile_layout_issue: "can-aipify-monitor-mobile-experiences",
  missing_translation: "can-aipify-monitor-missing-translations",
  failed_flow: "what-happens-when-critical-issue-detected",
  metadata_issue: "what-quality-guardian-monitors",
  integration_error: "quality-integration-monitoring",
};

const INCIDENT_TYPE_SLUGS: Record<string, string> = {
  compress_image: "can-aipify-compress-images-automatically",
  convert_to_webp: "recommended-image-formats",
  add_alt_text: "what-is-image-guardian",
  fix_link: "quality-broken-link-detection",
  lazy_load_image: "why-homepage-hero-image-flagged",
  reduce_bundle: "what-is-a-heavy-page",
  fix_mobile_css: "can-aipify-monitor-mobile-experiences",
};

export function knowledgeSlugForIncident(result: QualityScanResult): string | null {
  if (result.incident_type && QUALITY_INCIDENT_KNOWLEDGE_SLUGS[result.incident_type]) {
    return QUALITY_INCIDENT_KNOWLEDGE_SLUGS[result.incident_type];
  }
  if (result.recommendation_type && INCIDENT_TYPE_SLUGS[result.recommendation_type]) {
    return INCIDENT_TYPE_SLUGS[result.recommendation_type];
  }
  if (result.category === "images") return "what-is-image-guardian";
  if (result.category === "performance") return "what-is-a-heavy-page";
  if (result.category === "mobile") return "can-aipify-monitor-mobile-experiences";
  if (result.category === "localization") return "can-aipify-monitor-missing-translations";
  if (result.category === "integrations") return "quality-integration-monitoring";
  return "what-is-quality-guardian";
}

export function linkIncidentToKnowledge(result: QualityScanResult): QualityScanResult {
  if (result.passed) return result;
  const slug = knowledgeSlugForIncident(result);
  if (!slug) return result;
  return {
    ...result,
    evidence: {
      ...(result.evidence ?? {}),
      knowledge_article_slug: slug,
      knowledge_center_path: `/app/knowledge-center?slug=${slug}`,
    },
  };
}

export function linkIncidentsToKnowledge(results: QualityScanResult[]): QualityScanResult[] {
  return results.map(linkIncidentToKnowledge);
}
