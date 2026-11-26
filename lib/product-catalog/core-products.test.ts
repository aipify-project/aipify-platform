import assert from "node:assert/strict";
import {
  parseCoreSalesProductRow,
  parsePlatformOverviewProducts,
} from "./core-products";

const row = parseCoreSalesProductRow({
  id: "uuid-1",
  product_key: "kompis_web",
  title: "Website Companion",
  currency: "NOK",
  fixed_commission_amount: 500,
  published: true,
  publish_sale: true,
  publish_app: false,
});
assert.ok(row);
assert.equal(row.productKey, "kompis_web");
assert.equal(row.fixedCommissionAmount, 500);
assert.equal(row.publishSale, true);
assert.equal(row.publishApp, false);
assert.equal(row.published, true);

const camel = parseCoreSalesProductRow({
  id: "uuid-2",
  productKey: "Kompis_Bedrift",
  publishSale: false,
  publishApp: true,
  published: false,
  fixedCommissionAmount: 800,
  currency: "NOK",
});
assert.ok(camel);
assert.equal(camel.productKey, "kompis_bedrift");
assert.equal(camel.publishApp, true);
assert.equal(camel.publishSale, false);

assert.equal(parseCoreSalesProductRow({ title: "no id" }), null);

const products = parsePlatformOverviewProducts({
  products: [
    {
      id: "a",
      product_key: "aipify_voice",
      published: false,
      publish_sale: false,
      publish_app: false,
      fixed_commission_amount: 0,
      currency: "NOK",
    },
  ],
});
assert.equal(products.length, 1);
assert.equal(products[0]?.productKey, "aipify_voice");
assert.equal(products[0]?.fixedCommissionAmount, 0);

console.log("core-products.test.ts: ok");
