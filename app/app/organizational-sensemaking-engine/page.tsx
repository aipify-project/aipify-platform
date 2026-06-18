import { OrganizationalSensemakingEngineDashboardPanel } from "@/components/app/organizational-sensemaking-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalSensemakingEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "organizationalSensemakingEngine");
  const t = createTranslator(dict);
  const p = "customerApp.organizationalSensemakingEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationalSensemakingEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          sensemakingScore: t(`${p}.sensemakingScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          sensemakingMode: t(`${p}.sensemakingMode`),
          signalsCount: t(`${p}.signalsCount`),
          activeSignals: t(`${p}.activeSignals`),
          synthesesCount: t(`${p}.synthesesCount`),
          enableRequired: t(`${p}.enableRequired`),
          sensemakingCenter: t(`${p}.sensemakingCenter`),
          collectiveIntelligence: t(`${p}.collectiveIntelligence`),
          organizationalSignals: t(`${p}.organizationalSignals`),
          executiveSensemakingReviews: t(`${p}.executiveSensemakingReviews`),
          sensemakingCompanion: t(`${p}.sensemakingCompanion`),
          diversePerspectives: t(`${p}.diversePerspectives`),
          knowledgeSynthesis: t(`${p}.knowledgeSynthesis`),
          organizationalAwareness: t(`${p}.organizationalAwareness`),
          signalSnapshots: t(`${p}.signalSnapshots`),
          knowledgeSyntheses: t(`${p}.knowledgeSyntheses`),
          executiveReviews: t(`${p}.executiveReviews`),
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
