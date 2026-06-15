import type { Translator } from "@/lib/i18n/translate";
import type { SubscriptionOperationsLabels } from "./types";
import { PLAN_TYPES, RENEWAL_PERIODS, SUBSCRIPTION_STATUSES } from "./constants";

export function buildSubscriptionOperationsLabels(t: Translator): SubscriptionOperationsLabels {
  const p = "platform.subscriptionOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      subscriptions: t(`${p}.sections.subscriptions`),
      trials: t(`${p}.sections.trials`),
      upgrades: t(`${p}.sections.upgrades`),
      downgrades: t(`${p}.sections.downgrades`),
      renewals: t(`${p}.sections.renewals`),
      pastDue: t(`${p}.sections.pastDue`),
      enterpriseContracts: t(`${p}.sections.enterpriseContracts`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
    },
    overview: {
      active: t(`${p}.overview.active`),
      trials: t(`${p}.overview.trials`),
      renewals: t(`${p}.overview.renewals`),
      upgrades: t(`${p}.overview.upgrades`),
      downgrades: t(`${p}.overview.downgrades`),
      cancelled: t(`${p}.overview.cancelled`),
    },
    table: {
      customer: t(`${p}.table.customer`),
      plan: t(`${p}.table.plan`),
      users: t(`${p}.table.users`),
      billingProvider: t(`${p}.table.billingProvider`),
      monthlyValue: t(`${p}.table.monthlyValue`),
      renewalDate: t(`${p}.table.renewalDate`),
      status: t(`${p}.table.status`),
      actions: t(`${p}.table.actions`),
      previousPlan: t(`${p}.table.previousPlan`),
      newPlan: t(`${p}.table.newPlan`),
      effectiveDate: t(`${p}.table.effectiveDate`),
      revenueImpact: t(`${p}.table.revenueImpact`),
      reason: t(`${p}.table.reason`),
      trialStart: t(`${p}.table.trialStart`),
      trialEnd: t(`${p}.table.trialEnd`),
      daysRemaining: t(`${p}.table.daysRemaining`),
      conversionProbability: t(`${p}.table.conversionProbability`),
      outstandingAmount: t(`${p}.table.outstandingAmount`),
      daysOverdue: t(`${p}.table.daysOverdue`),
      paymentProvider: t(`${p}.table.paymentProvider`),
      recommendedAction: t(`${p}.table.recommendedAction`),
      contractStart: t(`${p}.table.contractStart`),
      contractEnd: t(`${p}.table.contractEnd`),
      paymentTerms: t(`${p}.table.paymentTerms`),
      accountManager: t(`${p}.table.accountManager`),
      event: t(`${p}.table.event`),
    },
    statuses: Object.fromEntries(
      SUBSCRIPTION_STATUSES.map((status) => [status, t(`${p}.statuses.${status}`)])
    ) as SubscriptionOperationsLabels["statuses"],
    actions: {
      view: t(`${p}.actions.view`),
      upgrade: t(`${p}.actions.upgrade`),
      downgrade: t(`${p}.actions.downgrade`),
      extendTrial: t(`${p}.actions.extendTrial`),
      suspend: t(`${p}.actions.suspend`),
      reactivate: t(`${p}.actions.reactivate`),
      cancel: t(`${p}.actions.cancel`),
      convertToPaid: t(`${p}.actions.convertToPaid`),
      sendReminder: t(`${p}.actions.sendReminder`),
      applying: t(`${p}.actions.applying`),
    },
    filters: {
      plan: t(`${p}.filters.plan`),
      status: t(`${p}.filters.status`),
      country: t(`${p}.filters.country`),
      provider: t(`${p}.filters.provider`),
      renewalPeriod: t(`${p}.filters.renewalPeriod`),
      allPlans: t(`${p}.filters.allPlans`),
      allStatuses: t(`${p}.filters.allStatuses`),
      allCountries: t(`${p}.filters.allCountries`),
      allProviders: t(`${p}.filters.allProviders`),
      allRenewals: t(`${p}.filters.allRenewals`),
      apply: t(`${p}.filters.apply`),
    },
    renewals: {
      within7: t(`${p}.renewals.within7`),
      within30: t(`${p}.renewals.within30`),
      within90: t(`${p}.renewals.within90`),
    },
    plans: Object.fromEntries(
      PLAN_TYPES.map((plan) => [plan, t(`${p}.plans.${plan}`)])
    ) as SubscriptionOperationsLabels["plans"],
  };
}
