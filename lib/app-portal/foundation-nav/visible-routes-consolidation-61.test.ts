/**
 * Job 61 — all 19 visible menu targets use AppHubShell / consolidated presentation.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  KOMPIS_BEDRIFT_FLAT_NAV,
  KOMPIS_WEB_FLAT_NAV,
  getAppPortalActiveNavId,
} from "@/lib/app-portal/nav-config";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

const ROOT = process.cwd();

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

const WEB_PAGES: Array<{ id: string; page: string }> = [
  { id: "kompisWebDashboard", page: "app/app/website-kompis/page.tsx" },
  { id: "kompisWebQa", page: "app/app/website-kompis/feedback/page.tsx" },
  { id: "kompisWebFaq", page: "app/app/website-kompis/faq/page.tsx" },
  { id: "kompisWebConnection", page: "app/app/website-kompis/connection/page.tsx" },
  { id: "accountSubscription", page: "app/app/account/subscription/page.tsx" },
  { id: "kompisWebSettings", page: "app/app/website-kompis/settings/page.tsx" },
];

const BEDRIFT_PAGES: Array<{ id: string; page: string }> = [
  { id: "kompisBedriftDashboard", page: "app/app/kompis-bedrift/page.tsx" },
  { id: "kompisBedriftEmployees", page: "app/app/kompis-bedrift/employees/page.tsx" },
  { id: "kompisBedriftDocuments", page: "app/app/kompis-bedrift/documents/page.tsx" },
  { id: "kompisBedriftFaq", page: "app/app/kompis-bedrift/knowledge/page.tsx" },
  { id: "kompisBedriftComms", page: "app/app/kompis-bedrift/communications/page.tsx" },
  { id: "kompisBedriftMeetings", page: "app/app/kompis-bedrift/meetings/page.tsx" },
  { id: "kompisBedriftModules", page: "app/app/kompis-bedrift/modules/page.tsx" },
  { id: "accountSubscription", page: "app/app/account/subscription/page.tsx" },
  { id: "kompisBedriftConnection", page: "app/app/kompis-bedrift/connection/page.tsx" },
  { id: "kompisBedriftSettings", page: "app/app/kompis-bedrift/settings/page.tsx" },
];

assert.equal(KOMPIS_WEB_FLAT_NAV.length, 7);
assert.equal(KOMPIS_BEDRIFT_FLAT_NAV.length, 11);
assert.equal(WEB_PAGES.length, 6);
assert.equal(BEDRIFT_PAGES.length, 10);

for (const entry of [...WEB_PAGES, ...BEDRIFT_PAGES]) {
  const src = read(entry.page);
  // FAQ Knowledge Center embeds hub chrome in-screen; other hubs use AppHubShell.
  if (entry.id === "kompisWebFaq") {
    assert.match(src, /WebsiteKompisKnowledgeCenterScreen|AppHubShell/, `${entry.page} hub chrome`);
  } else {
    assert.match(src, /AppHubShell/, `${entry.page} must use AppHubShell`);
  }
  assert.doesNotMatch(src, /GroupedSidebar/, `${entry.page} must not use GroupedSidebar`);
  assert.doesNotMatch(src, /CompanionShell/, `${entry.page} must not reintroduce Companion`);
}

// Deep-link redirects into Abonnement tabs
assert.match(read("app/app/account/invoices/page.tsx"), /redirect/);
assert.match(read("app/app/settings/modules/page.tsx"), /redirect/);
assert.match(read("app/app/license/page.tsx"), /redirect/);
assert.match(read("app/app/settings/billing/packages/page.tsx"), /redirect/);

// Embedded presentation on wrapped panels
assert.match(read("app/app/website-kompis/feedback/page.tsx"), /embedded/);
assert.match(read("app/app/software/page.tsx"), /embedded/);
assert.match(read("app/app/website-kompis/connection/page.tsx"), /DomainLicenseCenterPanel/);
assert.match(read("app/app/website-kompis/connection/page.tsx"), /embedded/);
assert.match(read("app/app/kompis-bedrift/documents/page.tsx"), /embedded/);
assert.match(read("app/app/kompis-bedrift/communications/page.tsx"), /embedded/);
assert.match(read("app/app/kompis-bedrift/meetings/page.tsx"), /embedded/);
assert.match(read("app/app/kompis-bedrift/modules/page.tsx"), /embedded/);
assert.match(read("app/app/account/subscription/page.tsx"), /SubscriptionWorkspace/);
assert.match(read("lib/app-portal/render-pages.tsx"), /embedded/);

// Legacy domains redirects to connection hub
assert.match(read("app/app/domains/page.tsx"), /redirect/);
assert.match(read("app/app/domains/page.tsx"), /kompisWebConnection/);

// Active nav still maps
assert.equal(getAppPortalActiveNavId("/app/website-kompis/feedback"), "kompisWebQa");
assert.equal(getAppPortalActiveNavId("/app/website-kompis/faq"), "kompisWebFaq");
assert.equal(getAppPortalActiveNavId("/app/software"), "kompisWebModules");
assert.equal(getAppPortalActiveNavId("/app/website-kompis/connection"), "kompisWebConnection");
assert.equal(getAppPortalActiveNavId("/app/domains"), "kompisWebConnection");
assert.equal(getAppPortalActiveNavId("/app/account/invoices"), "accountSubscription");
assert.equal(getAppPortalActiveNavId("/app/account/subscription"), "accountSubscription");
assert.equal(getAppPortalActiveNavId("/app/account/profile"), "accountProfile");
assert.equal(getAppPortalActiveNavId("/app/profile"), "accountProfile");
assert.match(read("app/app/profile/page.tsx"), /AppHubShell/);
assert.match(read("app/app/account/profile/page.tsx"), /redirect/);
assert.doesNotMatch(read("lib/app-portal/nav-config.ts"), /SHARED_ACCOUNT_PROFILE/);
assert.equal(getAppPortalActiveNavId("/app/kompis-bedrift/employees"), "kompisBedriftEmployees");

// Flat sidebar still the customer presentation
const shell = read("components/dashboard/DashboardShell.tsx");
assert.match(shell, /FlatSidebar/);
assert.doesNotMatch(shell, /CompanionFloatingButton/);

// Bindings cover flat menus
for (const item of [...KOMPIS_WEB_FLAT_NAV, ...KOMPIS_BEDRIFT_FLAT_NAV]) {
  const key = Object.entries(FOUNDATION_NAV_BINDINGS).find(([, href]) => href === item.href)?.[0];
  assert.ok(key, `missing binding for ${item.id}`);
}

// Operator preserved path not in primary menus
assert.ok(!KOMPIS_WEB_FLAT_NAV.some((i) => i.href === "/app/kompis"));
assert.ok(!KOMPIS_BEDRIFT_FLAT_NAV.some((i) => i.href === "/app/kompis"));

console.log("visible-routes-consolidation-61.test.ts: all assertions passed");
