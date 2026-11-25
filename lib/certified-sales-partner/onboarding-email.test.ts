import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";
import {
  checkCspOnboardingEmailRateLimit,
  CSP_ONBOARDING_EMAIL_FROM,
  CSP_PARTNER_LOGIN_URL,
  CSP_VERIFY_EMAIL_PAGE_URL,
  isCspOnboardingEmailConfigured,
  renderCspOnboardingEmail,
  resetCspOnboardingEmailRateLimit,
  sendCspOnboardingEmail,
} from "./onboarding-email";
import {
  CSP_ONBOARDING_EMAIL_COPY,
  CSP_ONBOARDING_EMAIL_KINDS,
  CSP_ONBOARDING_EMAIL_LOCALES,
  resolveCspOnboardingEmailLocale,
} from "./onboarding-email-copy";

const realFetch = globalThis.fetch;
const realKey = process.env.RESEND_API_KEY;

beforeEach(() => {
  resetCspOnboardingEmailRateLimit();
});

afterEach(() => {
  globalThis.fetch = realFetch;
  if (realKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = realKey;
});

const message = { to: "partner@customer.example", subject: "S", html: "<p>h</p>", text: "t" };

test("configured flag follows RESEND_API_KEY (trimmed)", () => {
  delete process.env.RESEND_API_KEY;
  assert.equal(isCspOnboardingEmailConfigured(), false);
  process.env.RESEND_API_KEY = "   ";
  assert.equal(isCspOnboardingEmailConfigured(), false);
  process.env.RESEND_API_KEY = "re_test_key_123456";
  assert.equal(isCspOnboardingEmailConfigured(), true);
});

test("no API key → not_configured, never sent, no network call", async () => {
  delete process.env.RESEND_API_KEY;
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response("{}");
  }) as typeof fetch;
  assert.deepEqual(await sendCspOnboardingEmail(message), { status: "not_configured" });
  assert.equal(called, false);
});

test("Resend 200 → accepted with providerId, correct from/headers", async () => {
  process.env.RESEND_API_KEY = "re_test_key_123456";
  let captured: { url: string; init: RequestInit } | null = null;
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    captured = { url, init };
    return new Response(JSON.stringify({ id: "msg_1" }), { status: 200 });
  }) as unknown as typeof fetch;
  const result = await sendCspOnboardingEmail({ ...message, idempotencyKey: "idem-1" });
  assert.deepEqual(result, { status: "accepted", providerId: "msg_1" });
  assert.ok(captured);
  const req = captured as { url: string; init: RequestInit };
  assert.equal(req.url, "https://api.resend.com/emails");
  const headers = req.init.headers as Record<string, string>;
  assert.equal(headers["Idempotency-Key"], "idem-1");
  const body = JSON.parse(String(req.init.body)) as { from: string; to: string[] };
  assert.equal(body.from, CSP_ONBOARDING_EMAIL_FROM);
  assert.equal(body.from, "Aipify Group AS <partners@aipify.ai>");
  assert.deepEqual(body.to, ["partner@customer.example"]);
});

test("Resend non-OK → failed, error truncated and key redacted", async () => {
  process.env.RESEND_API_KEY = "re_test_key_123456";
  globalThis.fetch = (async () =>
    new Response(`bad key re_test_key_123456 ${"x".repeat(1000)}`, { status: 401 })) as unknown as typeof fetch;
  const result = await sendCspOnboardingEmail(message);
  assert.equal(result.status, "failed");
  assert.ok(result.status === "failed");
  assert.ok(result.error.length <= 301);
  assert.ok(!result.error.includes("re_test_key_123456"));
});

test("network error → failed without throwing", async () => {
  process.env.RESEND_API_KEY = "re_test_key_123456";
  globalThis.fetch = (async () => {
    throw new Error("boom re_test_key_123456");
  }) as unknown as typeof fetch;
  const result = await sendCspOnboardingEmail(message);
  assert.ok(result.status === "failed");
  assert.ok(!result.error.includes("re_test_key_123456"));
});

test("every kind renders in every locale with no unreplaced placeholders", () => {
  for (const locale of CSP_ONBOARDING_EMAIL_LOCALES) {
    for (const kind of CSP_ONBOARDING_EMAIL_KINDS) {
      const out = renderCspOnboardingEmail(kind, locale, { name: "Kari" });
      assert.ok(out.subject.length > 0, `${locale}/${kind} subject`);
      assert.ok(out.html.includes(out.subject.replaceAll("'", "&#39;")), `${locale}/${kind} html heading`);
      assert.ok(out.text.length > 0);
      assert.ok(!/\{name\}/.test(out.html + out.text));
    }
  }
});

