import { getAllArticleSlugs } from "@/lib/marketing/knowledge/registry";
import { PUBLIC_BUSINESS_PACK_SLUGS } from "@/lib/marketing/knowledge/types";
import type { MarketingSearchResult } from "./types";

const STATIC_PAGES: MarketingSearchResult[] = [
  { id: "home", title: "Home", description: "Aipify Business Operating System", href: "/", category: "page" },
  { id: "product", title: "Product", description: "Platform map and operational engines", href: "/product", category: "page" },
  { id: "pricing", title: "Pricing", description: "Plans and Business Packs", href: "/pricing", category: "page" },
  { id: "enterprise", title: "Enterprise", description: "Built for serious organizations", href: "/enterprise", category: "enterprise" },
  { id: "security", title: "Security", description: "Trust, governance, and enterprise security", href: "/security", category: "security" },
  { id: "get-started", title: "Get Started", description: "Implementation and onboarding", href: "/get-started", category: "page" },
  { id: "knowledge", title: "Knowledge Center", description: "Public knowledge and guides", href: "/knowledge", category: "knowledge" },
  { id: "growth-partners", title: "Growth Partners", description: "Professional partnership program", href: "/growth-partners", category: "growth_partner" },
  { id: "company", title: "Company", description: "Aipify Group AS — mission and values", href: "/company", category: "page" },
  { id: "careers", title: "Careers", description: "Join Aipify Group AS", href: "/careers", category: "page" },
  { id: "media", title: "Media Center", description: "Press and company communications", href: "/media", category: "page" },
  { id: "contact", title: "Contact", description: "Sales, enterprise, partners, support", href: "/contact", category: "page" },
  { id: "book-demo", title: "Book Demo", description: "Schedule a demonstration", href: "/book-demo", category: "page" },
];

export function buildMarketingSearchIndex(
  articleTitles: Record<string, { title: string; metaDescription: string }> = {},
  packNames: Record<string, string> = {}
): MarketingSearchResult[] {
  const articles: MarketingSearchResult[] = getAllArticleSlugs()
    .filter((slug) => articleTitles[slug])
    .map((slug) => ({
      id: `article-${slug}`,
      title: articleTitles[slug].title,
      description: articleTitles[slug].metaDescription,
      href: `/knowledge/articles/${slug}`,
      category: "knowledge" as const,
    }));

  const packs: MarketingSearchResult[] = PUBLIC_BUSINESS_PACK_SLUGS.map((slug) => ({
    id: `pack-${slug}`,
    title: packNames[slug] ?? slug,
    description: "Business Pack",
    href: `/business-packs/${slug}`,
    category: "business_pack" as const,
  }));

  return [...STATIC_PAGES, ...articles, ...packs];
}

export function searchMarketingIndex(
  index: MarketingSearchResult[],
  query: string,
  limit = 12
): MarketingSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return index
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
