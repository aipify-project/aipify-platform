import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  AIPIFY_INTERNAL_PROVISION_EMAIL,
  assertAuthorizedAipifyEmail,
  containsForbiddenAipifyCom,
  evaluateCustomerContactEmail,
  findForbiddenAipifyComHits,
  isOwnedAipifyEmailDomain,
  isReservedExampleDomain,
  normalizeEmail,
} from "./index";

function runDomainOwnershipTests() {
  assert.equal(normalizeEmail("  Admin@Aipify.AI "), "admin@aipify.ai");
  assert.equal(isOwnedAipifyEmailDomain("AIPIFY.AI"), true);
  assert.equal(isReservedExampleDomain("example.com"), true);
  assert.equal(isReservedExampleDomain("customer.example"), true);

  assert.equal(containsForbiddenAipifyCom("team@aipify.com"), true);
  assert.equal(containsForbiddenAipifyCom("AIPIFY.COM"), true);
  assert.equal(containsForbiddenAipifyCom("https://aipify.com/x"), true);
  assert.equal(containsForbiddenAipifyCom("aipify.companion.ui.v1"), false);
  assert.equal(containsForbiddenAipifyCom("com.aipify.command-center"), false);

  assert.equal(evaluateCustomerContactEmail("ops@aipify.ai", { isInternalAipifyIdentity: true }).ok, true);
  assert.equal(
    evaluateCustomerContactEmail("team@aipify.com", { isInternalAipifyIdentity: true }).ok,
    false,
  );
  assert.equal(
    evaluateCustomerContactEmail("ops@customer.example", { isInternalAipifyIdentity: true }).ok,
    false,
  );
  assert.equal(
    evaluateCustomerContactEmail("ops@customer.example", { isInternalAipifyIdentity: false }).ok,
    true,
  );

  assert.doesNotThrow(() => assertAuthorizedAipifyEmail("admin@aipify.ai"));
  assert.throws(() => assertAuthorizedAipifyEmail("team@aipify.com"), /aipify_com_not_owned/);

  assert.equal(AIPIFY_INTERNAL_PROVISION_EMAIL, "admin@aipify.ai");
  console.log("aipify-domain-ownership policy: all tests passed");
}

function runGeneratorSourceTests() {
  const migration = readFileSync(
    "supabase/migrations/20261935900000_platform_customer_identity_domain_ownership_v1.sql",
    "utf8",
  );
  assert.match(migration, /admin@aipify\.ai/);
  assert.match(migration, /update_platform_portal_customer_contact_email/);
  assert.match(migration, /_platform_require_high_risk_write/);
  assert.match(migration, /set search_path = public/);
  assert.match(migration, /revoke all on function public\.update_platform_portal_customer_contact_email/);
  assert.doesNotMatch(
    migration.replace(/aipify\.com_not_owned|aipify\.com is not|forbidden.*aipify\.com|v_domain = 'aipify\.com'/gi, ""),
    /team@aipify\.com/,
  );
  // Live generator body in this migration must not insert team@aipify.com
  const fnStart = migration.indexOf("create or replace function public._aio_provision_internal_tenant");
  assert.ok(fnStart > 0);
  const fnBody = migration.slice(fnStart);
  assert.match(fnBody, /'admin@aipify\.ai'/);
  assert.doesNotMatch(fnBody, /'team@aipify\.com'/);
  assert.doesNotMatch(migration, /update public\.customers[\s\S]{0,80}97a4bbcd/i);
  assert.doesNotMatch(migration, /insert into public\.customers[\s\S]{0,200}97a4bbcd/i);

  console.log("aipify-domain-ownership generator migration: all tests passed");
}

function runIdentityModuleTests() {
  const identity = readFileSync("lib/platform-portal/customer-identity.ts", "utf8");
  assert.match(identity, /confirmation_required/);
  assert.match(identity, /expectedCurrentEmail/);
  assert.match(identity, /idempotencyKey/);
  assert.match(identity, /aipify_com_not_owned/);

  const route = readFileSync("app/api/platform-portal/customers/[id]/identity/route.ts", "utf8");
  assert.match(route, /update_platform_portal_customer_contact_email/);
  assert.match(route, /get_platform_portal_customer_identity/);
  assert.match(route, /PATCH/);
  assert.doesNotMatch(route, /sendMail|resend|nodemailer/i);

  const panel = readFileSync(
    "components/platform/platform-portal/PlatformPortalCustomerIdentityPanel.tsx",
    "utf8",
  );
  assert.match(panel, /AipifyLoader/);
  assert.match(panel, /confirmation/);
  assert.doesNotMatch(panel, /team@aipify\.com/);

  console.log("aipify-domain-ownership identity module: all tests passed");
}

function main() {
  runDomainOwnershipTests();
  runGeneratorSourceTests();
  runIdentityModuleTests();
  assert.equal(findForbiddenAipifyComHits("safe").length, 0);
  console.log("aipify-domain-ownership: ALL TESTS PASSED");
}

main();
