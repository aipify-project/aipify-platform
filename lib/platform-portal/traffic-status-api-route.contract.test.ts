import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { classifyPrivilegedPlatformRequest } from "@/lib/auth/platform-privileged-request";

const routePath = join(
  process.cwd(),
  "app/api/platform-portal/traffic-status/route.ts",
);
const source = readFileSync(routePath, "utf8");

assert.match(source, /getPlatformProfile/);
assert.match(source, /loadPlatformTrafficStatus/);
assert.match(source, /status: 401/);
assert.match(source, /status: 403/);
assert.doesNotMatch(source, /createServiceRoleClient/);
assert.doesNotMatch(source, /NEXT_PUBLIC_/);

const classification = classifyPrivilegedPlatformRequest({
  pathname: "/api/platform-portal/traffic-status",
  method: "GET",
});
assert.equal(classification.privileged, true);

console.log("traffic-status-api-route.contract.test.ts: ok");
