import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { LOCALES } from "@/lib/i18n/config";
import {
  isForgotPasswordPublicErrorCode,
  isForgotPasswordUnknownAccountMessage,
  mapForgotPasswordProviderError,
  normalizeForgotPasswordEmail,
} from "./forgot-password";

assert.equal(normalizeForgotPasswordEmail("  Support@Aipify.AI "), "support@aipify.ai");
assert.equal(normalizeForgotPasswordEmail(""), null);
assert.equal(normalizeForgotPasswordEmail(null), null);

assert.equal(
  mapForgotPasswordProviderError("Error sending recovery email."),
  "delivery_failed",
);
assert.equal(
  mapForgotPasswordProviderError("email rate limit exceeded"),
  "rate_limited",
);
assert.equal(
  mapForgotPasswordProviderError("over_email_send_rate_limit"),
  "rate_limited",
);
assert.equal(mapForgotPasswordProviderError("SMTP connection failed"), "delivery_failed");
assert.equal(mapForgotPasswordProviderError("User not found"), "generic");

assert.equal(isForgotPasswordUnknownAccountMessage("User not found"), true);
assert.equal(
  isForgotPasswordUnknownAccountMessage("Error sending recovery email."),
  false,
);

assert.equal(isForgotPasswordPublicErrorCode("delivery_failed"), true);
assert.equal(isForgotPasswordPublicErrorCode("Error sending recovery email."), false);

const route = readFileSync("app/api/auth/forgot-password/route.ts", "utf8");
assert.match(route, /mapForgotPasswordProviderError/);
assert.match(route, /isForgotPasswordUnknownAccountMessage/);
assert.doesNotMatch(route, /error:\s*error\.message/);

const form = readFileSync("components/auth/ForgotPasswordForm.tsx", "utf8");
assert.match(form, /isForgotPasswordPublicErrorCode/);
assert.match(form, /deliveryFailed/);
assert.doesNotMatch(form, /payload\.error\s*\?\?\s*labels\.generic/);

for (const locale of LOCALES) {
  const auth = JSON.parse(readFileSync(`locales/${locale}/auth.json`, "utf8"));
  const errors = auth.forgotPassword?.errors;
  assert.ok(errors, `missing forgotPassword.errors in ${locale}`);
  for (const key of ["deliveryFailed", "rateLimited", "requestFailed"]) {
    assert.equal(typeof errors[key], "string", `${locale}.${key}`);
    assert.ok(errors[key].length > 0, `${locale}.${key} empty`);
    assert.doesNotMatch(errors[key], /Supabase/i);
    assert.doesNotMatch(errors[key], /Error sending recovery email/i);
  }
  assert.equal(typeof auth.forgotPassword.success, "string");
}

const frozen = JSON.parse(
  readFileSync(
    "docs/integrations/website-kompis-public-chain-frozen-manifest.json",
    "utf8",
  ),
);
let ok = 0;
for (const row of frozen.protectedRuntimeFiles) {
  const h = createHash("sha256").update(readFileSync(row.path)).digest("hex");
  if (h === row.sha256) ok += 1;
}
assert.equal(ok, frozen.protectedRuntimeFiles.length);

console.log("forgot-password.test.ts: all assertions passed");
