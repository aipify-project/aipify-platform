import { validateNorwegianOrganization } from "@/lib/brreg/validate-organization";
import { validateEuVatNumber } from "@/lib/vies/validate-vat";
import { isEuCountry, normalizeOrgNumber, splitVatNumber, type ValidationSource, type ValidationStatus } from "./constants";

export type BusinessValidationResult = {
  status: ValidationStatus;
  source: ValidationSource;
  registryCompanyName: string;
  messageKey: string;
  rawResponse?: Record<string, unknown>;
};

export async function validateBusinessNumber(options: {
  country: string;
  businessNumber: string;
  customerType: "private" | "business";
}): Promise<BusinessValidationResult> {
  const country = options.country.toUpperCase();

  if (options.customerType !== "business") {
    return {
      status: "not_required",
      source: "none",
      registryCompanyName: "",
      messageKey: "",
    };
  }

  const number = options.businessNumber.trim();
  if (!number) {
    return {
      status: "invalid",
      source: "none",
      registryCompanyName: "",
      messageKey: "invalidBusinessNumber",
    };
  }

  if (country === "NO") {
    const orgnr = normalizeOrgNumber(number);
    if (orgnr.length !== 9) {
      return {
        status: "invalid",
        source: "brreg",
        registryCompanyName: "",
        messageKey: "invalidBusinessNumber",
      };
    }
    const brreg = await validateNorwegianOrganization(orgnr);
    if (brreg.status === "valid") {
      return {
        status: "valid",
        source: "brreg",
        registryCompanyName: brreg.companyName,
        messageKey: "",
        rawResponse: brreg.rawResponse,
      };
    }
    if (brreg.status === "service_unavailable") {
      return {
        status: "service_unavailable",
        source: "brreg",
        registryCompanyName: "",
        messageKey: "validationUnavailable",
        rawResponse: brreg.rawResponse,
      };
    }
    return {
      status: "invalid",
      source: "brreg",
      registryCompanyName: "",
      messageKey: "invalidBusinessNumber",
      rawResponse: brreg.rawResponse,
    };
  }

  if (isEuCountry(country)) {
    const parsed = splitVatNumber(number) ?? { countryCode: country, vatNumber: normalizeOrgNumber(number) };
    const vies = await validateEuVatNumber(parsed.countryCode, parsed.vatNumber);
    if (vies.status === "valid") {
      return {
        status: "valid",
        source: "vies",
        registryCompanyName: vies.companyName,
        messageKey: "",
        rawResponse: vies.rawResponse,
      };
    }
    if (vies.status === "service_unavailable") {
      return {
        status: "service_unavailable",
        source: "vies",
        registryCompanyName: "",
        messageKey: "validationUnavailable",
        rawResponse: vies.rawResponse,
      };
    }
    return {
      status: "invalid",
      source: "vies",
      registryCompanyName: "",
      messageKey: "invalidEuVatNumber",
      rawResponse: vies.rawResponse,
    };
  }

  return {
    status: "valid",
    source: "manual",
    registryCompanyName: "",
    messageKey: "",
  };
}
