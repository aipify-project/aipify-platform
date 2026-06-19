/** Brønnøysundregistrene — Norwegian organization number validation */

export type BrregValidationResult = {
  status: "valid" | "invalid" | "service_unavailable";
  companyName: string;
  rawResponse?: Record<string, unknown>;
};

export async function validateNorwegianOrganization(orgNumber: string): Promise<BrregValidationResult> {
  const normalized = orgNumber.replace(/\D/g, "");
  if (normalized.length !== 9) {
    return { status: "invalid", companyName: "" };
  }

  try {
    const res = await fetch(
      `https://data.brreg.no/enhetsregisteret/api/enheter/${normalized}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (res.status === 404) {
      return { status: "invalid", companyName: "", rawResponse: { httpStatus: 404 } };
    }

    if (!res.ok) {
      return {
        status: "service_unavailable",
        companyName: "",
        rawResponse: { httpStatus: res.status },
      };
    }

    const data = (await res.json()) as { navn?: string; organisasjonsnummer?: string };
    const companyName = data.navn?.trim() ?? "";

    if (!companyName) {
      return { status: "invalid", companyName: "", rawResponse: data as Record<string, unknown> };
    }

    return {
      status: "valid",
      companyName,
      rawResponse: { navn: companyName, organisasjonsnummer: data.organisasjonsnummer },
    };
  } catch {
    return { status: "service_unavailable", companyName: "" };
  }
}
