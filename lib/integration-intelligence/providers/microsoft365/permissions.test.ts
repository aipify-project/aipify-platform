import assert from "node:assert/strict";
import {
  assertMicrosoft365HandoffPermission,
  assertMicrosoft365HandoffPermissionForRole,
} from "./permissions";

assert.equal(assertMicrosoft365HandoffPermission(["aipify_studio_creative_intelligence.view"]), true);
assert.equal(assertMicrosoft365HandoffPermission(["other.permission"]), false);
assert.equal(assertMicrosoft365HandoffPermissionForRole("owner"), true);
assert.equal(assertMicrosoft365HandoffPermissionForRole("read_only"), false);

console.log("providers/microsoft365/permissions.test.ts: all assertions passed");
