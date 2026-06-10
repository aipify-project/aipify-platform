import type { Translator } from "@/lib/i18n/translate";

export function customerStatusLabels(t: Translator) {
  return {
    trial: t("platform.status.customer.trial"),
    active: t("platform.status.customer.active"),
    paused: t("platform.status.customer.paused"),
    cancelled: t("platform.status.customer.cancelled"),
    overdue: t("platform.status.customer.overdue"),
  };
}

export function customerTypeLabels(t: Translator) {
  return {
    company: t("platform.customerType.company"),
    private: t("platform.customerType.private"),
  };
}

export function planTypeLabels(t: Translator) {
  return {
    starter: t("platform.planType.starter"),
    growth: t("platform.planType.growth"),
    business: t("platform.planType.business"),
    enterprise: t("platform.planType.enterprise"),
  };
}

export function paymentProviderLabels(t: Translator) {
  return {
    klarna: t("platform.paymentProvider.klarna"),
    stripe: t("platform.paymentProvider.stripe"),
    vipps: t("platform.paymentProvider.vipps"),
    manual: t("platform.paymentProvider.manual"),
    invoice: t("platform.paymentProvider.invoice"),
  };
}

export function paymentStatusLabels(t: Translator) {
  return {
    not_connected: t("platform.status.payment.not_connected"),
    pending_setup: t("platform.status.payment.pending_setup"),
    active: t("platform.status.payment.active"),
    failed: t("platform.status.payment.failed"),
    cancelled: t("platform.status.payment.cancelled"),
  };
}

export function invoiceStatusLabels(t: Translator) {
  return {
    draft: t("platform.status.invoice.draft"),
    sent: t("platform.status.invoice.sent"),
    paid: t("platform.status.invoice.paid"),
    overdue: t("platform.status.invoice.overdue"),
    cancelled: t("platform.status.invoice.cancelled"),
    failed: t("platform.status.invoice.failed"),
  };
}

export function subscriptionStatusLabels(t: Translator) {
  return {
    trialing: t("platform.status.subscription.trialing"),
    active: t("platform.status.subscription.active"),
    cancelled: t("platform.status.subscription.cancelled"),
    paused: t("platform.status.subscription.paused"),
    past_due: t("platform.status.subscription.past_due"),
  };
}

export function installationStatusLabels(t: Translator) {
  return {
    pending: t("platform.status.installation.pending"),
    active: t("platform.status.installation.active"),
    paused: t("platform.status.installation.paused"),
    revoked: t("platform.status.installation.revoked"),
  };
}

export function integrationStatusLabels(t: Translator) {
  return {
    connected: t("platform.status.integration.connected"),
    pending: t("platform.status.integration.pending"),
    error: t("platform.status.integration.error"),
    disconnected: t("platform.status.integration.disconnected"),
  };
}

export function supportCaseStatusLabels(t: Translator) {
  return {
    open: t("platform.status.supportCase.open"),
    closed: t("platform.status.supportCase.closed"),
    escalated: t("platform.status.supportCase.escalated"),
  };
}

export function supportCategoryLabels(t: Translator) {
  return {
    general: t("platform.support.categoryLabels.general"),
    onboarding: t("platform.support.categoryLabels.onboarding"),
    billing: t("platform.support.categoryLabels.billing"),
    technical: t("platform.support.categoryLabels.technical"),
  };
}

export function supportPriorityLabels(t: Translator) {
  return {
    low: t("platform.support.priorityLabels.low"),
    normal: t("platform.support.priorityLabels.normal"),
    high: t("platform.support.priorityLabels.high"),
    urgent: t("platform.support.priorityLabels.urgent"),
  };
}
