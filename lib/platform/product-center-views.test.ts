import assert from "node:assert/strict";
import { test } from "node:test";
import {
  countProductCenterChannels,
  filterProductCenterView,
  parseProductCenterView,
} from "./product-center-views";

test("parseProductCenterView defaults and accepts known tabs", () => {
  assert.equal(parseProductCenterView(null), "products");
  assert.equal(parseProductCenterView("sale"), "sale");
  assert.equal(parseProductCenterView("nope"), "products");
});

test("counts treat one dual-channel product as one total", () => {
  const counts = countProductCenterChannels([
    {
      app: { visibleInStore: true },
      sale: { visibleInStore: true, status: "published" },
    },
    {
      app: { visibleInStore: false },
      sale: { visibleInStore: false, status: "draft" },
    },
  ]);
  assert.equal(counts.total, 2);
  assert.equal(counts.appPublished, 1);
  assert.equal(counts.salePublished, 1);
  assert.equal(counts.draft, 1);
});

test("channel views filter the same register", () => {
  const rows = [
    {
      productKey: "a",
      category: "kompis",
      app: { visibleInStore: true },
      sale: { visibleInStore: false },
    },
    {
      productKey: "b",
      category: "voice",
      app: { visibleInStore: false },
      sale: { visibleInStore: true },
    },
  ];
  assert.deepEqual(
    filterProductCenterView(rows, "app").map((r) => r.productKey),
    ["a"],
  );
  assert.deepEqual(
    filterProductCenterView(rows, "sale").map((r) => r.productKey),
    ["b"],
  );
  assert.equal(filterProductCenterView(rows, "products").length, 2);
});

console.log("product center views contract passed");
