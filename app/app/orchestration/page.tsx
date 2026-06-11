import { OrchestrationDashboardPanel } from "@/components/app/orchestration";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrchestrationPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.orchestration";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrchestrationDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          emergencyStopActive: t(`${p}.emergencyStopActive`),
          eventsToday: t(`${p}.eventsToday`),
          activeFlows: t(`${p}.activeFlows`),
          blockedFlows: t(`${p}.blockedFlows`),
          waitingApprovals: t(`${p}.waitingApprovals`),
          events: t(`${p}.events`),
          flows: t(`${p}.flows`),
          rules: t(`${p}.rules`),
          settings: t(`${p}.settings`),
          topModules: t(`${p}.topModules`),
          recentEvents: t(`${p}.recentEvents`),
          noEvents: t(`${p}.noEvents`),
          principle: t(`${p}.principle`),
        }}
      />
    </div>
  );
}
