import assert from "node:assert/strict";
import {
  getIntegrationConnectionBadgeConfig,
  mapConnectionStatusToSemantic,
} from "./connection-status";
import { getSemanticPresentation } from "@/lib/design/semantic-status-system";

// 1. Pending when credential exists
assert.equal(mapConnectionStatusToSemantic("pending", { hasCredential: true }), "pending");

// 2. Missing credential → missing_info
assert.equal(
  mapConnectionStatusToSemantic("pending", { hasCredential: false }),
  "missing_info"
);

// 3. Connected with read_only permission
assert.equal(
  mapConnectionStatusToSemantic("connected", { permissionLevel: "read_only" }),
  "read_only"
);

// 4. Test failure → failed
assert.equal(
  mapConnectionStatusToSemantic("connected", {
    permissionLevel: "read_only",
    lastTestFailedAt: "2026-01-01T00:00:00Z",
  }),
  "failed"
);

// 5. Successful test → connected (non read-only)
assert.equal(
  mapConnectionStatusToSemantic("active", {
    permissionLevel: "read_write",
    lastTestSuccessAt: "2026-01-01T00:00:00Z",
  }),
  "connected"
);

// 6. Needs review mapping
assert.equal(mapConnectionStatusToSemantic("needs_review"), "needs_review");

// 7. Badge config uses valid semantic types
const failedBadge = getIntegrationConnectionBadgeConfig("failed");
assert.equal(failedBadge.badgeType, "severity");
assert.doesNotThrow(() => getSemanticPresentation(failedBadge.badgeType, failedBadge.badgeValue));

const readOnlyBadge = getIntegrationConnectionBadgeConfig("read_only");
assert.equal(readOnlyBadge.badgeType, "access");
assert.doesNotThrow(() =>
  getSemanticPresentation(readOnlyBadge.badgeType, readOnlyBadge.badgeValue)
);

// 8. Label keys are defined
assert.ok(failedBadge.labelKey.includes("integrations.statuses.failed"));

console.log("connection-status.test.ts: all assertions passed");
