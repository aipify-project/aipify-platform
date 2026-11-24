/**
 * CSP payout bank profile validation — country-aware, never requires IBAN globally.
 */

/** Countries where IBAN is the standard account identifier (EU/EEA + CH/GB/Monaco-style SEPA users). */
export const CSP_IBAN_COUNTRIES: ReadonlySet<string> = new Set([
  // EU
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA (non-EU)
  "NO", "IS", "LI",
  // SEPA / IBAN-standard neighbours
  "CH", "GB",
]);

export function countryUsesIban(country: string): boolean {
  return CSP_IBAN_COUNTRIES.has(String(country ?? "").trim().toUpperCase());
}

function compact(v: string): string {
  return v.replace(/\s+/g, "").toUpperCase();
}

/** Shows only the last 4 characters; never reveals more. */
export function maskIban(iban: string | null | undefined): string {
  const c = compact(String(iban ?? ""));
  if (c.length === 0) return "";
  if (c.length <= 4) return "*".repeat(c.length);
  return `${"*".repeat(c.length - 4)}${c.slice(-4)}`;
}

/** ISO 13616 structure + mod-97 checksum. */
export function isValidIbanChecksum(iban: string): boolean {
  const c = compact(iban);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(c)) return false;
  const rearranged = c.slice(4) + c.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const digits = ch >= "A" && ch <= "Z" ? String(ch.charCodeAt(0) - 55) : ch;
    for (const d of digits) remainder = (remainder * 10 + Number(d)) % 97;
  }
  return remainder === 1;
}

export type CspBankProfileInput = {
  country: string;
  accountHolder: string;
  currency: string;
  iban?: string | null;
  swiftBic?: string | null;
  localAccountNumber?: string | null;
  localRoutingCode?: string | null;
};

export type CspBankProfileResult = { ok: true } | { ok: false; error: string; field?: string };

const SWIFT_RE = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

export function validateBankProfile(input: CspBankProfileInput): CspBankProfileResult {
  const fail = (field: string, error: string): CspBankProfileResult => ({ ok: false, error, field });
  const country = String(input?.country ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) return fail("country", "country_must_be_two_letter_code");
  if (!String(input?.accountHolder ?? "").trim()) return fail("accountHolder", "account_holder_required");
  if (!/^[A-Za-z]{3}$/.test(String(input?.currency ?? "").trim())) {
    return fail("currency", "currency_must_be_three_letter_code");
  }

  const iban = compact(String(input?.iban ?? ""));
  const swift = compact(String(input?.swiftBic ?? ""));
  const account = String(input?.localAccountNumber ?? "").replace(/\s+/g, "");
  const routing = String(input?.localRoutingCode ?? "").replace(/\s+/g, "");

  if (swift && !SWIFT_RE.test(swift)) return fail("swiftBic", "invalid_swift_bic");

  if (iban) {
    if (!isValidIbanChecksum(iban)) return fail("iban", "invalid_iban");
    return { ok: true };
  }

  if (countryUsesIban(country)) return fail("iban", "iban_required_for_country");

  if (country === "US") {
    if (!/^\d{9}$/.test(routing)) return fail("localRoutingCode", "us_routing_number_required");
    if (!/^\d{4,17}$/.test(account)) return fail("localAccountNumber", "local_account_number_required");
    return { ok: true };
  }

  // Other countries: local account number plus SWIFT/BIC (routing code optional).
  if (!account) return fail("localAccountNumber", "local_account_number_required");
  if (!swift) return fail("swiftBic", "swift_bic_required");
  return { ok: true };
}
