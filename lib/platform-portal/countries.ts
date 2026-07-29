/**
 * Global ISO 3166-1 alpha-2 country options for Platform Portal.
 * Prefer Intl.supportedValuesOf("region") when available; otherwise use the full ISO set.
 * Never Norway-first and never a tiny hard-coded subset as the only source.
 */

export type PlatformPortalCountryOption = {
  code: string;
  name: string;
};

const REGION_CODE_RE = /^[A-Z]{2}$/;

/** Full ISO 3166-1 alpha-2 set (excluding user-assigned / exceptional reservations). */
const ISO_ALPHA2_COUNTRIES = [
  "AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ",
  "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BV","BW","BY","BZ",
  "CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ",
  "DE","DJ","DK","DM","DO","DZ",
  "EC","EE","EG","EH","ER","ES","ET",
  "FI","FJ","FK","FM","FO","FR",
  "GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY",
  "HK","HM","HN","HR","HT","HU",
  "ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT",
  "JE","JM","JO","JP",
  "KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ",
  "LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY",
  "MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ",
  "NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ",
  "OM",
  "PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY",
  "QA",
  "RE","RO","RS","RU","RW",
  "SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ",
  "TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ",
  "UA","UG","UM","US","UY","UZ",
  "VA","VC","VE","VG","VI","VN","VU",
  "WF","WS",
  "YE","YT",
  "ZA","ZM","ZW",
] as const;

function regionCodes(): string[] {
  try {
    const supportedValuesOf = (
      Intl as typeof Intl & {
        supportedValuesOf?: (key: string) => string[];
      }
    ).supportedValuesOf;
    if (typeof supportedValuesOf === "function") {
      const supported = supportedValuesOf("region").filter((code) =>
        REGION_CODE_RE.test(code),
      );
      if (supported.length > 50) {
        return supported;
      }
    }
  } catch {
    // Some runtimes reject "region" — fall through to ISO table.
  }
  return [...ISO_ALPHA2_COUNTRIES];
}

export function listIsoAlpha2Countries(locale = "en"): PlatformPortalCountryOption[] {
  const display = new Intl.DisplayNames([locale, "en"], { type: "region" });
  return regionCodes()
    .map((code) => ({
      code,
      name: display.of(code) ?? code,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, locale, { sensitivity: "base" }));
}

export function isValidIsoAlpha2Country(code: string | null | undefined): boolean {
  const normalized = String(code ?? "")
    .trim()
    .toUpperCase();
  if (!REGION_CODE_RE.test(normalized)) return false;
  return regionCodes().includes(normalized);
}

export function countryHasCompanyLookupProvider(countryCode: string): boolean {
  return (
    String(countryCode ?? "")
      .trim()
      .toUpperCase() === "NO"
  );
}
