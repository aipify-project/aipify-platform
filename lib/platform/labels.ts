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

export function paymentMethodLabels(t: Translator) {
  return {
    manual: t("platform.paymentMethod.manual"),
    card: t("platform.paymentMethod.card"),
    invoice: t("platform.paymentMethod.invoice"),
    stripe: t("platform.paymentMethod.stripe"),
  };
}

export function invoiceStatusLabels(t: Translator) {
  return {
    draft: t("platform.status.invoice.draft"),
    sent: t("platform.status.invoice.sent"),
    paid: t("platform.status.invoice.paid"),
    overdue: t("platform.status.invoice.overdue"),
    cancelled: t("platform.status.invoice.cancelled"),
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
