import { CivilizationalCoordinationEngineDashboardPanel } from "@/components/app/civilizational-coordination-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CivilizationalCoordinationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.civilizationalCoordinationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CivilizationalCoordinationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          coordinationScore: t(`${p}.coordinationScore`),
          coordinationMode: t(`${p}.coordinationMode`),
          programsCount: t(`${p}.programsCount`),
          activePartnerships: t(`${p}.activePartnerships`),
          milestonesCount: t(`${p}.milestonesCount`),
          enableRequired: t(`${p}.enableRequired`),
          sharedActionCenter: t(`${p}.sharedActionCenter`),
          coordinationEngine: t(`${p}.coordinationEngine`),
          sharedActionFramework: t(`${p}.sharedActionFramework`),
          executiveCoordinationReviews: t(`${p}.executiveCoordinationReviews`),
          coordinationCompanion: t(`${p}.coordinationCompanion`),
          voluntaryAlignmentEngine: t(`${p}.voluntaryAlignmentEngine`),
          collectiveExecutionEngine: t(`${p}.collectiveExecutionEngine`),
          relationshipStewardshipEngine: t(`${p}.relationshipStewardshipEngine`),
          sharedActionPrograms: t(`${p}.sharedActionPrograms`),
          coordinationPartnerships: t(`${p}.coordinationPartnerships`),
          coordinationMilestones: t(`${p}.coordinationMilestones`),
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
