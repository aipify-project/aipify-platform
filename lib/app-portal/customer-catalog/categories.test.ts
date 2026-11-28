import assert from "node:assert/strict";
import {
  parseDeclaredDependencies,
  resolveStoreCategoryId,
  sortStoreCategoryIds,
  storeCategoryLabelKey,
} from "./categories";

assert.equal(resolveStoreCategoryId({ productKey: "website_kompis", category: null }), "kompis");
assert.equal(resolveStoreCategoryId({ productKey: "aipify_voice", category: null }), "voice");
assert.equal(
  resolveStoreCategoryId({ productKey: "sales_partner", category: "sales_growth" }),
  "sales_growth"
);
assert.equal(resolveStoreCategoryId({ productKey: "design_pack", category: "addons" }), "addons");
assert.equal(resolveStoreCategoryId({ productKey: "buddy", category: "buddy" }), "kompis");
assert.equal(resolveStoreCategoryId({ productKey: "custom_tool", category: null }), "other");
assert.equal(storeCategoryLabelKey("sales_growth"), "salesGrowth");
assert.equal(storeCategoryLabelKey("mystery"), null);
assert.deepEqual(sortStoreCategoryIds(["voice", "all", "addons", "kompis", "zebra"]), [
  "all",
  "kompis",
  "voice",
  "addons",
  "zebra",
]);
assert.deepEqual(
  parseDeclaredDependencies({ depends_on: ["kompis_web", "bad key!", "kompis_web", "design_pack"] }),
  ["kompis_web", "design_pack"]
);
assert.deepEqual(
  parseDeclaredDependencies({
    depends_on_product_keys: ["kompis_bedrift", "kompis_web"],
    depends_on: ["ignored_when_primary_present"],
  }),
  ["kompis_bedrift", "kompis_web"]
);
assert.deepEqual(parseDeclaredDependencies({}), []);

console.log("categories.test.ts: OK");
