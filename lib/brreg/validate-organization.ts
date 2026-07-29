/** Brønnøysundregistrene — Norwegian company registry adapter (number + name search). */

export type BrregValidationResult = {
  status: "valid" | "invalid" | "service_unavailable";
  companyName: string;
  rawResponse?: Record<string, unknown>;
};

export type BrregCompanyMatch = {
  registrationNumber: string;
  legalName: string;
  organizationType: string | null;
  addressLine: string | null;
  postalCode: string | null;
  city: string | null;
  status: string | null;
};

export type BrregSearchResult =
  | { status: "ok"; results: BrregCompanyMatch[] }
  | { status: "invalid_query" }
  | { status: "no_results"; results: [] }
  | { status: "service_unavailable" }
  | { status: "timeout" }
  | { status: "rate_limited" };

export const BRREG_NAME_MIN_LENGTH = 2;
export const BRREG_SEARCH_SIZE = 10;
export const BRREG_TIMEOUT_MS = 8000;

type BrregEnhet = {
  organisasjonsnummer?: string;
  navn?: string;
  organisasjonsform?: { kode?: string; beskrivelse?: string };
  forretningsadresse?: {
    adresse?: string[] | string;
    postnummer?: string;
    poststed?: string;
  };
  konkurs?: boolean;
  underAvvikling?: boolean;
  underTvangsavviklingEllerTvangsopplosning?: boolean;
};

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Classify operator input: exact 9-digit org number vs company name. */
export function classifyNorwegianCompanyQuery(
  query: string,
): { kind: "organization_number"; value: string } | { kind: "name"; value: string } | { kind: "invalid" } {
  const trimmed = query.trim();
  if (!trimmed) return { kind: "invalid" };

  const compact = trimmed.replace(/\s+/g, "");
  const digits = digitsOnly(compact);
  if (/^\d+$/.test(compact) && digits.length === 9) {
    return { kind: "organization_number", value: digits };
  }

  if (trimmed.length < BRREG_NAME_MIN_LENGTH) {
    return { kind: "invalid" };
  }

  return { kind: "name", value: trimmed };
}

function addressLineFrom(enhet: BrregEnhet): string | null {
  const raw = enhet.forretningsadresse?.adresse;
  if (Array.isArray(raw)) {
    const joined = raw.map((part) => String(part).trim()).filter(Boolean).join(", ");
    return joined || null;
  }
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return null;
}

function statusFrom(enhet: BrregEnhet): string | null {
  if (enhet.konkurs) return "bankrupt";
  if (enhet.underAvvikling) return "winding_up";
  if (enhet.underTvangsavviklingEllerTvangsopplosning) return "compulsory_liquidation";
  return "active";
}

export function mapBrregEnhet(enhet: BrregEnhet): BrregCompanyMatch | null {
  const registrationNumber = digitsOnly(String(enhet.organisasjonsnummer ?? ""));
  const legalName = String(enhet.navn ?? "").trim();
  if (registrationNumber.length !== 9 || !legalName) return null;

  const form = enhet.organisasjonsform;
  const organizationType =
    [form?.kode, form?.beskrivelse].filter(Boolean).join(" — ") || null;

  return {
    registrationNumber,
    legalName,
    organizationType,
    addressLine: addressLineFrom(enhet),
    postalCode: enhet.forretningsadresse?.postnummer?.trim() || null,
    city: enhet.forretningsadresse?.poststed?.trim() || null,
    status: statusFrom(enhet),
  };
}

async function fetchBrreg(
  url: string,
): Promise<
  | { ok: true; status: number; json: unknown }
  | { ok: false; reason: "timeout" | "rate_limited" | "service_unavailable" }
> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(BRREG_TIMEOUT_MS),
    });

    if (res.status === 429) {
      return { ok: false, reason: "rate_limited" };
    }

    if (res.status === 404) {
      return { ok: true, status: 404, json: null };
    }

    if (!res.ok) {
      return { ok: false, reason: "service_unavailable" };
    }

    return { ok: true, status: res.status, json: await res.json() };
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return { ok: false, reason: "timeout" };
    }
    return { ok: false, reason: "service_unavailable" };
  }
}

export async function validateNorwegianOrganization(orgNumber: string): Promise<BrregValidationResult> {
  const normalized = digitsOnly(orgNumber);
  if (normalized.length !== 9) {
    return { status: "invalid", companyName: "" };
  }

  const fetched = await fetchBrreg(
    `https://data.brreg.no/enhetsregisteret/api/enheter/${normalized}`,
  );

  if (!fetched.ok) {
    return { status: "service_unavailable", companyName: "" };
  }

  if (fetched.status === 404 || fetched.json == null) {
    return { status: "invalid", companyName: "", rawResponse: { httpStatus: 404 } };
  }

  const data = fetched.json as BrregEnhet;
  const companyName = data.navn?.trim() ?? "";
  if (!companyName) {
    return { status: "invalid", companyName: "", rawResponse: data as Record<string, unknown> };
  }

  return {
    status: "valid",
    companyName,
    rawResponse: { navn: companyName, organisasjonsnummer: data.organisasjonsnummer },
  };
}

export async function searchNorwegianCompanies(query: string): Promise<BrregSearchResult> {
  const classified = classifyNorwegianCompanyQuery(query);
  if (classified.kind === "invalid") {
    return { status: "invalid_query" };
  }

  if (classified.kind === "organization_number") {
    const single = await validateNorwegianOrganization(classified.value);
    if (single.status === "valid") {
      return {
        status: "ok",
        results: [
          {
            registrationNumber: classified.value,
            legalName: single.companyName,
            organizationType: null,
            addressLine: null,
            postalCode: null,
            city: null,
            status: "active",
          },
        ],
      };
    }
    if (single.status === "invalid") {
      return { status: "no_results", results: [] };
    }
    return { status: "service_unavailable" };
  }

  const url = new URL("https://data.brreg.no/enhetsregisteret/api/enheter");
  url.searchParams.set("navn", classified.value);
  url.searchParams.set("size", String(BRREG_SEARCH_SIZE));

  const fetched = await fetchBrreg(url.toString());
  if (!fetched.ok) {
    if (fetched.reason === "timeout") return { status: "timeout" };
    if (fetched.reason === "rate_limited") return { status: "rate_limited" };
    return { status: "service_unavailable" };
  }

  if (fetched.status === 404 || fetched.json == null) {
    return { status: "no_results", results: [] };
  }

  const payload = fetched.json as {
    _embedded?: { enheter?: BrregEnhet[] };
  };
  const enheter = Array.isArray(payload._embedded?.enheter) ? payload._embedded.enheter : [];
  const results = enheter
    .map((enhet) => mapBrregEnhet(enhet))
    .filter((item): item is BrregCompanyMatch => item !== null);

  if (results.length === 0) {
    return { status: "no_results", results: [] };
  }

  return { status: "ok", results };
}
