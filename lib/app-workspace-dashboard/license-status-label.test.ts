import assert from "node:assert/strict";
import { presentWorkspaceLicenseStatusLabel } from "./license-status-label";

const labels: Record<string, string> = {
  "license.center.subscription.licenseActive": "Aktiv",
  "license.center.subscription.licenseLifetime": "Livstid",
  "license.center.subscription.licensePaused": "Pauset",
  "license.center.subscription.licenseGrace": "Grace-periode",
  "license.center.subscription.licenseUnknown": "Ikke tilgjengelig",
};

const t = (key: string) => labels[key] ?? key;

assert.equal(presentWorkspaceLicenseStatusLabel("active", t), "Aktiv");
assert.equal(presentWorkspaceLicenseStatusLabel("ACTIVE", t), "Aktiv");
assert.equal(presentWorkspaceLicenseStatusLabel("lifetime", t), "Livstid");
assert.equal(presentWorkspaceLicenseStatusLabel("paused", t), "Pauset");
assert.equal(presentWorkspaceLicenseStatusLabel("grace_period", t), "Grace-periode");
assert.equal(presentWorkspaceLicenseStatusLabel("pending_setup", t), "Ikke tilgjengelig");
assert.equal(presentWorkspaceLicenseStatusLabel(null, t), null);
assert.equal(presentWorkspaceLicenseStatusLabel("  ", t), null);
assert.notEqual(presentWorkspaceLicenseStatusLabel("active", t), "active");

console.log("license-status-label.test.ts: OK");
