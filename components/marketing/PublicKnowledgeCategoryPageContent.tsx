import KnowledgeCategoryDetailPage from "@/components/marketing/knowledge/KnowledgeCategoryDetailPage";
import type { KnowledgePageRedesignLabels } from "@/components/marketing/knowledge/types";
import type { KnowledgeArticleSummary } from "@/components/marketing/knowledge/types";
import type { PublicKnowledgeCategoryDetail } from "@/lib/marketing/knowledge/types";

type PublicKnowledgeCategoryPageContentProps = {
  category: PublicKnowledgeCategoryDetail;
  nested: KnowledgePageRedesignLabels["nested"];
  articles: KnowledgeArticleSummary[];
};

export default function PublicKnowledgeCategoryPageContent({
  category,
  nested,
  articles,
}: PublicKnowledgeCategoryPageContentProps) {
  return <KnowledgeCategoryDetailPage category={category} nested={nested} articles={articles} />;
}
