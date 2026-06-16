import type { Translator } from "@/lib/i18n/translate";
import type { PlatformHealthOperationsLabels } from "./types";
import {
  ALERT_CATEGORIES,
  ALERT_RESOLUTION_STATUSES,
  ALERT_SEVERITIES,
  DEPLOYMENT_STATUSES,
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  SERVICE_KEYS,
  SERVICE_STATUSES,
} from "./constants";

export function buildPlatformHealthOperationsLabels(
  t: Translator
): PlatformHealthOperationsLabels {
  const p = "platform.platformHealthOperationsCenter";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      services: t(`${p}.sections.services`),
      executiveSummary: t(`${p}.sections.executiveSummary`),
      incidents: t(`${p}.sections.incidents`),
      resolvedIncidents: t(`${p}.sections.resolvedIncidents`),
      alerts: t(`${p}.sections.alerts`),
      deployment: t(`${p}.sections.deployment`),
      deploymentHistory: t(`${p}.sections.deploymentHistory`),
      audit: t(`${p}.sections.audit`),
      createIncident: t(`${p}.sections.createIncident`),
    },
    executiveSummary: {
      activeOrganizations: t(`${p}.executiveSummary.activeOrganizations`),
      activeSubscriptions: t(`${p}.executiveSummary.activeSubscriptions`),
      platformUptime: t(`${p}.executiveSummary.platformUptime`),
      openIncidents: t(`${p}.executiveSummary.openIncidents`),
      resolvedIncidentsMonth: t(`${p}.executiveSummary.resolvedIncidentsMonth`),
      criticalAlerts: t(`${p}.executiveSummary.criticalAlerts`),
    },
    services: Object.fromEntries(
      SERVICE_KEYS.map((key) => [key, t(`${p}.services.${key}`)])
    ) as PlatformHealthOperationsLabels["services"],
    serviceStatuses: Object.fromEntries(
      SERVICE_STATUSES.map((key) => [key, t(`${p}.serviceStatuses.${key}`)])
    ) as PlatformHealthOperationsLabels["serviceStatuses"],
    severities: Object.fromEntries(
      INCIDENT_SEVERITIES.map((key) => [key, t(`${p}.severities.${key}`)])
    ) as PlatformHealthOperationsLabels["severities"],
    incidentStatuses: Object.fromEntries(
      INCIDENT_STATUSES.map((key) => [key, t(`${p}.incidentStatuses.${key}`)])
    ) as PlatformHealthOperationsLabels["incidentStatuses"],
    alertCategories: Object.fromEntries(
      ALERT_CATEGORIES.map((key) => [key, t(`${p}.alertCategories.${key}`)])
    ) as PlatformHealthOperationsLabels["alertCategories"],
    alertResolutionStatuses: Object.fromEntries(
      ALERT_RESOLUTION_STATUSES.map((key) => [key, t(`${p}.alertResolutionStatuses.${key}`)])
    ) as PlatformHealthOperationsLabels["alertResolutionStatuses"],
    deploymentStatuses: Object.fromEntries(
      DEPLOYMENT_STATUSES.map((key) => [key, t(`${p}.deploymentStatuses.${key}`)])
    ) as PlatformHealthOperationsLabels["deploymentStatuses"],
    table: {
      title: t(`${p}.table.title`),
      category: t(`${p}.table.category`),
      severity: t(`${p}.table.severity`),
      status: t(`${p}.table.status`),
      timestamp: t(`${p}.table.timestamp`),
      version: t(`${p}.table.version`),
      initiator: t(`${p}.table.initiator`),
      action: t(`${p}.table.action`),
      notes: t(`${p}.table.notes`),
    },
    form: {
      incidentTitle: t(`${p}.form.incidentTitle`),
      incidentSummary: t(`${p}.form.incidentSummary`),
      serviceKey: t(`${p}.form.serviceKey`),
      severity: t(`${p}.form.severity`),
      status: t(`${p}.form.status`),
      note: t(`${p}.form.note`),
      create: t(`${p}.form.create`),
      updateStatus: t(`${p}.form.updateStatus`),
      addNote: t(`${p}.form.addNote`),
      acknowledgeAlert: t(`${p}.form.acknowledgeAlert`),
      resolveAlert: t(`${p}.form.resolveAlert`),
      saving: t(`${p}.form.saving`),
    },
    actions: {
      applying: t(`${p}.actions.applying`),
    },
  };
}
