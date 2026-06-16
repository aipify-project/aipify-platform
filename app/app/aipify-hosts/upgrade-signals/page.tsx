import { AipifyHostsUpgradeSignalsDashboardPanel } from "@/components/app/aipify-hosts-upgrade-signals";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsUpgradeSignalsPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.upgradeSignals";
  const c = "hosts.common";

  const signalKeys = [
    "property_limit_reached", "property_limit_nearly_reached", "multiple_properties_added",
    "high_operational_workload", "repeated_manual_tasks", "team_members_increased",
    "increased_guest_activity", "incidents_maintenance_volume",
  ] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    upgrade: t(`${p}.upgrade`),
    addPropertyLicense: t(`${p}.addPropertyLicense`),
    viewPlans: t(`${p}.viewPlans`),
    learnMore: t(`${p}.learnMore`),
    dismiss: t(`${p}.dismiss`),
    activatePack: t(`${p}.activatePack`),
    actionFailed: t(`${p}.actionFailed`),
    actionRecorded: t(`${c}.actionRecorded`),
    currentPlan: t(`${p}.currentPlan`),
    propertyCapacity: t(`${p}.propertyCapacity`),
    activeSignals: t(`${p}.activeSignals`),
    recommendations: t(`${p}.recommendations`),
    growthSignals: t(`${p}.growthSignals`),
    emptyRecommendations: t(`${p}.emptyRecommendations`),
    emptySignals: t(`${p}.emptySignals`),
    backToHosts: t(`${c}.backToHosts`),
    openMarketplace: t(`${p}.openMarketplace`),
  };

  for (const key of signalKeys) labels[`signal_${key}`] = t(`${p}.signals.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.pageTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsUpgradeSignalsDashboardPanel labels={labels} />
    </div>
  );
}
