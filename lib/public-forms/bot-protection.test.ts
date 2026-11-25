import assert from "node:assert/strict";
import test from "node:test";
import { createVerificationChallenge } from "./human-verification";
import {
  assertPublicFormSubmission,
  PUBLIC_FORM_GUARD_CODE_BY_LOG,
  resolvePublicFormGuardCode,
  type PublicFormGuardResult,
} from "./bot-protection";

let ipCounter = 0;
function request(ip = `192.0.2.${(ipCounter += 1)}`) {
  return new Request("https://example.com/api/form", { method: "POST", headers: { "x-forwarded-for": ip } });
}

function validBody(email: string) {
  const challenge = createVerificationChallenge();
  const encoded = challenge.token.split(".")[0]!;
  const correct = Number(Buffer.from(encoded, "base64url").toString("utf8").split(":")[1]);
  return {
    email,
    _form_started_at: Date.now() - 10_000,
    _verification_token: challenge.token,
    _verification_answer: correct,
  };
}

function failure(result: PublicFormGuardResult) {
  assert.equal(result.ok, false);
  return result as Extract<PublicFormGuardResult, { ok: false }>;
}

test("a complete submission passes the guard", () => {
  assert.deepEqual(assertPublicFormSubmission(request(), validBody("ok@example.com"), "t-ok"), { ok: true });
});

test("honeypot → submission_blocked (human error string kept)", () => {
  const r = failure(assertPublicFormSubmission(request(), { ...validBody("a@example.com"), _honeypot: "bot" }, "t-hp"));
  assert.equal(r.code, "submission_blocked");
  assert.equal(r.log, "honeypot");
  assert.equal(r.status, 400);
  assert.equal(r.error, "Submission blocked");
});

test("rate limit → rate_limited", () => {
  const ip = "198.51.100.77";
  let last: PublicFormGuardResult = { ok: true };
  for (let i = 0; i < 9; i += 1) {
    last = assertPublicFormSubmission(request(ip), validBody(`rl${i}@example.com`), "t-rl");
  }
  const r = failure(last);
  assert.equal(r.code, "rate_limited");
  assert.equal(r.status, 429);
  assert.ok(r.error.length > 0);
});

test("filling the form too fast → form_too_fast", () => {
  const r = failure(
    assertPublicFormSubmission(request(), { ...validBody("fast@example.com"), _form_started_at: Date.now() }, "t-fast"),
  );
  assert.equal(r.code, "form_too_fast");
  assert.equal(r.log, "timing");
});

test("missing or wrong verification → verification_required (the CSP production failure)", () => {
  const noToken = failure(
    assertPublicFormSubmission(request(), { email: "v@example.com", _form_started_at: Date.now() - 10_000 }, "t-ver"),
  );
  assert.equal(noToken.code, "verification_required");
  assert.equal(noToken.status, 400);
  assert.match(noToken.error, /^Verification required/);

  const body = validBody("v2@example.com");
  const wrong = failure(
    assertPublicFormSubmission(request(), { ...body, _verification_answer: (body._verification_answer + 1) % 4 }, "t-ver"),
  );
  assert.equal(wrong.code, "verification_required");
});

test("recent duplicate → duplicate_recent", () => {
  assert.equal(assertPublicFormSubmission(request(), validBody("dup@example.com"), "t-dup").ok, true);
  const r = failure(assertPublicFormSubmission(request(), validBody("DUP@example.com"), "t-dup"));
  assert.equal(r.code, "duplicate_recent");
  assert.equal(r.status, 429);
});

test("log reason → code mapping covers every guard failure and resolves a missing code", () => {
  assert.deepEqual(PUBLIC_FORM_GUARD_CODE_BY_LOG, {
    honeypot: "submission_blocked",
    rate_limit: "rate_limited",
    timing: "form_too_fast",
    verification: "verification_required",
    duplicate: "duplicate_recent",
  });
  assert.equal(resolvePublicFormGuardCode({ ok: false, error: "x", status: 400, log: "timing" }), "form_too_fast");
  assert.equal(resolvePublicFormGuardCode({ ok: false, error: "x", status: 400, code: "rate_limited" }), "rate_limited");
  assert.equal(resolvePublicFormGuardCode({ ok: false, error: "x", status: 400 }), null);
});
