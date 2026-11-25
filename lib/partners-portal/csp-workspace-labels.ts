import type { Translator } from "@/lib/i18n/translate";
import type { CspWorkspaceLabels } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import type { CspExamLabels } from "@/components/partners-portal/CertifiedSalesPartnerExamPanel";
import type { CspLessonsLabels } from "@/components/partners-portal/CertifiedSalesPartnerLessonsPanel";
import type { CspCatalogLabels } from "@/components/partners-portal/CertifiedSalesPartnerProductCatalogPanel";
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

const CSP_NS = "partnersPortal.certifiedSalesPartner";

export function buildCspExamLabels(t: Translator): CspExamLabels {
  const k = (key: string) => t(`${CSP_NS}.exam.${key}`);
  return {
    title: k("title"),
    intro: k("intro"),
    start: k("start"),
    starting: k("starting"),
    kompisBlocked: k("kompisBlocked"),
    progress: k("progress"),
    answered: k("answered"),
    previous: k("previous"),
    next: k("next"),
    submit: k("submit"),
    submitting: k("submitting"),
    submitDisabledHint: k("submitDisabledHint"),
    questionRegion: k("questionRegion"),
    passedTitle: k("passedTitle"),
    passedBody: k("passedBody"),
    failedTitle: k("failedTitle"),
    failedBody: k("failedBody"),
    passedBadge: k("passed"),
    failedBadge: k("failed"),
    score: k("score"),
    passMark: k("passMark"),
    reviewLessons: k("reviewLessons"),
    retake: k("retake"),
    practiceNotice: k("practiceNotice"),
    certificationRecorded: k("certificationRecorded"),
    downloadCertificate: k("downloadCertificate"),
    failClosed: t(`${CSP_NS}.workspace.notReadyBody`),
    error: t(`${CSP_NS}.workspace.errorTitle`),
  };
}

export function buildCspLessonsLabels(t: Translator): CspLessonsLabels {
  const k = (key: string) => t(`${CSP_NS}.lessons.${key}`);
  return {
    title: k("title"),
    intro: k("intro"),
    lessonNumber: k("lessonNumber"),
    plannedCatalogNote: k("plannedCatalogNote"),
  };
}

export function buildCspCatalogLabels(t: Translator): CspCatalogLabels {
  const k = (key: string) => t(`${CSP_NS}.catalog.${key}`);
  return {
    title: k("title"),
    intro: k("intro"),
    filterLabel: k("filterLabel"),
    filterAll: k("filterAll"),
    filterKompis: k("filterKompis"),
    filterVoice: k("filterVoice"),
    sellable: k("sellable"),
    future: k("future"),
    futureNote: k("futureNote"),
    plannedPrice: k("plannedPrice"),
    plannedPriceNote: k("plannedPriceNote"),
    noPlannedPrice: k("noPlannedPrice"),
    commissionLabel: k("commissionLabel"),
    commissionAmount: k("commissionAmount"),
    commissionPending: k("commissionPending"),
    certificationLabel: k("certificationLabel"),
    certNotStarted: k("certNotStarted"),
    certInProgress: k("certInProgress"),
    certPassed: k("certPassed"),
    certExpired: k("certExpired"),
    certRevoked: k("certRevoked"),
    certUnknown: k("certUnknown"),
    certNotApplicable: k("certNotApplicable"),
    copyLink: k("copyLink"),
    copyingLink: k("copyingLink"),
    linkCopied: k("linkCopied"),
    linkCreated: k("linkCreated"),
    linkGatesNotMet: k("linkGatesNotMet"),
    linkUnavailable: k("linkUnavailable"),
    error: t(`${CSP_NS}.workspace.errorTitle`),
    takeTraining: k("takeTraining"),
    trainingNotPublished: k("trainingNotPublished"),
    noBuy: t(`${CSP_NS}.pages.products.noBuy`),
    empty: k("empty"),
  };
}
