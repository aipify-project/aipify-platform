import assert from "node:assert/strict";
import test from "node:test";
import { firstValidTouchWins, isBotLikeUserAgent, isSelfReferral, normalizeChannel } from "./attribution-policy";
import { maskIban, validateBankProfile } from "./bank-profile";
import { callCspRpc } from "./core-rpc";
import { partnerCannotEditTemplateBody, renderLockedTemplate } from "./locked-email";
import { validateCspRegistration } from "./registration";

test("maskIban shows last 4 only", () => {
  assert.equal(maskIban("GB82 WEST 1234 5698 7654 32"), "******************5432");
  assert.equal(maskIban("1234"), "****");
  assert.equal(maskIban(""), "");
  assert.ok(!maskIban("GB82WEST12345698765432").includes("WEST"));
});

test("bank profile is country-aware", () => {
  const base = { accountHolder: "Example Ltd", currency: "EUR" };
  assert.equal(validateBankProfile({ ...base, country: "DE" }).ok, false);
  assert.equal(validateBankProfile({ ...base, country: "GB", iban: "GB82WEST12345698765432" }).ok, true);
  assert.equal(validateBankProfile({ ...base, country: "GB", iban: "GB82WEST12345698765433" }).ok, false);
  assert.equal(
    validateBankProfile({ ...base, currency: "USD", country: "US", localRoutingCode: "021000021", localAccountNumber: "123456789" }).ok,
    true,
  );
  assert.equal(validateBankProfile({ ...base, currency: "USD", country: "US", localAccountNumber: "123456789" }).ok, false);
  assert.equal(
    validateBankProfile({ ...base, currency: "AUD", country: "AU", localAccountNumber: "12345678", swiftBic: "DEUTDEFF" }).ok,
    true,
  );
});

const reg = {
  fullName: "Ada Example",
  email: "Ada@Partner.Example",
  country: "se",
  legalBusinessName: "Example AB",
  businessRegistrationNumber: "556016-0680",
  registeredBusinessConfirmed: true,
  termsAccepted: true,
  certificationUnderstood: true,
  infoAccurateConfirmed: true,
};

test("registration accepts non-Norwegian company and normalizes", () => {
  const r = validateCspRegistration(reg);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.payload.country, "SE");
    assert.equal(r.payload.email, "ada@partner.example");
  }
});

test("registration rejects missing fields/confirmations", () => {
  assert.equal(validateCspRegistration({ ...reg, country: "NOR" }).ok, false);
  assert.equal(validateCspRegistration({ ...reg, businessRegistrationNumber: " " }).ok, false);
  assert.equal(validateCspRegistration({ ...reg, email: "nope" }).ok, false);
  for (const k of ["registeredBusinessConfirmed", "termsAccepted", "certificationUnderstood", "infoAccurateConfirmed"]) {
    assert.equal(validateCspRegistration({ ...reg, [k]: false }).ok, false, k);
  }
});

test("attribution helpers", () => {
  assert.equal(normalizeChannel("Twitter"), "x");
  assert.equal(normalizeChannel("Facebook"), "facebook");
  assert.equal(normalizeChannel("weird"), "other");
  assert.equal(isSelfReferral({ partnerAuthUserId: "u1", customerAuthUserId: "u1" }), true);
  assert.equal(isSelfReferral({ partnerAuthUserId: null, customerAuthUserId: null }), false);
  assert.equal(
    firstValidTouchWins({ existingFirstTouchAt: "2026-01-01T00:00:00Z", newTouchAt: "2026-02-01T00:00:00Z" }).winner,
    "existing",
  );
  assert.equal(
    firstValidTouchWins({ existingFirstTouchAt: "2026-01-01T00:00:00Z", newTouchAt: "2026-06-01T00:00:00Z" }).winner,
    "new",
  );
  assert.equal(firstValidTouchWins({ existingFirstTouchAt: null, newTouchAt: "2026-06-01T00:00:00Z" }).winner, "new");
  assert.equal(isBotLikeUserAgent("Googlebot/2.1"), true);
  assert.equal(isBotLikeUserAgent("Mozilla/5.0 (Macintosh) AppleWebKit/605 Safari/605"), false);
});

test("locked template escapes and rejects scripts", () => {
  assert.equal(partnerCannotEditTemplateBody(), true);
  const body = "<p>Hi {{partnerName}}, see {{productName}}: {{trackingUrl}}</p>";
  const r = renderLockedTemplate({
    htmlBody: body,
    fields: { partnerName: "A <b>&</b>", productName: "P", trackingUrl: "https://x.example/?a=1&b=2" },
  });
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.ok(r.html.includes("A &lt;b&gt;&amp;&lt;/b&gt;"));
    assert.ok(r.html.includes("a=1&amp;b=2"));
  }
  assert.equal(renderLockedTemplate({ htmlBody: body, fields: { partnerName: "<script>x</script>", productName: "P", trackingUrl: "https://a.example" } }).ok, false);
  assert.equal(renderLockedTemplate({ htmlBody: body, fields: { partnerName: "A", productName: "P", trackingUrl: "javascript:alert(1)" } }).ok, false);
  assert.equal(renderLockedTemplate({ htmlBody: "{{evil}}", fields: {} }).ok, false);
});

test("callCspRpc fails closed", async () => {
  const mk = (res: unknown) => ({ rpc: async () => res }) as never;
  assert.deepEqual(await callCspRpc(mk({ data: { ok: 1 }, error: null }), "x"), { ready: true, data: { ok: 1 } });
  assert.equal((await callCspRpc(mk({ data: null, error: { code: "PGRST202", message: "nope" } }), "x") as { error: string }).error, "rpc_missing");
  assert.equal((await callCspRpc(mk({ data: null, error: { message: 'function public.x() does not exist' } }), "x") as { error: string }).error, "rpc_missing");
  assert.equal((await callCspRpc(mk({ data: null, error: { message: "csp_backend_not_applied" } }), "x") as { error: string }).error, "csp_backend_not_applied");
  assert.equal((await callCspRpc(mk({ data: { error: "csp_backend_not_applied" }, error: null }), "x") as { error: string }).error, "csp_backend_not_applied");
  assert.equal((await callCspRpc(mk({ data: null, error: { message: "boom" } }), "x") as { error: string }).error, "rpc_error");
  const thrower = { rpc: async () => { throw new Error("network"); } } as never;
  assert.equal(((await callCspRpc(thrower, "x")) as { ready: boolean }).ready, false);
});
