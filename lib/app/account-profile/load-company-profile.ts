import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  cleanCompanyText,
  cleanCompanyWebsite,
} from "./company-profile-format";
import type { AccountCompanyProfileRead } from "./types";

export type { AccountCompanyProfileRead };

function sameText(left: string | null, right: string | null): boolean {
  return (left ?? "").toLocaleLowerCase() === (right ?? "").toLocaleLowerCase();
}

/**
 * Tenant-scoped company registration/payment profile read for APP Kundeforhold.
 * Caller must pass only the signed-in workspace `customer_id` from Core context.
 * Never accepts client-supplied organization or customer identifiers.
 */
export async function loadAccountCompanyProfile(
  admin: SupabaseClient,
  customerId: string,
): Promise<AccountCompanyProfileRead> {
  const id = customerId.trim();
  if (!id) {
    return emptyRead("unavailable");
  }

  const [registration, payment] = await Promise.all([
    admin
      .from("organization_registration_profiles")
      .select(
        "business_address, postal_code, city, organization_country, website, owner_phone, organization_number, company_name",
      )
      .eq("customer_id", id)
      .maybeSingle(),
    admin
      .from("payment_profiles")
      .select("billing_address, postal_code, city, country")
      .eq("customer_id", id)
      .maybeSingle(),
  ]);

  if (registration.error) {
    return emptyRead("unavailable");
  }

  const street = cleanCompanyText(registration.data?.business_address);
  const postalCode = cleanCompanyText(registration.data?.postal_code);
  const city = cleanCompanyText(registration.data?.city);
  const country = cleanCompanyText(registration.data?.organization_country);
  const invoiceStreet = payment.error ? null : cleanCompanyText(payment.data?.billing_address);
  const invoicePostalCode = payment.error ? null : cleanCompanyText(payment.data?.postal_code);
  const invoiceCity = payment.error ? null : cleanCompanyText(payment.data?.city);
  const invoiceCountry = payment.error ? null : cleanCompanyText(payment.data?.country);
  const invoiceSameAsCompany =
    Boolean(invoiceStreet || invoicePostalCode || invoiceCity || invoiceCountry) &&
    sameText(street, invoiceStreet) &&
    sameText(postalCode, invoicePostalCode) &&
    sameText(city, invoiceCity) &&
    sameText(country, invoiceCountry);

  return {
    readState: "ready",
    legalName: cleanCompanyText(registration.data?.company_name),
    organizationNumber: cleanCompanyText(registration.data?.organization_number),
    website: cleanCompanyWebsite(registration.data?.website),
    phone: cleanCompanyText(registration.data?.owner_phone),
    street,
    postalCode,
    city,
    country,
    invoiceStreet: invoiceSameAsCompany ? null : invoiceStreet,
    invoicePostalCode: invoiceSameAsCompany ? null : invoicePostalCode,
    invoiceCity: invoiceSameAsCompany ? null : invoiceCity,
    invoiceCountry: invoiceSameAsCompany ? null : invoiceCountry,
    invoiceSameAsCompany,
  };
}

function emptyRead(readState: "ready" | "unavailable"): AccountCompanyProfileRead {
  return {
    readState,
    legalName: null,
    organizationNumber: null,
    website: null,
    phone: null,
    street: null,
    postalCode: null,
    city: null,
    country: null,
    invoiceStreet: null,
    invoicePostalCode: null,
    invoiceCity: null,
    invoiceCountry: null,
    invoiceSameAsCompany: false,
  };
}
