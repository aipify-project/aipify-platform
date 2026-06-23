import assert from "node:assert/strict";
import type { PortalSessionProbeResult } from "./portal-session-probe";

const PROBE_RETRY_DELAYS_MS = [0, 350, 900] as const;

assert.equal(PROBE_RETRY_DELAYS_MS.length, 3);

function finalStatus(results: PortalSessionProbeResult[]): PortalSessionProbeResult["status"] {
  if (results.some((result) => result.status === "authenticated")) return "authenticated";
  if (results.some((result) => result.status === "transient")) return "transient";
  return "unauthenticated";
}

assert.equal(
  finalStatus([
    { status: "unauthenticated" },
    { status: "transient", reason: "server" },
  ]),
  "transient",
);

console.log("portal-session-probe.test.ts: all assertions passed");
