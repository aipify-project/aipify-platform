import { GlobalStewardshipCollectiveFutureEngineDashboardPanel } from "@/components/app/global-stewardship-collective-future-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalStewardshipCollectiveFutureEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "globalStewardshipCollectiveFutureEngine");
  const t = createTranslator(dict);
  const p = "customerApp.globalStewardshipCollectiveFutureEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GlobalStewardshipCollectiveFutureEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          eraCapstoneBanner: t(`${p}.eraCapstoneBanner`),
          eraCrossLinksNote: t(`${p}.eraCrossLinksNote`),
          stewardshipCenter: t(`${p}.stewardshipCenter`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          reflectionOptIn: t(`${p}.reflectionOptIn`),
          currentMaturityLevel: t(`${p}.currentMaturityLevel`),
          wisdomBeforeSpeed: t(`${p}.wisdomBeforeSpeed`),
          executiveReviews: t(`${p}.executiveReviews`),
          futureScenarios: t(`${p}.futureScenarios`),
          readinessLevel: t(`${p}.readinessLevel`),
          extendedCrossLinks: t(`${p}.extendedCrossLinks`),
          globalStewardshipCenter: t(`${p}.globalStewardshipCenter`),
          collectiveFutureEngine: t(`${p}.collectiveFutureEngine`),
          longTermThinkingFramework: t(`${p}.longTermThinkingFramework`),
          globalResponsibilityPrinciples: t(`${p}.globalResponsibilityPrinciples`),
          collectiveResilienceEngine: t(`${p}.collectiveResilienceEngine`),
          executiveStewardshipReviewsMeta: t(`${p}.executiveStewardshipReviewsMeta`),
          legacyIntelligence: t(`${p}.legacyIntelligence`),
          legacyCrossLink: t(`${p}.legacyCrossLink`),
          executiveReviewsSection: t(`${p}.executiveReviewsSection`),
          futureScenariosSection: t(`${p}.futureScenariosSection`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionLimitations: t(`${p}.companionLimitations`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
