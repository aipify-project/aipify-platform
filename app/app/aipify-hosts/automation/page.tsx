import { AipifyHostsAutomationDashboardPanel } from "@/components/app/aipify-hosts-automation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsAutomationPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsAutomation";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsAutomationDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          dailyBriefing: t(`${p}.dailyBriefing`),
          recommendations: t(`${p}.recommendations`),
          operationalSnapshot: t(`${p}.operationalSnapshot`),
          arrivalsToday: t(`${p}.arrivalsToday`),
          departuresToday: t(`${p}.departuresToday`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          occupancyForecast: t(`${p}.occupancyForecast`),
          arrivalReadiness: t(`${p}.arrivalReadiness`),
          arrivalReadinessHint: t(`${p}.arrivalReadinessHint`),
          verified: t(`${p}.verified`),
          pending: t(`${p}.pending`),
          blocked: t(`${p}.blocked`),
          modules: t(`${p}.modules`),
          included: t(`${p}.included`),
          upgradeRequired: t(`${p}.upgradeRequired`),
          playbooks: t(`${p}.playbooks`),
          approvalLevels: t(`${p}.approvalLevels`),
          level: t(`${p}.level`),
          pendingRecommendations: t(`${p}.pendingRecommendations`),
          approvalLevel: t(`${p}.approvalLevel`),
          successMetrics: t(`${p}.successMetrics`),
          backToHosts: t(`${p}.backToHosts`),
          exploreKnowledge: t(`${p}.exploreKnowledge`),
        }}
      />
    </div>
  );
}
