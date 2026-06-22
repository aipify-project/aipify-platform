import assert from "node:assert/strict";
import test from "node:test";
import {
  humanizeModuleKeyFallback,
  isMissingPlatformVersion,
  resolveProviderModuleLabel,
} from "./presentation-registry";

const t = ((key: string) => {
  const labels: Record<string, string> = {
    "customerApp.companionPlatformKnowledge.platformSnapshot.modules.chat": "Chat",
    "customerApp.companionPlatformKnowledge.platformSnapshot.modules.registration":
      "Registration",
  };
  return labels[key] ?? key;
}) as (key: string) => string;

test("humanizeModuleKeyFallback converts snake_case", () => {
  assert.equal(humanizeModuleKeyFallback("customer_support"), "Customer Support");
});

test("missing platform version detection", () => {
  assert.equal(isMissingPlatformVersion("unknown"), true);
  assert.equal(isMissingPlatformVersion("1.2.3"), false);
});

test("resolveProviderModuleLabel uses translation or fallback", () => {
  assert.equal(resolveProviderModuleLabel("registration", t), "Registration");
  assert.equal(resolveProviderModuleLabel("customer_support", t), "Customer Support");
});
