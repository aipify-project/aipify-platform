import { SharedProsperityEngineDashboardPanel } from "@/components/app/shared-prosperity-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SharedProsperityEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.sharedProsperityEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SharedProsperityEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          eraCrossLinksBanner: t(`${p}.eraCrossLinksBanner`),
          eraCrossLinksNote: t(`${p}.eraCrossLinksNote`),
          sharedProsperityCenter: t(`${p}.sharedProsperityCenter`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          reflectionOptIn: t(`${p}.reflectionOptIn`),
          currentReadinessLevel: t(`${p}.currentReadinessLevel`),
          notResourceAllocation: t(`${p}.notResourceAllocation`),
          stewardshipNotObligation: t(`${p}.stewardshipNotObligation`),
          stewardshipReviews: t(`${p}.stewardshipReviews`),
          opportunityInitiatives: t(`${p}.opportunityInitiatives`),
          prosperityMemory: t(`${p}.prosperityMemory`),
          extendedCrossLinks: t(`${p}.extendedCrossLinks`),
          sharedProsperityCenterCapabilities: t(`${p}.sharedProsperityCenterCapabilities`),
          stewardshipEngine: t(`${p}.stewardshipEngine`),
          sharedProsperityFramework: t(`${p}.sharedProsperityFramework`),
          stewardshipCompanion: t(`${p}.stewardshipCompanion`),
          opportunityDevelopmentEngine: t(`${p}.opportunityDevelopmentEngine`),
          ecosystemHealthEngine: t(`${p}.ecosystemHealthEngine`),
          prosperityMemoryEngine: t(`${p}.prosperityMemoryEngine`),
          stewardshipReviewsSection: t(`${p}.stewardshipReviewsSection`),
          opportunityInitiativesSection: t(`${p}.opportunityInitiativesSection`),
          prosperityMemorySection: t(`${p}.prosperityMemorySection`),
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
