import { AipifyHostsExpansionIntelligenceDashboardPanel } from "@/components/app/aipify-hosts-expansion-intelligence";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsExpansionIntelligencePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyHostsExpansionIntelligence");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsExpansionIntelligence";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsExpansionIntelligenceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          growthSnapshot: t(`${p}.growthSnapshot`),
          expansionReadiness: t(`${p}.expansionReadiness`),
          opportunityScore: t(`${p}.opportunityScore`),
          portfolioQuality: t(`${p}.portfolioQuality`),
          marketsWatchlist: t(`${p}.marketsWatchlist`),
          underperforming: t(`${p}.underperforming`),
          opportunities: t(`${p}.opportunities`),
          typeMarket: t(`${p}.typeMarket`),
          typeProperty: t(`${p}.typeProperty`),
          typeOptimization: t(`${p}.typeOptimization`),
          executiveQuestions: t(`${p}.executiveQuestions`),
          executiveMetrics: t(`${p}.executiveMetrics`),
          modules: t(`${p}.modules`),
          included: t(`${p}.included`),
          upgradeRequired: t(`${p}.upgradeRequired`),
          playbooks: t(`${p}.playbooks`),
          simulationExamples: t(`${p}.simulationExamples`),
          knowledgeCategories: t(`${p}.knowledgeCategories`),
          successMetrics: t(`${p}.successMetrics`),
          backToHosts: t(`${p}.backToHosts`),
          exploreKnowledge: t(`${p}.exploreKnowledge`),
        }}
      />
    </div>
  );
}
