import assert from "node:assert/strict";
import { summarizeAddonModules } from "./addon-module-summary";

const summary = summarizeAddonModules([
  { module_key: "website_kompis_engine" },
  { module_key: "website_kompis_engine" },
  { module_key: "support_desk", module_name: "Support Desk" },
  { module_key: "another_engine" },
]);

assert.equal(summary.total, 3);
assert.deepEqual(summary.named, [{ key: "support_desk", name: "Support Desk", tone: "licensed" }]);
const active = summarizeAddonModules([
  { module_key: "desk", module_name: "Support Desk", enabled: true, status: "enabled" },
]);
assert.equal(active.named[0]?.tone, "active");
assert.equal(summary.unnamedCount, 2);
assert.equal(summarizeAddonModules([]).total, 0);
assert.equal(summarizeAddonModules(null).total, 0);

const hundred = summarizeAddonModules(
  Array.from({ length: 100 }, (_, index) => ({ module_key: `technical_module_${index}` })),
);
assert.equal(hundred.named.length, 0);
assert.equal(hundred.unnamedCount, 100);
assert.equal(hundred.total, 100);

console.log("addon-module-summary.test.ts: ok");
