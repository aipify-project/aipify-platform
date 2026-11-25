/**
 * CSP international phone helpers — pure, client-safe, no I/O, no external dependencies.
 *
 * Global by default: no country is assumed. The dial code is chosen per ISO 3166-1 alpha-2 country
 * and the national number is digits only. The stored value is an E.164 string (`+<digits>`, 8–15
 * digits in total) or `null` when the optional field is empty.
 */
import { listIsoAlpha2Countries } from "@/lib/platform-portal/countries";

/**
 * ISO 3166-1 alpha-2 → international calling code.
 * Territories that belong to the North American Numbering Plan share `+1`; territories without
 * their own code use the code of the administering state (e.g. BV → +47, HM → +672).
 */
export const CSP_CALLING_CODES: Readonly<Record<string, string>> = {
  AD: "+376", AE: "+971", AF: "+93", AG: "+1", AI: "+1", AL: "+355", AM: "+374", AO: "+244", AQ: "+672",
  AR: "+54", AS: "+1", AT: "+43", AU: "+61", AW: "+297", AX: "+358", AZ: "+994",
  BA: "+387", BB: "+1", BD: "+880", BE: "+32", BF: "+226", BG: "+359", BH: "+973", BI: "+257", BJ: "+229",
  BL: "+590", BM: "+1", BN: "+673", BO: "+591", BQ: "+599", BR: "+55", BS: "+1", BT: "+975", BV: "+47",
  BW: "+267", BY: "+375", BZ: "+501",
  CA: "+1", CC: "+61", CD: "+243", CF: "+236", CG: "+242", CH: "+41", CI: "+225", CK: "+682", CL: "+56",
  CM: "+237", CN: "+86", CO: "+57", CR: "+506", CU: "+53", CV: "+238", CW: "+599", CX: "+61", CY: "+357",
  CZ: "+420",
  DE: "+49", DJ: "+253", DK: "+45", DM: "+1", DO: "+1", DZ: "+213",
  EC: "+593", EE: "+372", EG: "+20", EH: "+212", ER: "+291", ES: "+34", ET: "+251",
  FI: "+358", FJ: "+679", FK: "+500", FM: "+691", FO: "+298", FR: "+33",
  GA: "+241", GB: "+44", GD: "+1", GE: "+995", GF: "+594", GG: "+44", GH: "+233", GI: "+350", GL: "+299",
  GM: "+220", GN: "+224", GP: "+590", GQ: "+240", GR: "+30", GS: "+500", GT: "+502", GU: "+1", GW: "+245",
  GY: "+592",
  HK: "+852", HM: "+672", HN: "+504", HR: "+385", HT: "+509", HU: "+36",
  ID: "+62", IE: "+353", IL: "+972", IM: "+44", IN: "+91", IO: "+246", IQ: "+964", IR: "+98", IS: "+354",
  IT: "+39",
  JE: "+44", JM: "+1", JO: "+962", JP: "+81",
  KE: "+254", KG: "+996", KH: "+855", KI: "+686", KM: "+269", KN: "+1", KP: "+850", KR: "+82", KW: "+965",
  KY: "+1", KZ: "+7",
  LA: "+856", LB: "+961", LC: "+1", LI: "+423", LK: "+94", LR: "+231", LS: "+266", LT: "+370", LU: "+352",
  LV: "+371", LY: "+218",
  MA: "+212", MC: "+377", MD: "+373", ME: "+382", MF: "+590", MG: "+261", MH: "+692", MK: "+389", ML: "+223",
  MM: "+95", MN: "+976", MO: "+853", MP: "+1", MQ: "+596", MR: "+222", MS: "+1", MT: "+356", MU: "+230",
  MV: "+960", MW: "+265", MX: "+52", MY: "+60", MZ: "+258",
  NA: "+264", NC: "+687", NE: "+227", NF: "+672", NG: "+234", NI: "+505", NL: "+31", NO: "+47", NP: "+977",
  NR: "+674", NU: "+683", NZ: "+64",
  OM: "+968",
  PA: "+507", PE: "+51", PF: "+689", PG: "+675", PH: "+63", PK: "+92", PL: "+48", PM: "+508", PN: "+64",
  PR: "+1", PS: "+970", PT: "+351", PW: "+680", PY: "+595",
  QA: "+974",
  RE: "+262", RO: "+40", RS: "+381", RU: "+7", RW: "+250",
  SA: "+966", SB: "+677", SC: "+248", SD: "+249", SE: "+46", SG: "+65", SH: "+290", SI: "+386", SJ: "+47",
  SK: "+421", SL: "+232", SM: "+378", SN: "+221", SO: "+252", SR: "+597", SS: "+211", ST: "+239", SV: "+503",
  SX: "+1", SY: "+963", SZ: "+268",
  TC: "+1", TD: "+235", TF: "+262", TG: "+228", TH: "+66", TJ: "+992", TK: "+690", TL: "+670", TM: "+993",
  TN: "+216", TO: "+676", TR: "+90", TT: "+1", TV: "+688", TW: "+886", TZ: "+255",
  UA: "+380", UG: "+256", UM: "+1", US: "+1", UY: "+598", UZ: "+998",
  VA: "+39", VC: "+1", VE: "+58", VG: "+1", VI: "+1", VN: "+84", VU: "+678",
  WF: "+681", WS: "+685",
  XK: "+383",
  YE: "+967", YT: "+262",
  ZA: "+27", ZM: "+260", ZW: "+263",
};

