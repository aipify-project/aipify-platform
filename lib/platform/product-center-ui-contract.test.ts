import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

test("Product Center list navigates to separate create/edit routes", () => {
  const live = read("components/platform/sellers/CertifiedSellersLivePanel.tsx");
  assert.match(live, /PRODUCT_CENTER_VIEWS/);
  assert.match(live, /ProductCenterWorkspace/);
  assert.match(live, /\/platform\/sellers\/products\/new/);
  assert.match(live, /\/platform\/sellers\/products\/\$\{encodeURIComponent\(productKey\)\}/);
  assert.doesNotMatch(live, /CertifiedSellersActionPanel[\s\S]{0,80}section="products"/);
});

test("Shopify product editor exists with sticky save and channel picker", () => {
  const editor = read("components/platform/sellers/ProductShopifyEditor.tsx");
  assert.match(editor, /sticky top-0/);
  assert.match(editor, /Publishing channels|channelsCardTitle|channelApp/);
  assert.match(editor, /statusActive|statusDraft|statusUnlisted/);
  assert.match(editor, /lg:grid-cols-\[minmax\(0,2fr\)_minmax\(16rem,1fr\)\]/);
  assert.match(editor, /ProductVariantBuilder/);
  assert.match(editor, /variants_json|variantsForProduct/);
});

test("premium catalog card and variant SQL candidate are prepared", () => {
  const card = read("components/shared/product-catalog/PremiumProductCatalogCard.tsx");
  assert.match(card, /data-catalog-mode/);
  assert.match(card, /resolveAppCheckoutCta/);
  assert.doesNotMatch(card, /Stripe Checkout Session/i);
  const sql = read("docs/platform/sql-candidates/csp_product_variants_billing_v1.sql");
  assert.match(sql, /PREPARED_ONLY/);
  assert.match(sql, /csp_product_variants/);
});

test("create and edit product pages are routed separately from the list", () => {
  assert.equal(existsSync("app/platform/sellers/products/new/page.tsx"), true);
  assert.equal(existsSync("app/platform/sellers/products/[productKey]/page.tsx"), true);
  const create = read("app/platform/sellers/products/new/page.tsx");
  const edit = read("app/platform/sellers/products/[productKey]/page.tsx");
  assert.match(create, /ProductEditorPageClient/);
  assert.match(edit, /ProductEditorPageClient/);
  assert.match(create, /mode="create"/);
  assert.match(edit, /mode="edit"/);
  assert.match(create, /max-w-\[1560px\]/);
  assert.match(edit, /max-w-\[1560px\]/);
});

test("SALE catalog hides free-plan commission and prefers certificate CTA when passed", () => {
  const panel = read("components/partners-portal/CertifiedSalesPartnerProductCatalogPanel.tsx");
  assert.match(panel, /variantHasPaidCustomerPrice/);
  assert.match(panel, /commissionNone/);
  assert.match(panel, /viewCertificate/);
  assert.match(panel, /\/partners\/academy\/certifications/);
});

test("register table supports compact channels column and clickable name", () => {
  const table = read("components/platform/sellers/UnifiedProductRegisterTable.tsx");
  assert.match(table, /countProductCenterChannels/);
  assert.match(table, /onNewProduct/);
  assert.match(table, /onEditProduct/);
  assert.match(table, /colChannels/);
  assert.match(table, /channelsBoth/);
  assert.match(table, /hover:underline/);
});

test("partner SALE catalog filters through unified sale channel", () => {
  const panel = read("components/partners-portal/CertifiedSalesPartnerProductCatalogPanel.tsx");
  const storefront = read("lib/product-catalog/partner-storefront-view-model.ts");
  assert.match(panel, /buildPartnerStorefrontViewModel/);
  assert.match(panel, /PremiumProductCatalogCard/);
  assert.match(panel, /mode="sale"/);
  assert.match(panel, /Never APP-only/);
  assert.match(storefront, /filterSalesCatalogProducts/);
  assert.match(storefront, /buildUnifiedCatalog/);
  assert.match(storefront, /authoritativeEmpty/);
});

test("partner SALE catalog resolves variant commission from Core slots", () => {
  const panel = read("components/partners-portal/CertifiedSalesPartnerProductCatalogPanel.tsx");
  assert.match(panel, /resolvePartnerSaleCommissionText/);
  assert.match(panel, /commissionNotConfigured/);
  assert.match(panel, /productLevelCommissionEstimate/);
});

test("RPC staging approval still names exact SHA gate", () => {
  const doc = read("docs/platform/UNIFIED_PRODUCT_CATALOG_CHANNEL_RPC_V1_STAGING_APPROVAL.md");
  assert.match(doc, /1a4cf73ea426119dd913564e9fc0d5215b921018530553f17f13f72d9f8dee24/);
  assert.match(doc, /absent/);
});

console.log("product center UI contract passed");
