import { GlobalExpansionDashboardPanel } from "@/components/app/global-expansion";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalExpansionPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.globalExpansion";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GlobalExpansionDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          globalReadiness: t(`${p}.globalReadiness`),
          generateBriefing: t(`${p}.generateBriefing`),
          languageCoverage: t(`${p}.languageCoverage`),
          activeMarkets: t(`${p}.activeMarkets`),
          plannedMarkets: t(`${p}.plannedMarkets`),
          defaultLanguage: t(`${p}.defaultLanguage`),
          defaultCurrency: t(`${p}.defaultCurrency`),
          supportedLanguages: t(`${p}.supportedLanguages`),
          coverage: t(`${p}.coverage`),
          futureLanguages: t(`${p}.futureLanguages`),
          localizationProjects: t(`${p}.localizationProjects`),
          countryPlaybooks: t(`${p}.countryPlaybooks`),
          readiness: t(`${p}.readiness`),
          advancePlaybook: t(`${p}.advancePlaybook`),
          recommendations: t(`${p}.recommendations`),
          dismiss: t(`${p}.dismiss`),
          internationalAnalytics: t(`${p}.internationalAnalytics`),
          adoption: t(`${p}.adoption`),
          languageUsage: t(`${p}.languageUsage`),
          satisfaction: t(`${p}.satisfaction`),
          terminologyGlossary: t(`${p}.terminologyGlossary`),
          regionalContent: t(`${p}.regionalContent`),
          qualityAssurance: t(`${p}.qualityAssurance`),
          complianceReadiness: t(`${p}.complianceReadiness`),
          recentBriefings: t(`${p}.recentBriefings`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          globalLearning: t(`${p}.globalLearning`),
          academy: t(`${p}.academy`),
          commercial: t(`${p}.commercial`),
        }}
      />
    </div>
  );
}
