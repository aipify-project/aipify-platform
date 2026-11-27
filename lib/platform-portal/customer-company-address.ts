/**
 * Company and invoice address presentation for Customer 360.
 * Values come only from stored Core fields. Empty means not registered.
 * A failed read is unavailable — never a guessed address or email-domain website.
 * Line 2 and region have no columns on the current registration or payment profile.
 */

export type AddressReadState = "ready" | "unavailable";

/** Presentation quality for invoice address — never invent values. */
export type InvoiceAddressQuality =
  | "registered"
  | "not_registered"
  | "needs_verification"
  | "unavailable";

export type StoredCompanyAddress = {
  readState: AddressReadState;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  phone: string | null;
  organizationNumber: string | null;
  legalName: string | null;
};

export type StoredInvoiceAddress = {
  readState: AddressReadState;
  /** False when the payment-profile read succeeded and no row exists. */
  rowPresent: boolean;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
};

export type CustomerCompanyProfile = {
  readState: AddressReadState;
  street: string | null;
  line2: string | null;
  postalCode: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  website: string | null;
  phone: string | null;
  organizationNumber: string | null;
  legalName: string | null;
  invoiceAddress: {
    readState: AddressReadState;
    quality: InvoiceAddressQuality;
    sameAsCompany: boolean;
    street: string | null;
    line2: string | null;
    postalCode: string | null;
    city: string | null;
    region: string | null;
    country: string | null;
  };
};

function clean(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cleanWebsite(value: string | null | undefined): string | null {
  const trimmed = clean(value);
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) return null;
  return trimmed;
}

function sameText(left: string | null, right: string | null): boolean {
  return (left ?? "").toLocaleLowerCase() === (right ?? "").toLocaleLowerCase();
}

/**
 * Narrow placeholder detection for known Core seed placeholders.
 * Must not hide real customer addresses.
 */
export function isInvoiceAddressPlaceholder(input: {
  street: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
}): boolean {
  const street = clean(input.street)?.toLowerCase() ?? "";
  const postal = clean(input.postalCode) ?? "";
  const city = clean(input.city)?.toLowerCase() ?? "";
  const country = clean(input.country)?.toUpperCase() ?? "";
  if (street.includes("billing address pending")) return true;
  if (street.includes("address pending") && postal === "0000") return true;
  if (postal === "0000" && city === "oslo" && country === "NO" && street.includes("pending")) {
    return true;
  }
  return false;
}

function invoiceQuality(input: {
  readState: AddressReadState;
  rowPresent: boolean;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  sameAsCompany: boolean;
}): InvoiceAddressQuality {
  if (input.readState !== "ready") return "unavailable";
  if (!input.rowPresent && input.sameAsCompany) return "not_registered";
  if (!input.street && !input.postalCode && !input.city && !input.country) {
    return input.sameAsCompany ? "not_registered" : "not_registered";
  }
  if (
    isInvoiceAddressPlaceholder({
      street: input.street,
      postalCode: input.postalCode,
      city: input.city,
      country: input.country,
    })
  ) {
    return "needs_verification";
  }
  return "registered";
}

export function buildCustomerCompanyProfile(
  company: StoredCompanyAddress,
  invoice: StoredInvoiceAddress,
): CustomerCompanyProfile {
  if (company.readState !== "ready") {
    const invoiceStreet = clean(invoice.street);
    const invoicePostal = clean(invoice.postalCode);
    const invoiceCity = clean(invoice.city);
    const invoiceCountry = clean(invoice.country);
    const invoiceReady = invoice.readState === "ready";
    const quality = invoiceQuality({
      readState: invoice.readState,
      rowPresent: invoice.rowPresent,
      street: invoiceStreet,
      postalCode: invoicePostal,
      city: invoiceCity,
      country: invoiceCountry,
      sameAsCompany: false,
    });
    return {
      readState: "unavailable",
      street: null,
      line2: null,
      postalCode: null,
      city: null,
      region: null,
      country: null,
      website: null,
      phone: null,
      organizationNumber: null,
      legalName: null,
      invoiceAddress: {
        readState: invoiceReady ? "ready" : "unavailable",
        quality,
        sameAsCompany: false,
        street: invoiceReady ? invoiceStreet : null,
        line2: null,
        postalCode: invoiceReady ? invoicePostal : null,
        city: invoiceReady ? invoiceCity : null,
        region: null,
        country: invoiceReady ? invoiceCountry : null,
      },
    };
  }

  const street = clean(company.street);
  const postalCode = clean(company.postalCode);
  const city = clean(company.city);
  const country = clean(company.country);
  const website = cleanWebsite(company.website);
  const phone = clean(company.phone);
  const organizationNumber = clean(company.organizationNumber);
  const legalName = clean(company.legalName);

  const invoiceStreet = clean(invoice.street);
  const invoicePostal = clean(invoice.postalCode);
  const invoiceCity = clean(invoice.city);
  const invoiceCountry = clean(invoice.country);
  const invoiceHasDistinct =
    invoice.readState === "ready" &&
    invoice.rowPresent &&
    Boolean(invoiceStreet || invoicePostal || invoiceCity || invoiceCountry);
  const matchesCompany =
    sameText(invoiceStreet, street) &&
    sameText(invoicePostal, postalCode) &&
    sameText(invoiceCity, city) &&
    sameText(invoiceCountry, country);
  const sameAsCompany =
    invoice.readState === "ready" && (!invoiceHasDistinct || matchesCompany);
  const showDistinct = invoice.readState === "ready" && invoiceHasDistinct && !matchesCompany;
  const quality = invoiceQuality({
    readState: invoice.readState,
    rowPresent: invoice.rowPresent,
    street: invoiceStreet,
    postalCode: invoicePostal,
    city: invoiceCity,
    country: invoiceCountry,
    sameAsCompany,
  });

  return {
    readState: "ready",
    street,
    line2: null,
    postalCode,
    city,
    region: null,
    country,
    website,
    phone,
    organizationNumber,
    legalName,
    invoiceAddress: {
      readState: invoice.readState,
      quality,
      sameAsCompany,
      street: showDistinct ? invoiceStreet : null,
      line2: null,
      postalCode: showDistinct ? invoicePostal : null,
      city: showDistinct ? invoiceCity : null,
      region: null,
      country: showDistinct ? invoiceCountry : null,
    },
  };
}
