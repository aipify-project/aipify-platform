import type { Translator } from "@/lib/i18n/translate";
import type { CspRegistrationFormLabels } from "@/components/marketing/CertifiedSalesPartnerRegistrationForm";
import type { CspExistingStatusKey } from "@/lib/certified-sales-partner/registration-outcome";
import type { CspWorkspaceLabels } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import type { CspExamLabels } from "@/components/partners-portal/CertifiedSalesPartnerExamPanel";
import type { CspLessonsLabels } from "@/components/partners-portal/CertifiedSalesPartnerLessonsPanel";
import type { CspCatalogLabels } from "@/components/partners-portal/CertifiedSalesPartnerProductCatalogPanel";
import type { CspLinkLabels } from "@/components/partners-portal/CertifiedSalesPartnerLinkPanel";
import type {
  CspCertificationsLabels,
  CspMarketingLabels,
  CspOverviewLabels,
  CspSalesLabels,
  CspSettlementsLabels,
} from "@/components/partners-portal/CertifiedSalesPartnerPortalPanels";
import type { SellersActionLabels } from "@/components/platform/sellers/CertifiedSellersActionPanel";
import type { PartnerDetailsDrawerLabels } from "@/components/platform/sellers/CertifiedSellersPartnerDetailsDrawer";

export function buildCspWorkspaceLabels(t: Translator, titleKey: string, subtitleKey: string): CspWorkspaceLabels {
  return {
    title: t(titleKey),
    subtitle: t(subtitleKey),
    loading: t("partnersPortal.certifiedSalesPartner.workspace.loading"),
    notReadyTitle: t("partnersPortal.certifiedSalesPartner.workspace.notReadyTitle"),
    notReadyBody: t("partnersPortal.certifiedSalesPartner.workspace.notReadyBody"),
    retry: t("partnersPortal.certifiedSalesPartner.workspace.retry"),
    errorTitle: t("partnersPortal.certifiedSalesPartner.workspace.errorTitle"),
    unauthorizedTitle: t("partnersPortal.certifiedSalesPartner.workspace.unauthorizedTitle"),
    unauthorizedBody: t("partnersPortal.certifiedSalesPartner.workspace.unauthorizedBody"),
    signIn: t("partnersPortal.certifiedSalesPartner.workspace.signIn"),
    notRegisteredTitle: t("partnersPortal.certifiedSalesPartner.workspace.notRegisteredTitle"),
    notRegisteredBody: t("partnersPortal.certifiedSalesPartner.workspace.notRegisteredBody"),
    applyCta: t("partnersPortal.certifiedSalesPartner.workspace.applyCta"),
    pending: {
      statusLabel: t("partnersPortal.certifiedSalesPartner.workspace.pending.statusLabel"),
      nextTitle: t("partnersPortal.certifiedSalesPartner.workspace.pending.nextTitle"),
      contactCta: t("partnersPortal.certifiedSalesPartner.workspace.pending.contactCta"),
      statuses: Object.fromEntries(
        (["under_review", "needs_information", "rejected", "suspended"] as const).map((status) => [
          status,
          {
            title: t(`partnersPortal.certifiedSalesPartner.workspace.pending.${status}.title`),
            body: t(`partnersPortal.certifiedSalesPartner.workspace.pending.${status}.body`),
            next: t(`partnersPortal.certifiedSalesPartner.workspace.pending.${status}.next`),
          },
        ]),
      ) as CspWorkspaceLabels["pending"]["statuses"],
    },
  };
}

const CSP_REGISTRATION_ERROR_CODES = [
  "full_name_required",
  "valid_email_required",
  "country_must_be_two_letter_code",
  "legal_business_name_required",
  "business_registration_number_required",
  "registered_business_confirmation_required",
  "terms_acceptance_required",
  "certification_acknowledgement_required",
  "accuracy_confirmation_required",
  "invalid_phone",
  "submission_blocked",
  "rate_limited",
  "form_too_fast",
  "verification_required",
  "duplicate_recent",
  "forbidden",
  "registration_failed",
] as const;

