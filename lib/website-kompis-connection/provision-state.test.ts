import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { classifyDomainActionResult, domainActionHttpError } from "./provision-state";
import {
  WEBSITE_KOMPIS_SITE_PROVISION_LIVE,
  websiteKompisSiteProvisionDecision,
} from "./provision-gate";

const created = classifyDomainActionResult("create_domain", true, { ok: true });
assert.equal(created.installationCreated, false);
assert.equal(created.licensePurchased, false);
assert.equal(created.verificationRecorded, false);
assert.equal(created.knowledgeScopeCreated, false);
assert.equal(created.scriptReady, false);
assert.equal(created.runtimeObserved, false);
assert.equal(created.notice, "pending_without_installation");

assert.equal(classifyDomainActionResult("create_domain", true, { ok: false }).notice, "failed");
assert.equal(classifyDomainActionResult("purchase_domain_license", false, { ok: false }).licensePurchased, false);
assert.equal(domainActionHttpError("Insufficient permissions").code, "management_role_required");
assert.equal(domainActionHttpError("No available Domain License — purchase Additional Domain License in Marketplace").status, 409);
assert.equal(domainActionHttpError("syntax error at or near select").code, "domain_action_failed");

const page = readFileSync(join(process.cwd(), "app/app/website-kompis/connection/page.tsx"), "utf8");
assert.doesNotMatch(page, /create_installation_draft|begin_modern_install|provision_website_kompis_site/);
const panel = readFileSync(
  join(process.cwd(), "components/app/website-kompis/WebsiteKompisConnectionCenterPanel.tsx"),
  "utf8",
);
assert.doesNotMatch(panel, /create_installation|activate_domain|purchase_domain_license/);
assert.doesNotMatch(panel, /\/api\/app\/website-kompis\/provision/);
assert.equal(WEBSITE_KOMPIS_SITE_PROVISION_LIVE, false);
assert.deepEqual(websiteKompisSiteProvisionDecision(), {
  ok: false,
  code: "provision_unavailable",
  httpStatus: 409,
});

const provisionRoute = readFileSync(
  join(process.cwd(), "app/api/app/website-kompis/provision/route.ts"),
  "utf8",
);
const provisionGate = readFileSync(
  join(process.cwd(), "lib/website-kompis-connection/provision-gate.ts"),
  "utf8",
);
assert.doesNotMatch(provisionRoute, /\.rpc\(|provision_website_kompis_site/);
assert.match(provisionRoute, /websiteKompisSiteProvisionDecision/);
assert.match(provisionGate, /provision_unavailable/);

console.log("provision-state.test.ts: OK");
