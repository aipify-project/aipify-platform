export type PhoneCountryOption = {
  code: string;
  dial: string;
  flag: string;
  label: string;
};

export const GROWTH_PARTNER_PHONE_COUNTRIES: PhoneCountryOption[] = [
  { code: "NO", dial: "+47", flag: "🇳🇴", label: "Norway" },
  { code: "SE", dial: "+46", flag: "🇸🇪", label: "Sweden" },
  { code: "DK", dial: "+45", flag: "🇩🇰", label: "Denmark" },
  { code: "GB", dial: "+44", flag: "🇬🇧", label: "United Kingdom" },
  { code: "US", dial: "+1", flag: "🇺🇸", label: "United States" },
  { code: "DE", dial: "+49", flag: "🇩🇪", label: "Germany" },
  { code: "FR", dial: "+33", flag: "🇫🇷", label: "France" },
  { code: "NL", dial: "+31", flag: "🇳🇱", label: "Netherlands" },
  { code: "ES", dial: "+34", flag: "🇪🇸", label: "Spain" },
  { code: "IT", dial: "+39", flag: "🇮🇹", label: "Italy" },
  { code: "FI", dial: "+358", flag: "🇫🇮", label: "Finland" },
];

export const GROWTH_PARTNER_COUNTRY_OPTIONS = [
  { code: "NO", label: "Norway" },
  { code: "SE", label: "Sweden" },
  { code: "DK", label: "Denmark" },
  { code: "FI", label: "Finland" },
  { code: "GB", label: "United Kingdom" },
  { code: "US", label: "United States" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "NL", label: "Netherlands" },
  { code: "ES", label: "Spain" },
  { code: "IT", label: "Italy" },
  { code: "EU", label: "Other EU" },
  { code: "OTHER", label: "Other" },
];

export function dialForCountry(countryCode: string): string {
  return GROWTH_PARTNER_PHONE_COUNTRIES.find((c) => c.code === countryCode)?.dial ?? "+47";
}

export function businessRegistrationHelper(countryCode: string): string {
  const helpers: Record<string, string> = {
    NO: "Organization Number / Org.nr",
    SE: "Organisationsnummer",
    DK: "CVR Number",
    FI: "Business ID / Y-tunnus",
    GB: "Company Number",
    US: "EIN or business registration number",
    DE: "Handelsregisternummer or Steuernummer",
    FR: "SIREN / SIRET",
    NL: "KvK Number",
    ES: "CIF / NIF",
    IT: "Partita IVA",
    EU: "VAT number or company registration number",
  };
  return helpers[countryCode] ?? "Business registration number, tax ID, company number, or local equivalent.";
}

export const GROWTH_PARTNERS_ROUTE = "/growth-partners";
export const GROWTH_PARTNER_APP_ROUTE = "/app/growth-partner";
