import assert from "node:assert/strict";
import test from "node:test";
import { buildCspPublicLinkPath, isCspLinkCode, resolveCspProductDestination } from "./attribution-policy";

test("destination: known products map to allowlisted paths; unknown fails closed (null)", () => {
  assert.equal(resolveCspProductDestination("kompis_web"), "/");
  assert.equal(resolveCspProductDestination("kompis-web"), "/");
  assert.equal(resolveCspProductDestination("kompis_bedrift"), "/book-demo");
  assert.equal(resolveCspProductDestination("aipify_voice"), null);
  assert.equal(resolveCspProductDestination("https://evil.example"), null);
  assert.equal(resolveCspProductDestination(null), null);
});

test("link code shape", () => {
  assert.equal(isCspLinkCode("csp-0123456789ab"), true);
  assert.equal(isCspLinkCode("csp-short"), false);
  assert.equal(isCspLinkCode("some-growth-partner"), false);
  assert.equal(isCspLinkCode(undefined), false);
});

test("public link path is remapped from the Core placeholder and fail-closed for bad input", () => {
  assert.equal(
    buildCspPublicLinkPath({ code: "csp-0123456789ab", productKey: "kompis_web", channel: "email" }),
    "/p/csp-0123456789ab/kompis_web?channel=email",
  );
  assert.equal(buildCspPublicLinkPath({ code: "bad", productKey: "kompis_web", channel: "email" }), null);
  assert.equal(buildCspPublicLinkPath({ code: "csp-0123456789ab", productKey: "aipify_voice", channel: "email" }), null);
});
