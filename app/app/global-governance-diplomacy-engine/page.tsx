import { GlobalGovernanceDiplomacyEngineDashboardPanel } from "@/components/app/global-governance-diplomacy-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalGovernanceDiplomacyEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "globalGovernanceDiplomacyEngine");
  const t = createTranslator(dict);
  const p = "customerApp.globalGovernanceDiplomacyEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GlobalGovernanceDiplomacyEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          governanceScore: t(`${p}.governanceScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          legalDisclaimer: t(`${p}.legalDisclaimer`),
          governanceMaturityLevel: t(`${p}.governanceMaturityLevel`),
          chartersCount: t(`${p}.chartersCount`),
          activeCharters: t(`${p}.activeCharters`),
          activeEngagements: t(`${p}.activeEngagements`),
          optInRequired: t(`${p}.optInRequired`),
          executiveApprovalRequired: t(`${p}.executiveApprovalRequired`),
          globalGovernanceCenter: t(`${p}.globalGovernanceCenter`),
          digitalDiplomacy: t(`${p}.digitalDiplomacy`),
          partnershipCharterEngine: t(`${p}.partnershipCharterEngine`),
          executiveAlignment: t(`${p}.executiveAlignment`),
          crossCulturalCollaboration: t(`${p}.crossCulturalCollaboration`),
          governanceCompanion: t(`${p}.governanceCompanion`),
          conflictPrevention: t(`${p}.conflictPrevention`),
          globalPolicyLibrary: t(`${p}.globalPolicyLibrary`),
          partnershipCharters: t(`${p}.partnershipCharters`),
          diplomacyEngagements: t(`${p}.diplomacyEngagements`),
          policyLibraryRefs: t(`${p}.policyLibraryRefs`),
          crossLinks: t(`${p}.crossLinks`),
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
