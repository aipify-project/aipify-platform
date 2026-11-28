import assert from "node:assert/strict";
import {
  readWebsiteKompisAppearanceFailClosed,
  validateWebsiteKompisAppearanceDraft,
  writeWebsiteKompisAppearanceFailClosed,
} from "./fail-closed";
import { WEBSITE_KOMPIS_APPEARANCE_CONTRACT_VERSION } from "./types";

assert.equal(WEBSITE_KOMPIS_APPEARANCE_CONTRACT_VERSION, "v1_candidate");

const read = readWebsiteKompisAppearanceFailClosed();
assert.equal(read.kind, "writer_unavailable");

assert.equal(
  validateWebsiteKompisAppearanceDraft({
    accentToken: "companion_purple",
    welcomeMessage: "Hello",
    showBranding: true,
  }).ok,
  true,
);
assert.equal(
  validateWebsiteKompisAppearanceDraft({
    accentToken: "neon_hack",
    welcomeMessage: null,
    showBranding: true,
  }).ok,
  false,
);
assert.equal(
  validateWebsiteKompisAppearanceDraft({
    accentToken: "slate",
    welcomeMessage: "x".repeat(200),
    showBranding: false,
  }).ok,
  false,
);

const write = writeWebsiteKompisAppearanceFailClosed({
  accentToken: "companion_purple",
  welcomeMessage: "Hi",
  showBranding: true,
});
assert.equal(write.ok, false);
if (!write.ok) {
  assert.equal(write.reason, "writer_unavailable");
  assert.equal(write.messageKey, "writerUnavailable");
}

console.log("appearance-fail-closed.test.ts: ok");
