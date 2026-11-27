import assert from "node:assert/strict";
import test from "node:test";
import {
  SELLERS_HUB_TABS,
  getSellersHubActiveTabId,
  getSellersSidebarNavId,
  shouldShowSellersHubTabs,
} from "./sellers-hub";

test("sellers hub tabs cover all existing admin routes", () => {
  assert.equal(SELLERS_HUB_TABS.length, 13);
  assert.equal(getSellersSidebarNavId("/platform/sellers/partners"), "sellersOverview");
  assert.equal(getSellersHubActiveTabId("/platform/sellers"), "overview");
  assert.equal(getSellersHubActiveTabId("/platform/sellers/settlements"), "settlements");
  assert.equal(shouldShowSellersHubTabs("/platform/sellers/partners"), true);
  assert.equal(shouldShowSellersHubTabs("/platform/sellers/partners/abc"), false);
});

console.log("platform-sellers-hub: all tests passed");
