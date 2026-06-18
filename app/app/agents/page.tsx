import { AgentsDashboardPanel } from "@/components/app/agents";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AgentsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "agents");
  const t = createTranslator(dict);
  const p = "customerApp.agents";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AgentsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          overview: t(`${p}.overview`),
          activeAgents: t(`${p}.activeAgents`),
          blockedEvents: t(`${p}.blockedEvents`),
          principle: t(`${p}.principle`),
          runSampleFlow: t(`${p}.runSampleFlow`),
          runningFlow: t(`${p}.runningFlow`),
          lastCollaboration: t(`${p}.lastCollaboration`),
          agentRegistry: t(`${p}.agentRegistry`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          agentHealth: t(`${p}.agentHealth`),
          events: t(`${p}.events`),
          successRate: t(`${p}.successRate`),
          recentEvents: t(`${p}.recentEvents`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}
