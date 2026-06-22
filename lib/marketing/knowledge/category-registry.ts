import type { PublicKnowledgeCategoryId } from "./types";
import { PUBLIC_KNOWLEDGE_CATEGORIES } from "./types";
import { getArticlesByCategory } from "./registry";

/** Locale-independent category page graph — copy lives in i18n `publicKnowledge.categories`. */
export type PublicKnowledgeCategoryRegistryEntry = {
  id: PublicKnowledgeCategoryId;
  sortOrder: number;
  topicIds: string[];
  relatedCategoryIds: PublicKnowledgeCategoryId[];
  featuredArticleSlugs: string[];
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
};

const VALID_CTA_HREFS = new Set([
  "/book-demo",
  "/early-access",
  "/contact",
  "/growth-partners",
  "/pricing",
  "/pricing#business-packs",
  "/knowledge/getting-started",
  "/knowledge/companion",
  "/knowledge/knowledge-center",
  "/knowledge/trust-center",
  "/knowledge/governance",
  "/knowledge/business-packs",
  "/knowledge/growth-partners",
  "/knowledge/integrations",
  "/knowledge/enterprise",
  "/knowledge/security",
  "/knowledge/operations",
  "/knowledge/business-operating-system",
  "/knowledge/articles/getting-started-with-aipify",
  "/knowledge/articles/installing-aipify-web-app",
  "/knowledge/articles/how-aipify-install-works",
  "/knowledge/articles/what-is-a-business-companion",
  "/knowledge/articles/what-is-a-business-operating-system",
  "/knowledge/articles/governance-and-human-approval",
  "/knowledge/articles/enterprise-knowledge-management",
]);

function categoryEntry(
  id: PublicKnowledgeCategoryId,
  sortOrder: number,
  opts: Omit<PublicKnowledgeCategoryRegistryEntry, "id" | "sortOrder">
): PublicKnowledgeCategoryRegistryEntry {
  if (!VALID_CTA_HREFS.has(opts.ctaPrimaryHref) || !VALID_CTA_HREFS.has(opts.ctaSecondaryHref)) {
    throw new Error(`Invalid CTA href for category ${id}`);
  }
  return { id, sortOrder, ...opts };
}

function featuredForCategory(categoryId: PublicKnowledgeCategoryId, preferred: string[]): string[] {
  const slugs = new Set(getArticlesByCategory(categoryId).map((a) => a.slug));
  return preferred.filter((slug) => slugs.has(slug)).slice(0, 3);
}

