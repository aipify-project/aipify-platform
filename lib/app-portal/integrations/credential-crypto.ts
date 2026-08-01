/**
 * Authoritative APP Portal integration credential crypto.
 * Server-only. Never log plaintext. Supports multi-key decrypt for rotation.
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const ENVELOPE_VERSION = 1;

export type IntegrationCredentialDecryptErrorCode =
  | "SECRET_KEY_VERSION_MISSING"
  | "SECRET_CIPHERTEXT_MISSING"
  | "SECRET_DECRYPTION_FAILED";

export type IntegrationCredentialDecryptResult =
  | { ok: true; plaintext: string; keyFingerprint: string }
  | { ok: false; code: IntegrationCredentialDecryptErrorCode };

function deriveKey(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

export function fingerprintEncryptionKey(secret: string): string {
  return createHash("sha256").update(`aipify-int-cred-fp:${secret}`).digest("hex").slice(0, 16);
}

/** Ordered key candidates: current integration → payment → legacy TOTP → previous variants. */
export function listIntegrationEncryptionKeys(): Array<{ material: string; fingerprint: string }> {
  const names = [
    "INTEGRATION_CREDENTIAL_ENCRYPTION_KEY",
    "PAYMENT_CREDENTIAL_ENCRYPTION_KEY",
    "TOTP_ENCRYPTION_KEY",
    "INTEGRATION_CREDENTIAL_ENCRYPTION_KEY_PREVIOUS",
    "PAYMENT_CREDENTIAL_ENCRYPTION_KEY_PREVIOUS",
    "TOTP_ENCRYPTION_KEY_PREVIOUS",
  ];
  const seen = new Set<string>();
  const keys: Array<{ material: string; fingerprint: string }> = [];
  for (const name of names) {
    const material = process.env[name]?.trim();
    if (!material) continue;
    const fingerprint = fingerprintEncryptionKey(material);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    keys.push({ material, fingerprint });
  }
  return keys;
}

function encryptWithKey(plaintext: string, keyMaterial: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, deriveKey(keyMaterial), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

function tryDecryptWithKey(ciphertext: string, keyMaterial: string): string | null {
  try {
    const data = Buffer.from(ciphertext, "base64");
    if (data.length < IV_LENGTH + 16 + 1) return null;
    const iv = data.subarray(0, IV_LENGTH);
    const tag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
    const encrypted = data.subarray(IV_LENGTH + 16);
    const decipher = createDecipheriv(ALGORITHM, deriveKey(keyMaterial), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export function encryptIntegrationPortalCredential(plaintext: string): {
  ciphertext: string;
  keyFingerprint: string;
  envelopeVersion: number;
} {
  const keys = listIntegrationEncryptionKeys();
  if (keys.length === 0) {
    // Controlled fallback when no key configured — still not returned to clients.
    const ciphertext = Buffer.from(plaintext, "utf8").toString("base64");
    return { ciphertext, keyFingerprint: "unkeyed", envelopeVersion: ENVELOPE_VERSION };
  }
  const primary = keys[0]!;
  return {
    ciphertext: encryptWithKey(plaintext, primary.material),
    keyFingerprint: primary.fingerprint,
    envelopeVersion: ENVELOPE_VERSION,
  };
}

export function decryptIntegrationPortalCredential(
  ciphertext: string | null | undefined,
): IntegrationCredentialDecryptResult {
  const value = String(ciphertext ?? "").trim();
  if (!value) {
    return { ok: false, code: "SECRET_CIPHERTEXT_MISSING" };
  }

  const keys = listIntegrationEncryptionKeys();
  if (keys.length === 0) {
    try {
      const plaintext = Buffer.from(value, "base64").toString("utf8");
      if (!plaintext) return { ok: false, code: "SECRET_KEY_VERSION_MISSING" };
      return { ok: true, plaintext, keyFingerprint: "unkeyed" };
    } catch {
      return { ok: false, code: "SECRET_KEY_VERSION_MISSING" };
    }
  }

  for (const key of keys) {
    const plaintext = tryDecryptWithKey(value, key.material);
    if (plaintext != null && plaintext.length > 0) {
      return { ok: true, plaintext, keyFingerprint: key.fingerprint };
    }
  }

  return { ok: false, code: "SECRET_DECRYPTION_FAILED" };
}

export function isRotationRequiredErrorCode(code: string | null | undefined): boolean {
  const key = String(code ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return (
    key === "secret_decryption_failed" ||
    key === "rotation_required" ||
    key === "credential_unavailable" ||
    key === "secret_key_version_missing" ||
    key === "secret_ciphertext_missing" ||
    key.includes("credentialunavailable") ||
    key.includes("decrypt")
  );
}
