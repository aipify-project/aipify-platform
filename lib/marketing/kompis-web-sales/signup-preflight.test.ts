import assert from "node:assert/strict";
import {
  looksLikeWorkEmail,
  normalizeWebsiteUrl,
  signupCollectQueryString,
  validateSignupCollectFields,
} from "./signup-preflight";

assert.equal(looksLikeWorkEmail("a@b.com"), true);
assert.equal(looksLikeWorkEmail("not-an-email"), false);
assert.equal(looksLikeWorkEmail(""), false);

assert.equal(normalizeWebsiteUrl("example.com"), "https://example.com");
assert.equal(normalizeWebsiteUrl("https://example.com/path"), "https://example.com/path");
assert.equal(normalizeWebsiteUrl(""), null);
assert.equal(normalizeWebsiteUrl("not a url"), null);
assert.equal(normalizeWebsiteUrl("http://localhost"), null);

const empty = validateSignupCollectFields({
  email: "",
  website: "",
  company: "",
  language: "en",
});
assert.equal(empty.ok, false);
if (!empty.ok) {
  assert.equal(empty.field, "email");
  assert.equal(empty.code, "required");
}

const badEmail = validateSignupCollectFields({
  email: "nope",
  website: "https://example.com",
  company: "Acme",
  language: "en",
});
assert.equal(badEmail.ok, false);
if (!badEmail.ok) assert.equal(badEmail.code, "email");

const ok = validateSignupCollectFields({
  email: " You@Company.com ",
  website: "example.com",
  company: " Acme AS ",
  language: "en",
});
assert.equal(ok.ok, true);
if (ok.ok) {
  assert.equal(ok.values.email, "you@company.com");
  assert.equal(ok.values.website, "https://example.com");
  assert.equal(ok.values.company, "Acme AS");
  assert.equal(ok.values.language, "en");
  assert.match(signupCollectQueryString(ok.values), /email=you%40company.com/);
}

console.log("signup-preflight: PASS");
