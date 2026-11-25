import assert from "node:assert/strict";
import {
  AUTH_LIFECYCLE_LOGO_URL,
  renderAuthLifecycleEmail,
} from "./auth-lifecycle-email";
import {
  resolveAuthLifecycleEmailLocale,
  getAuthLifecycleEmailCopy,
} from "./auth-lifecycle-email-copy";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

test("locale resolver maps nb→no and unknown→en", () => {
  assert.equal(resolveAuthLifecycleEmailLocale("nb-NO"), "no");
  assert.equal(resolveAuthLifecycleEmailLocale("no"), "no");
  assert.equal(resolveAuthLifecycleEmailLocale("pt-BR"), "en");
  assert.equal(resolveAuthLifecycleEmailLocale(null), "en");
});

test("Norwegian password reset is localized and never English-only", () => {
  const rendered = renderAuthLifecycleEmail({
    kind: "password_reset",
    locale: "no",
    name: "Svein",
    actionUrl: "https://app.aipify.ai/auth/callback?token_hash=test&type=recovery",
  });
  assert.match(rendered.subject, /Tilbakestill/i);
  assert.match(rendered.html, /Sett nytt passord/);
  assert.ok(rendered.html.includes(AUTH_LIFECYCLE_LOGO_URL));
  assert.match(rendered.html, /text-align:left/);
  assert.doesNotMatch(rendered.html, /Reset password/);
  assert.doesNotMatch(rendered.text, /Core|RPC|Staging|migration/i);
});

test("Norwegian partner activation uses congratulatory seller wording", () => {
  const copy = getAuthLifecycleEmailCopy("partner_activation", "no");
  assert.match(copy.subject, /Aktiver/i);
  assert.match(copy.paragraphs.join(" "), /Gratulerer/);
  assert.match(copy.paragraphs.join(" "), /Aipify Academy/);
  assert.match(copy.cta, /Aktiver selgerkontoen min/);
  assert.doesNotMatch(copy.paragraphs.join(" "), /Glemt passord/);
});

test("action URL is present but templates do not embed raw provider brands", () => {
  const rendered = renderAuthLifecycleEmail({
    kind: "password_reset",
    locale: "en",
    actionUrl: "https://app.aipify.ai/auth/callback?token_hash=abc&type=recovery",
  });
  assert.ok(rendered.html.includes("token_hash=abc"));
  assert.doesNotMatch(rendered.html, /Supabase|Resend/i);
});

console.log("auth-lifecycle-email.test.ts: all assertions passed");