const CSP_EXISTING_KEYS = [
  "registered",
  "under_review",
  "needs_information",
  "approved",
  "rejected",
  "suspended",
  "other",
] as const;

/** Public registration form labels (marketing namespace) incl. sign-in bridge, existing-status and error maps. */
export function buildCspRegistrationFormLabels(t: Translator): CspRegistrationFormLabels {
  const k = (key: string) => t(`marketing.certifiedSalesPartner.registration.${key}`);
  return {
    title: k("title"),
    sectionContact: k("sectionContact"),
    sectionCompany: k("sectionCompany"),
    sectionTerms: k("sectionTerms"),
    fullName: k("fullName"),
    email: k("email"),
    country: k("country"),
    countryPlaceholder: k("countryPlaceholder"),
    countryHint: k("countryHint"),
    legalBusinessName: k("legalBusinessName"),
    businessRegistrationNumber: k("businessRegistrationNumber"),
    phone: k("phone"),
    phoneDial: k("phoneDial"),
    phoneNational: k("phoneNational"),
    phoneHint: k("phoneHint"),
    companyPersistenceNote: k("companyPersistenceNote"),
    processTitle: k("processTitle"),
    processBody: k("processBody"),
    successUnverifiedAddon: k("successUnverifiedAddon"),
    successEmailAcceptedAddon: k("successEmailAcceptedAddon"),
    successEmailNotConfiguredAddon: k("successEmailNotConfiguredAddon"),
    errorSummaryTitle: k("errorSummaryTitle"),
    supportRefLabel: k("supportRefLabel"),
    address: k("address"),
    optional: k("optional"),
    required: k("required"),
    confirmBusiness: k("confirmBusiness"),
    confirmTerms: k("confirmTerms"),
    confirmCertification: k("confirmCertification"),
    confirmAccuracy: k("confirmAccuracy"),
    submit: k("submit"),
    submitting: k("submitting"),
    successTitle: k("successTitle"),
    successBody: k("successBody"),
    backendClosedTitle: k("backendClosedTitle"),
    backendClosedBody: k("backendClosedBody"),
    errorGeneric: k("errorGeneric"),
    loginRequiredTitle: k("loginRequiredTitle"),
    loginRequiredBody: k("loginRequiredBody"),
    loginCta: k("loginCta"),
    createAccountCta: k("createAccountCta"),
    existingTitle: k("existing.title"),
    existingBody: Object.fromEntries(CSP_EXISTING_KEYS.map((key) => [key, k(`existing.${key}`)])) as Record<
      CspExistingStatusKey,
      string
    >,
    openPortalCta: k("existing.openPortalCta"),
    errors: Object.fromEntries(CSP_REGISTRATION_ERROR_CODES.map((code) => [code, k(`errors.${code}`)])),
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

const SELLERS_LIVE_TEXT_KEYS = [
  "loading",
  "retry",
  "errorTitle",
  "errorBody",
  "forbiddenTitle",
  "forbiddenBody",
  "notReported",
  "notReportedNote",
  "kpiApplications",
  "kpiApplicationsNote",
  "kpiApprovedPartners",
  "kpiPartnersTotal",
  "kpiCertified",
  "kpiSales",
  "kpiOpenSettlements",
  "kpiUnpaidSettlements",
  "kpiProductsPublished",
  "kpiProductsTotal",
  "kpiInReview",
  "kpiAwaitingPayout",
  "kpiPaid",
  "sectionsTitle",
  "sectionPartnersBody",
  "sectionProductsBody",
  "sectionSettlementsBody",
  "sectionAcademyBody",
  "sectionOpen",
  "statusBreakdownTitle",
  "statusBreakdownNote",
  "filterLabel",
  "filterAll",
  "colPartner",
  "colCountry",
  "colStatus",
  "colApplied",
  "colAction",
  "colProduct",
  "colCommission",
  "colPeriod",
  "colTotal",
  "colLines",
  "selectAction",
  "viewApplication",
  "partnerUnnamed",
  "referenceLabel",
  "dateEmpty",
  "dateInvalid",
  "partnersListMissingTitle",
  "partnersListMissingBody",
  "partnersEmptyTitle",
  "partnersEmptyBody",
  "partnersFilterEmpty",
  "productsListMissingTitle",
  "productsListMissingBody",
  "productsEmptyTitle",
  "productsEmptyBody",
  "productPublished",
  "productDraft",
  "settlementsEmptyTitle",
  "settlementsEmptyBody",
  "settlementsNoFurtherSteps",
  "settlementsOpenByCurrency",
  "academyAttempts",
  "academyPassed",
  "academyFailed",
  "academyCertifications",
  "academyEmptyTitle",
  "academyEmptyBody",
  "academyNoteTitle",
  "academyNoteBody",
] as const;

const SELLERS_PARTNER_STATUS_KEYS = [
  "registered",
  "under_review",
  "needs_information",
  "approved",
  "rejected",
  "suspended",
  "unknown",
] as const;

const SELLERS_SETTLEMENT_STATUS_KEYS = ["open", "approved", "closed", "paid", "voided", "unknown"] as const;

export type SellersLiveLabels = {
  text: Record<(typeof SELLERS_LIVE_TEXT_KEYS)[number], string>;
  /** Business labels for partner status codes; unknown codes use `unknown`. */
  partnerStatus: Record<string, string>;
  /** Business labels for settlement status codes; unknown codes use `unknown`. */
  settlementStatus: Record<string, string>;
  sectionTitles: { partners: string; products: string; settlements: string; academy: string };
};

export function buildSellersLiveLabels(t: Translator): SellersLiveLabels {
  const k = (key: string) => t(`platform.sellers.live.${key}`);
  return {
    text: Object.fromEntries(SELLERS_LIVE_TEXT_KEYS.map((key) => [key, k(key)])) as SellersLiveLabels["text"],
    partnerStatus: Object.fromEntries(SELLERS_PARTNER_STATUS_KEYS.map((key) => [key, k(`partnerStatus.${key}`)])),
    settlementStatus: Object.fromEntries(
      SELLERS_SETTLEMENT_STATUS_KEYS.map((key) => [
        key,
        key === "unknown" ? k("partnerStatus.unknown") : t(`platform.sellers.actions.settlementStatusOptions.${key}`),
      ]),
    ),
    sectionTitles: {
      partners: t("platform.sellers.partners.title"),
      products: t("platform.sellers.products.title"),
      settlements: t("platform.sellers.settlements.title"),
      academy: t("platform.sellers.academy.title"),
    },
  };
}

const SELLERS_DRAWER_TEXT_KEYS = [
  "title",
  "close",
  "loading",
  "errorTitle",
  "errorBody",
  "retry",
  "notFoundTitle",
  "notFoundBody",
  "sectionContact",
  "sectionCompany",
  "sectionStatus",
  "sectionActivity",
  "fieldName",
  "fieldEmail",
  "fieldEmailVerified",
  "fieldPhone",
  "fieldCountry",
  "fieldLegalBusiness",
  "fieldRegistration",
  "fieldAddress",
  "fieldStatus",
  "fieldApplied",
  "fieldUpdated",
  "emailVerifiedYes",
  "emailVerifiedNo",
  "notSavedYet",
  "emptyValue",
  "activityEmpty",
  "activityUnknown",
  "actionsTitle",
  "actionsHint",
  "approve",
  "requestInfo",
  "reject",
  "suspend",
  "reason",
  "reasonHint",
  "confirmApprove",
  "confirmReject",
  "confirmNeedsInfo",
  "confirmSuspend",
  "confirmSubmit",
  "submitting",
  "success",
  "failClosed",
  "approveRequiresVerifiedEmail",
  "companyIdentityPendingSql",
  "approveCompanyDetailsMissing",
] as const;

const SELLERS_DRAWER_ERROR_CODES = [
  "reason_required",
  "partner_not_found",
  "forbidden",
] as const;

const SELLERS_DRAWER_ACTIVITY_KEYS = [
  "partner_application_registered",
  "partner_status_changed",
  "partner_status_set",
  "csp_set_partner_status",
  "academy_attempt_recorded",
  "certification_awarded",
] as const;

/** Labels for the partner application details drawer (`platform.sellers.drawer.*`). */
export function buildSellersPartnerDrawerLabels(t: Translator): PartnerDetailsDrawerLabels {
  const k = (key: string) => t(`platform.sellers.drawer.${key}`);
  const text = Object.fromEntries(SELLERS_DRAWER_TEXT_KEYS.map((key) => [key, k(key)])) as Record<
    (typeof SELLERS_DRAWER_TEXT_KEYS)[number],
    string
  >;
  return {
    ...text,
    activityLabels: Object.fromEntries(
      SELLERS_DRAWER_ACTIVITY_KEYS.map((key) => [key, t(`platform.sellers.drawer.activityLabels.${key}`)]),
    ),
    errors: Object.fromEntries(SELLERS_DRAWER_ERROR_CODES.map((code) => [code, t(`platform.sellers.actions.errors.${code}`)])),
    partnerStatus: Object.fromEntries(
      SELLERS_PARTNER_STATUS_KEYS.map((key) => [key, t(`platform.sellers.live.partnerStatus.${key}`)]),
    ),
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
    attemptRecorded: k("attemptRecorded"),
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

function group(t: Translator, base: string, keys: readonly string[]): Record<string, string> {
  return Object.fromEntries(keys.map((key) => [key, t(`${base}.${key}`)]));
}

const PARTNER_STATUS_KEYS = [
  "registered",
  "under_review",
  "needs_information",
  "approved",
  "active",
  "certified",
  "in_academy",
  "rejected",
  "suspended",
  "unknown",
] as const;
const NEXT_ACTION_KEYS = [
  "awaiting_approval",
  "provide_information",
  "not_active",
  "train",
  "create_link",
  "view_sales",
] as const;
const CERT_STATUS_KEYS = ["not_started", "in_progress", "passed", "expired", "revoked", "unknown"] as const;
const SALE_STATUS_KEYS = [
  "registered_awaiting_second_payment",
  "pending_possible",
  "earned",
  "approved_for_payout",
  "queued_for_payout",
  "paid",
  "reversed",
  "rejected",
  "unknown",
] as const;
const SETTLEMENT_STATUS_KEYS = ["open", "approved", "closed", "paid", "voided", "unknown"] as const;
const SELF_SERVICE_CHANNEL_KEYS = [
  "facebook",
  "instagram",
  "x",
  "snapchat",
  "tiktok",
  "linkedin",
  "email",
  "qr",
  "other",
  "referral_link",
  "partner_code",
] as const;

export function buildCspOverviewLabels(t: Translator): CspOverviewLabels {
  const k = (key: string) => t(`${CSP_NS}.overview.${key}`);
  return {
    title: k("title"),
    statusLabel: k("statusLabel"),
    partnerStatus: group(t, `${CSP_NS}.overview.partnerStatus`, PARTNER_STATUS_KEYS),
    certificationsLabel: k("certificationsLabel"),
    certificationsValue: k("certificationsValue"),
    certificationsNone: k("certificationsNone"),
    linksLabel: k("linksLabel"),
    salesLabel: k("salesLabel"),
    salesNone: k("salesNone"),
    balanceLabel: k("balanceLabel"),
    balanceNone: k("balanceNone"),
    nextTitle: k("nextTitle"),
    nextBody: group(t, `${CSP_NS}.overview.nextBody`, NEXT_ACTION_KEYS),
    nextCta: group(t, `${CSP_NS}.overview.nextCta`, ["train", "create_link", "view_sales"]),
  };
}

export function buildCspCertificationsLabels(t: Translator): CspCertificationsLabels {
  const k = (key: string) => t(`${CSP_NS}.certifications.${key}`);
  return {
    title: k("title"),
    intro: k("intro"),
    productCol: k("productCol"),
    statusCol: k("statusCol"),
    scoreCol: k("scoreCol"),
    passedOnCol: k("passedOnCol"),
    status: group(t, `${CSP_NS}.certifications.status`, CERT_STATUS_KEYS),
    download: t(`${CSP_NS}.exam.downloadCertificate`),
    emptyTitle: k("emptyTitle"),
    emptyBody: k("emptyBody"),
    emptyCta: k("emptyCta"),
    unknownProduct: k("unknownProduct"),
  };
}

export function buildCspSalesLabels(t: Translator): CspSalesLabels {
  const k = (key: string) => t(`${CSP_NS}.salesList.${key}`);
  return {
    title: k("title"),
    intro: t(`${CSP_NS}.pages.sales.awaitingHint`),
    productCol: k("productCol"),
    statusCol: k("statusCol"),
    periodsCol: k("periodsCol"),
    commissionCol: k("commissionCol"),
    registeredCol: k("registeredCol"),
    status: group(t, `${CSP_NS}.salesList.status`, SALE_STATUS_KEYS),
    commissionPending: k("commissionPending"),
    emptyTitle: k("emptyTitle"),
    emptyBody: k("emptyBody"),
    emptyCta: k("emptyCta"),
    loadError: k("loadError"),
    retry: t(`${CSP_NS}.workspace.retry`),
  };
}

export function buildCspSettlementsLabels(t: Translator): CspSettlementsLabels {
  const k = (key: string) => t(`${CSP_NS}.settlements.${key}`);
  return {
    title: k("title"),
    intro: t(`${CSP_NS}.pages.settlement.readOnlyHint`),
    periodCol: k("periodCol"),
    statusCol: k("statusCol"),
    linesCol: k("linesCol"),
    totalCol: k("totalCol"),
    status: group(t, `${CSP_NS}.settlements.status`, SETTLEMENT_STATUS_KEYS),
    balanceTitle: k("balanceTitle"),
    balanceNone: k("balanceNone"),
    emptyTitle: k("emptyTitle"),
    emptyBody: k("emptyBody"),
    loadError: k("loadError"),
    retry: t(`${CSP_NS}.workspace.retry`),
  };
}

export function buildCspLinkLabels(t: Translator): CspLinkLabels {
  const k = (key: string) => t(`${CSP_NS}.links.${key}`);
  return {
    title: k("panelTitle"),
    product: k("product"),
    productPlaceholder: k("productPlaceholder"),
    certificationNeeded: k("certificationNeeded"),
    noProducts: k("noProducts"),
    channel: k("channel"),
    channels: group(t, `${CSP_NS}.links.channels`, SELF_SERVICE_CHANNEL_KEYS),
    submit: k("submit"),
    creating: k("creating"),
    howItWorks: k("howItWorks"),
    failClosed: t(`${CSP_NS}.workspace.notReadyBody`),
    error: t(`${CSP_NS}.workspace.errorTitle`),
    success: k("success"),
    copy: k("copy"),
    copied: k("copied"),
    gatesHint: k("gatesHint"),
    productNotYet: k("productNotYet"),
  };
}

export function buildCspMarketingLabels(t: Translator): CspMarketingLabels {
  const k = (key: string) => t(`${CSP_NS}.marketing.${key}`);
  return {
    title: k("title"),
    intro: k("intro"),
    linkTitle: k("linkTitle"),
    linkEmpty: k("linkEmpty"),
    linkCta: k("linkCta"),
    assetsTitle: k("assetsTitle"),
    assetsEmptyTitle: k("assetsEmptyTitle"),
    assetsEmptyBody: k("assetsEmptyBody"),
    productTabs: k("productTabs"),
    localeTabs: k("localeTabs"),
    voiceNote: k("voiceNote"),
    signatureNote: k("signatureNote"),
    filterKompisWeb: k("filterKompisWeb"),
    filterKompisBedrift: k("filterKompisBedrift"),
    filterVoice: k("filterVoice"),
  };
}
