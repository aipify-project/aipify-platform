import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { classifyPrivilegedPlatformRequest } from "@/lib/auth/platform-privileged-request";

const source = readFileSync(
  join(process.cwd(), "app/api/live-presence/heartbeat/route.ts"),
  "utf8",
);

assert.match(source, /getUser/);
assert.match(source, /upsert_platform_live_presence_heartbeat|PLATFORM_LIVE_PRESENCE_HEARTBEAT_RPC/);
assert.match(source, /status: 401/);
assert.match(source, /status: 403/);
assert.match(source, /not_measured/);
assert.doesNotMatch(source, /createServiceRoleClient/);

// Heartbeat must remain available to APP/seller auth — not Platform-admin-only MFA gate.
const classification = classifyPrivilegedPlatformRequest({
  pathname: "/api/live-presence/heartbeat",
  method: "POST",
});
assert.equal(classification.privileged, false);

console.log("live-presence/heartbeat-api.contract.test.ts: ok");
