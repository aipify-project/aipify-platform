import { GlobalExpansionDashboardPanel } from "@/components/app/global-expansion";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalExpansionPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "globalExpansion");
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
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintPhase35: t(`${p}.blueprintPhase35`),
          localizationSummary: t(`${p}.localizationSummary`),
          activeLanguages: t(`${p}.activeLanguages`),
          avgCoverage: t(`${p}.avgCoverage`),
          openRecommendations: t(`${p}.openRecommendations`),
          publishedProjects: t(`${p}.publishedProjects`),
          regionalContentItems: t(`${p}.regionalContentItems`),
          localizationObjectives: t(`${p}.localizationObjectives`),
          languageStrategy: t(`${p}.languageStrategy`),
          futureLocales: t(`${p}.futureLocales`),
          companionLocalization: t(`${p}.companionLocalization`),
          paymentLocalization: t(`${p}.paymentLocalization`),
          internationalPayments: t(`${p}.internationalPayments`),
          salesExpertLocalization: t(`${p}.salesExpertLocalization`),
          openSalesExpert: t(`${p}.openSalesExpert`),
          trainingCertificationLocalization: t(`${p}.trainingCertificationLocalization`),
          trustConnection: t(`${p}.trustConnection`),
          dogfooding: t(`${p}.dogfooding`),
          aipifyGroup: t(`${p}.aipifyGroup`),
          unonight: t(`${p}.unonight`),
          successCriteria: t(`${p}.successCriteria`),
          visionPhrases: t(`${p}.visionPhrases`),
        }}
      />
    </div>
  );
}
