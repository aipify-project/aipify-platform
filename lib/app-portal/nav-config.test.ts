import assert from "node:assert/strict";
import { APP_MOBILE_NAV_IDS } from "@/lib/app/nav-config";
import { APP_PORTAL_NAV_GROUPS } from "@/lib/app-portal/nav-config";
import { assertCanonicalNavIntegrity } from "@/lib/app-portal/canonical-nav";

function testHomeNavOrder() {
  const homeGroup = APP_PORTAL_NAV_GROUPS.find((group) => group.id === "home");
  assert.ok(homeGroup, "home nav group exists");
  assert.deepEqual(
    homeGroup.items.map((item) => item.id),
    ["appDashboard", "commandBrief", "sinceLastLogin", "appNotifications"],
  );
}

function testMobileNavDashboardFirst() {
  assert.equal(APP_MOBILE_NAV_IDS[0], "appDashboard");
  assert.equal(APP_MOBILE_NAV_IDS[1], "commandBrief");
}

function testCanonicalIntegrity() {
  assertCanonicalNavIntegrity();
  const businessPacks = APP_PORTAL_NAV_GROUPS.find((group) => group.id === "businessPacks");
  assert.ok(businessPacks?.items.some((item) => item.id === "softwareCatalog"));
}

testHomeNavOrder();
testMobileNavDashboardFirst();
testCanonicalIntegrity();

console.log("nav-config.test.ts: all assertions passed");
