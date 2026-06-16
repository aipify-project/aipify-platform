import { AipifyHostsMaintenanceCenterDashboardPanel } from "@/components/app/aipify-hosts-maintenance-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsMaintenancePage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.maintenance";
  const c = "hosts.common";

  const sectionKeys = ["open_work_orders", "preventive_maintenance", "scheduled_maintenance", "completed_maintenance", "contractors"] as const;
  const categoryKeys = ["plumbing", "electrical", "hvac", "appliances", "furniture", "exterior", "safety_equipment", "general_repairs", "other"] as const;
  const priorityKeys = ["low", "medium", "high", "critical"] as const;
  const woStatusKeys = ["new", "assigned", "scheduled", "in_progress", "waiting_parts", "completed", "cancelled"] as const;
  const recurrenceKeys = ["monthly", "quarterly", "semi_annual", "annual"] as const;
  const contractorStatusKeys = ["active", "preferred", "inactive"] as const;
  const timelineKeys = ["issue_reported", "work_order_created", "assigned", "started", "completed"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    viewKnowledge: t(`${p}.viewKnowledge`),
    governanceNote: t(`${p}.governanceNote`),
    openWorkOrders: t(`${p}.openWorkOrders`),
    criticalItems: t(`${p}.criticalItems`),
    upcomingPreventive: t(`${p}.upcomingPreventive`),
    overdueTasks: t(`${p}.overdueTasks`),
    needsAttention: t(`${p}.needsAttention`),
    filterStatus: t(`${p}.filterStatus`),
    allStatuses: t(`${p}.allStatuses`),
    description: t(`${p}.description`),
    property: t(`${p}.property`),
    category: t(`${p}.category`),
    priority: t(`${p}.priority`),
    assignedTo: t(`${p}.assignedTo`),
    dueDate: t(`${p}.dueDate`),
    status: t(`${p}.status`),
    actions: t(`${p}.actions`),
    overdue: t(`${p}.overdue`),
    assignContractor: t(`${p}.assignContractor`),
    scheduleMaintenance: t(`${p}.scheduleMaintenance`),
    startWork: t(`${p}.startWork`),
    closeWorkOrder: t(`${p}.closeWorkOrder`),
    escalatePriority: t(`${p}.escalatePriority`),
    createWorkOrder: t(`${p}.createWorkOrder`),
    taskName: t(`${p}.taskName`),
    recurrence: t(`${p}.recurrence`),
    nextDue: t(`${p}.nextDue`),
    dueNow: t(`${p}.dueNow`),
    companyName: t(`${p}.companyName`),
    contact: t(`${p}.contact`),
    tradeCategory: t(`${p}.tradeCategory`),
    coverageArea: t(`${p}.coverageArea`),
    maintenanceTimeline: t(`${p}.maintenanceTimeline`),
    emptyWorkOrdersTitle: t(`${p}.emptyWorkOrdersTitle`),
    emptyWorkOrdersMessage: t(`${p}.emptyWorkOrdersMessage`),
    emptyPreventiveTitle: t(`${p}.emptyPreventiveTitle`),
    emptyPreventiveMessage: t(`${p}.emptyPreventiveMessage`),
    emptyContractorsTitle: t(`${p}.emptyContractorsTitle`),
    emptyContractorsMessage: t(`${p}.emptyContractorsMessage`),
    demoWorkOrderDescription: t(`${p}.demoWorkOrderDescription`),
    closedNote: t(`${p}.closedNote`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of categoryKeys) labels[`category_${key}`] = t(`${p}.categories.${key}`);
  for (const key of priorityKeys) labels[`priority_${key}`] = t(`${p}.priorities.${key}`);
  for (const key of woStatusKeys) labels[`woStatus_${key}`] = t(`${p}.workOrderStatuses.${key}`);
  for (const key of recurrenceKeys) labels[`recurrence_${key}`] = t(`${p}.recurrences.${key}`);
  for (const key of contractorStatusKeys) labels[`contractorStatus_${key}`] = t(`${p}.contractorStatuses.${key}`);
  for (const key of timelineKeys) labels[`timelineEvent_${key}`] = t(`${p}.timelineEvents.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.pageTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsMaintenanceCenterDashboardPanel labels={labels} />
    </div>
  );
}
