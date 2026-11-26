import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

test("Product Center exposes Shopify-style top tabs on sellers products", () => {
  const live = read("components/platform/sellers/CertifiedSellersLivePanel.tsx");
  assert.match(live, /PRODUCT_CENTER_VIEWS/);
  assert.match(live, /productCenterTabProducts/);
  assert.match(live, /productCenterTabCategories/);
  assert.match(live, /productCenterTabApp/);
  assert.match(live, /productCenterTabSale/);
  assert.match(live, /productCenterTabMedia/);
  assert.match(live, /ProductCenterWorkspace/);
  assert.match(live, /onEditProduct/);
  assert.match(live, /onNewProduct/);
});

test("register table supports counts, search, and edit without empty create-as-edit ambiguity", () => {
  const table = read("components/platform/sellers/UnifiedProductRegisterTable.tsx");
  assert.match(table, /countProductCenterChannels/);
  assert.match(table, /onNewProduct/);
  assert.match(table, /onEditProduct/);
  assert.match(table, /listPendingNote/);
});

test("partner SALE catalog filters through unified sale channel", () => {
  const panel = read("components/partners-portal/CertifiedSalesPartnerProductCatalogPanel.tsx");
  assert.match(panel, /filterSalesCatalogProducts/);
  assert.match(panel, /buildUnifiedCatalog/);
  assert.match(panel, /Never APP-only/);
});

test("RPC staging approval still names exact SHA gate", () => {
  const doc = read("docs/platform/UNIFIED_PRODUCT_CATALOG_CHANNEL_RPC_V1_STAGING_APPROVAL.md");
  assert.match(doc, /1a4cf73ea426119dd913564e9fc0d5215b921018530553f17f13f72d9f8dee24/);
  assert.match(doc, /absent/);
});

console.log("product center UI contract passed");
