import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CSP_SALES_MATERIALS_CATALOG,
  listPublishedSalesMaterials,
} from "./sales-materials-catalog";

describe("sales-materials-catalog", () => {
  it("exposes only published items by default", () => {
    const rows = listPublishedSalesMaterials();
    assert.ok(rows.length > 0);
    assert.ok(rows.every((r) => r.published));
    assert.equal(
      rows.length,
      CSP_SALES_MATERIALS_CATALOG.filter((r) => r.published).length,
    );
  });

  it("filters by product key without inventing assets", () => {
    const web = listPublishedSalesMaterials({ productKey: "kompis_web" });
    assert.ok(web.every((r) => r.productKeys.length === 0 || r.productKeys.includes("kompis_web")));
    const unknown = listPublishedSalesMaterials({ productKey: "not_a_real_product" });
    assert.ok(unknown.every((r) => r.productKeys.length === 0));
  });
});
