import type { Translator } from "@/lib/i18n/translate";
import type { ServicePaymentsSection } from "./config";

export type ServicePaymentsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  refresh: string;
  principle: string;
  privacyNote: string;
  noRecords: string;
  companionAdvisor: string;
  sections: Record<ServicePaymentsSection, string>;
  stats: {
    paymentsToday: string;
    depositsReceived: string;
    outstandingBalances: string;
    failedPayments: string;
    refundsPending: string;
    noShowsPending: string;
    reconciliationIssues: string;
  };
  checkout: {
    validate: string;
    confirm: string;
    verificationRequired: string;
  };
};

export function buildServicePaymentsLabels(t: Translator): ServicePaymentsLabels {
  const p = "customerApp.servicePayments";
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
      payments: t(`${p}.sections.payments`),
      deposits: t(`${p}.sections.deposits`),
      balances: t(`${p}.sections.balances`),
      refunds: t(`${p}.sections.refunds`),
      cancellations: t(`${p}.sections.cancellations`),
      noShows: t(`${p}.sections.noShows`),
      reconciliation: t(`${p}.sections.reconciliation`),
      policies: t(`${p}.sections.policies`),
    },
    stats: {
      paymentsToday: t(`${p}.stats.paymentsToday`),
      depositsReceived: t(`${p}.stats.depositsReceived`),
      outstandingBalances: t(`${p}.stats.outstandingBalances`),
      failedPayments: t(`${p}.stats.failedPayments`),
      refundsPending: t(`${p}.stats.refundsPending`),
      noShowsPending: t(`${p}.stats.noShowsPending`),
      reconciliationIssues: t(`${p}.stats.reconciliationIssues`),
    },
    checkout: {
      validate: t(`${p}.checkout.validate`),
      confirm: t(`${p}.checkout.confirm`),
      verificationRequired: t(`${p}.checkout.verificationRequired`),
    },
  };
}
