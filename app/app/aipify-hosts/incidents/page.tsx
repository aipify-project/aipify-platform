import { AipifyHostsIncidentCenterDashboardPanel } from "@/components/app/aipify-hosts-incident-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsIncidentsPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.incidents";
  const c = "hosts.common";

  const catKeys = [
    "guest_complaint", "property_damage", "noise_complaint", "access_problem", "cleaning_failure",
    "maintenance_failure", "safety_concern", "utility_outage", "security_concern", "other",
  ] as const;
  const severityKeys = ["low", "medium", "high", "critical"] as const;
  const statusKeys = ["open", "investigating", "action_required", "resolved", "closed"] as const;
  const sectionKeys = [
    "active_incidents", "emergency_events", "incident_history", "recovery_actions", "incident_playbooks",
  ] as const;
  const emergencyKeys = [
    "fire", "flood", "gas_leak", "medical_emergency", "security_threat", "major_utility_failure",
  ] as const;
  const emergencyStatusKeys = ["open", "responding", "resolved", "closed"] as const;
  const contactKeys = ["property_manager", "emergency_services", "maintenance_contact", "backup_contact"] as const;
  const recoveryKeys = ["create_task", "assign_owner", "escalate", "schedule_inspection", "initiate_playbook"] as const;
  const timelineKeys = ["incident_reported", "owner_assigned", "action_taken", "escalation", "resolution"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    activeIncidents: t(`${p}.activeIncidents`),
    criticalIncidents: t(`${p}.criticalIncidents`),
    openEmergencies: t(`${p}.openEmergencies`),
    recoveryActions: t(`${p}.recoveryActions`),
    property: t(`${p}.property`),
    incidentType: t(`${p}.incidentType`),
    severity: t(`${p}.severity`),
    description: t(`${p}.description`),
    reportedBy: t(`${p}.reportedBy`),
    assignedOwner: t(`${p}.assignedOwner`),
    status: t(`${p}.status`),
    createdDate: t(`${p}.createdDate`),
    actions: t(`${p}.actions`),
    assign: t(`${p}.assign`),
    escalate: t(`${p}.escalate`),
    createTask: t(`${p}.createTask`),
    scheduleInspection: t(`${p}.scheduleInspection`),
    resolve: t(`${p}.resolve`),
    ownerPlaceholder: t(`${p}.ownerPlaceholder`),
    defaultOwner: t(`${p}.defaultOwner`),
    reportIncident: t(`${p}.reportIncident`),
    reportEmergency: t(`${p}.reportEmergency`),
    descriptionPlaceholder: t(`${p}.descriptionPlaceholder`),
    emergencyPlaceholder: t(`${p}.emergencyPlaceholder`),
    allProperties: t(`${p}.allProperties`),
    emergencyType: t(`${p}.emergencyType`),
    emergencyContacts: t(`${p}.emergencyContacts`),
    recoveryAction: t(`${p}.recoveryAction`),
    summary: t(`${p}.summary`),
    timeline: t(`${p}.timeline`),
    selectIncident: t(`${p}.selectIncident`),
    initiatePlaybook: t(`${p}.initiatePlaybook`),
    emptyIncidentsTitle: t(`${p}.emptyIncidentsTitle`),
    emptyIncidentsMessage: t(`${p}.emptyIncidentsMessage`),
    emptyEmergenciesTitle: t(`${p}.emptyEmergenciesTitle`),
    emptyEmergenciesMessage: t(`${p}.emptyEmergenciesMessage`),
    emptyRecoveryTitle: t(`${p}.emptyRecoveryTitle`),
    emptyRecoveryMessage: t(`${p}.emptyRecoveryMessage`),
    emptyPlaybooksTitle: t(`${p}.emptyPlaybooksTitle`),
    emptyPlaybooksMessage: t(`${p}.emptyPlaybooksMessage`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of catKeys) labels[`cat_${key}`] = t(`${p}.categories.${key}`);
  for (const key of severityKeys) labels[`severity_${key}`] = t(`${p}.severities.${key}`);
  for (const key of statusKeys) labels[`status_${key}`] = t(`${p}.statuses.${key}`);
  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of emergencyKeys) labels[`emergency_${key}`] = t(`${p}.emergencies.${key}`);
  for (const key of emergencyStatusKeys) labels[`emergencystatus_${key}`] = t(`${p}.emergencyStatuses.${key}`);
  for (const key of contactKeys) labels[`contact_${key}`] = t(`${p}.contacts.${key}`);
  for (const key of recoveryKeys) labels[`recovery_${key}`] = t(`${p}.recovery.${key}`);
  for (const key of timelineKeys) labels[`timeline_${key}`] = t(`${p}.timelineTypes.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsIncidentCenterDashboardPanel labels={labels} />
    </div>
  );
}