/** Total digits of an E.164 number (country code + national number). */
export const CSP_PHONE_MIN_DIGITS = 8;
export const CSP_PHONE_MAX_DIGITS = 15;

/** Stable code for the UI — mapped to translated copy in `registration.errors`. */
export const CSP_INVALID_PHONE_CODE = "invalid_phone";

/** Calling code (`+NN`) for an ISO alpha-2 country, or `null` when unknown. */
export function dialForCspCountry(country: unknown): string | null {
  const code = typeof country === "string" ? country.trim().toUpperCase() : "";
  return CSP_CALLING_CODES[code] ?? null;
}

/** Regional-indicator flag emoji. Decorative only — the country name is always shown as text. */
export function flagEmojiForCountry(country: string): string {
  const code = country.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

export type CspPhoneDialOption = {
  /** ISO alpha-2 — the option value (several countries share one dial code, e.g. `+1`). */
  country: string;
  /** `+NN` */
  dial: string;
  flag: string;
  name: string;
  /** Text shown in the select: flag, dial code, country name. */
  label: string;
};

/** One option per country (localized name, sorted by name). Countries without a known code are skipped. */
export function buildCspPhoneDialOptions(locale = "en"): CspPhoneDialOption[] {
  const options: CspPhoneDialOption[] = [];
  for (const { code, name } of listIsoAlpha2Countries(locale)) {
    const dial = CSP_CALLING_CODES[code];
    if (!dial) continue;
    const flag = flagEmojiForCountry(code);
    options.push({ country: code, dial, flag, name, label: `${flag} ${dial} ${name}`.trim() });
  }
  return options;
}

export type CspPhoneInput = {
  /** `+47` or `47`. */
  dial?: unknown;
  /** National number — digits with optional spaces, hyphens, dots or parentheses. */
  national?: unknown;
};

export type CspPhoneResult =
  | { ok: true; e164: string | null }
  | { ok: false; error: typeof CSP_INVALID_PHONE_CODE };

const INVALID: CspPhoneResult = { ok: false, error: CSP_INVALID_PHONE_CODE };
const SEPARATORS_RE = /[\s().\-–]/g;
const NATIONAL_CHARS_RE = /^[0-9\s().\-–]*$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function dialDigits(dial: unknown): string | null {
  const raw = str(dial).replace(/\s/g, "");
  const m = /^\+?([1-9][0-9]{0,3})$/.exec(raw);
  return m ? m[1]! : null;
}

function inRange(digits: string): boolean {
  return digits.length >= CSP_PHONE_MIN_DIGITS && digits.length <= CSP_PHONE_MAX_DIGITS;
}

/**
 * Parses dial code + national number into E.164.
 * - Empty national number → `{ ok: true, e164: null }` (the field is optional).
 * - Letters or other characters, bad dial code, or a total outside 8–15 digits → `invalid_phone`.
 * - A single leading trunk `0` is dropped, except for `+39` where it is part of the number.
 */
export function validateCspPhone(input: CspPhoneInput): CspPhoneResult {
  const national = str(input?.national);
  if (!national) return { ok: true, e164: null };
  if (!NATIONAL_CHARS_RE.test(national)) return INVALID;

  const dial = dialDigits(input?.dial);
  if (!dial) return INVALID;

  let digits = national.replace(SEPARATORS_RE, "");
  if (!digits) return INVALID;
  if (digits.startsWith("0") && dial !== "39") digits = digits.replace(/^0/, "");
  if (!digits) return INVALID;

  const total = `${dial}${digits}`;
  return inRange(total) ? { ok: true, e164: `+${total}` } : INVALID;
}

/**
 * Validates a single combined string (`+47 912 34 567`) — used for API clients that send one field.
 * Must start with `+` and contain digits and common separators only.
 */
export function validateCspCombinedPhone(phone: unknown): CspPhoneResult {
  const raw = str(phone);
  if (!raw) return { ok: true, e164: null };
  if (!/^\+[0-9\s().\-–]+$/.test(raw)) return INVALID;
  const digits = raw.slice(1).replace(SEPARATORS_RE, "");
  if (!/^[1-9]/.test(digits) || !inRange(digits)) return INVALID;
  return { ok: true, e164: `+${digits}` };
}

/** E.164 string, or `null` when the number is empty **or** invalid. Use `validateCspPhone` for errors. */
export function normalizeCspPhone(input: CspPhoneInput): string | null {
  const result = validateCspPhone(input);
  return result.ok ? result.e164 : null;
}
