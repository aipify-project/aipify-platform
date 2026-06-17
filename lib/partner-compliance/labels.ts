export function buildPartnerComplianceLabels(t: (key: string) => string): Record<string, string> {
  const p = "partnerCompliance";
  const keys = [
    "title",
    "subtitle",
    "loading",
    "errorTitle",
    "errorMessage",
    "retry",
    "accessDenied",
    "readOnlyNote",
    "complianceStatus",
    "businessVerification",
    "identityVerification",
    "selfBillingAgreement",
    "taxInformation",
    "settlementEligibility",
    "bankingVerification",
    "healthScore",
    "alertsTitle",
    "timelineTitle",
    "businessTitle",
    "bankingTitle",
    "taxTitle",
    "agreementsTitle",
    "documentsTitle",
    "companyName",
    "registrationNumber",
    "vatNumber",
    "country",
    "registeredAddress",
    "legalRepresentative",
    "accountHolder",
    "accountNumber",
    "iban",
    "swiftBic",
    "vatRegistered",
    "taxClassification",
    "reverseCharge",
    "agreementVersion",
    "acceptedAt",
    "acceptedBy",
    "saveProfile",
    "submitVerification",
    "profileSaved",
    "verificationSubmitted",
    "actionFailed",
    "completeSetup",
    "emptyTitle",
    "emptyMessage",
    "searchPlaceholder",
    "filterComplianceStatus",
    "filterCountry",
    "filterAll",
    "eligibility_eligible",
    "eligibility_partially_eligible",
    "eligibility_not_eligible",
    "health_excellent",
    "health_good",
    "health_needs_attention",
    "health_action_required",
    "status_pending",
    "status_under_review",
    "status_verified",
    "status_rejected",
    "status_expired",
    "status_active",
    "status_requires_acceptance",
    "doc_pending",
    "doc_approved",
    "doc_rejected",
    "doc_expired",
    "doc_archived",
    "viewSettlements",
    "faqTitle",
    "faqWhyRequired",
    "faqWhyRequiredAnswer",
    "faqPaymentsWithoutVerification",
    "faqPaymentsWithoutVerificationAnswer",
    "faqSelfBilling",
    "faqSelfBillingAnswer",
  ];
  return Object.fromEntries(keys.map((key) => [key, t(`${p}.${key}`)]));
}

export function complianceStatusLabel(labels: Record<string, string>, key: string): string {
  return labels[`status_${key}`] ?? key.replace(/_/g, " ");
}

export function eligibilityLabel(labels: Record<string, string>, key: string): string {
  return labels[`eligibility_${key}`] ?? key.replace(/_/g, " ");
}

export function healthLabel(labels: Record<string, string>, key: string): string {
  return labels[`health_${key}`] ?? key.replace(/_/g, " ");
}

export function documentStatusLabel(labels: Record<string, string>, key: string): string {
  return labels[`doc_${key}`] ?? key.replace(/_/g, " ");
}
