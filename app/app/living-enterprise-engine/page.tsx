import { LivingEnterpriseEngineDashboardPanel } from "@/components/app/living-enterprise-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LivingEnterpriseEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "livingEnterpriseEngine");
  const t = createTranslator(dict);
  const p = "customerApp.livingEnterpriseEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <LivingEnterpriseEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          eraCapstoneBanner: t(`${p}.eraCapstoneBanner`),
          eraCrossLinksNote: t(`${p}.eraCrossLinksNote`),
          livingEnterpriseCenter: t(`${p}.livingEnterpriseCenter`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          reflectionOptIn: t(`${p}.reflectionOptIn`),
          currentReadinessLevel: t(`${p}.currentReadinessLevel`),
          maturityNotRanking: t(`${p}.maturityNotRanking`),
          stewardshipReviews: t(`${p}.stewardshipReviews`),
          flourishingSnapshots: t(`${p}.flourishingSnapshots`),
          livingMemory: t(`${p}.livingMemory`),
          extendedCrossLinks: t(`${p}.extendedCrossLinks`),
          livingEnterpriseCenterCapabilities: t(`${p}.livingEnterpriseCenterCapabilities`),
          transcendenceEngine: t(`${p}.transcendenceEngine`),
          livingSystemsFramework: t(`${p}.livingSystemsFramework`),
          enterpriseFlourishing: t(`${p}.enterpriseFlourishing`),
          transcendenceCompanion: t(`${p}.transcendenceCompanion`),
          stewardshipMaturity: t(`${p}.stewardshipMaturity`),
          collectiveFlourishing: t(`${p}.collectiveFlourishing`),
          livingMemoryEngine: t(`${p}.livingMemoryEngine`),
          stewardshipReviewsSection: t(`${p}.stewardshipReviewsSection`),
          flourishingSection: t(`${p}.flourishingSection`),
          livingMemorySection: t(`${p}.livingMemorySection`),
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
