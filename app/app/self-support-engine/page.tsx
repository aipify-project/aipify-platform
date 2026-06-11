import { SelfSupportEngineDashboardPanel } from "@/components/app/self-support-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SelfSupportEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.selfSupportEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SelfSupportEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          supportAi: t(`${p}.supportAi`),
          onboarding: t(`${p}.onboarding`),
          selfSupportEngine: t(`${p}.selfSupportEngine`),
          activeConversations: t(`${p}.activeConversations`),
          escalationQueue: t(`${p}.escalationQueue`),
          unresolvedIssues: t(`${p}.unresolvedIssues`),
          totalConversations: t(`${p}.totalConversations`),
          settings: t(`${p}.settings`),
          autoResponse: t(`${p}.autoResponse`),
          confidenceThreshold: t(`${p}.confidenceThreshold`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          futureChannels: t(`${p}.futureChannels`),
          activeConversationsList: t(`${p}.activeConversationsList`),
          escalationQueueList: t(`${p}.escalationQueueList`),
          satisfactionTrends: t(`${p}.satisfactionTrends`),
          statistics: t(`${p}.statistics`),
          helpful: t(`${p}.helpful`),
          unhelpful: t(`${p}.unhelpful`),
          automaticResponses: t(`${p}.automaticResponses`),
          draftResponses: t(`${p}.draftResponses`),
          escalatedConversations: t(`${p}.escalatedConversations`),
          knowledgeGaps: t(`${p}.knowledgeGaps`),
          principles: t(`${p}.principles`),
          noConversations: t(`${p}.noConversations`),
          noEscalations: t(`${p}.noEscalations`),
          escalate: t(`${p}.escalate`),
          close: t(`${p}.close`),
        }}
      />
    </div>
  );
}
