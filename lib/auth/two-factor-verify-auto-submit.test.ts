import assert from "node:assert/strict";
import {
  isCompleteTotpCode,
  normalizeTotpDigitsFromPaste,
  shouldAutoSubmitTotpCode,
} from "./two-factor-verify-auto-submit";

assert.equal(isCompleteTotpCode(["1", "2", "3", "4", "5", "6"]), true);
assert.equal(isCompleteTotpCode(["1", "2", "3", "4", "5", ""]), false);
assert.equal(isCompleteTotpCode(["a", "2", "3", "4", "5", "6"]), false);

assert.equal(
  shouldAutoSubmitTotpCode({
    digits: ["1", "2", "3", "4", "5", "6"],
    autoAttemptedCode: null,
    recoveryMode: false,
    booting: false,
    loading: false,
    submitInFlight: false,
  }),
  true,
);

assert.equal(
  shouldAutoSubmitTotpCode({
    digits: ["1", "2", "3", "4", "5", "6"],
    autoAttemptedCode: "123456",
    recoveryMode: false,
    booting: false,
    loading: false,
    submitInFlight: false,
  }),
  false,
);

assert.equal(
  shouldAutoSubmitTotpCode({
    digits: ["1", "2", "3", "4", "5", "6"],
    autoAttemptedCode: "123456",
    recoveryMode: false,
    booting: false,
    loading: false,
    submitInFlight: false,
  }),
  false,
  "same complete code must not auto-submit twice",
);

assert.equal(
  shouldAutoSubmitTotpCode({
    digits: ["1", "2", "3", "4", "5", "7"],
    autoAttemptedCode: "123456",
    recoveryMode: false,
    booting: false,
    loading: false,
    submitInFlight: false,
  }),
  true,
  "edited code after failure should auto-submit again",
);

assert.equal(
  shouldAutoSubmitTotpCode({
    digits: ["1", "2", "3", "4", "5", "6"],
    autoAttemptedCode: null,
    recoveryMode: false,
    booting: false,
    loading: true,
    submitInFlight: false,
  }),
  false,
);

assert.deepEqual(normalizeTotpDigitsFromPaste("12-34-56"), ["1", "2", "3", "4", "5", "6"]);
assert.deepEqual(normalizeTotpDigitsFromPaste("123"), ["1", "2", "3", "", "", ""]);

console.log("two-factor-verify-auto-submit.test.ts: all assertions passed");
