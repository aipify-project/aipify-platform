import assert from "node:assert/strict";
import { summarizeAuditState } from "@/lib/super-portal/platform-revision";

function main() {
  assert.equal(summarizeAuditState({}, "—"), "—");
  assert.equal(summarizeAuditState({ role: "super_admin" }, "—"), '{"role":"super_admin"}');

  const long: Record<string, unknown> = {};
  for (let i = 0; i < 40; i += 1) long[`k${i}`] = `value-${i}`;
  const summary = summarizeAuditState(long, "—");
  assert.ok(summary.endsWith("…"));
  assert.ok(summary.length <= 120);

  console.log("platform-revision.test.ts: all assertions passed");
}

void main();
