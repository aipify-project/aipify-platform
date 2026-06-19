import type { Translator } from "@/lib/i18n/translate";

export function buildUnifiedBillingLabels(t: Translator) {
  const p = "customerApp.unifiedBilling";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    back: t(`${p}.back`),
    manageProfile: t(`${p}.manageProfile`),
    viewCheckout: t(`${p}.viewCheckout`),
    viewUpgrade: t(`${p}.viewUpgrade`),
    sections: {
      profiles: t(`${p}.sections.profiles`),
      subscriptions: t(`${p}.sections.subscriptions`),
      invoices: t(`${p}.sections.invoices`),
      licenses: t(`${p}.sections.licenses`),
      events: t(`${p}.sections.events`),
      checkoutFlow: t(`${p}.sections.checkoutFlow`),
    },
    stats: {
      profiles: t(`${p}.stats.profiles`),
      activeSubscriptions: t(`${p}.stats.activeSubscriptions`),
      overdueInvoices: t(`${p}.stats.overdueInvoices`),
      userCapacity: t(`${p}.stats.userCapacity`),
    },
    profile: {
      title: t(`${p}.profile.title`),
      subtitle: t(`${p}.profile.subtitle`),
      save: t(`${p}.profile.save`),
      saving: t(`${p}.profile.saving`),
      saved: t(`${p}.profile.saved`),
      customerType: t(`${p}.profile.customerType`),
      profileLabel: t(`${p}.profile.profileLabel`),
      companyName: t(`${p}.profile.companyName`),
      legalName: t(`${p}.profile.legalName`),
      organizationNumber: t(`${p}.profile.organizationNumber`),
      vatNumber: t(`${p}.profile.vatNumber`),
      country: t(`${p}.profile.country`),
      billingAddress: t(`${p}.profile.billingAddress`),
      billingEmail: t(`${p}.profile.billingEmail`),
      invoiceEmail: t(`${p}.profile.invoiceEmail`),
      paymentMethod: t(`${p}.profile.paymentMethod`),
      taxStatus: t(`${p}.profile.taxStatus`),
      validationStatus: t(`${p}.profile.validationStatus`),
      isPrimary: t(`${p}.profile.isPrimary`),
      accessDenied: t(`${p}.profile.accessDenied`),
      auditTitle: t(`${p}.profile.auditTitle`),
    },
    advisor: {
      title: t(`${p}.advisor.title`),
      openBilling: t(`${p}.advisor.openBilling`),
    },
  };
}
