import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  mapCustomerIdentityRpcError,
  parsePlatformCustomerIdentityPayload,
  parseUpdateCustomerContactEmailInput,
  parseUpdateCustomerContactEmailResult,
} from "./customer-identity";
import { buildPlatformCustomerIdentityLabels } from "./customer-identity-labels";

function runParserTests() {
  const badCustomer = parseUpdateCustomerContactEmailInput("not-a-uuid", {
    email: "admin@aipify.ai",
    expectedCurrentEmail: "team@aipify.com",
    confirmation: true,
    reason: "Correct identity",
    idempotencyKey: "pci-test-key-01",
  });
  assert.equal(badCustomer.ok, false);

  const needsConfirm = parseUpdateCustomerContactEmailInput(
    "97a4bbcd-a223-47bd-9a3e-eadab02aaf1c",
    {
      email: "admin@aipify.ai",
      expectedCurrentEmail: "team@aipify.com",
      confirmation: false,
      reason: "Correct identity",
      idempotencyKey: "pci-test-key-01",
    },
  );
  assert.equal(needsConfirm.ok, false);
  if (!needsConfirm.ok) assert.equal(needsConfirm.code, "confirmation_required");

  const ok = parseUpdateCustomerContactEmailInput("97a4bbcd-a223-47bd-9a3e-eadab02aaf1c", {
    email: " Admin@Aipify.AI ",
    expectedCurrentEmail: " Team@Aipify.COM ",
    confirmation: true,
    reason: "Correct Aipify Group AS contact identity to an owned Aipify domain.",
    idempotencyKey: "pci-release-20260731-01",
  });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.value.email, "admin@aipify.ai");
    assert.equal(ok.value.expectedCurrentEmail, "team@aipify.com");
  }

  const payload = parsePlatformCustomerIdentityPayload({
    customer_id: "97a4bbcd-a223-47bd-9a3e-eadab02aaf1c",
    organization_id: "97a4bbcd-a223-47bd-9a3e-eadab02aaf1c",
    slug: "aipify-group",
    company_name: "Aipify Group AS",
    contact_email: "team@aipify.com",
    email_domain: "aipify.com",
    is_internal_aipify_identity: true,
    forbidden_unowned_domain: true,
    owned_aipify_domain: false,
    updated_at: "2026-06-14T01:50:05.314404+00:00",
  });
  assert.ok(payload);
  assert.equal(payload?.forbiddenUnownedDomain, true);
  assert.equal(payload?.isInternalAipifyIdentity, true);

  const result = parseUpdateCustomerContactEmailResult({
    ok: true,
    result: "updated",
    customer_id: "97a4bbcd-a223-47bd-9a3e-eadab02aaf1c",
    organization_id: "97a4bbcd-a223-47bd-9a3e-eadab02aaf1c",
    previous_email: "team@aipify.com",
    new_email: "admin@aipify.ai",
    previous_email_domain: "aipify.com",
    new_email_domain: "aipify.ai",
    idempotency_key: "pci-release-20260731-01",
    write_id: "00000000-0000-4000-8000-000000000001",
    auth_unchanged: true,
    billing_unchanged: true,
    email_sent: false,
    notification_sent: false,
  });
  assert.ok(result);
  assert.equal(result?.newEmail, "admin@aipify.ai");
  assert.equal(result?.emailSent, false);

  assert.equal(mapCustomerIdentityRpcError("aipify_com_not_owned").code, "aipify_com_not_owned");
  assert.equal(mapCustomerIdentityRpcError("Platform high-risk write denied").status, 403);
  assert.equal(mapCustomerIdentityRpcError("expected_email_mismatch").status, 409);

  console.log("platform customer-identity parsers: all tests passed");
}

function runLocaleParityTests() {
  const locales = readdirSync("locales").filter((name) => {
    try {
      return statSync(join("locales", name)).isDirectory();
    } catch {
      return false;
    }
  });
  const required = [
    "title",
    "contactEmail",
    "ownedDomain",
    "forbiddenDomain",
    "invalidEmail",
    "emailConflict",
    "expectedMismatch",
    "reason",
    "confirmation",
    "save",
    "success",
    "noEmailSent",
    "authUnchanged",
    "billingUnchanged",
    "auditNote",
  ];
  for (const locale of locales) {
    const platform = JSON.parse(readFileSync(join("locales", locale, "platform.json"), "utf8"));
    const section = platform.customers?.customerIdentity;
    assert.ok(section, `${locale}: missing customers.customerIdentity`);
    for (const key of required) {
      assert.equal(typeof section[key], "string", `${locale}: missing ${key}`);
      assert.ok(section[key].trim().length > 0, `${locale}: empty ${key}`);
    }
    const labels = buildPlatformCustomerIdentityLabels((k) => {
      const path = k.replace(/^platform\./, "").split(".");
      let cur: unknown = platform;
      for (const part of path) {
        cur = (cur as Record<string, unknown>)?.[part];
      }
      return String(cur ?? k);
    });
    assert.equal(labels.title, section.title);
  }
  console.log(`platform customer-identity locale parity (${locales.length}): all tests passed`);
}

function main() {
  runParserTests();
  runLocaleParityTests();
  console.log("platform customer-identity: ALL TESTS PASSED");
}

main();
