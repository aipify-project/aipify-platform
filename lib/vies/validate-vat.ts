/** EU VIES VAT number validation via official REST API */

export type ViesValidationResult = {
  status: "valid" | "invalid" | "service_unavailable";
  companyName: string;
  rawResponse?: Record<string, unknown>;
};

export async function validateEuVatNumber(
  countryCode: string,
  vatNumber: string
): Promise<ViesValidationResult> {
  const cc = countryCode.toUpperCase().slice(0, 2);
  const vn = vatNumber.replace(/\s/g, "").toUpperCase();

  if (!cc || !vn) {
    return { status: "invalid", companyName: "" };
  }

  try {
    const res = await fetch(
      "https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ countryCode: cc, vatNumber: vn }),
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) {
      return {
        status: "service_unavailable",
        companyName: "",
        rawResponse: { httpStatus: res.status },
      };
    }

    const data = (await res.json()) as {
      valid?: boolean;
      userError?: string;
      name?: string;
      address?: string;
    };

    if (data.valid === true) {
      return {
        status: "valid",
        companyName: data.name?.trim() ?? "",
        rawResponse: {
          valid: true,
          name: data.name,
          address: data.address,
        },
      };
    }

    return {
      status: "invalid",
      companyName: "",
      rawResponse: { valid: false, userError: data.userError },
    };
  } catch {
    return { status: "service_unavailable", companyName: "" };
  }
}
