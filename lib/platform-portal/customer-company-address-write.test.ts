import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  COMPANY_ADDRESS_WRITE_CORE_LIVE,
  COMPANY_ADDRESS_WRITE_RPC,
  parsePlatformCompanyAddressWriteInput,
  writePlatformCustomerCompanyAddress,
} from "./customer-company-address-write";

const CUSTOMER = "11111111-1111-4111-8111-111111111111";

const SQL_REL =
  "docs/sql-candidates/20261127_update_platform_portal_customer_company_address_v1.sql";
const SHA_REL =
  "docs/sql-candidates/20261127_update_platform_portal_customer_company_address_v1.sha256.txt";

{
  const sql = readFileSync(resolve(process.cwd(), SQL_REL), "utf8");
  const sha = createHash("sha256").update(sql).digest("hex");
  const ledger = readFileSync(resolve(process.cwd(), SHA_REL), "utf8").trim();
  assert.match(ledger, new RegExp(`^${sha}\\s+`));
  assert.match(sql, /NOT APPLIED/i);
  assert.match(sql, new RegExp(COMPANY_ADDRESS_WRITE_RPC));
  assert.match(sql, /is_platform_admin\(\)/);
  assert.match(sql, /record_platform_admin_audit_event/);
  assert.match(sql, /customer_company_address_update/);
  assert.match(sql, /organization_registration_profiles/);
  assert.match(sql, /payment_profiles/);
  assert.doesNotMatch(sql, /company_name\s*=/);
  assert.doesNotMatch(sql, /organization_number\s*=/);
  assert.doesNotMatch(sql, /update_platform_portal_customer_primary_contact/);
  assert.equal(COMPANY_ADDRESS_WRITE_CORE_LIVE, false);
}

{
  const bad = parsePlatformCompanyAddressWriteInput("not-a-uuid", {
    confirmation: true,
    internalReason: "fix address",
    updateCompany: true,
    street: "Gate 1",
  });
  assert.equal(bad.ok, false);
  if (!bad.ok) assert.equal(bad.code, "invalid_customer");
}

{
  const missingConfirm = parsePlatformCompanyAddressWriteInput(CUSTOMER, {
    internalReason: "Fix address",
    updateCompany: true,
    street: "Gate 1",
  });
  assert.equal(missingConfirm.ok, false);
  if (!missingConfirm.ok) assert.equal(missingConfirm.code, "confirmation_required");
}

{
  const missingReason = parsePlatformCompanyAddressWriteInput(CUSTOMER, {
    confirmation: true,
    internalReason: "ab",
    updateCompany: true,
    street: "Gate 1",
  });
  assert.equal(missingReason.ok, false);
  if (!missingReason.ok) assert.equal(missingReason.code, "invalid_internal_reason");
}

{
  const placeholderPostal = parsePlatformCompanyAddressWriteInput(CUSTOMER, {
    confirmation: true,
    internalReason: "Fix invoice",
    updateInvoice: true,
    invoicePostalCode: "0000",
    invoiceStreet: "Gate 1",
    invoiceCity: "Oslo",
    invoiceCountry: "NO",
  });
  assert.equal(placeholderPostal.ok, false);
  if (!placeholderPostal.ok) assert.equal(placeholderPostal.code, "invalid_invoice_postal_code");
}

{
  const pendingStreet = parsePlatformCompanyAddressWriteInput(CUSTOMER, {
    confirmation: true,
    internalReason: "Fix invoice",
    updateInvoice: true,
    invoiceStreet: "Billing address pending",
    invoicePostalCode: "0155",
    invoiceCity: "Oslo",
    invoiceCountry: "NO",
  });
  assert.equal(pendingStreet.ok, false);
  if (!pendingStreet.ok) assert.equal(pendingStreet.code, "invalid_invoice_street");
}

{
  const badSite = parsePlatformCompanyAddressWriteInput(CUSTOMER, {
    confirmation: true,
    internalReason: "Fix website",
    updateCompany: true,
    website: "javascript:alert(1)",
  });
  assert.equal(badSite.ok, false);
  if (!badSite.ok) assert.equal(badSite.code, "invalid_website");
}

{
  const ok = parsePlatformCompanyAddressWriteInput(CUSTOMER, {
    confirmation: true,
    internalReason: "Correct company address after support request",
    updateCompany: true,
    updateInvoice: true,
    copyCompanyToInvoice: true,
    displayName: "North Studio",
    website: "https://customer.example",
    companyPhone: "+4711223344",
    street: "Storgata 1",
    postalCode: "0155",
    city: "Oslo",
    country: "no",
  });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.value.country, "NO");
    assert.equal(ok.value.copyCompanyToInvoice, true);
  }
}

void (async () => {
  const gated = await writePlatformCustomerCompanyAddress(
    {
      userClient: {
        rpc: async () => ({
          data: { ok: true },
          error: null,
        }),
      },
    },
    {
      customerId: CUSTOMER,
      updateCompany: true,
      updateInvoice: false,
      copyCompanyToInvoice: false,
      confirmation: true,
      internalReason: "Should stay gated until Core live flag flips",
      street: "Storgata 1",
    },
  );
  assert.equal(gated.ok, false);
  if (!gated.ok) assert.equal(gated.code, "core_gate_pending");
  console.log("customer-company-address-write.test.ts: ok");
})();
