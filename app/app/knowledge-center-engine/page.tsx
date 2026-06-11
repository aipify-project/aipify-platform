import { KnowledgeCenterEngineDashboardPanel } from "@/components/app/knowledge-center-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgeCenterEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.knowledgeCenterEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <KnowledgeCenterEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          aipifyCore: t(`${p}.aipifyCore`),
          auditAccountability: t(`${p}.auditAccountability`),
          secureAiActions: t(`${p}.secureAiActions`),
          knowledgeEngine: t(`${p}.knowledgeEngine`),
          publishedArticles: t(`${p}.publishedArticles`),
          awaitingReview: t(`${p}.awaitingReview`),
          faqCount: t(`${p}.faqCount`),
          categories: t(`${p}.categories`),
          searchPlaceholder: t(`${p}.searchPlaceholder`),
          search: t(`${p}.search`),
          searchResults: t(`${p}.searchResults`),
          categoryList: t(`${p}.categoryList`),
          publishedList: t(`${p}.publishedList`),
          awaitingReviewList: t(`${p}.awaitingReviewList`),
          mostViewed: t(`${p}.mostViewed`),
          needsUpdate: t(`${p}.needsUpdate`),
          outdatedAlerts: t(`${p}.outdatedAlerts`),
          recentFaqs: t(`${p}.recentFaqs`),
          principles: t(`${p}.principles`),
          noArticles: t(`${p}.noArticles`),
          noAlerts: t(`${p}.noAlerts`),
        }}
      />
    </div>
  );
}
