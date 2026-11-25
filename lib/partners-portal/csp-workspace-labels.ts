import type { Translator } from "@/lib/i18n/translate";
import type { CspWorkspaceLabels } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import type { SellersActionLabels } from "@/components/platform/sellers/CertifiedSellersActionPanel";

export function buildCspWorkspaceLabels(t: Translator, titleKey: string, subtitleKey: string): CspWorkspaceLabels {
  return {
    title: t(titleKey),
    subtitle: t(subtitleKey),
    loading: t("partnersPortal.certifiedSalesPartner.workspace.loading"),
    notReadyTitle: t("partnersPortal.certifiedSalesPartner.workspace.notReadyTitle"),
    notReadyBody: t("partnersPortal.certifiedSalesPartner.workspace.notReadyBody"),
    retry: t("partnersPortal.certifiedSalesPartner.workspace.retry"),
    errorTitle: t("partnersPortal.certifiedSalesPartner.workspace.errorTitle"),
  };
}

export function buildSellersActionLabels(t: Translator): SellersActionLabels {
  return {
    partnersTitle: t("platform.sellers.actions.partnersTitle"),
    settlementsTitle: t("platform.sellers.actions.settlementsTitle"),
    productsTitle: t("platform.sellers.actions.productsTitle"),
    partnerId: t("platform.sellers.actions.partnerId"),
    status: t("platform.sellers.actions.status"),
    reason: t("platform.sellers.actions.reason"),
    submitPartner: t("platform.sellers.actions.submitPartner"),
    settlementId: t("platform.sellers.actions.settlementId"),
    fromStatus: t("platform.sellers.actions.fromStatus"),
    toStatus: t("platform.sellers.actions.toStatus"),
    rejectionReason: t("platform.sellers.actions.rejectionReason"),
    paidAt: t("platform.sellers.actions.paidAt"),
    paymentReference: t("platform.sellers.actions.paymentReference"),
    submitSettlement: t("platform.sellers.actions.submitSettlement"),
    productKey: t("platform.sellers.actions.productKey"),
    productTitle: t("platform.sellers.actions.productTitle"),
    currency: t("platform.sellers.actions.currency"),
    fixedCommission: t("platform.sellers.actions.fixedCommission"),
    published: t("platform.sellers.actions.published"),
    submitProduct: t("platform.sellers.actions.submitProduct"),
    success: t("platform.sellers.actions.success"),
    failClosed: t("platform.sellers.actions.failClosed"),
    error: t("platform.sellers.actions.error"),
  };
}
