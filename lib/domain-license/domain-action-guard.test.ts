import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { domainActionPayload, domainActionRefusal } from "./action-guard";

const ROOT = process.cwd();

assert.equal(domainActionRefusal("purchase_domain_license"), "payment_not_confirmed");
assert.equal(domainActionRefusal("activate_domain"), "verification_not_recorded");
assert.equal(domainActionRefusal("create_domain"), null);
assert.equal(domainActionRefusal("remove_domain"), "domain_removal_not_available");

const createPayload = domainActionPayload("create_domain", {
  domain: "  Example.COM ",
  display_name: "Example",
  connected_platform: "custom_website",
  organization_id: "foreign",
  customer_id: "foreign",
  quantity: 4,
});
assert.deepEqual(createPayload, {
  domain: "Example.COM",
  display_name: "Example",
  connected_platform: "custom_website",
});

const otherPayload = domainActionPayload("assign_user", {
  domain_id: "11111111-1111-4111-8111-111111111111",
  organization_id: "foreign",
  customerId: "foreign",
});
assert.deepEqual(otherPayload, { domain_id: "11111111-1111-4111-8111-111111111111" });

const migration = readFileSync(
  join(
    ROOT,
    "supabase/migrations/20261850510000_domain_license_domain_pack_installation_engine_phase505a.sql",
  ),
  "utf8",
);

const createStart = migration.indexOf("if p_action_type = 'create_domain' then");
const createEnd = migration.indexOf("elsif p_action_type = 'activate_domain' then");
const createBlock = migration.slice(createStart, createEnd);
assert.ok(createStart > 0 && createEnd > createStart);
assert.match(createBlock, /domain_status/);
assert.match(createBlock, /'pending'/);
assert.equal(createBlock.includes("installation_id"), false);
assert.equal(createBlock.includes("customer_domains"), false);
assert.equal(createBlock.includes("tenant_public_companion_faq_items"), false);

const purchaseStart = migration.indexOf("elsif p_action_type = 'purchase_domain_license' then");
const purchaseEnd = migration.indexOf("elsif p_action_type = 'assign_user' then");
const purchaseBlock = migration.slice(purchaseStart, purchaseEnd);
assert.match(purchaseBlock, /purchased_licenses/);
assert.equal(/stripe|payment_intent|invoice/i.test(purchaseBlock), false);

const centerStart = migration.indexOf("function public.get_domain_license_center()");
const centerEnd = migration.indexOf("function public.perform_domain_license_action(");
assert.match(migration.slice(centerStart, centerEnd), /_dl505_ensure_primary_domain/);

const getRoute = readFileSync(join(ROOT, "app/api/app/domains/route.ts"), "utf8");
assert.doesNotMatch(getRoute, /performDomainLicenseAction|create_domain|purchase_domain_license/);

const connectionPage = readFileSync(
  join(ROOT, "app/app/website-kompis/connection/page.tsx"),
  "utf8",
);
assert.doesNotMatch(connectionPage, /performDomainLicenseAction|create_domain|purchase_domain_license/);

const panel = readFileSync(
  join(ROOT, "components/app/domain-license/DomainLicenseCenterPanel.tsx"),
  "utf8",
);
assert.doesNotMatch(panel, /purchase_domain_license|activate_domain/);
assert.match(panel, /domainAddedPending/);
assert.match(panel, /purchaseUnavailable/);

const actionRoute = readFileSync(join(ROOT, "app/api/app/domains/action/route.ts"), "utf8");
assert.match(actionRoute, /domainActionRefusal/);
assert.match(actionRoute, /domainActionHttpError/);
assert.doesNotMatch(actionRoute, /error: message/);

const proposal = readFileSync(
  join(ROOT, "docs/platform/NOT_APPLIED_website_kompis_faq_install_isolation_v1.sql"),
  "utf8",
);
assert.match(proposal, /NOT APPLIED/);
assert.equal(/^\s*(create|alter|update|insert|delete|drop)\b/im.test(proposal), false);

const provision = readFileSync(
  join(ROOT, "docs/platform/NOT_APPLIED_website_kompis_site_provision_v1.sql"),
  "utf8",
);
assert.match(provision, /NOT APPLIED/);
assert.match(provision, /installation token/);
assert.equal(/^\s*(create|alter|update|insert|delete|drop)\b/im.test(provision), false);

console.log("domain-action-guard.test.ts: OK");
