import type { Translator } from "@/lib/i18n/translate";
import {
  DELIVERY_METHODS,
  MARKETING_LANGUAGES,
  NOTIFICATION_TYPES,
  REQUEST_STATUSES,
  RESOURCE_TYPES,
  TARGET_AUDIENCES,
  WORKFLOW_STAGES,
} from "./constants";
import type { GrowthPartnerContentRequestLabels } from "./types";

export function buildGrowthPartnerContentRequestLabels(
  t: Translator,
  namespace: string
): GrowthPartnerContentRequestLabels {
  const mapKeys = <K extends string>(keys: readonly K[], suffix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`${namespace}.${suffix}.${k}`)])) as Record<K, string>;

  return {
    title: t(`${namespace}.title`),
    subtitle: t(`${namespace}.subtitle`),
    loading: t(`${namespace}.loading`),
    back: t(`${namespace}.back`),
    principle: t(`${namespace}.principle`),
    foundationPrinciple: t(`${namespace}.foundationPrinciple`),
    emptyState: t(`${namespace}.emptyState`),
    overview: {
      openRequests: t(`${namespace}.overview.openRequests`),
      inProduction: t(`${namespace}.overview.inProduction`),
      awaitingReview: t(`${namespace}.overview.awaitingReview`),
      completedRequests: t(`${namespace}.overview.completedRequests`),
      recentlyPublishedAssets: t(`${namespace}.overview.recentlyPublishedAssets`),
      averageDeliveryTime: t(`${namespace}.overview.averageDeliveryTime`),
    },
    sections: {
      overview: t(`${namespace}.sections.overview`),
      requestForm: t(`${namespace}.sections.requestForm`),
      requests: t(`${namespace}.sections.requests`),
      workflow: t(`${namespace}.sections.workflow`),
      notifications: t(`${namespace}.sections.notifications`),
      reporting: t(`${namespace}.sections.reporting`),
      audit: t(`${namespace}.sections.audit`),
      delivery: t(`${namespace}.sections.delivery`),
    },
    table: {
      title: t(`${namespace}.table.title`),
      type: t(`${namespace}.table.type`),
      status: t(`${namespace}.table.status`),
      priority: t(`${namespace}.table.priority`),
      progress: t(`${namespace}.table.progress`),
      owner: t(`${namespace}.table.owner`),
      partner: t(`${namespace}.table.partner`),
      industry: t(`${namespace}.table.industry`),
      audience: t(`${namespace}.table.audience`),
      actions: t(`${namespace}.table.actions`),
    },
    resourceTypes: mapKeys(RESOURCE_TYPES, "resourceTypes"),
    targetAudiences: mapKeys(TARGET_AUDIENCES, "targetAudiences"),
    requestStatuses: mapKeys(REQUEST_STATUSES, "requestStatuses"),
    workflowStages: mapKeys(WORKFLOW_STAGES, "workflowStages"),
    deliveryMethods: mapKeys(DELIVERY_METHODS, "deliveryMethods"),
    languages: mapKeys(MARKETING_LANGUAGES, "languages"),
    notifications: mapKeys(NOTIFICATION_TYPES, "notifications"),
    reporting: {
      mostRequested: t(`${namespace}.reporting.mostRequested`),
      industryDemand: t(`${namespace}.reporting.industryDemand`),
      avgProduction: t(`${namespace}.reporting.avgProduction`),
      satisfaction: t(`${namespace}.reporting.satisfaction`),
    },
    quickActions: {
      submitRequest: t(`${namespace}.quickActions.submitRequest`),
      approve: t(`${namespace}.quickActions.approve`),
      decline: t(`${namespace}.quickActions.decline`),
      assignOwner: t(`${namespace}.quickActions.assignOwner`),
      assignPartner: t(`${namespace}.quickActions.assignPartner`),
      clarify: t(`${namespace}.quickActions.clarify`),
      startProduction: t(`${namespace}.quickActions.startProduction`),
      advanceProduction: t(`${namespace}.quickActions.advanceProduction`),
      publish: t(`${namespace}.quickActions.publish`),
      archive: t(`${namespace}.quickActions.archive`),
    },
    requestForm: {
      title: t(`${namespace}.requestForm.title`),
      resourceType: t(`${namespace}.requestForm.resourceType`),
      industry: t(`${namespace}.requestForm.industry`),
      targetAudience: t(`${namespace}.requestForm.targetAudience`),
      country: t(`${namespace}.requestForm.country`),
      language: t(`${namespace}.requestForm.language`),
      businessObjective: t(`${namespace}.requestForm.businessObjective`),
      additionalNotes: t(`${namespace}.requestForm.additionalNotes`),
      desiredCompletionDate: t(`${namespace}.requestForm.desiredCompletionDate`),
      submit: t(`${namespace}.requestForm.submit`),
    },
    duplicates: {
      heading: t(`${namespace}.duplicates.heading`),
      recommend: t(`${namespace}.duplicates.recommend`),
    },
  };
}
