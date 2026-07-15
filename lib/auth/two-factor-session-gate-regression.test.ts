import assert from "node:assert/strict";
import {
  sessionNeedsTwoFactorGate,
  twoFactorRedirectPath,
  type TwoFactorStatus,
} from "./two-factor/requires-2fa";

const authenticatedNeedsVerification: TwoFactorStatus = {
  authenticated: true,
  enabled: true,
  required: true,
  confirmed_at: "2026-01-01T00:00:00.000Z",
  last_verified_at: "2026-01-01T00:00:00.000Z",
  session_verified: false,
  recovery_codes_remaining: 8,
  needs_enrollment: false,
  needs_verification: true,
};

assert.equal(sessionNeedsTwoFactorGate(authenticatedNeedsVerification), true);
assert.equal(
  twoFactorRedirectPath(authenticatedNeedsVerification, "/platform"),
  "/auth/two-factor/verify?next=%2Fplatform",
);

assert.equal(
  twoFactorRedirectPath(
    {
      ...authenticatedNeedsVerification,
      needs_enrollment: true,
      needs_verification: false,
      enabled: false,
    },
    "/platform",
  ),
  "/auth/two-factor/enroll?required=1&next=%2Fplatform",
);

assert.equal(
  twoFactorRedirectPath(authenticatedNeedsVerification, "/app/command-center"),
  "/verify-2fa?next=%2Fapp%2Fcommand-center",
);

const verified: TwoFactorStatus = {
  ...authenticatedNeedsVerification,
  session_verified: true,
  needs_verification: false,
};

assert.equal(sessionNeedsTwoFactorGate(verified), false);
assert.equal(twoFactorRedirectPath(verified, "/app/command-center"), null);

console.log("two-factor-session-gate-regression.test.ts: all assertions passed");
