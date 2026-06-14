import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function deriveKey(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

function encryptionKey(): string | null {
  return process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY ?? process.env.TOTP_ENCRYPTION_KEY ?? null;
}

export function encryptPaymentCredential(plaintext: string): string {
  const keyMaterial = encryptionKey();
  if (!keyMaterial) {
    return Buffer.from(plaintext, "utf8").toString("base64");
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, deriveKey(keyMaterial), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptPaymentCredential(ciphertext: string): string {
  const keyMaterial = encryptionKey();
  if (!keyMaterial) {
    return Buffer.from(ciphertext, "base64").toString("utf8");
  }

  const data = Buffer.from(ciphertext, "base64");
  const iv = data.subarray(0, IV_LENGTH);
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = data.subarray(IV_LENGTH + 16);
  const decipher = createDecipheriv(ALGORITHM, deriveKey(keyMaterial), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export function maskSecretValue(value: string): string {
  if (!value) return "";
  if (value.length <= 8) return "•".repeat(value.length);
  const prefix = value.startsWith("sk_") || value.startsWith("pk_") ? value.slice(0, 7) : value.slice(0, 4);
  const suffix = value.slice(-4);
  return `${prefix}${"•".repeat(Math.max(8, value.length - prefix.length - 4))}${suffix}`;
}
