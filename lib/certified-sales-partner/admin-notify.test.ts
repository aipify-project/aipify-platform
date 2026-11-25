import assert from "node:assert/strict";
import test from "node:test";
import { resolveCspAdminNotifyEmails } from "./admin-notify";

test("resolveCspAdminNotifyEmails returns empty when unset", () => {
  assert.deepEqual(resolveCspAdminNotifyEmails(undefined), []);
  assert.deepEqual(resolveCspAdminNotifyEmails(""), []);
  assert.deepEqual(resolveCspAdminNotifyEmails("   "), []);
});

test("resolveCspAdminNotifyEmails parses comma/semicolon lists, dedupes, lowercases", () => {
  assert.deepEqual(resolveCspAdminNotifyEmails("Ops@Aipify.ai, ops@aipify.ai;review@example.com"), [
    "ops@aipify.ai",
    "review@example.com",
  ]);
});

test("resolveCspAdminNotifyEmails skips invalid tokens and caps at 20", () => {
  const many = Array.from({ length: 25 }, (_, i) => `a${i}@example.com`).join(",");
  const resolved = resolveCspAdminNotifyEmails(`not-an-email,${many}`);
  assert.equal(resolved.length, 20);
  assert.equal(resolved[0], "a0@example.com");
  assert.ok(!resolved.includes("not-an-email"));
});
