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
  phone?: unknown;
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRY_RE = /^[A-Za-z]{2}$/;

function text(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function validateCspRegistration(input: CspRegistrationInput): CspRegistrationResult {
  const fail = (field: string, error: string): CspRegistrationResult => ({ ok: false, error, field });

  const fullName = text(input?.fullName);
  if (!fullName) return fail("fullName", "full_name_required");

  const email = text(input?.email).toLowerCase();
  if (!email || !EMAIL_RE.test(email)) return fail("email", "valid_email_required");

  const country = text(input?.country);
  if (!COUNTRY_RE.test(country)) return fail("country", "country_must_be_two_letter_code");

  const legalBusinessName = text(input?.legalBusinessName);
  if (!legalBusinessName) return fail("legalBusinessName", "legal_business_name_required");

  const businessRegistrationNumber = text(input?.businessRegistrationNumber);
  if (!businessRegistrationNumber) {
    return fail("businessRegistrationNumber", "business_registration_number_required");
  }

  if (input?.registeredBusinessConfirmed !== true) {
    return fail("registeredBusinessConfirmed", "registered_business_confirmation_required");
  }
  if (input?.termsAccepted !== true) return fail("termsAccepted", "terms_acceptance_required");
  if (input?.certificationUnderstood !== true) {
    return fail("certificationUnderstood", "certification_acknowledgement_required");
  }
  if (input?.infoAccurateConfirmed !== true) {
    return fail("infoAccurateConfirmed", "accuracy_confirmation_required");
  }

  const phone = text(input?.phone) || null;
  const preferredLocale = text(input?.preferredLocale) || null;
  const address = text(input?.address) || null;

  return {
    ok: true,
    payload: {
      fullName,
      email,
      country: country.toUpperCase(),
      legalBusinessName,
      businessRegistrationNumber,
      phone,
      preferredLocale,
      address,
      registeredBusinessConfirmed: true,
      termsAccepted: true,
      certificationUnderstood: true,
      infoAccurateConfirmed: true,
    },
  };
}
