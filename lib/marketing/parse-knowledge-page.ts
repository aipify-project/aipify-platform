import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";
import type { KnowledgePageRedesignLabels } from "@/components/marketing/knowledge/types";
import { getSection, recordValues } from "@/lib/marketing/parse-marketing";
import { getPublicKnowledgeHubLabels } from "@/lib/marketing/knowledge/load";
import { PUBLIC_KNOWLEDGE_HUBS } from "@/lib/marketing/knowledge/types";

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function recordList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (!value || typeof value !== "object") return [];
  return recordValues(value as Record<string, T>);
}

export function getKnowledgePageRedesignLabels(marketing: MarketingDictionary): KnowledgePageRedesignLabels {
  const redesign = getSection<Partial<KnowledgePageRedesignLabels>>(marketing, "knowledgePageRedesign");
  const hub = getPublicKnowledgeHubLabels(marketing);
  const publicSection = (marketing.publicKnowledge ?? {}) as Record<string, unknown>;
  const categoryLabels = (publicSection.categories ?? {}) as Record<string, { name?: string; description?: string }>;

  const hubItems: KnowledgePageRedesignLabels["hubs"]["items"] = {};
  for (const hubId of PUBLIC_KNOWLEDGE_HUBS) {
    const fromRedesign = redesign.hubs?.items?.[hubId];
    const fromCategory = categoryLabels[hubId];
    hubItems[hubId] = {
      title: str(fromRedesign?.title, fromCategory?.name ?? hubId.replace(/-/g, " ")),
      description: str(fromRedesign?.description, fromCategory?.description ?? ""),
    };
  }

  const defaultQuickLinks: KnowledgePageRedesignLabels["search"]["quickLinks"] = [
    { label: "Getting Started", href: "/knowledge/getting-started" },
    { label: "Companion", href: "/knowledge/companion" },
    { label: "Business Packs", href: "/knowledge#business-packs" },
    { label: "Governance", href: "/knowledge/governance" },
    { label: "Integrations", href: "/knowledge/integrations" },
    { label: "Security", href: "/knowledge/security" },
  ];

  const defaultFeaturedSlugs = [
    "what-is-a-business-operating-system",
    "how-companion-supports-organizations",
    "getting-started-with-aipify",
  ];

  return {
    hero: {
      breadcrumbHome: str(redesign.hero?.breadcrumbHome, "Home"),
      breadcrumbKnowledge: str(redesign.hero?.breadcrumbKnowledge, hub.title),
      eyebrow: str(redesign.hero?.eyebrow, "KNOWLEDGE CENTER"),
      title: str(redesign.hero?.title, hub.title),
      subtitle: str(redesign.hero?.subtitle, hub.subtitle),
      authorityNote: str(redesign.hero?.authorityNote, hub.authorityNote),
    },
    search: {
      placeholder: str(redesign.search?.placeholder, "Search articles, topics, and guides…"),
      ariaLabel: str(redesign.search?.ariaLabel, "Search Knowledge Center"),
      noResults: str(redesign.search?.noResults, "No articles match your search."),
      quickLinksTitle: str(redesign.search?.quickLinksTitle, "Popular topics"),
      quickLinks:
        recordList<{ label: string; href: string }>(redesign.search?.quickLinks).length > 0
          ? recordList<{ label: string; href: string }>(redesign.search?.quickLinks)
          : defaultQuickLinks,
    },
    featured: {
      title: str(redesign.featured?.title, "Featured guides"),
      subtitle: str(redesign.featured?.subtitle, "Start with foundational concepts for modern operations."),
      readArticle: str(redesign.featured?.readArticle, hub.readArticle),
      featuredSlugs:
        Array.isArray(redesign.featured?.featuredSlugs) && redesign.featured.featuredSlugs.length > 0
          ? redesign.featured.featuredSlugs
          : defaultFeaturedSlugs,
    },
    hubs: {
      title: str(redesign.hubs?.title, hub.browseHubs),
      subtitle: str(redesign.hubs?.subtitle, "Deep-dive content hubs for platform strategy and Companion."),
      exploreHub: str(redesign.hubs?.exploreHub, "Explore hub"),
      items: hubItems,
    },
    categories: {
      title: str(redesign.categories?.title, hub.browseCategories),
      subtitle: str(redesign.categories?.subtitle, "Browse by topic across the Aipify platform."),
      exploreCategory: str(redesign.categories?.exploreCategory, hub.viewCategory),
    },
    industries: {
      title: str(redesign.industries?.title, hub.browseIndustries),
      subtitle: str(redesign.industries?.subtitle, "Operational guides tailored to your industry."),
      exploreIndustry: str(redesign.industries?.exploreIndustry, "View industry guide"),
    },
    businessPacks: {
      title: str(redesign.businessPacks?.title, hub.browseBusinessPacks),
      subtitle: str(redesign.businessPacks?.subtitle, "Modular capabilities for specific operational domains."),
      explorePack: str(redesign.businessPacks?.explorePack, hub.businessPackCta),
    },
    filterBar: {
      categoryLabel: str(redesign.filterBar?.categoryLabel, "Category"),
      typeLabel: str(redesign.filterBar?.typeLabel, "Content type"),
      sortLabel: str(redesign.filterBar?.sortLabel, "Sort"),
      allCategories: str(redesign.filterBar?.allCategories, "All categories"),
      allTypes: str(redesign.filterBar?.allTypes, "All types"),
      sortTitleAsc: str(redesign.filterBar?.sortTitleAsc, "Title A–Z"),
      sortTitleDesc: str(redesign.filterBar?.sortTitleDesc, "Title Z–A"),
      resultsCount: str(redesign.filterBar?.resultsCount, "{count} articles"),
      openFilters: str(redesign.filterBar?.openFilters, "Filters"),
      closeFilters: str(redesign.filterBar?.closeFilters, "Close filters"),
      types: {
        hub: str(redesign.filterBar?.types?.hub, "Hub articles"),
        industry: str(redesign.filterBar?.types?.industry, "Industry guides"),
        article: str(redesign.filterBar?.types?.article, "General articles"),
      },
    },
    articleListing: {
      featured: str(redesign.articleListing?.featured, "Featured"),
      gettingStarted: str(redesign.articleListing?.gettingStarted, "Getting started"),
      latest: str(redesign.articleListing?.latest, "More guides"),
      all: str(redesign.articleListing?.all, hub.viewAllArticles),
      readArticle: str(redesign.articleListing?.readArticle, hub.readArticle),
      empty: str(redesign.articleListing?.empty, "No articles match your filters."),
    },
    journey: {
      title: str(redesign.journey?.title, "Your knowledge journey"),
      steps:
        recordList<{ title: string; description: string }>(redesign.journey?.steps).length > 0
          ? recordList<{ title: string; description: string }>(redesign.journey?.steps)
          : [
              { title: "Understand the platform", description: "Learn what a Business Operating System means for your organization." },
              { title: "Explore Companion", description: "See how Aipify supports leaders and teams with governed intelligence." },
              { title: "Review your industry", description: "Find operational guides relevant to your sector and workflows." },
              { title: "Take the next step", description: "Book a demo or explore Business Packs when you are ready." },
            ],
    },
    trust: {
      title: str(redesign.trust?.title, "Built for trust and clarity"),
      subtitle: str(redesign.trust?.subtitle, "Knowledge that helps you decide — not marketing noise."),
      principles:
        recordList<{ title: string; description: string }>(redesign.trust?.principles).length > 0
          ? recordList<{ title: string; description: string }>(redesign.trust?.principles)
          : [
              { title: "People first", description: "Every article explains how humans stay in control of decisions and approvals." },
              { title: "Governed by design", description: "Policies, audit trails, and transparency are part of the platform — not add-ons." },
              { title: "Useful before searchable", description: "We publish knowledge to help you understand and decide — not to chase keywords." },
              { title: "Honest scope", description: "We describe what Aipify does today and what requires your organization's approval." },
            ],
    },
    cta: {
      title: str(redesign.cta?.title, hub.articleCtaTitle),
      subtitle: str(redesign.cta?.subtitle, "See how governed operational intelligence works in practice."),
      bookDemo: str(redesign.cta?.bookDemo, hub.articleCtaPrimary),
      explorePacks: str(redesign.cta?.explorePacks, "Explore Business Packs"),
      earlyAccess: str(redesign.cta?.earlyAccess, "Request early access"),
    },
    nested: {
      backToKnowledge: str(redesign.nested?.backToKnowledge, `Back to ${hub.title}`),
      breadcrumbHome: str(redesign.nested?.breadcrumbHome, "Home"),
      breadcrumbKnowledge: str(redesign.nested?.breadcrumbKnowledge, hub.title),
    },
    localesNote: str(redesign.localesNote, hub.localesNote),
  };
}
