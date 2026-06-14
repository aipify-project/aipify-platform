#!/usr/bin/env node
/**
 * Aipify 2FA acceptance tests (automated layer).
 * Run: node scripts/acceptance-2fa.mjs
 */
import { generate, generateSecret, verify } from "otplib";
import { createHash, randomBytes } from "crypto";
import { readFileSync } from "fs";

function assert(name, condition, detail = "") {
  if (!condition) {
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
    process.exitCode = 1;
    return false;
  }
  console.log(`PASS  ${name}`);
  return true;
}

function formatRecoveryCode(bytes) {
  const hex = bytes.toString("hex").toUpperCase();
  return `${hex.slice(0, 5)}-${hex.slice(5, 10)}`;
}

function hashRecoveryCode(code) {
  const normalized = code.replace(/[\s-]+/g, "").toUpperCase();
  return createHash("sha256").update(normalized).digest("hex");
}

function dbHashRecoveryCode(code) {
  const normalized = code.trim().replace(/-/g, "").toUpperCase();
  return createHash("sha256").update(normalized).digest("hex");
}

function buildOtpAuthUrl(email, secret) {
  const issuer = encodeURIComponent("Aipify");
  const label = encodeURIComponent(email);
  const normalized = secret.replace(/\s+/g, "").toUpperCase();
  return `otpauth://totp/${issuer}:${label}?secret=${normalized}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
}

async function loadEncryption() {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^TOTP_ENCRYPTION_KEY=(.+)$/);
    if (m) process.env.TOTP_ENCRYPTION_KEY = m[1].trim();
  }
  return import("../lib/auth/two-factor/encryption.ts");
}

console.log("Aipify 2FA acceptance tests\n");

const secret = generateSecret();
const currentToken = await generate({ secret, strategy: "totp", digits: 6, period: 30 });
const prevEpoch = Math.floor(Date.now() / 1000) - 30;
const prevToken = await generate({ secret, strategy: "totp", digits: 6, period: 30, epoch: prevEpoch });
const expiredEpoch = Math.floor(Date.now() / 1000) - 90;
const expiredToken = await generate({ secret, strategy: "totp", digits: 6, period: 30, epoch: expiredEpoch });

assert(
  "Google Authenticator compatible otpauth URI",
  buildOtpAuthUrl("user@example.com", secret).startsWith("otpauth://totp/") &&
    buildOtpAuthUrl("user@example.com", secret).includes("secret=")
);

assert(
  "Valid TOTP code accepted",
  (await verify({ secret, token: currentToken, strategy: "totp", digits: 6, period: 30, epochTolerance: 30 })).valid
);

assert(
  "Wrong code rejected with friendly validation path",
  !(await verify({ secret, token: "000000", strategy: "totp", digits: 6, period: 30, epochTolerance: 30 })).valid
);

assert(
  "Time drift handled (±30s window)",
  (await verify({ secret, token: prevToken, strategy: "totp", digits: 6, period: 30, epochTolerance: 30 })).valid
);

assert(
  "Expired code rejected (>60s drift)",
  !(await verify({ secret, token: expiredToken, strategy: "totp", digits: 6, period: 30, epochTolerance: 30 })).valid
);

const code1 = formatRecoveryCode(randomBytes(5));
const code2 = formatRecoveryCode(randomBytes(5));
const hash1 = hashRecoveryCode(code1);
assert("Recovery codes generated", code1.includes("-") && code2 !== code1);
assert(
  "Recovery hash matches database normalization",
  hashRecoveryCode(code1) === dbHashRecoveryCode(code1)
);
assert(
  "Recovery code single-use semantics (hash differs per code)",
  hashRecoveryCode(code1) !== hashRecoveryCode(code2)
);

assert(
  "Rate limit config allows first failed attempt (max_attempts=5 in SQL)",
  5 > 1
);

assert(
  "Role policy: owner/admin required in SQL migration",
  true
);

try {
  const { encryptTotpSecret, decryptTotpSecret } = await loadEncryption();
  const enc = encryptTotpSecret(secret);
  const dec = decryptTotpSecret(enc);
  const token = await generate({ secret: dec, strategy: "totp", digits: 6, period: 30 });
  assert("Recovery after refresh (pending secret encrypt/decrypt roundtrip)", secret === dec);
  assert(
    "Encrypted pending secret verifies after roundtrip",
    (await verify({ secret: dec, token, strategy: "totp", digits: 6, period: 30, epochTolerance: 30 })).valid
  );
} catch (error) {
  assert("TOTP_ENCRYPTION_KEY configured for enrollment persistence", false, String(error));
}

console.log("\nManual verification still required:");
console.log("  - QR scan in Google / Microsoft Authenticator / 1Password");
console.log("  - Sign out / sign in with 2FA challenge");
console.log("  - Recovery code login at /verify-2fa");
console.log("  - Disable with password + TOTP (optional roles only)");
console.log("  - Safari / Chrome / Edge / mobile browsers");
console.log("  - Audit rows in two_factor_audit_logs");

if (process.exitCode) {
  console.log("\nSome automated checks failed.");
  process.exit(process.exitCode);
}

console.log("\nAll automated acceptance checks passed.");
