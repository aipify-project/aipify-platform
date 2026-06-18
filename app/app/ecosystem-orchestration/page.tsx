import { EcosystemOrchestrationDashboardPanel } from "@/components/app/ecosystem-orchestration";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EcosystemOrchestrationPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "ecosystemOrchestration");
  const t = createTranslator(dict);
  const p = "customerApp.ecosystemOrchestration";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EcosystemOrchestrationDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          orchestrationCenter: t(`${p}.orchestrationCenter`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          healthIndicators: t(`${p}.healthIndicators`),
          knowledgeFlow: t(`${p}.knowledgeFlow`),
          resilienceIndicators: t(`${p}.resilienceIndicators`),
          opportunities: t(`${p}.opportunities`),
          memoryEntries: t(`${p}.memoryEntries`),
          eraCrossLinks: t(`${p}.eraCrossLinks`),
          eraCrossLinksNote: t(`${p}.eraCrossLinksNote`),
          extendedCrossLinks: t(`${p}.extendedCrossLinks`),
          orchestrationCapabilities: t(`${p}.orchestrationCapabilities`),
          collectiveEvolution: t(`${p}.collectiveEvolution`),
          ecosystemHealth: t(`${p}.ecosystemHealth`),
          knowledgeFlowEngine: t(`${p}.knowledgeFlowEngine`),
          resilienceEngine: t(`${p}.resilienceEngine`),
          strategicOpportunities: t(`${p}.strategicOpportunities`),
          stewardshipCouncil: t(`${p}.stewardshipCouncil`),
          ecosystemMemory: t(`${p}.ecosystemMemory`),
          selfLoveInEcosystem: t(`${p}.selfLoveInEcosystem`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
