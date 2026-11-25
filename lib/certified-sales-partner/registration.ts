import { CSP_INVALID_PHONE_CODE, validateCspCombinedPhone, validateCspPhone } from "./phone";

/**
 * CSP partner registration validation — global by default (no country-specific assumptions).
 */
export type CspRegistrationInput = {
  fullName?: unknown;
  email?: unknown;
  /** ISO 3166-1 alpha-2 */
  country?: unknown;
  legalBusinessName?: unknown;
  /** Free-form text — formats differ per country. */
  businessRegistrationNumber?: unknown;
  /**
   * Combined international number (`+47 912 34 567`) — used when `phoneDial`/`phoneNational` are absent.
   * Stored as E.164 or `null`.
   */
  phone?: unknown;
  /** Calling code, `+47` or `47`. */
  phoneDial?: unknown;
  /** National number — digits with optional separators. */
  phoneNational?: unknown;
  preferredLocale?: unknown;
  address?: unknown;
  registeredBusinessConfirmed?: unknown;
  termsAccepted?: unknown;
  certificationUnderstood?: unknown;
  infoAccurateConfirmed?: unknown;
};

export type CspRegistrationPayload = {
  fullName: string;
  email: string;
  country: string;
  legalBusinessName: string;
  businessRegistrationNumber: string;
  /** E.164 (`+NN…`) or `null` — never free text. */
  phone: string | null;
  preferredLocale: string | null;
  address: string | null;
  registeredBusinessConfirmed: true;
  termsAccepted: true;
  certificationUnderstood: true;
  infoAccurateConfirmed: true;
};

export type CspRegistrationResult =
  | { ok: true; payload: CspRegistrationPayload }
  | { ok: false; error: string; field?: string };

export type CspRegistrationFieldError = { field: string; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRY_RE = /^[A-Za-z]{2}$/;

function text(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function resolvePhone(input: CspRegistrationInput): { ok: true; e164: string | null } | { ok: false } {
  const hasSplit = text(input?.phoneNational) !== "" || text(input?.phoneDial) !== "";
  const result = hasSplit
    ? validateCspPhone({ dial: input.phoneDial, national: input.phoneNational })
    : validateCspCombinedPhone(input?.phone);
  return result.ok ? { ok: true, e164: result.e164 } : { ok: false };
}

/**
 * Every validation failure, in form order (one entry per field). Empty array = valid.
 * Used by the form for field-level messages; the API returns only the first via `validateCspRegistration`.
 */
export function collectCspRegistrationErrors(input: CspRegistrationInput): CspRegistrationFieldError[] {
  const errors: CspRegistrationFieldError[] = [];
  const add = (field: string, error: string) => errors.push({ field, error });

  if (!text(input?.fullName)) add("fullName", "full_name_required");

  const email = text(input?.email).toLowerCase();
  if (!email || !EMAIL_RE.test(email)) add("email", "valid_email_required");

  if (!COUNTRY_RE.test(text(input?.country))) add("country", "country_must_be_two_letter_code");

  if (!text(input?.legalBusinessName)) add("legalBusinessName", "legal_business_name_required");
  if (!text(input?.businessRegistrationNumber)) {
    add("businessRegistrationNumber", "business_registration_number_required");
  }

  if (!resolvePhone(input).ok) add("phone", CSP_INVALID_PHONE_CODE);

  if (input?.registeredBusinessConfirmed !== true) {
    add("registeredBusinessConfirmed", "registered_business_confirmation_required");
  }
  if (input?.termsAccepted !== true) add("termsAccepted", "terms_acceptance_required");
  if (input?.certificationUnderstood !== true) {
    add("certificationUnderstood", "certification_acknowledgement_required");
  }
  if (input?.infoAccurateConfirmed !== true) add("infoAccurateConfirmed", "accuracy_confirmation_required");
  return errors;
}

export function validateCspRegistration(input: CspRegistrationInput): CspRegistrationResult {
  const [first] = collectCspRegistrationErrors(input);
  if (first) return { ok: false, error: first.error, field: first.field };

  const phone = resolvePhone(input);
  return {
    ok: true,
    payload: {
      fullName: text(input?.fullName),
      email: text(input?.email).toLowerCase(),
      country: text(input?.country).toUpperCase(),
      legalBusinessName: text(input?.legalBusinessName),
      businessRegistrationNumber: text(input?.businessRegistrationNumber),
      phone: phone.ok ? phone.e164 : null,
      preferredLocale: text(input?.preferredLocale) || null,
      address: text(input?.address) || null,
      registeredBusinessConfirmed: true,
      termsAccepted: true,
      certificationUnderstood: true,
      infoAccurateConfirmed: true,
    },
  };
}

/** Error code → the form field it belongs to (for field-level messages and focus). */
export const CSP_FIELD_BY_ERROR_CODE: Readonly<Record<string, string>> = {
  full_name_required: "fullName",
  valid_email_required: "email",
  country_must_be_two_letter_code: "country",
  legal_business_name_required: "legalBusinessName",
  business_registration_number_required: "businessRegistrationNumber",
  [CSP_INVALID_PHONE_CODE]: "phone",
  registered_business_confirmation_required: "registeredBusinessConfirmed",
  terms_acceptance_required: "termsAccepted",
  certification_acknowledgement_required: "certificationUnderstood",
  accuracy_confirmation_required: "infoAccurateConfirmed",
};
