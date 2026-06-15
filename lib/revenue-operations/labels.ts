import type { Translator } from "@/lib/i18n/translate";
import { BILLING_EVENT_TYPES, REVENUE_PROVIDERS } from "./constants";
import type { RevenueOperationsLabels } from "./types";

const AUDIT_ACTION_KEYS = [
  "billing_event_received",
  "activation_completed",
  "activation_failed",
  "permissions_modified",
  "retry_initiated",
  "manual_override_applied",
  "escalation_recorded",
  "customer_contacted",
  "package_synchronized",
] as const;

const NOTIFICATION_TYPE_KEYS = [
  "activation_success",
  "upgrade_success",
  "payment_failed",
  "upcoming_renewal",
  "subscription_cancelled",
  "trial_ending",
] as const;

export function buildRevenueOperationsLabels(t: Translator): RevenueOperationsLabels {
  const p = "platform.revenueOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    foundingPrinciple: t(`${p}.foundingPrinciple`),
    sections: {
      overview: t(`${p}.sections.overview`),
      failedActivations: t(`${p}.sections.failedActivations`),
      timeline: t(`${p}.sections.timeline`),
      trialConversion: t(`${p}.sections.trialConversion`),
      packageSync: t(`${p}.sections.packageSync`),
      notifications: t(`${p}.sections.notifications`),
      audit: t(`${p}.sections.audit`),
      externalResponsibilities: t(`${p}.sections.externalResponsibilities`),
    },
    overview: {
      activeProviders: t(`${p}.overview.activeProviders`),
      successfulActivations: t(`${p}.overview.successfulActivations`),
      pendingActivations: t(`${p}.overview.pendingActivations`),
      failedActivations: t(`${p}.overview.failedActivations`),
      upgrades: t(`${p}.overview.upgrades`),
      downgrades: t(`${p}.overview.downgrades`),
    },
    table: {
      customer: t(`${p}.table.customer`),
      provider: t(`${p}.table.provider`),
      failureReason: t(`${p}.table.failureReason`),
      detectedAt: t(`${p}.table.detectedAt`),
      resolutionStatus: t(`${p}.table.resolutionStatus`),
      eventType: t(`${p}.table.eventType`),
      timestamp: t(`${p}.table.timestamp`),
      outcome: t(`${p}.table.outcome`),
      summary: t(`${p}.table.summary`),
      notificationType: t(`${p}.table.notificationType`),
      channel: t(`${p}.table.channel`),
      status: t(`${p}.table.status`),
      action: t(`${p}.table.action`),
    },
    trialConversion: {
      title: t(`${p}.trialConversion.title`),
      steps: t(`${p}.trialConversion.steps`),
    },
    packageSync: {
      onSuccess: t(`${p}.packageSync.onSuccess`),
      onExpiry: t(`${p}.packageSync.onExpiry`),
      status: t(`${p}.packageSync.status`),
    },
    external: {
      title: t(`${p}.external.title`),
      note: t(`${p}.external.note`),
    },
    actions: {
      retry: t(`${p}.actions.retry`),
      escalate: t(`${p}.actions.escalate`),
      contact: t(`${p}.actions.contact`),
      reviewLogs: t(`${p}.actions.reviewLogs`),
      applying: t(`${p}.actions.applying`),
    },
    resolutions: {
      open: t(`${p}.resolutions.open`),
      retrying: t(`${p}.resolutions.retrying`),
      resolved: t(`${p}.resolutions.resolved`),
      escalated: t(`${p}.resolutions.escalated`),
    },
    outcomes: {
      received: t(`${p}.outcomes.received`),
      processed: t(`${p}.outcomes.processed`),
      failed: t(`${p}.outcomes.failed`),
      ignored: t(`${p}.outcomes.ignored`),
    },
    eventTypes: Object.fromEntries(
      BILLING_EVENT_TYPES.map((key) => [key, t(`${p}.eventTypes.${key}`)])
    ) as RevenueOperationsLabels["eventTypes"],
    notificationTypes: Object.fromEntries(
      NOTIFICATION_TYPE_KEYS.map((key) => [key, t(`${p}.notificationTypes.${key}`)])
    ) as RevenueOperationsLabels["notificationTypes"],
    auditActions: Object.fromEntries(
      AUDIT_ACTION_KEYS.map((key) => [key, t(`${p}.auditActions.${key}`)])
    ) as RevenueOperationsLabels["auditActions"],
    providers: Object.fromEntries(
      REVENUE_PROVIDERS.map((key) => [key, t(`${p}.providers.${key}`)])
    ) as RevenueOperationsLabels["providers"],
    empty: {
      failed: t(`${p}.empty.failed`),
      timeline: t(`${p}.empty.timeline`),
      notifications: t(`${p}.empty.notifications`),
      audit: t(`${p}.empty.audit`),
    },
  };
}
