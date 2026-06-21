/** Canonical Support hub back link */
export const CUSTOMER_ACADEMY_SUPPORT_HREF = "/app/support/history";

export const ACADEMY_SORT_OPTIONS = [
  "title",
  "duration",
  "difficulty",
  "section",
  "progress",
] as const;

export type AcademySortOption = (typeof ACADEMY_SORT_OPTIONS)[number];

export const ACADEMY_SECTION_ORDER = [
  "getting_started",
  "product_training",
  "team_training",
  "certifications",
  "knowledge_center",
] as const;

export const CERTIFICATION_STATUS_ORDER: Record<string, number> = {
  earned: 0,
  in_progress: 1,
  not_started: 2,
  expired: 3,
};

export function resolveCourseHref(slug: string, contentType?: string): string {
  if (contentType === "faq" || contentType === "article") {
    return `/app/support/knowledge/${slug}`;
  }
  return `/app/support/academy?course=${encodeURIComponent(slug)}`;
}

export const CERTIFICATION_REQUIRED_COURSES: Record<string, string[]> = {
  aipify_certified_user: ["welcome_to_aipify", "dashboard_essentials", "knowledge_center"],
  aipify_operations_user: ["operations_center", "integrations", "governance_security"],
  aipify_support_user: ["support_center", "knowledge_center", "notifications"],
  aipify_executive_user: ["dashboard_essentials", "operations_center", "governance_security", "understanding_business_packs"],
};

export const SUGGESTED_PATH_LINKS: Record<string, string> = {
  "path-getting-started": "/app/support/academy?section=getting_started",
  "path-product": "/app/support/academy?section=product_training",
  "path-certification": "/app/support/academy?section=certifications",
};
