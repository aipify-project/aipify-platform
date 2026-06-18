import { JointOperationsEngineDashboardPanel } from "@/components/app/joint-operations-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function JointOperationsEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "jointOperationsEngine");
  const t = createTranslator(dict);
  const p = "customerApp.jointOperationsEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <JointOperationsEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          collaborationScore: t(`${p}.collaborationScore`),
          optInRequired: t(`${p}.optInRequired`),
          executiveApprovalRequired: t(`${p}.executiveApprovalRequired`),
          partnershipsCount: t(`${p}.partnershipsCount`),
          activePartnerships: t(`${p}.activePartnerships`),
          sharedWorkspaces: t(`${p}.sharedWorkspaces`),
          sharedObjectives: t(`${p}.sharedObjectives`),
          philosophy: t(`${p}.philosophy`),
          distinctionNote: t(`${p}.distinctionNote`),
          jointOperationsCenter: t(`${p}.jointOperationsCenter`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          partnerships: t(`${p}.partnerships`),
          sharedWorkspacesList: t(`${p}.sharedWorkspacesList`),
          sharedObjectivesList: t(`${p}.sharedObjectivesList`),
          collaborationFramework: t(`${p}.collaborationFramework`),
          sharedWorkspaceEngine: t(`${p}.sharedWorkspaceEngine`),
          jointGovernance: t(`${p}.jointGovernance`),
          crossOrgCompanion: t(`${p}.crossOrgCompanion`),
          partnerExperience: t(`${p}.partnerExperience`),
          sharedObjectivesFramework: t(`${p}.sharedObjectivesFramework`),
          collaborationMemory: t(`${p}.collaborationMemory`),
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
