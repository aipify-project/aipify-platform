/**
 * Channel matrix evidence that can run without Staging RPC apply.
 * Live Core write/read of publish_app is BLOCKED_BY_EXACT_SQL_APPROVAL.
 */
import assert from "node:assert/strict";
import {
  assertChannelIsolation,
  buildUnifiedCatalog,
  filterAppStoreProducts,
  filterSalesCatalogProducts,
} from "./merge";

type MatrixRow = {
  label: string;
  publishApp: boolean;
  publishSale: boolean;
  expectAppVisible: boolean;
  expectSaleVisible: boolean;
};

const MATRIX: MatrixRow[] = [
  { label: "none", publishApp: false, publishSale: false, expectAppVisible: false, expectSaleVisible: false },
  { label: "app_only", publishApp: true, publishSale: false, expectAppVisible: true, expectSaleVisible: false },
  { label: "sale_only", publishApp: false, publishSale: true, expectAppVisible: false, expectSaleVisible: true },
  { label: "both", publishApp: true, publishSale: true, expectAppVisible: true, expectSaleVisible: true },
];

for (const row of MATRIX) {
  const catalog = buildUnifiedCatalog({
    locale: "no",
    coreProducts: [
      {
        id: "fixture-web",
        productKey: "kompis_web",
        currency: "NOK",
        fixedCommissionAmount: 500,
        published: row.publishSale,
        publishSale: row.publishSale,
        publishApp: row.publishApp,
      },
    ],
  });
  const web = catalog.find((p) => p.productKey === "kompis_web");
  assert.ok(web, row.label);
  assert.equal(web.app.visibleInStore, row.expectAppVisible, `${row.label} APP`);
  assert.equal(web.sale.visibleInStore, row.expectSaleVisible, `${row.label} SALE`);
  assert.equal(filterAppStoreProducts(catalog).some((p) => p.productKey === "kompis_web"), row.expectAppVisible);
  assert.equal(filterSalesCatalogProducts(catalog).some((p) => p.productKey === "kompis_web"), row.expectSaleVisible);
  if (web.commission.kind === "fixed") {
    assert.equal(web.commission.amount, 500, `${row.label} commission`);
  }
}

// SALE legacy published (no publishSale field) still drives SALE when Core row exists.
const legacy = buildUnifiedCatalog({
  locale: "en",
  coreProducts: [
    {
      id: "legacy",
      productKey: "kompis_bedrift",
      currency: "NOK",
      fixedCommissionAmount: 800,
      published: true,
    },
  ],
});
const bedrift = legacy.find((p) => p.productKey === "kompis_bedrift");
assert.equal(bedrift?.sale.visibleInStore, true);
assert.equal(bedrift?.app.visibleInStore, false);
assert.equal(bedrift?.app.status, "blocked_needs_sql");

const isolation = assertChannelIsolation(
  buildUnifiedCatalog({
    locale: "en",
    coreProducts: [
      {
        id: "v",
        productKey: "aipify_voice",
        currency: "NOK",
        fixedCommissionAmount: 0,
        published: true,
        publishSale: true,
        publishApp: false,
      },
    ],
  }),
);
assert.ok(isolation.saleOnlyKeys.includes("aipify_voice"));

console.log(
  JSON.stringify({
    unit_matrix: "PASS",
    live_core_publish_app_write_read: "BLOCKED_BY_EXACT_SQL_APPROVAL",
    rpc_candidate:
      "docs/platform/sql-candidates/unified_product_catalog_channel_rpc_v1.sql",
    sha256: "1a4cf73ea426119dd913564e9fc0d5215b921018530553f17f13f72d9f8dee24",
  }),
);
console.log("channel-e2e-matrix.test.ts: ok");
