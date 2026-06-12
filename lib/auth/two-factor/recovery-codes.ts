import { createHash, randomBytes } from "crypto";

const CODE_COUNT = 10;
const CODE_BYTES = 5;

export function generateRecoveryCodes(count = CODE_COUNT): string[] {
  return Array.from({ length: count }, () => formatRecoveryCode(randomBytes(CODE_BYTES)));
}

function formatRecoveryCode(bytes: Buffer): string {
  const hex = bytes.toString("hex").toUpperCase();
  return `${hex.slice(0, 5)}-${hex.slice(5, 10)}`;
}

export function hashRecoveryCode(code: string): string {
  const normalized = code.replace(/[\s-]+/g, "").toUpperCase();
  return createHash("sha256").update(normalized).digest("hex");
}

export function verifyRecoveryCode(code: string, hash: string): boolean {
  return hashRecoveryCode(code) === hash;
}
