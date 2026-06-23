import assert from "node:assert/strict";
import {
  assertCanvaHandoffPermissionForRole,
  CANVA_ARTIFACT_HANDOFF_REQUIRED_PERMISSION,
} from "./permissions";

assert.equal(CANVA_ARTIFACT_HANDOFF_REQUIRED_PERMISSION, "aipify_studio_creative_intelligence.view");
assert.equal(assertCanvaHandoffPermissionForRole("owner"), true);
assert.equal(assertCanvaHandoffPermissionForRole("read_only"), false);

console.log("providers/canva/permissions.test.ts: all assertions passed");
