import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_PATH,
  PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_SHA256,
  PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED,
  PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED,
  assertPlatformSupportTicketsReadIsFailClosed,
} from "./support-tickets-cross-tenant-read-contract";
import {
  PLATFORM_SUPPORT_ALLOWED_CHANNEL_FILTERS,
  PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK,
  PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE,
  canInvokePlatformSupportTicketsReadRpc,
  denyInactivePlatformSupportTicketsRead,
  getPlatformSupportTicket,
  getPlatformSupportTicketCounts,
  getPlatformSupportTicketsReadGateState,
  httpStatusForSupportTicketsReadDenial,
  listPlatformSupportTickets,
} from "./support-tickets-read-adapter";

assert.ok(assertPlatformSupportTicketsReadIsFailClosed());
assert.equal(PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED, false);
assert.equal(PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE, false);
assert.equal(PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED, false);
assert.equal(canInvokePlatformSupportTicketsReadRpc(), false);

const gate = getPlatformSupportTicketsReadGateState();
assert.equal(gate.live, false);
assert.equal(gate.sourceLocaleInvent, false);
assert.deepEqual([...gate.allowedRoles], ["super_admin", "platform_support"]);

const inactive = denyInactivePlatformSupportTicketsRead();
assert.equal(inactive.ok, false);
assert.equal(inactive.code, "rpc_not_applied");
assert.equal(httpStatusForSupportTicketsReadDenial(inactive.code), 503);

// Product channel link honesty
assert.equal(PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK.aipify_public_site.linked, false);
assert.equal(PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK.aipify_public_site.status, "NOT_LINKED");
assert.equal(PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK.kompis_web.linked, false);
assert.equal(PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK.sellers_partners.linked, false);
assert.equal(PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK.kompis_bedrift_app.linked, true);
assert.deepEqual(
  [...PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK.kompis_bedrift_app.sotChannels],
  ["app_portal"],
);
assert.ok(PLATFORM_SUPPORT_ALLOWED_CHANNEL_FILTERS.includes("app_portal"));
assert.ok(!PLATFORM_SUPPORT_ALLOWED_CHANNEL_FILTERS.includes("selgere" as never));

// Adapter must not call RPC while inactive — stub that throws if invoked.
const forbiddenClient = {
  rpc: async () => {
    throw new Error("RPC must not be invoked while feature gate / apply is off");
  },
};

void (async () => {
  const list = await listPlatformSupportTickets(forbiddenClient, {
    channel: "app_portal",
  });
  assert.equal(list.ok, false);
  if (!list.ok) assert.equal(list.code, "rpc_not_applied");

  const detail = await getPlatformSupportTicket(
    forbiddenClient,
    "51111111-1111-4111-8111-111111111111",
  );
  assert.equal(detail.ok, false);
  if (!detail.ok) assert.equal(detail.code, "rpc_not_applied");

  const counts = await getPlatformSupportTicketCounts(forbiddenClient);
  assert.equal(counts.ok, false);
  if (!counts.ok) assert.equal(counts.code, "rpc_not_applied");

  // While inactive, invalid channel is not reached; ensure filter allowlist is SoT-only.
  assert.deepEqual(
    [...PLATFORM_SUPPORT_ALLOWED_CHANNEL_FILTERS],
    ["app_portal", "email", "chat", "phone", "assistant"],
  );

  // SQL hash still matches prepare artifact
  assert.ok(existsSync(PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_PATH));
  const sql = readFileSync(PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_PATH, "utf8");
  assert.equal(
    createHash("sha256").update(sql).digest("hex"),
    PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_SHA256,
  );

  // API routes: auth + fail-closed + no service role + no UI wire
  const listRoute = readFileSync(
    join(process.cwd(), "app/api/platform-portal/support-requests/route.ts"),
    "utf8",
  );
  const getRoute = readFileSync(
    join(process.cwd(), "app/api/platform-portal/support-requests/[id]/route.ts"),
    "utf8",
  );
  const countsRoute = readFileSync(
    join(
      process.cwd(),
      "app/api/platform-portal/support-requests/counts/route.ts",
    ),
    "utf8",
  );
  const panel = readFileSync(
    join(process.cwd(), "components/platform/PlatformSupportPanel.tsx"),
    "utf8",
  );

  for (const src of [listRoute, getRoute, countsRoute]) {
    assert.match(src, /getUser\(\)/);
    assert.match(src, /Unauthorized/);
    assert.doesNotMatch(src, /createServiceRoleClient/);
    assert.doesNotMatch(src, /service_role/);
    assert.doesNotMatch(src, /isAdmin\s*[:=]/);
  }

  assert.match(listRoute, /listPlatformSupportTickets/);
  assert.match(getRoute, /getPlatformSupportTicket/);
  assert.match(countsRoute, /getPlatformSupportTicketCounts/);

  // Legacy panel remains on legacy queue — UI not wired to APP SoT adapter
  assert.match(panel, /list_platform_support_queue/);
  assert.doesNotMatch(panel, /listPlatformSupportTickets/);
  assert.doesNotMatch(panel, /list_platform_app_portal_support_requests/);
  assert.doesNotMatch(panel, /\/api\/platform-portal\/support-requests/);

  console.log(
    "support-tickets-read-adapter: fail-closed PASS; feature gate OFF; UI not wired",
  );
})();
