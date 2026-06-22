import assert from "node:assert/strict";
import {
  UNONIGHT_AIPIFY_TOKEN_PREFIX,
  extractBearerToken,
  hashUnonightAipifyToken,
  isUnonightAipifyTokenFormat,
  maskUnonightAipifyTokenPrefix,
} from "./index";

function runTests() {
  const sample = `${UNONIGHT_AIPIFY_TOKEN_PREFIX}${"a".repeat(32)}`;
  assert.equal(isUnonightAipifyTokenFormat(sample), true);
  assert.equal(isUnonightAipifyTokenFormat("aipify_token"), false);
  assert.equal(extractBearerToken(`Bearer ${sample}`), sample);
  assert.equal(extractBearerToken("Token abc"), null);
  assert.equal(hashUnonightAipifyToken(sample).length, 64);
  assert.match(maskUnonightAipifyTokenPrefix(), /^uno_aipify_•+/);
  console.log("unonight platform token tests passed");
}

runTests();
