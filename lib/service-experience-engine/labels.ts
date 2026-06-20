import type { Translator } from "@/lib/i18n/translate";
import type { ServiceCommunicationsSection } from "./communications-config";

export type ServiceCommunicationsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  refresh: string;
  principle: string;
  privacyNote: string;
  noRecords: string;
  companionAdvisor: string;
  sections: Record<ServiceCommunicationsSection, string>;
  stats: {
    scheduled: string;
    delivered: string;
    failed: string;
    repliesPending: string;
    suppressed: string;
  };
};

export type ServiceRebookingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  refresh: string;
  principle: string;
  privacyNote: string;
  noRecords: string;
  stats: { rebookingDue: string; rebooked: string; remindersSent: string };
};

export type ServiceFeedbackLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  refresh: string;
  principle: string;
  privacyNote: string;
  noRecords: string;
  stats: { newFeedback: string; followUpRequired: string; recoveryOpen: string; reviewRequests: string };
};

export type ServiceQualityLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  refresh: string;
  principle: string;
  privacyNote: string;
  noRecords: string;
  stats: { alertsOpen: string; avgRating: string; deliverySuccessRate: string; rebookingRate: string };
};

export function buildServiceCommunicationsLabels(t: Translator): ServiceCommunicationsLabels {
  const p = "customerApp.serviceCommunications";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    noRecords: t(`${p}.noRecords`),
    companionAdvisor: t(`${p}.companionAdvisor`),
    sections: {
      overview: t(`${p}.sections.overview`),
      messages: t(`${p}.sections.messages`),
      scheduled: t(`${p}.sections.scheduled`),
      failed: t(`${p}.sections.failed`),
      replies: t(`${p}.sections.replies`),
      templates: t(`${p}.sections.templates`),
      preferences: t(`${p}.sections.preferences`),
      settings: t(`${p}.sections.settings`),
    },
    stats: {
      scheduled: t(`${p}.stats.scheduled`),
      delivered: t(`${p}.stats.delivered`),
      failed: t(`${p}.stats.failed`),
      repliesPending: t(`${p}.stats.repliesPending`),
      suppressed: t(`${p}.stats.suppressed`),
    },
  };
}

export function buildServiceRebookingLabels(t: Translator): ServiceRebookingLabels {
  const p = "customerApp.serviceRebooking";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    noRecords: t(`${p}.noRecords`),
    stats: {
      rebookingDue: t(`${p}.stats.rebookingDue`),
      rebooked: t(`${p}.stats.rebooked`),
      remindersSent: t(`${p}.stats.remindersSent`),
    },
  };
}

export function buildServiceFeedbackLabels(t: Translator): ServiceFeedbackLabels {
  const p = "customerApp.serviceFeedback";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    noRecords: t(`${p}.noRecords`),
    stats: {
      newFeedback: t(`${p}.stats.newFeedback`),
      followUpRequired: t(`${p}.stats.followUpRequired`),
      recoveryOpen: t(`${p}.stats.recoveryOpen`),
      reviewRequests: t(`${p}.stats.reviewRequests`),
    },
  };
}

export function buildServiceQualityLabels(t: Translator): ServiceQualityLabels {
  const p = "customerApp.serviceQuality";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    noRecords: t(`${p}.noRecords`),
    stats: {
      alertsOpen: t(`${p}.stats.alertsOpen`),
      avgRating: t(`${p}.stats.avgRating`),
      deliverySuccessRate: t(`${p}.stats.deliverySuccessRate`),
      rebookingRate: t(`${p}.stats.rebookingRate`),
    },
  };
}
