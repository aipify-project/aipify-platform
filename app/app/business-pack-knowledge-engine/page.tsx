import { BusinessPackKnowledgeEngineDashboardPanel } from "@/components/app/business-pack-knowledge-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackKnowledgeEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.businessPackKnowledgeEngine";

  const labels: Record<string, string> = {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    engineTitle: t(`${p}.engineTitle`),
    packDefinitions: t(`${p}.packDefinitions`),
    knowledgeArticles: t(`${p}.knowledgeArticles`),
    feedbackRecords: t(`${p}.feedbackRecords`),
    openGaps: t(`${p}.openGaps`),
    auditEvents: t(`${p}.auditEvents`),
    knowledgeStructure: t(`${p}.knowledgeStructure`),
    governance: t(`${p}.governance`),
    catalogTitle: t(`${p}.catalogTitle`),
    viewKnowledgeCenter: t(`${p}.viewKnowledgeCenter`),
    articles: t(`${p}.articles`),
    topSearches: t(`${p}.topSearches`),
    forbiddenTitle: t(`${p}.forbiddenTitle`),
    successCriteria: t(`${p}.successCriteria`),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </header>
      <BusinessPackKnowledgeEngineDashboardPanel labels={labels} />
    </div>
  );
}
