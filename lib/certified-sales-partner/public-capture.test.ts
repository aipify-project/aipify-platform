import assert from "node:assert/strict";
import {
  allowCspCaptureRate,
  decideCspPublicCapture,
  hashCspSessionKey,
  parseCspAttributionCookie,
  serializeCspAttributionCookie,
} from "./public-capture";

assert.equal(
  decideCspPublicCapture({
    code: "csp-abcdef123456",
    productKey: "kompis_web",
    sessionKey: "sess",
    userAgent: "Googlebot/2.1",
  }).ok,
  false,
);

assert.equal(
  decideCspPublicCapture({
    code: "not-a-code",
    productKey: "kompis_web",
    sessionKey: "abcdefghijklmnop",
    userAgent: "Mozilla/5.0",
    rateKey: `bad-${Date.now()}`,
  }).ok,
  false,
);

const ok = decideCspPublicCapture({
  code: "csp-abcdef123456",
  productKey: "Kompis-Web",
  sessionKey: "abcdefghijklmnop",
  userAgent: "Mozilla/5.0",
  rateKey: `ok-${Date.now()}`,
});
assert.equal(ok.ok, true);
if (ok.ok) {
  assert.equal(ok.payload.productKey, "kompis_web");
  assert.equal(ok.payload.sessionHash, hashCspSessionKey("abcdefghijklmnop"));
}

const rateKey = `rate-${Date.now()}`;
for (let i = 0; i < 30; i += 1) assert.equal(allowCspCaptureRate(rateKey), true);
assert.equal(allowCspCaptureRate(rateKey), false);

const raw = serializeCspAttributionCookie({
  code: "csp-abcdef123456",
  productKey: "kompis_web",
  sessionKey: "session-key-1",
  firstTouchAt: "2026-11-26T00:00:00.000Z",
  lastTouchAt: "2026-11-26T00:00:00.000Z",
});
assert.equal(parseCspAttributionCookie(raw)?.code, "csp-abcdef123456");
assert.equal(parseCspAttributionCookie("!!!"), null);

console.log("public-capture.test.ts: ok");
