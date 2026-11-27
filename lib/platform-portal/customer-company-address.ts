/**
 * Company and invoice address presentation for Customer 360.
 * Values come only from stored Core fields. Empty means not registered.
 * A failed read is unavailable — never a guessed address or email-domain website.
 * Line 2 and region have no columns on the current registration or payment profile.
 */

export type AddressReadState = "ready" | "unavailable";

export type StoredCompanyAddress = {
  readState: AddressReadState;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
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
  organizationNumber: string | null;
  legalName: string | null;
  invoiceAddress: {
    readState: AddressReadState;
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

export function buildCustomerCompanyProfile(
  company: StoredCompanyAddress,
  invoice: StoredInvoiceAddress,
): CustomerCompanyProfile {
  if (company.readState !== "ready") {
    const invoiceStreet = clean(invoice.street);
    const invoicePostal = clean(invoice.postalCode);
    const invoiceCity = clean(invoice.city);
    const invoiceCountry = clean(invoice.country);
    return {
      readState: "unavailable",
      street: null,
      line2: null,
      postalCode: null,
      city: null,
      region: null,
      country: null,
      website: null,
      organizationNumber: null,
      legalName: null,
      invoiceAddress: {
        readState: invoice.readState === "ready" ? "ready" : "unavailable",
        sameAsCompany: false,
        street: invoice.readState === "ready" ? invoiceStreet : null,
        line2: null,
        postalCode: invoice.readState === "ready" ? invoicePostal : null,
        city: invoice.readState === "ready" ? invoiceCity : null,
        region: null,
        country: invoice.readState === "ready" ? invoiceCountry : null,
      },
    };
  }

  const street = clean(company.street);
  const postalCode = clean(company.postalCode);
  const city = clean(company.city);
  const country = clean(company.country);
  const website = cleanWebsite(company.website);
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

  return {
    readState: "ready",
    street,
    line2: null,
    postalCode,
    city,
    region: null,
    country,
    website,
    organizationNumber,
    legalName,
    invoiceAddress: {
      readState: invoice.readState,
      sameAsCompany: invoice.readState === "ready" && (!invoiceHasDistinct || matchesCompany),
      street: invoice.readState === "ready" && invoiceHasDistinct && !matchesCompany ? invoiceStreet : null,
      line2: null,
      postalCode: invoice.readState === "ready" && invoiceHasDistinct && !matchesCompany ? invoicePostal : null,
      city: invoice.readState === "ready" && invoiceHasDistinct && !matchesCompany ? invoiceCity : null,
      region: null,
      country: invoice.readState === "ready" && invoiceHasDistinct && !matchesCompany ? invoiceCountry : null,
    },
  };
}
