import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { classifyDomainActionResult, domainActionHttpError } from "./provision-state";
import {
  WEBSITE_KOMPIS_SITE_PROVISION_LIVE,
  websiteKompisSiteProvisionDecision,
} from "./provision-gate";
import {
  interpretProvisionRpcResult,
  mapProvisionError,
  requestWebsiteKompisSiteProvision,
} from "./provision-request";

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
const provisionRequest = readFileSync(
  join(process.cwd(), "lib/website-kompis-connection/provision-request.ts"),
  "utf8",
);
assert.doesNotMatch(provisionRoute, /customerId|organizationId|p_customer_id/);
assert.match(provisionRoute, /requestWebsiteKompisSiteProvision/);
assert.match(provisionGate, /provision_unavailable/);
assert.match(provisionRequest, /if \(!websiteKompisSiteProvisionIsLive\(\)\)/);
const liveGuard = provisionRequest.indexOf("if (!websiteKompisSiteProvisionIsLive())");
const rpcCall = provisionRequest.indexOf('rpc("provision_website_kompis_site"');
assert.ok(liveGuard > 0 && rpcCall > liveGuard);

let rpcCalls = 0;
void requestWebsiteKompisSiteProvision(
  {
    async rpc() {
      rpcCalls += 1;
      return { data: null, error: null };
    },
  },
  {
    domainId: "11111111-1111-4111-8111-111111111101",
    confirmation: true,
  },
).then((blocked) => {
  assert.equal(rpcCalls, 0);
  assert.deepEqual(blocked, websiteKompisSiteProvisionDecision());
  assert.equal(interpretProvisionRpcResult({ installation_token: "aipify_secret", token_returned: false }).ok, false);
  assert.equal(mapProvisionError("syntax error at or near select"), "provision_failed");
  assert.equal(mapProvisionError("domain_not_verified"), "domain_not_verified");
assert.equal(mapProvisionError("management_role_required"), "management_role_required");
assert.equal(
  mapProvisionError("Aipify services are paused. Please update billing to continue."),
  "license_service_paused",
);
assert.equal(
  mapProvisionError("Installation limit reached. Upgrade your plan to add more websites."),
  "installation_limit_reached",
);

const panel = readFileSync(
  join(process.cwd(), "components/app/website-kompis/WebsiteKompisConnectionCenterPanel.tsx"),
  "utf8",
);
assert.match(panel, /installationNotCreated/);
assert.doesNotMatch(panel, /provisionCodes/);

const enCodes = JSON.parse(
  readFileSync(join(process.cwd(), "locales/en/customer-app/core.json"), "utf8"),
).websiteKompisConnection.provisionCodes as Record<string, string>;
for (const locale of ["no", "sv", "da", "pl", "uk"]) {
  const codes = JSON.parse(
    readFileSync(join(process.cwd(), `locales/${locale}/customer-app/core.json`), "utf8"),
  ).websiteKompisConnection.provisionCodes as Record<string, string>;
  assert.deepEqual(Object.keys(codes).sort(), Object.keys(enCodes).sort(), locale);
  for (const [key, value] of Object.entries(codes)) {
    assert.equal(typeof value, "string");
    assert.notEqual(value, key, `${locale}.${key}`);
    assert.notEqual(value, enCodes[key], `${locale}.${key}`);
  }
}
  console.log("provision-state.test.ts: OK");
}).catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
