import { SupportAiEngineDashboardPanel } from "@/components/app/support-ai-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SupportAiEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.supportAiEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SupportAiEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          adminAssistant: t(`${p}.adminAssistant`),
          secureAiActions: t(`${p}.secureAiActions`),
          supportEngine: t(`${p}.supportEngine`),
          openCases: t(`${p}.openCases`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          escalatedCases: t(`${p}.escalatedCases`),
          aiResponses: t(`${p}.aiResponses`),
          responseModes: t(`${p}.responseModes`),
          defaultMode: t(`${p}.defaultMode`),
          autoFaq: t(`${p}.autoFaq`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          openCasesList: t(`${p}.openCasesList`),
          pendingApprovalsList: t(`${p}.pendingApprovalsList`),
          supportMetrics: t(`${p}.supportMetrics`),
          aiStatistics: t(`${p}.aiStatistics`),
          escalationRate: t(`${p}.escalationRate`),
          aiUsageRate: t(`${p}.aiUsageRate`),
          approvalRate: t(`${p}.approvalRate`),
          avgResponseTime: t(`${p}.avgResponseTime`),
          automaticSent: t(`${p}.automaticSent`),
          draftsPending: t(`${p}.draftsPending`),
          escalatedResponses: t(`${p}.escalatedResponses`),
          knowledgeGaps: t(`${p}.knowledgeGaps`),
          principles: t(`${p}.principles`),
          noCases: t(`${p}.noCases`),
          noApprovals: t(`${p}.noApprovals`),
          approve: t(`${p}.approve`),
          send: t(`${p}.send`),
          supportTiers: t(`${p}.supportTiers`),
          kcConnection: t(`${p}.kcConnection`),
          successCriteria: t(`${p}.successCriteria`),
          trustConnection: t(`${p}.trustConnection`),
          dogfooding: t(`${p}.dogfooding`),
        }}
      />
    </div>
  );
}
