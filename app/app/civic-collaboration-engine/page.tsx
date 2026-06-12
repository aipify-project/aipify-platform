import { CivicCollaborationEngineDashboardPanel } from "@/components/app/civic-collaboration-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CivicCollaborationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.civicCollaborationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CivicCollaborationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          publicValueScore: t(`${p}.publicValueScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          collaborationMode: t(`${p}.collaborationMode`),
          partnershipsCount: t(`${p}.partnershipsCount`),
          activeInitiatives: t(`${p}.activeInitiatives`),
          trustReflections: t(`${p}.trustReflections`),
          enableRequired: t(`${p}.enableRequired`),
          publicValueCenter: t(`${p}.publicValueCenter`),
          civicCollaborationEngine: t(`${p}.civicCollaborationEngine`),
          communityPartnershipFramework: t(`${p}.communityPartnershipFramework`),
          publicTrustEngine: t(`${p}.publicTrustEngine`),
          civicCompanion: t(`${p}.civicCompanion`),
          educationMentorshipEngine: t(`${p}.educationMentorshipEngine`),
          collectiveResilienceFramework: t(`${p}.collectiveResilienceFramework`),
          publicValueInitiatives: t(`${p}.publicValueInitiatives`),
          communityPartnerships: t(`${p}.communityPartnerships`),
          trustReflectionEntries: t(`${p}.trustReflectionEntries`),
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
