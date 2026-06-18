import { CivilizationalForesightEngineDashboardPanel } from "@/components/app/civilizational-foresight-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CivilizationalForesightEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "civilizationalForesightEngine");
  const t = createTranslator(dict);
  const p = "customerApp.civilizationalForesightEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CivilizationalForesightEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          eraCrossLinksBanner: t(`${p}.eraCrossLinksBanner`),
          eraCrossLinksNote: t(`${p}.eraCrossLinksNote`),
          longHorizonCenter: t(`${p}.longHorizonCenter`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          scenarioExplorationEnabled: t(`${p}.scenarioExplorationEnabled`),
          currentReadinessLevel: t(`${p}.currentReadinessLevel`),
          preparationNotProphecy: t(`${p}.preparationNotProphecy`),
          scenarios: t(`${p}.scenarios`),
          executiveReviews: t(`${p}.executiveReviews`),
          foresightMemory: t(`${p}.foresightMemory`),
          extendedCrossLinks: t(`${p}.extendedCrossLinks`),
          longHorizonCenterCapabilities: t(`${p}.longHorizonCenterCapabilities`),
          foresightEngine: t(`${p}.foresightEngine`),
          longHorizonFramework: t(`${p}.longHorizonFramework`),
          executiveForesightReviewsMeta: t(`${p}.executiveForesightReviewsMeta`),
          foresightCompanion: t(`${p}.foresightCompanion`),
          scenarioExplorationEngine: t(`${p}.scenarioExplorationEngine`),
          intergenerationalResponsibility: t(`${p}.intergenerationalResponsibility`),
          foresightMemoryEngine: t(`${p}.foresightMemoryEngine`),
          scenariosSection: t(`${p}.scenariosSection`),
          executiveReviewsSection: t(`${p}.executiveReviewsSection`),
          foresightMemorySection: t(`${p}.foresightMemorySection`),
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
