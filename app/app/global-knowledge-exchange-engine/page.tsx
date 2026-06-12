import { GlobalKnowledgeExchangeEngineDashboardPanel } from "@/components/app/global-knowledge-exchange-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalKnowledgeExchangeEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.globalKnowledgeExchangeEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GlobalKnowledgeExchangeEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          exchangeScore: t(`${p}.exchangeScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          participationStatus: t(`${p}.participationStatus`),
          programsCount: t(`${p}.programsCount`),
          approvedContributions: t(`${p}.approvedContributions`),
          pendingContributions: t(`${p}.pendingContributions`),
          optInRequired: t(`${p}.optInRequired`),
          approvalRequired: t(`${p}.approvalRequired`),
          globalKnowledgeCenter: t(`${p}.globalKnowledgeCenter`),
          interorganizationalLearning: t(`${p}.interorganizationalLearning`),
          knowledgeSharingGovernance: t(`${p}.knowledgeSharingGovernance`),
          anonymizedBenchmarking: t(`${p}.anonymizedBenchmarking`),
          globalLearningNetworks: t(`${p}.globalLearningNetworks`),
          exchangePrograms: t(`${p}.exchangePrograms`),
          contributions: t(`${p}.contributions`),
          benchmarkSnapshots: t(`${p}.benchmarkSnapshots`),
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
