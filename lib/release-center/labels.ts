import type { Translator } from "@/lib/i18n/translate";
import {
  APPROVAL_ROLES,
  AUDIENCES,
  CALENDAR_EVENT_TYPES,
  CHANGE_LOG_CATEGORIES,
  COMMUNICATION_CHANNELS,
  RELEASE_STATUSES,
  RELEASE_TYPES,
  RISK_LEVELS,
} from "./constants";
import type { ReleaseCenterLabels } from "./types";

export function buildReleaseCenterLabels(t: Translator): ReleaseCenterLabels {
  const p = "platform.releaseCenter";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      releases: t(`${p}.sections.releases`),
      changeLog: t(`${p}.sections.changeLog`),
      calendar: t(`${p}.sections.calendar`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
      createRelease: t(`${p}.sections.createRelease`),
      approvals: t(`${p}.sections.approvals`),
      communications: t(`${p}.sections.communications`),
      rollbacks: t(`${p}.sections.rollbacks`),
    },
    overview: {
      upcomingReleases: t(`${p}.overview.upcomingReleases`),
      releasesInTesting: t(`${p}.overview.releasesInTesting`),
      productionReleases: t(`${p}.overview.productionReleases`),
      emergencyHotfixes: t(`${p}.overview.emergencyHotfixes`),
      notificationsPending: t(`${p}.overview.notificationsPending`),
      recentlyCompleted: t(`${p}.overview.recentlyCompleted`),
    },
    table: {
      releaseName: t(`${p}.table.releaseName`),
      version: t(`${p}.table.version`),
      category: t(`${p}.table.category`),
      summary: t(`${p}.table.summary`),
      releaseDate: t(`${p}.table.releaseDate`),
      status: t(`${p}.table.status`),
      audience: t(`${p}.table.audience`),
      owner: t(`${p}.table.owner`),
      plannedDate: t(`${p}.table.plannedDate`),
      actualDate: t(`${p}.table.actualDate`),
      riskLevel: t(`${p}.table.riskLevel`),
      type: t(`${p}.table.type`),
      actions: t(`${p}.table.actions`),
    },
    releaseTypes: Object.fromEntries(
      RELEASE_TYPES.map((key) => [key, t(`${p}.releaseTypes.${key}`)])
    ) as ReleaseCenterLabels["releaseTypes"],
    riskLevels: Object.fromEntries(
      RISK_LEVELS.map((key) => [key, t(`${p}.riskLevels.${key}`)])
    ) as ReleaseCenterLabels["riskLevels"],
    changeLogCategories: Object.fromEntries(
      CHANGE_LOG_CATEGORIES.map((key) => [key, t(`${p}.changeLogCategories.${key}`)])
    ) as ReleaseCenterLabels["changeLogCategories"],
    statuses: Object.fromEntries(
      RELEASE_STATUSES.map((key) => [key, t(`${p}.statuses.${key}`)])
    ) as ReleaseCenterLabels["statuses"],
    audiences: Object.fromEntries(
      AUDIENCES.map((key) => [key, t(`${p}.audiences.${key}`)])
    ) as ReleaseCenterLabels["audiences"],
    approvalRoles: Object.fromEntries(
      APPROVAL_ROLES.map((key) => [key, t(`${p}.approvalRoles.${key}`)])
    ) as ReleaseCenterLabels["approvalRoles"],
    communicationChannels: Object.fromEntries(
      COMMUNICATION_CHANNELS.map((key) => [key, t(`${p}.communicationChannels.${key}`)])
    ) as ReleaseCenterLabels["communicationChannels"],
    calendarEventTypes: Object.fromEntries(
      CALENDAR_EVENT_TYPES.map((key) => [key, t(`${p}.calendarEventTypes.${key}`)])
    ) as ReleaseCenterLabels["calendarEventTypes"],
    filters: {
      releaseType: t(`${p}.filters.releaseType`),
      status: t(`${p}.filters.status`),
      owner: t(`${p}.filters.owner`),
      audience: t(`${p}.filters.audience`),
      dateFrom: t(`${p}.filters.dateFrom`),
      dateTo: t(`${p}.filters.dateTo`),
      allTypes: t(`${p}.filters.allTypes`),
      allStatuses: t(`${p}.filters.allStatuses`),
      allAudiences: t(`${p}.filters.allAudiences`),
      apply: t(`${p}.filters.apply`),
    },
    actions: {
      create: t(`${p}.actions.create`),
      approve: t(`${p}.actions.approve`),
      revokeApproval: t(`${p}.actions.revokeApproval`),
      publish: t(`${p}.actions.publish`),
      rollback: t(`${p}.actions.rollback`),
      advanceStatus: t(`${p}.actions.advanceStatus`),
      applying: t(`${p}.actions.applying`),
    },
    create: {
      releaseName: t(`${p}.create.releaseName`),
      releaseVersion: t(`${p}.create.releaseVersion`),
      description: t(`${p}.create.description`),
      submit: t(`${p}.create.submit`),
      placeholderName: t(`${p}.create.placeholderName`),
      placeholderVersion: t(`${p}.create.placeholderVersion`),
      placeholderDescription: t(`${p}.create.placeholderDescription`),
    },
  };
}
