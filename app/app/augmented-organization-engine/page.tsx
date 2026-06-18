import { AugmentedOrganizationEngineDashboardPanel } from "@/components/app/augmented-organization-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AugmentedOrganizationEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "augmentedOrganizationEngine");
  const t = createTranslator(dict);
  const p = "customerApp.augmentedOrganizationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AugmentedOrganizationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          eraCapstoneBanner: t(`${p}.eraCapstoneBanner`),
          eraCrossLinksNote: t(`${p}.eraCrossLinksNote`),
          symbiosisCenter: t(`${p}.symbiosisCenter`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          humanAgencyProtection: t(`${p}.humanAgencyProtection`),
          currentMaturityLevel: t(`${p}.currentMaturityLevel`),
          maturityNotSpeed: t(`${p}.maturityNotSpeed`),
          symbiosisAssessments: t(`${p}.symbiosisAssessments`),
          trustSignals: t(`${p}.trustSignals`),
          agencyRecords: t(`${p}.agencyRecords`),
          maturityModel: t(`${p}.maturityModel`),
          symbiosisModel: t(`${p}.symbiosisModel`),
          humanContributions: t(`${p}.humanContributions`),
          companionContributions: t(`${p}.companionContributions`),
          extendedCrossLinks: t(`${p}.extendedCrossLinks`),
          augmentedOrganizationCenter: t(`${p}.augmentedOrganizationCenter`),
          symbiosisDesignPrinciples: t(`${p}.symbiosisDesignPrinciples`),
          augmentedExperienceEngine: t(`${p}.augmentedExperienceEngine`),
          humanAgencyFramework: t(`${p}.humanAgencyFramework`),
          trustEngine: t(`${p}.trustEngine`),
          relationshipIntelligence: t(`${p}.relationshipIntelligence`),
          rsiCrossLink: t(`${p}.rsiCrossLink`),
          symbiosisAssessmentsSection: t(`${p}.symbiosisAssessmentsSection`),
          trustSignalsSection: t(`${p}.trustSignalsSection`),
          agencyRecordsSection: t(`${p}.agencyRecordsSection`),
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
