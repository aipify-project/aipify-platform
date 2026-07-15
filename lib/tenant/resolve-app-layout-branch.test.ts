import assert from "node:assert/strict";
import { resolveAppLayoutBranch } from "@/lib/tenant/resolve-app-layout-branch";

console.log("resolve-app-layout-branch.test.ts");

assert.equal(
  resolveAppLayoutBranch({ state: "membership_missing", hasPlatformAccess: true }),
  "platform",
);

assert.equal(
  resolveAppLayoutBranch({ state: "membership_missing", hasPlatformAccess: false }),
  "bootstrap",
);

assert.equal(
  resolveAppLayoutBranch({ state: "selection_required", hasPlatformAccess: false }),
  "bootstrap",
);

assert.equal(
  resolveAppLayoutBranch({ state: "ready", hasPlatformAccess: false }),
  "shell",
);

assert.equal(
  resolveAppLayoutBranch({ state: "subscription_inactive", hasPlatformAccess: false }),
  "shell",
);

assert.equal(
  resolveAppLayoutBranch({ state: "license_inactive", hasPlatformAccess: false }),
  "shell",
);

assert.equal(
  resolveAppLayoutBranch({ state: "organization_missing", hasPlatformAccess: true }),
  "bootstrap",
);

assert.equal(
  resolveAppLayoutBranch({ state: "user_not_provisioned", hasPlatformAccess: true }),
  "bootstrap",
);

assert.equal(
  resolveAppLayoutBranch({ state: "unauthenticated", hasPlatformAccess: false }),
  "bootstrap",
);

assert.equal(
  resolveAppLayoutBranch({ state: "access_denied", hasPlatformAccess: false }),
  "bootstrap",
);

console.log("resolve-app-layout-branch.test.ts: all assertions passed");