export const PUBLIC_KNOWLEDGE_CATEGORY_REGISTRY: PublicKnowledgeCategoryRegistryEntry[] = [
  categoryEntry("getting-started", 1, {
    topicIds: ["topic1", "topic2", "topic3", "topic4"],
    relatedCategoryIds: ["companion", "business-operating-system", "governance"],
    featuredArticleSlugs: featuredForCategory("getting-started", [
      "installing-aipify-web-app",
      "getting-started-with-aipify",
    ]),
    ctaPrimaryHref: "/book-demo",
    ctaSecondaryHref: "/early-access",
  }),
  categoryEntry("companion", 2, {
    topicIds: ["topic1", "topic2", "topic3", "topic4", "topic5"],
    relatedCategoryIds: ["getting-started", "business-operating-system", "governance"],
    featuredArticleSlugs: featuredForCategory("companion", [
      "what-is-a-business-companion",
      "companion-vs-chatbot",
      "how-companion-supports-organizations",
    ]),
    ctaPrimaryHref: "/book-demo",
    ctaSecondaryHref: "/knowledge/articles/what-is-a-business-companion",
  }),
  categoryEntry("business-operating-system", 3, {
    topicIds: ["topic1", "topic2", "topic3", "topic4"],
    relatedCategoryIds: ["companion", "operations", "governance"],
    featuredArticleSlugs: featuredForCategory("business-operating-system", [
      "what-is-a-business-operating-system",
      "why-organizations-need-operational-visibility",
      "how-operational-knowledge-creates-competitive-advantage",
    ]),
    ctaPrimaryHref: "/book-demo",
    ctaSecondaryHref: "/knowledge/articles/what-is-a-business-operating-system",
  }),
  categoryEntry("knowledge-center", 4, {
    topicIds: ["topic1", "topic2", "topic3", "topic4"],
    relatedCategoryIds: ["operations", "governance", "trust-center"],
    featuredArticleSlugs: featuredForCategory("knowledge-center", ["enterprise-knowledge-management"]),
    ctaPrimaryHref: "/book-demo",
    ctaSecondaryHref: "/knowledge/articles/enterprise-knowledge-management",
  }),
  categoryEntry("operations", 5, {
    topicIds: ["topic1", "topic2", "topic3", "topic4", "topic5"],
    relatedCategoryIds: ["business-packs", "knowledge-center", "companion"],
    featuredArticleSlugs: featuredForCategory("operations", [
      "hospitality-operations-with-aipify",
      "support-operations-with-aipify",
      "commerce-operations-with-aipify",
    ]),
    ctaPrimaryHref: "/book-demo",
    ctaSecondaryHref: "/pricing#business-packs",
  }),
  categoryEntry("governance", 6, {
    topicIds: ["topic1", "topic2", "topic3", "topic4"],
    relatedCategoryIds: ["trust-center", "security", "companion"],
    featuredArticleSlugs: featuredForCategory("governance", ["governance-and-human-approval"]),
    ctaPrimaryHref: "/book-demo",
    ctaSecondaryHref: "/knowledge/articles/governance-and-human-approval",
  }),
  categoryEntry("trust-center", 7, {
    topicIds: ["topic1", "topic2", "topic3", "topic4"],
    relatedCategoryIds: ["governance", "security", "enterprise"],
    featuredArticleSlugs: [],
    ctaPrimaryHref: "/book-demo",
    ctaSecondaryHref: "/knowledge/governance",
  }),
  categoryEntry("security", 8, {
    topicIds: ["topic1", "topic2", "topic3", "topic4"],
    relatedCategoryIds: ["trust-center", "governance", "enterprise"],
    featuredArticleSlugs: [],
    ctaPrimaryHref: "/book-demo",
    ctaSecondaryHref: "/knowledge/trust-center",
  }),
  categoryEntry("business-packs", 9, {
    topicIds: ["topic1", "topic2", "topic3", "topic4"],
    relatedCategoryIds: ["operations", "integrations", "enterprise"],
    featuredArticleSlugs: [],
    ctaPrimaryHref: "/pricing#business-packs",
    ctaSecondaryHref: "/book-demo",
  }),
  categoryEntry("integrations", 10, {
    topicIds: ["topic1", "topic2", "topic3", "topic4"],
    relatedCategoryIds: ["business-packs", "operations", "enterprise"],
    featuredArticleSlugs: [],
    ctaPrimaryHref: "/book-demo",
    ctaSecondaryHref: "/early-access",
  }),
  categoryEntry("enterprise", 11, {
    topicIds: ["topic1", "topic2", "topic3", "topic4", "topic5"],
    relatedCategoryIds: ["security", "governance", "trust-center"],
    featuredArticleSlugs: [],
    ctaPrimaryHref: "/book-demo",
    ctaSecondaryHref: "/contact",
  }),
  categoryEntry("growth-partners", 12, {
    topicIds: ["topic1", "topic2", "topic3", "topic4"],
    relatedCategoryIds: ["enterprise", "business-packs", "getting-started"],
    featuredArticleSlugs: [],
    ctaPrimaryHref: "/growth-partners",
    ctaSecondaryHref: "/contact",
  }),
];

export function getCategoryRegistryEntry(
  categoryId: PublicKnowledgeCategoryId
): PublicKnowledgeCategoryRegistryEntry | undefined {
  return PUBLIC_KNOWLEDGE_CATEGORY_REGISTRY.find((entry) => entry.id === categoryId);
}

export function getAllCategoryRegistryEntries(): PublicKnowledgeCategoryRegistryEntry[] {
  return [...PUBLIC_KNOWLEDGE_CATEGORY_REGISTRY].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Ensures registry covers every canonical category slug exactly once. */
export function assertCategoryRegistryComplete(): void {
  const registryIds = new Set(PUBLIC_KNOWLEDGE_CATEGORY_REGISTRY.map((e) => e.id));
  for (const id of PUBLIC_KNOWLEDGE_CATEGORIES) {
    if (!registryIds.has(id)) {
      throw new Error(`Missing category registry entry: ${id}`);
    }
  }
  if (registryIds.size !== PUBLIC_KNOWLEDGE_CATEGORIES.length) {
    throw new Error("Category registry contains unknown category ids");
  }
}
