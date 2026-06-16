import { BusinessPackKnowledgeCenterPanel } from "@/components/app/business-pack-knowledge-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = {
  params: Promise<{ packKey: string }>;
  searchParams: Promise<{ context?: string }>;
};

export default async function BusinessPackKnowledgePage({ params, searchParams }: PageProps) {
  const { packKey } = await params;
  const { context } = await searchParams;
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.businessPackKnowledge";

  const categoryKeys = [
    "overview", "getting_started", "features", "best_practices",
    "troubleshooting", "release_notes", "upgrade_guidance", "advanced_topics",
  ] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    notFoundTitle: t(`${p}.notFoundTitle`),
    notFoundMessage: t(`${p}.notFoundMessage`),
    backToMarketplace: t(`${p}.backToMarketplace`),
    viewPack: t(`${p}.viewPack`),
    knowledgeCenter: t(`${p}.knowledgeCenter`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    search: t(`${p}.search`),
    language: t(`${p}.language`),
    allCategories: t(`${p}.allCategories`),
    totalArticles: t(`${p}.totalArticles`),
    totalViews: t(`${p}.totalViews`),
    openGaps: t(`${p}.openGaps`),
    contextualTitle: t(`${p}.contextualTitle`),
    articles: t(`${p}.articles`),
    noResults: t(`${p}.noResults`),
    version: t(`${p}.version`),
    published: t(`${p}.published`),
    updated: t(`${p}.updated`),
    readArticle: t(`${p}.readArticle`),
    hideArticle: t(`${p}.hideArticle`),
    wasHelpful: t(`${p}.wasHelpful`),
    helpful: t(`${p}.helpful`),
    notHelpful: t(`${p}.notHelpful`),
    helpfulRating: t(`${p}.helpfulRating`),
    feedbackThanks: t(`${p}.feedbackThanks`),
    actionFailed: t(`${p}.actionFailed`),
  };

  for (const key of categoryKeys) labels[`category_${key}`] = t(`${p}.categories.${key}`);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <BusinessPackKnowledgeCenterPanel
        packKey={packKey}
        labels={labels}
        initialContext={context ?? null}
      />
    </div>
  );
}