test("Norwegian baseline wording", () => {
  const received = renderCspOnboardingEmail("application_received", "no", { name: "Kari" });
  assert.equal(received.subject, "Søknaden din er mottatt");
  assert.match(received.text, /Takk for interessen for å bli Certified Aipify Sales Partner\./);
  assert.match(
    received.text,
    /Vi har mottatt søknaden din og vil gjennomgå opplysningene\. Du får en e-post med informasjon om neste steg\./,
  );
  assert.match(received.text, /Hei Kari,/);
  assert.match(received.text, /Status: Til vurdering/);
  assert.match(renderCspOnboardingEmail("email_verified", "no").text, /Status: Verifisert/);
  assert.match(
    renderCspOnboardingEmail("email_verified", "no").text,
    /Søknaden din er under behandling\. Vi gir deg beskjed på e-post når vi har en oppdatering\./,
  );
  assert.equal(
    CSP_ONBOARDING_EMAIL_COPY.no.unverifiedAddon,
    "Bekreft e-postadressen din via lenken vi har sendt deg. Finner du ikke e-posten, kontroller søppelpost eller be om en ny lenke.",
  );
  assert.match(renderCspOnboardingEmail("approved", "no").text, /Status: Godkjent/);
});

test("unverified add-on only when emailVerified is false and kind allows it", () => {
  const addon = CSP_ONBOARDING_EMAIL_COPY.no.unverifiedAddon;
  assert.ok(renderCspOnboardingEmail("application_received", "no", { emailVerified: false }).text.includes(addon));
  assert.ok(!renderCspOnboardingEmail("application_received", "no", { emailVerified: true }).text.includes(addon));
  assert.ok(!renderCspOnboardingEmail("application_received", "no", {}).text.includes(addon));
  assert.ok(!renderCspOnboardingEmail("rejected", "no", { emailVerified: false }).text.includes(addon));
});

test("CTAs point to canonical https login / verify pages with no PII in the URL", () => {
  const approved = renderCspOnboardingEmail("approved", "en", { name: "A B", emailVerified: true });
  assert.ok(approved.html.includes(`href="${CSP_PARTNER_LOGIN_URL}"`));
  const nudge = renderCspOnboardingEmail("verify_email_nudge", "en", { name: "A B" });
  assert.ok(nudge.html.includes(`href="${CSP_VERIFY_EMAIL_PAGE_URL}"`));
  for (const url of (approved.html + nudge.html).match(/https?:\/\/[^"\s<]+/g) ?? []) {
    assert.ok(url.startsWith("https://"));
    assert.ok(!/@|%40|A%20B/.test(url));
  }
});

test("html-escapes name and reason; reason only on needs_information", () => {
  const nasty = '<script>alert("x")</script>';
  const out = renderCspOnboardingEmail("needs_information", "en", { name: nasty, reason: nasty });
  assert.ok(!out.html.includes("<script>"));
  assert.ok(out.html.includes("&lt;script&gt;"));
  const rejected = renderCspOnboardingEmail("rejected", "en", { reason: "internal note 123" });
  assert.ok(!rejected.html.includes("internal note 123"));
  assert.ok(!rejected.text.includes("internal note 123"));
});

test("locale resolution maps aliases and falls back to en", () => {
  assert.equal(resolveCspOnboardingEmailLocale("nb-NO"), "no");
  assert.equal(resolveCspOnboardingEmailLocale("uk_UA"), "uk");
  assert.equal(resolveCspOnboardingEmailLocale("ES"), "es");
  assert.equal(resolveCspOnboardingEmailLocale("fr"), "en");
  assert.equal(resolveCspOnboardingEmailLocale(null), "en");
});

test("rate limiter enforces 60s per kind+email, case-insensitive", () => {
  const t0 = 1_000_000;
  assert.deepEqual(checkCspOnboardingEmailRateLimit("verify_email_nudge", "A@x.example", t0), { allowed: true });
  const blocked = checkCspOnboardingEmailRateLimit("verify_email_nudge", "a@x.example", t0 + 10_000);
  assert.deepEqual(blocked, { allowed: false, retryAfterSeconds: 50 });
  assert.deepEqual(checkCspOnboardingEmailRateLimit("approved", "a@x.example", t0 + 10_000), { allowed: true });
  assert.deepEqual(checkCspOnboardingEmailRateLimit("verify_email_nudge", "a@x.example", t0 + 60_000), {
    allowed: true,
  });
});
