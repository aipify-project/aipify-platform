import { ExecutiveIntelligenceDashboardPanel } from "@/components/app/executive-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveIntelligencePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.executiveIntelligence";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ExecutiveIntelligenceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          intelligenceScore: t(`${p}.intelligenceScore`),
          humanDecisionRequired: t(`${p}.humanDecisionRequired`),
          overloadAwareMode: t(`${p}.overloadAwareMode`),
          briefingsReady: t(`${p}.briefingsReady`),
          memoryEntries: t(`${p}.memoryEntries`),
          prioritiesActive: t(`${p}.prioritiesActive`),
          risksActive: t(`${p}.risksActive`),
          philosophy: t(`${p}.philosophy`),
          intelligenceCenter: t(`${p}.intelligenceCenter`),
          dashboardSections: t(`${p}.dashboardSections`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          executiveBriefings: t(`${p}.executiveBriefings`),
          executiveMemory: t(`${p}.executiveMemory`),
          decisionSupport: t(`${p}.decisionSupport`),
          personalDecisionSupport: t(`${p}.personalDecisionSupport`),
          organizationalDecisionSupport: t(`${p}.organizationalDecisionSupport`),
          orgHealth: t(`${p}.orgHealth`),
          organizationalHealthLink: t(`${p}.organizationalHealthLink`),
          priorityAlignment: t(`${p}.priorityAlignment`),
          strategicAlignmentLink: t(`${p}.strategicAlignmentLink`),
          executiveCompanion: t(`${p}.executiveCompanion`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          riskVisibility: t(`${p}.riskVisibility`),
          opportunityIntelligence: t(`${p}.opportunityIntelligence`),
          communicationSupport: t(`${p}.communicationSupport`),
          companionLimitations: t(`${p}.companionLimitations`),
          selfLoveLeadership: t(`${p}.selfLoveLeadership`),
          selfLoveLink: t(`${p}.selfLoveLink`),
          crossLinks: t(`${p}.crossLinks`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
