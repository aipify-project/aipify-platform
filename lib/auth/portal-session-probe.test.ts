import assert from "node:assert/strict";
import type { PortalSessionProbeResult } from "./portal-session-probe";

function resolveFromProbe(probe: PortalSessionProbeResult): string {
  return probe.status;
}

assert.equal(
  resolveFromProbe({ status: "authenticated", userId: "user-1" }),
  "authenticated",
);
assert.equal(resolveFromProbe({ status: "unauthenticated" }), "unauthenticated");
assert.equal(
  resolveFromProbe({ status: "transient", reason: "network" }),
  "transient",
);

console.log("portal-session-probe.test.ts: all assertions passed");
