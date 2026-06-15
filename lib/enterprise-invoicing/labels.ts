import type { Translator } from "@/lib/i18n/translate";
import type { EnterpriseInvoicingLabels } from "./types";
import { INVOICE_STATUSES, PAYMENT_TERMS } from "./constants";

type LabelNamespace = "customerApp" | "platform";

export function buildEnterpriseInvoicingLabels(
  t: Translator,
  namespace: LabelNamespace
): EnterpriseInvoicingLabels {
  const prefix = `${namespace}.enterpriseInvoicing`;

  const paymentTerms = Object.fromEntries(
    PAYMENT_TERMS.map((term) => [term, t(`${prefix}.paymentTerms.${term}`)])
  );

  const statuses = Object.fromEntries(
    INVOICE_STATUSES.map((status) => [status, t(`${prefix}.statuses.${status}`)])
  );

  return {
    title: t(`${prefix}.title`),
    subtitle: t(`${prefix}.subtitle`),
    loading: t(`${prefix}.loading`),
    back: t(`${prefix}.back`),
    principle: t(`${prefix}.principle`),
    save: t(`${prefix}.save`),
    saving: t(`${prefix}.saving`),
    saved: t(`${prefix}.saved`),
    empty: t(`${prefix}.empty`),
    overdueBanner: t(`${prefix}.overdueBanner`),
    sections: {
      billingDetails: t(`${prefix}.sections.billingDetails`),
      paymentTerms: t(`${prefix}.sections.paymentTerms`),
      invoices: t(`${prefix}.sections.invoices`),
      audit: t(`${prefix}.sections.audit`),
      dnbProfile: t(`${prefix}.sections.dnbProfile`),
      actions: t(`${prefix}.sections.actions`),
    },
    fields: {
      companyName: t(`${prefix}.fields.companyName`),
      organizationNumber: t(`${prefix}.fields.organizationNumber`),
      vatNumber: t(`${prefix}.fields.vatNumber`),
      billingAddress: t(`${prefix}.fields.billingAddress`),
      addressLine1: t(`${prefix}.fields.addressLine1`),
      addressLine2: t(`${prefix}.fields.addressLine2`),
      city: t(`${prefix}.fields.city`),
      postalCode: t(`${prefix}.fields.postalCode`),
      country: t(`${prefix}.fields.country`),
      invoiceEmail: t(`${prefix}.fields.invoiceEmail`),
      apContactName: t(`${prefix}.fields.apContactName`),
      apContactEmail: t(`${prefix}.fields.apContactEmail`),
      purchaseOrderNumber: t(`${prefix}.fields.purchaseOrderNumber`),
      internalReference: t(`${prefix}.fields.internalReference`),
      paymentTerms: t(`${prefix}.fields.paymentTerms`),
      paymentTermsCustom: t(`${prefix}.fields.paymentTermsCustom`),
      preferredCurrency: t(`${prefix}.fields.preferredCurrency`),
      billingLanguage: t(`${prefix}.fields.billingLanguage`),
      invoiceNumber: t(`${prefix}.fields.invoiceNumber`),
      amount: t(`${prefix}.fields.amount`),
      dueDate: t(`${prefix}.fields.dueDate`),
      status: t(`${prefix}.fields.status`),
      tenant: t(`${prefix}.fields.tenant`),
      paymentMethod: t(`${prefix}.fields.paymentMethod`),
      bankTransfer: t(`${prefix}.fields.bankTransfer`),
      kid: t(`${prefix}.fields.kid`),
    },
    paymentTerms,
    statuses,
    actions: {
      create: t(`${prefix}.actions.create`),
      send: t(`${prefix}.actions.send`),
      view: t(`${prefix}.actions.view`),
      downloadPdf: t(`${prefix}.actions.downloadPdf`),
      markPaid: t(`${prefix}.actions.markPaid`),
      partialPayment: t(`${prefix}.actions.partialPayment`),
      sendReminder: t(`${prefix}.actions.sendReminder`),
      credit: t(`${prefix}.actions.credit`),
      attachPo: t(`${prefix}.actions.attachPo`),
      addNote: t(`${prefix}.actions.addNote`),
      escalate: t(`${prefix}.actions.escalate`),
      approve: t(`${prefix}.actions.approve`),
      cancel: t(`${prefix}.actions.cancel`),
      markOverdue: t(`${prefix}.actions.markOverdue`),
    },
    paymentMethods: {
      invoice: t(`${prefix}.paymentMethods.invoice`),
      bankTransfer: t(`${prefix}.paymentMethods.bankTransfer`),
      dnbInvoice: t(`${prefix}.paymentMethods.dnbInvoice`),
    },
    invoiceCenter: {
      title: t(`${prefix}.invoiceCenter.title`),
      emptyStructure: t(`${prefix}.invoiceCenter.emptyStructure`),
    },
    billingModel: {
      selfService: t(`${prefix}.billingModel.selfService`),
      enterprise: t(`${prefix}.billingModel.enterprise`),
      selfServiceNote: t(`${prefix}.billingModel.selfServiceNote`),
      enterpriseNote: t(`${prefix}.billingModel.enterpriseNote`),
    },
    upgrade: {
      title: t(`${prefix}.upgrade.title`),
      currentPlan: t(`${prefix}.upgrade.currentPlan`),
      newPlan: t(`${prefix}.upgrade.newPlan`),
      priceDifference: t(`${prefix}.upgrade.priceDifference`),
      billingMethod: t(`${prefix}.upgrade.billingMethod`),
      paymentTerms: t(`${prefix}.upgrade.paymentTerms`),
      accessPolicy: t(`${prefix}.upgrade.accessPolicy`),
      requiresApproval: t(`${prefix}.upgrade.requiresApproval`),
      approveAndContinue: t(`${prefix}.upgrade.approveAndContinue`),
      createInvoiceDraft: t(`${prefix}.upgrade.createInvoiceDraft`),
      profileRequired: t(`${prefix}.upgrade.profileRequired`),
    },
    permissions: {
      viewOnly: t(`${prefix}.permissions.viewOnly`),
      financeRequired: t(`${prefix}.permissions.financeRequired`),
    },
  };
}
