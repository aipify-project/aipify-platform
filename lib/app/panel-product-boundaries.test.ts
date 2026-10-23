import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { bedriftHomeCardState } from "./foundation-product-card";
import { accountSettingsParent } from "@/lib/app-portal/product-context/account-settings-parent";

assert.equal(bedriftHomeCardState(true), "open");
assert.equal(bedriftHomeCardState(false), "unavailable");
assert.equal(bedriftHomeCardState(null), "unavailable");

assert.equal(accountSettingsParent("kompisBedrift"), "kompisBedrift");
assert.equal(accountSettingsParent("kompisWeb"), "kompisWeb");
assert.equal(accountSettingsParent(null), "account");
assert.equal(accountSettingsParent("other"), "account");

const root = process.cwd();
const hub = readFileSync(
  join(root, "components/app/app-portal/AppPortalIntegrationsHubPanel.tsx"),
  "utf8",
);
const errorStart = hub.indexOf("if (!hub)");
const errorBranch = hub.slice(errorStart, errorStart + 420);
assert.match(errorBranch, /AppErrorState/);
assert.match(errorBranch, /labels\.hub\.loadError/);
assert.doesNotMatch(errorBranch, /labels\.hub\.loading/);

const homePage = readFileSync(join(root, "app/app/page.tsx"), "utf8");
assert.doesNotMatch(homePage, /is_tenant_module_enabled/);
assert.match(homePage, /loadRequestAccessControlPlaneSnapshot/);

const home = readFileSync(join(root, "components/app/foundation/AppFoundationDashboard.tsx"), "utf8");
assert.match(home, /bedriftHomeCardState\(kompisBedriftAvailable\)/);
assert.doesNotMatch(home, /kompisBedriftDashboard[\s\S]{0,240}statusReady/);

console.log("panel-product-boundaries.test.ts: OK");
