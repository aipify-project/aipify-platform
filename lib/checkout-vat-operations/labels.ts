import type { Translator } from "@/lib/i18n/translate";
import type { CheckoutVatLabels } from "./types";

export function buildCheckoutVatLabels(t: Translator): CheckoutVatLabels {
  const p = "checkoutVat";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    legalReviewBanner: t(`${p}.legalReviewBanner`),
    customerType: t(`${p}.customerType`),
    privatePerson: t(`${p}.privatePerson`),
    business: t(`${p}.business`),
    companyName: t(`${p}.companyName`),
    organizationNumber: t(`${p}.organizationNumber`),
    country: t(`${p}.country`),
    billingAddress: t(`${p}.billingAddress`),
    billingEmail: t(`${p}.billingEmail`),
    reference: t(`${p}.reference`),
    purchaseOrder: t(`${p}.purchaseOrder`),
    subtotal: t(`${p}.subtotal`),
    vat: t(`${p}.vat`),
    total: t(`${p}.total`),
    reverseChargeNote: t(`${p}.reverseChargeNote`),
    confirmPurchase: t(`${p}.confirmPurchase`),
    continueToPayment: t(`${p}.continueToPayment`),
    validating: t(`${p}.validating`),
    validationValid: t(`${p}.validationValid`),
    invalidBusinessNumber: t(`${p}.invalidBusinessNumber`),
    invalidEuVatNumber: t(`${p}.invalidEuVatNumber`),
    validationUnavailable: t(`${p}.validationUnavailable`),
    productType: t(`${p}.productType`),
    paymentProvider: t(`${p}.paymentProvider`),
    requiredField: t(`${p}.requiredField`),
    businessNumberRequired: t(`${p}.businessNumberRequired`),
  };
}
