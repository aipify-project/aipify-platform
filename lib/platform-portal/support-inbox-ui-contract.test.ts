import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LOCALES } from "@/lib/i18n/config";
import {
  PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE,
} from "./support-tickets-read-adapter";
import {
  PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED,
  PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED,
} from "./support-tickets-cross-tenant-read-contract";
import {
  assertPlatformSupportInboxUiIsDormant,
  getPlatformSupportInboxUiGateState,
  PLATFORM_SUPPORT_INBOX_MISSING_CONTRACTS,
  PLATFORM_SUPPORT_INBOX_PRODUCT_TABS,
} from "./support-inbox-ui-contract";

assert.ok(assertPlatformSupportInboxUiIsDormant());
assert.equal(PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED, false);
assert.equal(PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE, false);
assert.equal(PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED, false);

const gate = getPlatformSupportInboxUiGateState();
assert.equal(gate.liveTickets, false);
assert.ok(PLATFORM_SUPPORT_INBOX_PRODUCT_TABS.includes("aipify_public_site"));
assert.ok(PLATFORM_SUPPORT_INBOX_PRODUCT_TABS.includes("sellers_partners"));
assert.ok(
  PLATFORM_SUPPORT_INBOX_MISSING_CONTRACTS.some((c) => c.id === "core_read_rpc_apply"),
);

const page = readFileSync(join(process.cwd(), "app/platform/support/page.tsx"), "utf8");
assert.match(page, /PlatformSupportInboxDormantPanel/);
assert.match(page, /embedded/);
assert.doesNotMatch(page, /list_platform_app_portal_support_requests/);
assert.doesNotMatch(page, /\/api\/platform-portal\/support-requests/);

const dormant = readFileSync(
  join(
    process.cwd(),
    "components/platform/platform-portal/PlatformSupportInboxDormantPanel.tsx",
  ),
  "utf8",
);
assert.match(dormant, /data-live-tickets/);
assert.match(dormant, /data-support-inbox="dormant"/);
assert.doesNotMatch(dormant, /createClient/);
assert.doesNotMatch(dormant, /listPlatformSupportTickets/);
assert.doesNotMatch(dormant, /supabase\.rpc/);

const legacy = readFileSync(
  join(process.cwd(), "components/platform/PlatformSupportPanel.tsx"),
  "utf8",
);
assert.match(legacy, /list_platform_support_queue/);
assert.match(legacy, /scopeNote/);
assert.doesNotMatch(legacy, /list_platform_app_portal_support_requests/);

for (const locale of LOCALES) {
  const dict = JSON.parse(
    readFileSync(join(process.cwd(), `locales/${locale}/platform.json`), "utf8"),
  );
  assert.ok(dict.supportInbox?.title, `missing supportInbox.title for ${locale}`);
  assert.ok(dict.supportInbox?.list?.emptyTitle, `missing emptyTitle for ${locale}`);
  assert.ok(dict.support?.counters?.scopeNote, `missing counters.scopeNote for ${locale}`);
  assert.match(
    String(dict.support.empty),
    /legacy|eldre|äldre|ældre|starsz|старіш|anterior|ops|APP/i,
  );
  assert.doesNotMatch(String(dict.support.counters.resolvedByAi), /Aipifypifypify/);
  assert.match(
    String(dict.executive.sinceLogin.supportResolved),
    /lifetime|livstid|livstid|lifetime|ops|drifts/i,
  );
}

console.log(
  "support-inbox-ui-contract: dormant UI PASS; gates OFF; 7-locale keys present",
);
