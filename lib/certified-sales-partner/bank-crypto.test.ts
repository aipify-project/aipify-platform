import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import {
  CSP_BANK_CRYPTO_ERRORS,
  decryptBankPayload,
  encryptBankPayload,
  isBankEncryptionConfigured,
} from "./bank-crypto";

const KEY_ENV = "AIPIFY_CSP_BANK_ENCRYPTION_KEY";
// Ephemeral, test-only key generated at runtime — not a real secret.
const ephemeral = (): NodeJS.ProcessEnv => ({ [KEY_ENV]: randomBytes(32).toString("hex") });
const PLAINTEXT = JSON.stringify({ iban: "NO9386011117947", account_holder: "Test Partner" });

test("missing key fails closed", () => {
  assert.deepEqual(encryptBankPayload(PLAINTEXT, {}), {
    ok: false,
    error: "csp_bank_encryption_key_missing",
  });
  assert.equal(isBankEncryptionConfigured({}), false);
});

test("empty / whitespace key fails closed", () => {
  assert.equal(encryptBankPayload(PLAINTEXT, { [KEY_ENV]: "" }).ok, false);
  const ws = encryptBankPayload(PLAINTEXT, { [KEY_ENV]: "   " });
  assert.deepEqual(ws, { ok: false, error: CSP_BANK_CRYPTO_ERRORS.keyMissing });
});

test("malformed or short key fails closed (no key derivation fallback)", () => {
  const r = encryptBankPayload(PLAINTEXT, { [KEY_ENV]: "too-short" });
  assert.deepEqual(r, { ok: false, error: CSP_BANK_CRYPTO_ERRORS.keyInvalid });
});

test("decrypt fails closed without key", () => {
  assert.deepEqual(decryptBankPayload("v1.a.b.c", {}), {
    ok: false,
    error: CSP_BANK_CRYPTO_ERRORS.keyMissing,
  });
});

test("round trip with ephemeral key; ciphertext carries no plaintext", () => {
  const env = ephemeral();
  const enc = encryptBankPayload(PLAINTEXT, env);
  assert.ok(enc.ok);
  if (!enc.ok) return;
  assert.equal(enc.key_version, 1);
  assert.match(enc.fingerprint, /^[A-Za-z0-9:_-]{16,128}$/);
  assert.ok(!enc.encrypted_payload.includes("NO9386011117947"));
  assert.ok(!enc.fingerprint.includes("NO9386011117947"));
  const dec = decryptBankPayload(enc.encrypted_payload, env);
  assert.deepEqual(dec, { ok: true, plaintext: PLAINTEXT, key_version: 1 });
});

test("random IV: same plaintext yields different ciphertext, same keyed fingerprint", () => {
  const env = ephemeral();
  const a = encryptBankPayload(PLAINTEXT, env);
  const b = encryptBankPayload(PLAINTEXT, env);
  assert.ok(a.ok && b.ok);
  if (!a.ok || !b.ok) return;
  assert.notEqual(a.encrypted_payload, b.encrypted_payload);
  assert.equal(a.fingerprint, b.fingerprint);
});

test("tampered ciphertext and wrong key fail closed", () => {
  const env = ephemeral();
  const enc = encryptBankPayload(PLAINTEXT, env);
  assert.ok(enc.ok);
  if (!enc.ok) return;
  const parts = enc.encrypted_payload.split(".");
  parts[3] = Buffer.from("tampered-bytes").toString("base64url");
  assert.equal(decryptBankPayload(parts.join("."), env).ok, false);
  assert.deepEqual(decryptBankPayload(enc.encrypted_payload, ephemeral()), {
    ok: false,
    error: CSP_BANK_CRYPTO_ERRORS.decryptFailed,
  });
  assert.deepEqual(decryptBankPayload("not-an-envelope", env), {
    ok: false,
    error: CSP_BANK_CRYPTO_ERRORS.payloadInvalid,
  });
});

test("key version is read from env and empty plaintext is rejected", () => {
  const env = { ...ephemeral(), AIPIFY_CSP_BANK_ENCRYPTION_KEY_VERSION: "3" };
  const enc = encryptBankPayload(PLAINTEXT, env);
  assert.ok(enc.ok);
  if (enc.ok) assert.ok(enc.encrypted_payload.startsWith("v3."));
  assert.deepEqual(encryptBankPayload("", env), { ok: false, error: CSP_BANK_CRYPTO_ERRORS.plaintextRequired });
});
