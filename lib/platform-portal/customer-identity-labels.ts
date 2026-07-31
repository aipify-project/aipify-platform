type Translate = (key: string) => string;

const ROOT = "platform.customers.customerIdentity";

export type PlatformCustomerIdentityLabels = {
  title: string;
  description: string;
  contactEmail: string;
  currentEmail: string;
  targetEmail: string;
  emailDomain: string;
  ownedDomain: string;
  forbiddenDomain: string;
  internalIdentity: string;
  externalIdentity: string;
  reason: string;
  reasonPlaceholder: string;
  confirmation: string;
  confirmationHelp: string;
  expectedCurrent: string;
  save: string;
  saving: string;
  success: string;
  successReplay: string;
  retry: string;
  loadError: string;
  unauthorized: string;
  forbidden: string;
  invalidEmail: string;
  emailConflict: string;
  expectedMismatch: string;
  aipifyComNotOwned: string;
  internalRequiresOwned: string;
  confirmationRequired: string;
  reasonRequired: string;
  noEmailSent: string;
  authUnchanged: string;
  billingUnchanged: string;
  auditNote: string;
  domainStatusOk: string;
  domainStatusForbidden: string;
  domainStatusNeedsOwned: string;
};

export function buildPlatformCustomerIdentityLabels(t: Translate): PlatformCustomerIdentityLabels {
  return {
    title: t(`${ROOT}.title`),
    description: t(`${ROOT}.description`),
    contactEmail: t(`${ROOT}.contactEmail`),
    currentEmail: t(`${ROOT}.currentEmail`),
    targetEmail: t(`${ROOT}.targetEmail`),
    emailDomain: t(`${ROOT}.emailDomain`),
    ownedDomain: t(`${ROOT}.ownedDomain`),
    forbiddenDomain: t(`${ROOT}.forbiddenDomain`),
    internalIdentity: t(`${ROOT}.internalIdentity`),
    externalIdentity: t(`${ROOT}.externalIdentity`),
    reason: t(`${ROOT}.reason`),
    reasonPlaceholder: t(`${ROOT}.reasonPlaceholder`),
    confirmation: t(`${ROOT}.confirmation`),
    confirmationHelp: t(`${ROOT}.confirmationHelp`),
    expectedCurrent: t(`${ROOT}.expectedCurrent`),
    save: t(`${ROOT}.save`),
    saving: t(`${ROOT}.saving`),
    success: t(`${ROOT}.success`),
    successReplay: t(`${ROOT}.successReplay`),
    retry: t(`${ROOT}.retry`),
    loadError: t(`${ROOT}.loadError`),
    unauthorized: t(`${ROOT}.unauthorized`),
    forbidden: t(`${ROOT}.forbidden`),
    invalidEmail: t(`${ROOT}.invalidEmail`),
    emailConflict: t(`${ROOT}.emailConflict`),
    expectedMismatch: t(`${ROOT}.expectedMismatch`),
    aipifyComNotOwned: t(`${ROOT}.aipifyComNotOwned`),
    internalRequiresOwned: t(`${ROOT}.internalRequiresOwned`),
    confirmationRequired: t(`${ROOT}.confirmationRequired`),
    reasonRequired: t(`${ROOT}.reasonRequired`),
    noEmailSent: t(`${ROOT}.noEmailSent`),
    authUnchanged: t(`${ROOT}.authUnchanged`),
    billingUnchanged: t(`${ROOT}.billingUnchanged`),
    auditNote: t(`${ROOT}.auditNote`),
    domainStatusOk: t(`${ROOT}.domainStatusOk`),
    domainStatusForbidden: t(`${ROOT}.domainStatusForbidden`),
    domainStatusNeedsOwned: t(`${ROOT}.domainStatusNeedsOwned`),
  };
}

export function customerIdentityErrorLabel(
  code: string | undefined,
  labels: PlatformCustomerIdentityLabels,
): string {
  switch (code) {
    case "unauthorized":
      return labels.unauthorized;
    case "forbidden":
      return labels.forbidden;
    case "invalid_email":
    case "invalid_expected_email":
      return labels.invalidEmail;
    case "email_conflict":
      return labels.emailConflict;
    case "expected_email_mismatch":
      return labels.expectedMismatch;
    case "aipify_com_not_owned":
      return labels.aipifyComNotOwned;
    case "internal_aipify_requires_owned_domain":
      return labels.internalRequiresOwned;
    case "confirmation_required":
      return labels.confirmationRequired;
    case "invalid_internal_reason":
      return labels.reasonRequired;
    default:
      return labels.loadError;
  }
}
