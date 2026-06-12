import { CompanionWorkforceEngineDashboardPanel } from "@/components/app/companion-workforce-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionWorkforceEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.companionWorkforceEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CompanionWorkforceEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          workforceScore: t(`${p}.workforceScore`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          membersActive: t(`${p}.membersActive`),
          collaborationsActive: t(`${p}.collaborationsActive`),
          routingRulesActive: t(`${p}.routingRulesActive`),
          conflictsPending: t(`${p}.conflictsPending`),
          philosophy: t(`${p}.philosophy`),
          distinctionNote: t(`${p}.distinctionNote`),
          workforceCenter: t(`${p}.workforceCenter`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionDirectory: t(`${p}.companionDirectory`),
          collaborationModel: t(`${p}.collaborationModel`),
          activeCollaborations: t(`${p}.activeCollaborations`),
          workforceOrchestration: t(`${p}.workforceOrchestration`),
          routingRules: t(`${p}.routingRules`),
          responsibilityFramework: t(`${p}.responsibilityFramework`),
          humanCollaboration: t(`${p}.humanCollaboration`),
          companionHealth: t(`${p}.companionHealth`),
          conflictManagement: t(`${p}.conflictManagement`),
          openConflicts: t(`${p}.openConflicts`),
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
