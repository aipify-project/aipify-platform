import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCustomerCompanyProfile,
  isInvoiceAddressPlaceholder,
} from "./customer-company-address";

const company = {
  readState: "ready" as const,
  street: "Storgata 1",
  postalCode: "0155",
  city: "Oslo",
  country: "NO",
  website: "https://customer.example",
  phone: "+4712345678",
  organizationNumber: "999999999",
  legalName: "Example AS",
};

test("missing registration fields stay empty and invoice address matches when no payment profile exists", () => {
  const profile = buildCustomerCompanyProfile(
    { ...company, street: "  ", website: "", phone: null, organizationNumber: null, legalName: "  " },
    {
      readState: "ready",
      rowPresent: false,
      street: null,
      postalCode: null,
      city: null,
      country: null,
    },
  );
  assert.equal(profile.readState, "ready");
  assert.equal(profile.street, null);
  assert.equal(profile.line2, null);
  assert.equal(profile.region, null);
  assert.equal(profile.website, null);
  assert.equal(profile.phone, null);
  assert.equal(profile.organizationNumber, null);
  assert.equal(profile.invoiceAddress.sameAsCompany, true);
  assert.equal(profile.invoiceAddress.quality, "not_registered");
  assert.equal(profile.invoiceAddress.street, null);
});

test("a differing payment profile is a separate invoice address", () => {
  const profile = buildCustomerCompanyProfile(company, {
    readState: "ready",
    rowPresent: true,
    street: "Fakturagata 2",
    postalCode: "5008",
    city: "Bergen",
    country: "NO",
  });
  assert.equal(profile.invoiceAddress.sameAsCompany, false);
  assert.equal(profile.invoiceAddress.quality, "registered");
  assert.equal(profile.invoiceAddress.street, "Fakturagata 2");
  assert.equal(profile.invoiceAddress.city, "Bergen");
  assert.equal(profile.website, "https://customer.example");
  assert.equal(profile.phone, "+4712345678");
});

test("identical invoice address collapses to the company address", () => {
  const profile = buildCustomerCompanyProfile(company, {
    readState: "ready",
    rowPresent: true,
    street: "storgata 1",
    postalCode: "0155",
    city: "oslo",
    country: "no",
  });
  assert.equal(profile.invoiceAddress.sameAsCompany, true);
});

test("a failed company read is unavailable and does not invent a website", () => {
  const profile = buildCustomerCompanyProfile(
    {
      readState: "unavailable",
      street: "Hidden",
      postalCode: "0001",
      city: "Oslo",
      country: "NO",
      website: "https://guessed.example",
      phone: "+4799999999",
      organizationNumber: "111111111",
      legalName: "Guessed",
    },
    {
      readState: "unavailable",
      rowPresent: false,
      street: null,
      postalCode: null,
      city: null,
      country: null,
    },
  );
  assert.equal(profile.readState, "unavailable");
  assert.equal(profile.website, null);
  assert.equal(profile.phone, null);
  assert.equal(profile.street, null);
  assert.equal(profile.invoiceAddress.sameAsCompany, false);
  assert.equal(profile.invoiceAddress.quality, "unavailable");
});

test("javascript websites are dropped", () => {
  const profile = buildCustomerCompanyProfile(
    { ...company, website: "javascript:alert(1)" },
    {
      readState: "ready",
      rowPresent: false,
      street: null,
      postalCode: null,
      city: null,
      country: null,
    },
  );
  assert.equal(profile.website, null);
});

test("known billing placeholder is needs_verification and not treated as registered", () => {
  assert.equal(
    isInvoiceAddressPlaceholder({
      street: "Billing address pending",
      postalCode: "0000",
      city: "Oslo",
      country: "NO",
    }),
    true,
  );
  assert.equal(
    isInvoiceAddressPlaceholder({
      street: "Karl Johans gate 1",
      postalCode: "0154",
      city: "Oslo",
      country: "NO",
    }),
    false,
  );

  const profile = buildCustomerCompanyProfile(company, {
    readState: "ready",
    rowPresent: true,
    street: "Billing address pending",
    postalCode: "0000",
    city: "Oslo",
    country: "NO",
  });
  assert.equal(profile.invoiceAddress.quality, "needs_verification");
  assert.equal(profile.invoiceAddress.sameAsCompany, false);
});
