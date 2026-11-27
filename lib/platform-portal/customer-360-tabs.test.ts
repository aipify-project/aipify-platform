import assert from "node:assert/strict";
import { CUSTOMER_360_TABS, isCustomer360Tab } from "./customer-360-tabs";
import { CUSTOMER_PROFILE_CHANGE_SUPPORT_HREF } from "@/lib/app-portal/support-requests/profile-change-intent";
import { readFileSync } from "node:fs";
import { join } from "node:path";

assert.equal(CUSTOMER_360_TABS[0], "contact");
assert.deepEqual([...CUSTOMER_360_TABS], [
  "contact",
  "company",
  "products",
  "subscription",
  "support",
  "technical",
]);
assert.equal(isCustomer360Tab("contact"), true);
assert.equal(isCustomer360Tab("billing"), false);

assert.match(CUSTOMER_PROFILE_CHANGE_SUPPORT_HREF, /\/app\/support\/requests/);
assert.match(CUSTOMER_PROFILE_CHANGE_SUPPORT_HREF, /category=account/);
assert.match(CUSTOMER_PROFILE_CHANGE_SUPPORT_HREF, /intent=customer_profile_change/);

const panel = readFileSync(
  join(process.cwd(), "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx"),
  "utf8",
);
assert.match(panel, /role="tablist"/);
assert.match(panel, /activeTab === "contact"/);
assert.match(panel, /activeTab === "products"/);
assert.match(panel, /activeTab === "technical"/);
assert.match(panel, /modulesAvailable/);
assert.match(panel, /productTruthNote/);

const formStyles = readFileSync(
  join(process.cwd(), "lib/app/account-profile/form-styles.ts"),
  "utf8",
);
assert.match(formStyles, /max-w-\[45rem\]/);

console.log("customer-360-tabs.test.ts: all assertions passed");
