import assert from "node:assert/strict";
import { resolveAppPortalAccessMessageKey } from "@/lib/app-portal/access-state-messages";

console.log("access-state-messages.test.ts");

assert.equal(resolveAppPortalAccessMessageKey("selection_required"), "organizationMissing");

assert.equal(resolveAppPortalAccessMessageKey("membership_missing"), "organizationMissing");

assert.equal(resolveAppPortalAccessMessageKey("ready"), "accessDenied");

assert.equal(resolveAppPortalAccessMessageKey(undefined), "accessDenied");
assert.equal(resolveAppPortalAccessMessageKey(null), "accessDenied");
assert.equal(
  resolveAppPortalAccessMessageKey("unknown_state" as never),
  "accessDenied",
);

console.log("access-state-messages.test.ts: all assertions passed");
