import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { installationOccupiesLicenseSlot, OCCUPYING_INSTALLATION_STATUSES } from "./installation-slot";

assert.deepEqual(OCCUPYING_INSTALLATION_STATUSES, [
  "pending_verification",
  "ready",
  "installing",
  "active",
  "warning",
]);

assert.equal(installationOccupiesLicenseSlot({ status: "ready", revoked_at: null }), true);
assert.equal(installationOccupiesLicenseSlot({ status: "pending_verification" }), true);
assert.equal(installationOccupiesLicenseSlot({ status: "active", revoked_at: null }), true);
assert.equal(installationOccupiesLicenseSlot({ status: "warning" }), true);
assert.equal(installationOccupiesLicenseSlot({ status: "installing" }), true);
assert.equal(
  installationOccupiesLicenseSlot({ status: "ready", revoked_at: "2026-10-22T00:00:00Z" }),
  false,
);
assert.equal(installationOccupiesLicenseSlot({ status: "archived", revoked_at: null }), false);
assert.equal(installationOccupiesLicenseSlot({ status: "suspended" }), false);
assert.equal(installationOccupiesLicenseSlot({ status: "failed" }), false);
assert.equal(installationOccupiesLicenseSlot({ status: "draft" }), false);
assert.equal(installationOccupiesLicenseSlot({ status: "pending" }), false);

const root = new URL("../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const summary = read("lib/website-kompis-connection/load-summary.ts");
const sites = read("lib/website-kompis-site-context/load-sites.ts");
const route = read("app/api/app/domains/website-kompis/route.ts");
const frozen = read("lib/marketing/website-kompis-domain-settings-server.ts");

assert.match(summary, /filterOccupyingInstallId/);
assert.match(sites, /occupyingInstallIdSet/);
assert.match(route, /filterOccupyingInstallId/);
assert.doesNotMatch(frozen, /installationOccupiesLicenseSlot/);
assert.match(frozen, /if \(installationId\) \{\s*return installationId;\s*\}/);

console.log("installation-slot ok");
