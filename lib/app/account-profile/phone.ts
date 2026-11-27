/**
 * Lightweight international phone helpers for APP profile.
 * Persist normalized E.164 when possible; never invent a number.
 */

export type PhoneCountryOption = {
  iso2: string;
  dial: string;
  labelKey: string;
  /** Regional-indicator emoji when the environment supports it. */
  flagEmoji: string;
  /**
   * Optional same-origin SVG used as a stable visual fallback when emoji
   * flags are missing or poorly rendered (matches `/public/flags`).
   */
  flagSrc: string | null;
};

/** Compact curated list — labels resolved via i18n at the call site. */
export const ACCOUNT_PROFILE_PHONE_COUNTRIES: readonly PhoneCountryOption[] = [
  { iso2: "NO", dial: "+47", labelKey: "no", flagEmoji: "🇳🇴", flagSrc: "/flags/no.svg" },
  { iso2: "SE", dial: "+46", labelKey: "se", flagEmoji: "🇸🇪", flagSrc: "/flags/sv.svg" },
  { iso2: "DK", dial: "+45", labelKey: "dk", flagEmoji: "🇩🇰", flagSrc: "/flags/da.svg" },
  { iso2: "FI", dial: "+358", labelKey: "fi", flagEmoji: "🇫🇮", flagSrc: null },
  { iso2: "PL", dial: "+48", labelKey: "pl", flagEmoji: "🇵🇱", flagSrc: "/flags/pl.svg" },
  { iso2: "UA", dial: "+380", labelKey: "ua", flagEmoji: "🇺🇦", flagSrc: "/flags/uk.svg" },
  { iso2: "GB", dial: "+44", labelKey: "gb", flagEmoji: "🇬🇧", flagSrc: "/flags/en.svg" },
  { iso2: "DE", dial: "+49", labelKey: "de", flagEmoji: "🇩🇪", flagSrc: "/flags/de.svg" },
  { iso2: "US", dial: "+1", labelKey: "us", flagEmoji: "🇺🇸", flagSrc: null },
  { iso2: "OTHER", dial: "+", labelKey: "other", flagEmoji: "🌐", flagSrc: null },
] as const;

export function phoneCountryByDial(dial: string): PhoneCountryOption {
  const match = ACCOUNT_PROFILE_PHONE_COUNTRIES.find((row) => row.dial === dial);
  return match ?? ACCOUNT_PROFILE_PHONE_COUNTRIES[ACCOUNT_PROFILE_PHONE_COUNTRIES.length - 1]!;
}

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
