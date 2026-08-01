import assert from "node:assert/strict";
import {
  resolveIntegrationCanonicalStatus,
  shouldShowLastTestFailed,
  shouldShowLastTestSuccess,
} from "./canonical-status";
import type { AppPortalIntegrationConnection } from "./types";

// Stale status=failed must not override newer success
assert.equal(
  resolveIntegrationCanonicalStatus({
    status: "failed",
    hasCredential: true,
    last_test_success_at: "2026-06-20T12:00:00Z",
    last_test_failed_at: "2026-06-01T12:00:00Z",
    canonical_status: "verification_failed",
  }),
  "verified"
);

// Newer failure wins
assert.equal(
  resolveIntegrationCanonicalStatus({
    status: "connected",
    hasCredential: true,
    last_test_success_at: "2026-06-01T12:00:00Z",
    last_test_failed_at: "2026-06-20T12:00:00Z",
  }),
  "verification_failed"
);

// Decrypt failure maps to rotation_required (not false active)
assert.equal(
  resolveIntegrationCanonicalStatus({
    status: "failed",
    hasCredential: true,
    last_test_success_at: "2026-07-06T12:00:00Z",
    last_test_failed_at: "2026-08-01T12:00:00Z",
    last_test_error: "Credential decrypt failed",
    activated_at: "2026-07-06T13:00:00Z",
  }),
  "rotation_required"
);

assert.equal(
  resolveIntegrationCanonicalStatus({
    status: "rotation_required",
    hasCredential: true,
    last_test_failed_at: "2026-08-01T12:00:00Z",
    last_test_error: "rotation_required",
  }),
  "rotation_required"
);

// Active persists from timestamps
assert.equal(
  resolveIntegrationCanonicalStatus({
    status: "active",
    hasCredential: true,
    last_test_success_at: "2026-06-20T12:00:00Z",
    activated_at: "2026-06-20T13:00:00Z",
  }),
  "active"
);

// Deactivation overrides active status
assert.equal(
  resolveIntegrationCanonicalStatus({
    status: "inactive",
    hasCredential: true,
    last_test_success_at: "2026-06-20T12:00:00Z",
    activated_at: "2026-06-20T13:00:00Z",
    deactivated_at: "2026-06-21T09:00:00Z",
  }),
  "inactive"
);

// Removed
assert.equal(
  resolveIntegrationCanonicalStatus({
    status: "revoked",
    removed_at: "2026-06-22T10:00:00Z",
  }),
  "removed"
);

const conn: AppPortalIntegrationConnection = {
  id: "1",
  provider_key: "unonight",
  setup_type: "manual",
  status: "connected",
  permission_level: "read_only",
  approved_scopes: [],
  masked_credential_hint: "abcd****",
  last_test_success_at: "2026-06-20T12:00:00Z",
  last_test_failed_at: "2026-06-01T12:00:00Z",
  last_test_error: null,
};

assert.equal(shouldShowLastTestSuccess(conn), true);
assert.equal(shouldShowLastTestFailed(conn), false);

console.log("canonical-status.test.ts: all assertions passed");
