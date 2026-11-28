import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { SALES_PARTNER_APP_ROUTE_MATRIX } from "./phase-a-contract";
import { SALES_PARTNER_THIN_HOSTS } from "./phase-b-hosts";
import {
  CSP_PORTAL_CLIENT_FETCH_TIMEOUT_MS,
  mapPartnersHrefToAppHost,
  salesPartnerPathIsActive,
  SALES_PARTNER_APP_MIGRATION_PHASE_C,
  SALES_PARTNER_PARTNERS_TO_APP_HREF,
  SALES_PARTNER_PHASE_C_SHARED_SURFACES,
} from "./phase-c-shared-surfaces";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("Phase C marker and portal timeout budget", () => {
  assert.equal(SALES_PARTNER_APP_MIGRATION_PHASE_C, "C");
  assert.ok(CSP_PORTAL_CLIENT_FETCH_TIMEOUT_MS <= 20_000);
  assert.ok(CSP_PORTAL_CLIENT_FETCH_TIMEOUT_MS >= 5_000);
});

test("partners hrefs map to APP thin hosts", () => {
  assert.equal(mapPartnersHrefToAppHost("/partners"), "/app/sales-partner");
  assert.equal(
    mapPartnersHrefToAppHost("/partners/marketing/assets?section=library"),
    "/app/sales-partner/materials",
  );
  assert.equal(
    mapPartnersHrefToAppHost("/partners/account/messages"),
    "/app/sales-partner/messages",
  );
  assert.equal(
    mapPartnersHrefToAppHost("/partners/account/notifications"),
    "/app/sales-partner/notifications",
  );
});

test("active matching treats APP and partners paths as equivalent", () => {
  assert.equal(
    salesPartnerPathIsActive("/partners/account/messages", "/app/sales-partner/messages", null),
    true,
  );
  assert.equal(
    salesPartnerPathIsActive("/partners", "/app/sales-partner", null),
    true,
  );
  assert.equal(
    salesPartnerPathIsActive(
      "/partners/marketing/assets?section=library",
      "/app/sales-partner/materials",
      null,
    ),
    true,
  );
  assert.equal(
    salesPartnerPathIsActive("/partners/settlement", "/app/sales-partner/products", null),
    false,
  );
});

test("Phase C shared surfaces document Agent 3 fence and no auto profile merge", () => {
  assert.equal(
    SALES_PARTNER_PHASE_C_SHARED_SURFACES.feedback.supportTicketIntegration,
    "BLOCKED_agent3_fence",
  );
  assert.match(
    SALES_PARTNER_PHASE_C_SHARED_SURFACES.profileApp.parity,
    /csp_payout/,
  );
});

test("Phase C thin hosts exist for notifications profile help", () => {
  for (const cap of ["notifications", "profile", "help"] as const) {
    const host = SALES_PARTNER_THIN_HOSTS.find((h) => h.capability === cap);
    assert.ok(host, cap);
    // appPath is `/app/sales-partner/...` → file under repo `app/app/sales-partner/...`
    const fileRel = path.join("app", host!.appPath.replace(/^\//, ""), "page.tsx");
    assert.ok(existsSync(path.join(root, fileRel)), fileRel);
  }
});

test("route matrix thin hosts are covered by Phase B/C host registry", () => {
  const hostCaps = new Set(SALES_PARTNER_THIN_HOSTS.map((h) => h.capability));
  for (const row of SALES_PARTNER_APP_ROUTE_MATRIX) {
    if (row.hostStrategy !== "thin_app_host") continue;
    assert.ok(hostCaps.has(row.capability), row.capability);
    assert.ok(row.targetAppPath.startsWith("/app/sales-partner"), row.targetAppPath);
  }
});

test("href map covers every partners path in map keys", () => {
  for (const [from, to] of Object.entries(SALES_PARTNER_PARTNERS_TO_APP_HREF)) {
    assert.equal(mapPartnersHrefToAppHost(from), to);
  }
});

test("perf contracts: parallel unread, portal abort, session auth", () => {
  const topbar = readFileSync(
    path.join(root, "components/partners-portal/PartnersPortalTopbarActions.tsx"),
    "utf8",
  );
  assert.match(topbar, /Promise\.all/);
  assert.doesNotMatch(
    topbar,
    /if \(onMessages \|\| onNotifications\) \{\s*void refreshUnread\(\);/,
  );

  const portal = readFileSync(
    path.join(root, "components/partners-portal/CspPortalSessionProvider.tsx"),
    "utf8",
  );
  assert.match(portal, /AbortController/);
  assert.match(portal, /CSP_PORTAL_CLIENT_FETCH_TIMEOUT_MS/);

  const notifications = readFileSync(
    path.join(root, "components/partners-portal/CertifiedSalesPartnerNotificationsPanel.tsx"),
    "utf8",
  );
  assert.match(notifications, /AbortController/);

  const accessApi = readFileSync(
    path.join(root, "app/api/partners-portal/access/route.ts"),
    "utf8",
  );
  assert.match(accessApi, /Promise\.all/);
  assert.match(accessApi, /getAuthenticatedUserFromSession/);

  const serverAccess = readFileSync(
    path.join(root, "lib/partners-portal/server-access.ts"),
    "utf8",
  );
  assert.match(serverAccess, /getAuthenticatedUserFromSession/);
  assert.doesNotMatch(serverAccess, /supabase\.auth\.getUser\(\)/);

  const portalApi = readFileSync(
    path.join(root, "app/api/certified-sales-partner/portal/route.ts"),
    "utf8",
  );
  assert.match(portalApi, /getAuthenticatedUserFromSession/);
});
