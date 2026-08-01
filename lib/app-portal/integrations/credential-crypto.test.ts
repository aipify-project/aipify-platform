import assert from "node:assert/strict";
import {
  decryptIntegrationPortalCredential,
  encryptIntegrationPortalCredential,
  isRotationRequiredErrorCode,
} from "./credential-crypto";

const PREV_INTEGRATION = process.env.INTEGRATION_CREDENTIAL_ENCRYPTION_KEY;
const PREV_PAYMENT = process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY;
const PREV_TOTP = process.env.TOTP_ENCRYPTION_KEY;
const PREV_PAYMENT_PREV = process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY_PREVIOUS;

function restoreEnv() {
  for (const [key, value] of [
    ["INTEGRATION_CREDENTIAL_ENCRYPTION_KEY", PREV_INTEGRATION],
    ["PAYMENT_CREDENTIAL_ENCRYPTION_KEY", PREV_PAYMENT],
    ["TOTP_ENCRYPTION_KEY", PREV_TOTP],
    ["PAYMENT_CREDENTIAL_ENCRYPTION_KEY_PREVIOUS", PREV_PAYMENT_PREV],
  ] as const) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

try {
  delete process.env.INTEGRATION_CREDENTIAL_ENCRYPTION_KEY;
  delete process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY_PREVIOUS;
  process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY = "test-payment-key-v1-secret-stream";
  process.env.TOTP_ENCRYPTION_KEY = "test-totp-key-should-not-be-primary";

  const sealed = encryptIntegrationPortalCredential("readonly-bearer-token-value");
  assert.equal(sealed.envelopeVersion, 1);
  assert.notEqual(sealed.ciphertext, "readonly-bearer-token-value");
  assert.ok(sealed.keyFingerprint.length >= 8);

  const opened = decryptIntegrationPortalCredential(sealed.ciphertext);
  assert.equal(opened.ok, true);
  if (opened.ok) {
    assert.equal(opened.plaintext, "readonly-bearer-token-value");
  }

  // Previous key can still decrypt after primary rotates.
  process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY_PREVIOUS = process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY;
  process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY = "test-payment-key-v2-rotated";
  delete process.env.INTEGRATION_CREDENTIAL_ENCRYPTION_KEY;

  const openedAfterRotate = decryptIntegrationPortalCredential(sealed.ciphertext);
  assert.equal(openedAfterRotate.ok, true);

  const missing = decryptIntegrationPortalCredential("");
  assert.equal(missing.ok, false);
  if (!missing.ok) assert.equal(missing.code, "SECRET_CIPHERTEXT_MISSING");

  const wrongKey = decryptIntegrationPortalCredential(sealed.ciphertext);
  // still ok via previous
  assert.equal(wrongKey.ok, true);

  delete process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY_PREVIOUS;
  process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY = "unrelated-key-material-zzzz";
  const failed = decryptIntegrationPortalCredential(sealed.ciphertext);
  assert.equal(failed.ok, false);
  if (!failed.ok) assert.equal(failed.code, "SECRET_DECRYPTION_FAILED");

  assert.equal(isRotationRequiredErrorCode("SECRET_DECRYPTION_FAILED"), true);
  assert.equal(isRotationRequiredErrorCode("rotation_required"), true);
  assert.equal(isRotationRequiredErrorCode("Credential decrypt failed"), true);
  assert.equal(isRotationRequiredErrorCode("organization_mismatch"), false);

  console.log("credential-crypto.test.ts: all assertions passed");
} finally {
  restoreEnv();
}
