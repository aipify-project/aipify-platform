/**
 * Lightweight international phone helpers for APP profile.
 * Persist normalized E.164 when possible; never invent a number.
 */

export type PhoneCountryOption = {
  iso2: string;
  dial: string;
  labelKey: string;
};

/** Compact curated list — labels resolved via i18n at the call site. */
export const ACCOUNT_PROFILE_PHONE_COUNTRIES: readonly PhoneCountryOption[] = [
  { iso2: "NO", dial: "+47", labelKey: "no" },
  { iso2: "SE", dial: "+46", labelKey: "se" },
  { iso2: "DK", dial: "+45", labelKey: "dk" },
  { iso2: "FI", dial: "+358", labelKey: "fi" },
  { iso2: "PL", dial: "+48", labelKey: "pl" },
  { iso2: "UA", dial: "+380", labelKey: "ua" },
  { iso2: "GB", dial: "+44", labelKey: "gb" },
  { iso2: "DE", dial: "+49", labelKey: "de" },
  { iso2: "US", dial: "+1", labelKey: "us" },
  { iso2: "OTHER", dial: "+", labelKey: "other" },
] as const;

export function digitsOnly(value: string): string {
  return value.replace(/\D+/g, "");
}

export function splitStoredPhone(value: string | null | undefined): {
  dial: string;
  national: string;
} {
  const raw = (value ?? "").trim();
  if (!raw) return { dial: "+47", national: "" };

  const compact = raw.replace(/\s+/g, "");
  if (compact.startsWith("+")) {
    const known = [...ACCOUNT_PROFILE_PHONE_COUNTRIES]
      .filter((row) => row.dial !== "+")
      .sort((a, b) => b.dial.length - a.dial.length)
      .find((row) => compact.startsWith(row.dial));
    if (known) {
      return {
        dial: known.dial,
        national: digitsOnly(compact.slice(known.dial.length)),
      };
    }
    const match = compact.match(/^\+(\d{1,3})(.*)$/);
    if (match) {
      return { dial: `+${match[1]}`, national: digitsOnly(match[2] ?? "") };
    }
  }

  return { dial: "+47", national: digitsOnly(raw) };
}

export function composeE164(dial: string, national: string): string {
  const cleanDial = dial.trim().startsWith("+") ? dial.trim() : `+${digitsOnly(dial)}`;
  const nationalDigits = digitsOnly(national);
  if (!nationalDigits) return "";
  if (cleanDial === "+") return `+${nationalDigits}`;
  return `${cleanDial}${nationalDigits}`;
}

export function isPlausibleE164(value: string): boolean {
  if (!value) return true;
  return /^\+[1-9]\d{6,14}$/.test(value);
}
