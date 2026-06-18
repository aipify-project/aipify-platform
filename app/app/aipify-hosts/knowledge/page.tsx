import { AipifyHostsKnowledgeDashboardPanel } from "@/components/app/aipify-hosts-knowledge";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsKnowledgePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyHostsKnowledge");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsKnowledge";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsKnowledgeDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          backToHosts: t(`${p}.backToHosts`),
          globalSearch: t(`${p}.globalSearch`),
          searchPlaceholder: t(`${p}.searchPlaceholder`),
          search: t(`${p}.search`),
          searching: t(`${p}.searching`),
          suggestedArticles: t(`${p}.suggestedArticles`),
          recentArticles: t(`${p}.recentArticles`),
          popularArticles: t(`${p}.popularArticles`),
          emptySuggestedTitle: t(`${p}.emptySuggestedTitle`),
          emptySuggestedMessage: t(`${p}.emptySuggestedMessage`),
          emptyRecentTitle: t(`${p}.emptyRecentTitle`),
          emptyRecentMessage: t(`${p}.emptyRecentMessage`),
          browseSections: t(`${p}.browseSections`),
          markHelpful: t(`${p}.markHelpful`),
          markedHelpful: t(`${p}.markedHelpful`),
          relatedArticles: t(`${p}.relatedArticles`),
          backToBrowse: t(`${p}.backToBrowse`),
          loadingArticle: t(`${p}.loadingArticle`),
        }}
      />
    </div>
  );
}
