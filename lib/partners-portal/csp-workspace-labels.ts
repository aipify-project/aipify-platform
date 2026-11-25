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
  const k = (key: string) => t(`platform.sellers.actions.${key}`);
  const partnerStatuses = ["under_review", "needs_information", "approved", "rejected", "suspended"] as const;
  const settlementStatuses = ["open", "approved", "closed", "paid", "voided"] as const;
  const errorCodes = [
    "reason_required",
    "rejection_reason_required",
    "paid_at_required",
    "payment_reference_required",
    "admin_id_required",
    "invalid_settlement_transition",
    "settlement_transition_fields_required",
    "partner_not_found",
    "forbidden",
  ] as const;
  return {
    partnersTitle: k("partnersTitle"),
    settlementsTitle: k("settlementsTitle"),
    productsTitle: k("productsTitle"),
    partnersHint: k("partnersHint"),
    settlementsHint: k("settlementsHint"),
    partnerId: k("partnerId"),
    partnerIdHint: k("partnerIdHint"),
    status: k("status"),
    reason: k("reason"),
    reasonHint: k("reasonHint"),
    partnerStatusOptions: partnerStatuses.map((value) => ({ value, label: k(`statusOptions.${value}`) })),
    submitPartner: k("submitPartner"),
    settlementId: k("settlementId"),
    settlementIdHint: k("settlementIdHint"),
    fromStatus: k("fromStatus"),
    toStatus: k("toStatus"),
    settlementStatusOptions: settlementStatuses.map((value) => ({
      value,
      label: k(`settlementStatusOptions.${value}`),
    })),
    rejectionReason: k("rejectionReason"),
    rejectionReasonHint: k("rejectionReasonHint"),
    paidAt: k("paidAt"),
    paymentReference: k("paymentReference"),
    paidEvidenceHint: k("paidEvidenceHint"),
    submitSettlement: k("submitSettlement"),
    productKey: k("productKey"),
    productTitle: k("productTitle"),
    currency: k("currency"),
    fixedCommission: k("fixedCommission"),
    published: k("published"),
    submitProduct: k("submitProduct"),
    success: k("success"),
    failClosed: k("failClosed"),
    error: k("error"),
    errors: Object.fromEntries(errorCodes.map((code) => [code, k(`errors.${code}`)])),
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
