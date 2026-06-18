import { CollectiveDecisionCouncilEngineDashboardPanel } from "@/components/app/collective-decision-council-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CollectiveDecisionCouncilEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "collectiveDecisionCouncilEngine");
  const t = createTranslator(dict);
  const p = "customerApp.collectiveDecisionCouncilEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CollectiveDecisionCouncilEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          councilWisdomScore: t(`${p}.councilWisdomScore`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          companionsDoNotVote: t(`${p}.companionsDoNotVote`),
          activeWorkspaces: t(`${p}.activeWorkspaces`),
          perspectives: t(`${p}.perspectives`),
          humanPerspectives: t(`${p}.humanPerspectives`),
          companionPerspectives: t(`${p}.companionPerspectives`),
          philosophy: t(`${p}.philosophy`),
          distinctionNote: t(`${p}.distinctionNote`),
          collectiveDecisionCenter: t(`${p}.collectiveDecisionCenter`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          decisionWorkspaces: t(`${p}.decisionWorkspaces`),
          humanCompanionCouncil: t(`${p}.humanCompanionCouncil`),
          councilPerspectives: t(`${p}.councilPerspectives`),
          perspectiveEngine: t(`${p}.perspectiveEngine`),
          companionAdvisory: t(`${p}.companionAdvisory`),
          stakeholderImpacts: t(`${p}.stakeholderImpacts`),
          stakeholderMapping: t(`${p}.stakeholderMapping`),
          disagreementFramework: t(`${p}.disagreementFramework`),
          transparencyRecords: t(`${p}.transparencyRecords`),
          transparencyEngine: t(`${p}.transparencyEngine`),
          councilMemory: t(`${p}.councilMemory`),
          councilMemoryEngine: t(`${p}.councilMemoryEngine`),
          companionLimitations: t(`${p}.companionLimitations`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          securityRequirements: t(`${p}.securityRequirements`),
          crossLinks: t(`${p}.crossLinks`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
