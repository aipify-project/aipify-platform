import { AipifyHostsExecutiveDashboardPanel } from "@/components/app/aipify-hosts-executive-dashboard";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsExecutivePage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.executive";
  const c = "hosts.common";

  const widgetKeys = ["executive_summary", "requires_attention", "notifications", "todays_operations", "property_health", "financial_snapshot", "upcoming_events", "quick_actions"] as const;
  const healthLevelKeys = ["excellent", "good", "attention_required", "critical"] as const;
  const eventTypeKeys = ["owner_stay", "seasonal_closure", "scheduled_inspection", "preventive_maintenance", "document_renewal"] as const;
  const quickActionKeys = ["add_property", "create_work_order", "schedule_inspection", "open_operations", "view_marketplace"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    viewKnowledge: t(`${p}.viewKnowledge`),
    governanceNote: t(`${p}.governanceNote`),
    moveUp: t(`${p}.moveUp`),
    moveDown: t(`${p}.moveDown`),
    preferencesSaved: t(`${p}.preferencesSaved`),
    activeProperties: t(`${p}.activeProperties`),
    occupancyRate: t(`${p}.occupancyRate`),
    revenueThisMonth: t(`${p}.revenueThisMonth`),
    openIncidents: t(`${p}.openIncidents`),
    guestSatisfaction: t(`${p}.guestSatisfaction`),
    openApprovals: t(`${p}.openApprovals`),
    noAttentionItems: t(`${p}.noAttentionItems`),
    noNotifications: t(`${p}.noNotifications`),
    arrivalsToday: t(`${p}.arrivalsToday`),
    departuresToday: t(`${p}.departuresToday`),
    cleaningToday: t(`${p}.cleaningToday`),
    maintenanceToday: t(`${p}.maintenanceToday`),
    pendingGuestRequests: t(`${p}.pendingGuestRequests`),
    property: t(`${p}.property`),
    score: t(`${p}.score`),
    status: t(`${p}.status`),
    actions: t(`${p}.actions`),
    viewHealthDetails: t(`${p}.viewHealthDetails`),
    upcomingPayouts: t(`${p}.upcomingPayouts`),
    outstandingExpenses: t(`${p}.outstandingExpenses`),
    estimatedNet: t(`${p}.estimatedNet`),
    noUpcomingEvents: t(`${p}.noUpcomingEvents`),
  };

  for (const key of widgetKeys) labels[`widget_${key}`] = t(`${p}.widgets.${key}`);
  for (const key of healthLevelKeys) labels[`healthLevel_${key}`] = t(`${p}.healthLevels.${key}`);
  for (const key of eventTypeKeys) labels[`eventType_${key}`] = t(`${p}.eventTypes.${key}`);
  for (const key of quickActionKeys) labels[`quickAction_${key}`] = t(`${p}.quickActions.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.pageTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsExecutiveDashboardPanel labels={labels} />
    </div>
  );
}
