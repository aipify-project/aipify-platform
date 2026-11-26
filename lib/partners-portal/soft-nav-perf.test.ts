import assert from "node:assert/strict";
import test from "node:test";
import { markPartnersSoftNavReady, markPartnersSoftNavStart } from "./soft-nav-perf";

test("soft-nav marks are safe when performance is unavailable", () => {
  assert.doesNotThrow(() => markPartnersSoftNavStart("/partners"));
  assert.doesNotThrow(() => markPartnersSoftNavReady("/partners"));
});
