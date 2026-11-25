/**
 * CSP partner bank payload encryption — FAIL-CLOSED, server-only.
 *
 * - AES-256-GCM via Node `crypto`.
 * - The key comes ONLY from env `AIPIFY_CSP_BANK_ENCRYPTION_KEY` (32 bytes, hex or base64).
 *   A missing, empty or malformed key returns `{ ok: false }` — nothing is ever encrypted with
 *   a fallback, derived or default key, and plaintext is never sent to Core instead.
 * - Plaintext and key material are never logged or returned in errors.
 * - Envelope format: `v<keyVersion>.<iv b64url>.<tag b64url>.<ciphertext b64url>`.
 * - `decryptBankPayload` is for admin-only server callers; never import into client code.
 */
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

export const CSP_BANK_ENCRYPTION_KEY_ENV = "AIPIFY_CSP_BANK_ENCRYPTION_KEY" as const;
export const CSP_BANK_ENCRYPTION_KEY_VERSION_ENV = "AIPIFY_CSP_BANK_ENCRYPTION_KEY_VERSION" as const;

export const CSP_BANK_CRYPTO_ERRORS = {
  keyMissing: "csp_bank_encryption_key_missing",
  keyInvalid: "csp_bank_encryption_key_invalid",
  plaintextRequired: "csp_bank_plaintext_required",
  payloadInvalid: "csp_bank_encrypted_payload_invalid",
  decryptFailed: "csp_bank_decrypt_failed",
} as const;

export type CspBankCryptoError = (typeof CSP_BANK_CRYPTO_ERRORS)[keyof typeof CSP_BANK_CRYPTO_ERRORS];

export type CspBankEncryptResult =
  | { ok: true; encrypted_payload: string; fingerprint: string; key_version: number }
  | { ok: false; error: CspBankCryptoError };

export type CspBankDecryptResult =
  | { ok: true; plaintext: string; key_version: number }
  | { ok: false; error: CspBankCryptoError };

/** Injectable env map — looser than ProcessEnv so unit tests need not supply NODE_ENV. */
export type CspBankCryptoEnv = NodeJS.Dict<string>;

type KeyResult =
  | { ok: true; key: Buffer; keyVersion: number }
  | { ok: false; error: CspBankCryptoError };

function resolveKeyVersion(env: CspBankCryptoEnv): number {
  const raw = (env[CSP_BANK_ENCRYPTION_KEY_VERSION_ENV] ?? "").trim();
  if (/^[0-9]{1,4}$/.test(raw)) return Math.max(Number(raw), 1);
  return 1;
}

/** Accepts exactly 32 bytes encoded as 64 hex chars or base64/base64url. Otherwise fail closed. */
function resolveKey(env: CspBankCryptoEnv): KeyResult {
  const raw = (env[CSP_BANK_ENCRYPTION_KEY_ENV] ?? "").trim();
  if (raw.length === 0) return { ok: false, error: CSP_BANK_CRYPTO_ERRORS.keyMissing };

  let key: Buffer | null = null;
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    key = Buffer.from(raw, "hex");
  } else if (/^[A-Za-z0-9+/_-]+={0,2}$/.test(raw)) {
    const decoded = Buffer.from(raw.replace(/-/g, "+").replace(/_/g, "/"), "base64");
    if (decoded.length === 32) key = decoded;
  }
  if (!key || key.length !== 32) return { ok: false, error: CSP_BANK_CRYPTO_ERRORS.keyInvalid };
  return { ok: true, key, keyVersion: resolveKeyVersion(env) };
}

const b64u = (b: Buffer) => b.toString("base64url");

/**
 * Encrypts a bank payload (e.g. JSON string of IBAN/account fields).
 * `env` is injectable for tests; production callers use the default `process.env`.
 */
export function encryptBankPayload(
  plaintext: string,
  env: CspBankCryptoEnv = process.env,
): CspBankEncryptResult {
  const k = resolveKey(env);
  if (!k.ok) return { ok: false, error: k.error };
  if (typeof plaintext !== "string" || plaintext.length === 0) {
    return { ok: false, error: CSP_BANK_CRYPTO_ERRORS.plaintextRequired };
  }
  try {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", k.key, iv);
    const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    const encrypted_payload = `v${k.keyVersion}.${b64u(iv)}.${b64u(tag)}.${b64u(ct)}`;
    // Keyed fingerprint: never a plain hash of bank data (which would be brute-forceable).
    const fingerprint = `hmac256:${createHmac("sha256", k.key).update(plaintext, "utf8").digest("hex").slice(0, 40)}`;
    return { ok: true, encrypted_payload, fingerprint, key_version: k.keyVersion };
  } catch {
    return { ok: false, error: CSP_BANK_CRYPTO_ERRORS.keyInvalid };
  }
}

/** Admin-only server callers. Fails closed without a valid key or on any tampering. */
export function decryptBankPayload(
  encryptedPayload: string,
  env: CspBankCryptoEnv = process.env,
): CspBankDecryptResult {
  const k = resolveKey(env);
  if (!k.ok) return { ok: false, error: k.error };
  if (typeof encryptedPayload !== "string") {
    return { ok: false, error: CSP_BANK_CRYPTO_ERRORS.payloadInvalid };
  }
  const parts = encryptedPayload.split(".");
  if (parts.length !== 4 || !/^v[0-9]{1,4}$/.test(parts[0])) {
    return { ok: false, error: CSP_BANK_CRYPTO_ERRORS.payloadInvalid };
  }
  try {
    const iv = Buffer.from(parts[1], "base64url");
    const tag = Buffer.from(parts[2], "base64url");
    const ct = Buffer.from(parts[3], "base64url");
    if (iv.length !== 12 || tag.length !== 16) {
      return { ok: false, error: CSP_BANK_CRYPTO_ERRORS.payloadInvalid };
    }
    const decipher = createDecipheriv("aes-256-gcm", k.key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
    return { ok: true, plaintext, key_version: Number(parts[0].slice(1)) };
  } catch {
    return { ok: false, error: CSP_BANK_CRYPTO_ERRORS.decryptFailed };
  }
}

/** True only when a usable key is configured (never reveals the key). */
export function isBankEncryptionConfigured(env: CspBankCryptoEnv = process.env): boolean {
  return resolveKey(env).ok;
}
