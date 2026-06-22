import assert from "node:assert/strict";
import {
  classifyIntegrationError,
  getIntegrationErrorGuidance,
  parseIntegrationError,
} from "./error-guidance";

// 1. Unauthorized patterns
assert.equal(classifyIntegrationError("Unauthorized"), "unauthorized");
assert.equal(classifyIntegrationError({ error: "401 Invalid API key" }), "unauthorized");

// 2. Network patterns
assert.equal(classifyIntegrationError("Failed to fetch"), "network");
assert.equal(classifyIntegrationError("Network timeout"), "network");

// 3. Invalid scope
assert.equal(classifyIntegrationError("Invalid scope"), "invalid_scope");
assert.equal(classifyIntegrationError("403 permission denied"), "invalid_scope");

// 4. Missing environment variable
assert.equal(classifyIntegrationError("Missing environment variable"), "missing_env");

// 5. Validation pending
assert.equal(classifyIntegrationError("Connection validation pending"), "validation_pending");

// 6. Unknown fallback
assert.equal(classifyIntegrationError("Something else entirely"), "unknown");

// 7. Guidance includes checklist and actions
const unauthorized = getIntegrationErrorGuidance("unauthorized");
assert.ok(unauthorized.checklistKeys.length >= 3);
assert.ok(unauthorized.actions.retry.includes("errorGuidance"));
assert.ok(unauthorized.titleKey.includes("unauthorized"));

// 8. parseIntegrationError delegates to classifier
const parsed = parseIntegrationError("Failed to fetch");
assert.equal(parsed.category, "network");
assert.equal(parsed.bodyKey, getIntegrationErrorGuidance("network").bodyKey);

console.log("error-guidance.test.ts: all assertions passed");
