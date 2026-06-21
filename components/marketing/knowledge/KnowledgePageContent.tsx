import { KnowledgeHubProvider } from "./KnowledgeHubContext";
import BusinessPackKnowledge from "./BusinessPackKnowledgeCard";
import CategoryNavigation from "./KnowledgeCategoryCard";
import ContentHubs from "./KnowledgeHubCard";
import FeaturedKnowledge from "./FeaturedKnowledge";
import IndustryGuides from "./IndustryGuideCard";
import KnowledgeArticleListingSection from "./KnowledgeArticleListingSection";
import KnowledgeCTA from "./KnowledgeCTA";
import KnowledgeFilterBar from "./KnowledgeFilterBar";
import KnowledgeHero from "./KnowledgeHero";
import KnowledgeJourney from "./KnowledgeJourney";
import KnowledgeSearch from "./KnowledgeSearch";
import KnowledgeTrustSection from "./KnowledgeTrustSection";
import type { KnowledgePageContentProps } from "./types";

export default function KnowledgePageContent({
  labels,
  categories,
  industries,
  businessPacks,
  articleSummaries,
}: KnowledgePageContentProps) {
  return (
    <KnowledgeHubProvider articleSummaries={articleSummaries}>
      <KnowledgeHero hero={labels.hero} />
      <KnowledgeSearch labels={labels.search} />
      <FeaturedKnowledge labels={labels.featured} articleSummaries={articleSummaries} />
      <ContentHubs labels={labels.hubs} />
      <CategoryNavigation labels={labels.categories} categories={categories} />
      <IndustryGuides labels={labels.industries} industries={industries} />
      <BusinessPackKnowledge labels={labels.businessPacks} businessPacks={businessPacks} />
      <KnowledgeFilterBar labels={labels.filterBar} categories={categories} />
      <KnowledgeArticleListingSection
        labels={labels.articleListing}
        featuredSlugs={labels.featured.featuredSlugs}
        categories={categories}
      />
      <KnowledgeJourney journey={labels.journey} />
      <KnowledgeTrustSection trust={labels.trust} />
      <KnowledgeCTA cta={labels.cta} />

      {labels.localesNote ? (
        <p className="mx-auto max-w-[77.5rem] px-4 pb-10 text-center text-xs text-aipify-text-muted sm:px-6 lg:px-8">
          {labels.localesNote}
        </p>
      ) : null}
    </KnowledgeHubProvider>
  );
}
