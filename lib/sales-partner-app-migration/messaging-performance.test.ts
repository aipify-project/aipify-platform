import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  PARTNER_MESSAGES_API_PATH,
  PARTNER_MESSAGES_APP_PATH,
  PARTNER_MESSAGES_CLIENT_RULES,
  PARTNER_MESSAGE_UNREAD_BADGE,
  SHARED_APP_NOTIFICATIONS_PATH,
  SALES_PARTNER_MESSAGING_PERFORMANCE_MARKER,
} from "./messaging-performance";
import { mapPartnersHrefToAppHost } from "./phase-c-shared-surfaces";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("messaging performance marker and paths", () => {
  assert.equal(SALES_PARTNER_MESSAGING_PERFORMANCE_MARKER, "messaging_performance_v1");
  assert.equal(PARTNER_MESSAGES_APP_PATH, "/app/sales-partner/messages");
  assert.equal(SHARED_APP_NOTIFICATIONS_PATH, "/app/notifications");
  assert.equal(PARTNER_MESSAGE_UNREAD_BADGE.status, "deferred_no_count_rpc");
  assert.equal(PARTNER_MESSAGE_UNREAD_BADGE.forbiddenFallback, "full_list_fetch");
});

test("topbar never fetches partner message lists", () => {
  const topbar = readFileSync(
    path.join(root, "components/partners-portal/PartnersPortalTopbarActions.tsx"),
    "utf8",
  );
  assert.doesNotMatch(topbar, /\/api\/certified-sales-partner\/messages/);
  assert.doesNotMatch(topbar, /usePollingTask/);
  assert.doesNotMatch(topbar, /messages\?limit=/);
  assert.match(topbar, /PARTNER_MESSAGE_UNREAD_BADGE/);
  assert.match(topbar, /SHARED_APP_NOTIFICATIONS_PATH|notificationsApp\.href/);
});

test("messages list fetch lives only in messages center panel", () => {
  const panel = readFileSync(
    path.join(root, "components/partners-portal/PartnersMessagesCenterPanel.tsx"),
    "utf8",
  );
  assert.match(panel, new RegExp(PARTNER_MESSAGES_API_PATH.replace(/\//g, "\\/")));
  assert.match(panel, /AbortController/);
  assert.match(panel, /CSP_MESSAGES_CLIENT_FETCH_TIMEOUT_MS|15_000|15000/);

  const notificationsRedirect = readFileSync(
    path.join(root, "app/app/sales-partner/notifications/page.tsx"),
    "utf8",
  );
  assert.match(notificationsRedirect, /redirect/);
  assert.match(notificationsRedirect, /SHARED_APP_NOTIFICATIONS_PATH/);
  assert.doesNotMatch(notificationsRedirect, /CertifiedSalesPartnerNotificationsPanel/);
});

test("nav maps partner notifications to shared APP notifications", () => {
  assert.equal(mapPartnersHrefToAppHost("/partners/account/notifications"), "/app/notifications");
  assert.equal(mapPartnersHrefToAppHost("/partners/account/messages"), PARTNER_MESSAGES_APP_PATH);
});

test("client rules forbid layout/topbar list fetches", () => {
  assert.ok(PARTNER_MESSAGES_CLIENT_RULES.listFetchAllowedOn.includes(PARTNER_MESSAGES_APP_PATH));
  assert.ok(PARTNER_MESSAGES_CLIENT_RULES.listFetchForbiddenIn.includes("topbar"));
  assert.ok(PARTNER_MESSAGES_CLIENT_RULES.listFetchForbiddenIn.includes("layout"));
});
