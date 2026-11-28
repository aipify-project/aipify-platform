import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PRODUCT_DEPENDENCY_SEMANTICS,
  PRODUCT_TAXONOMY_TYPES,
  parseTaxonomyFromCoreRow,
  taxonomyShowsDependencyPicker,
  toTaxonomyRpcArgs,
  validateProductTaxonomyInput,
} from "./product-taxonomy";

assert.equal(PRODUCT_DEPENDENCY_SEMANTICS, "all");
assert.deepEqual([...PRODUCT_TAXONOMY_TYPES], ["primary", "addon", "voice", "sales_growth", "other"]);

// Unconfigured primary-like empty
{
  const v = validateProductTaxonomyInput({
    productKey: "Kompis_Web",
    productType: null,
    categoryId: null,
    dependsOnProductKeys: [],
  });
  assert.equal(v.ok, true);
  if (v.ok) {
    assert.equal(v.payload.productKey, "kompis_web");
    assert.equal(v.payload.unconfigured, true);
  }
}

// Primary with category
{
  const v = validateProductTaxonomyInput({
    productKey: "kompis_web",
    productType: "primary",
    categoryId: "kompis",
    dependsOnProductKeys: [],
  });
  assert.equal(v.ok, true);
  if (v.ok) {
    assert.equal(v.payload.unconfigured, false);
    assert.equal(taxonomyShowsDependencyPicker(v.payload.productType), false);
  }
}

// Addon with ALL deps
{
  const v = validateProductTaxonomyInput({
    productKey: "design_pack",
    productType: "addon",
    categoryId: "addons",
    dependsOnProductKeys: ["kompis_web", "kompis_bedrift", "kompis_web"],
  });
  assert.equal(v.ok, true);
  if (v.ok) {
    assert.deepEqual(v.payload.dependsOnProductKeys, ["kompis_web", "kompis_bedrift"]);
    assert.equal(taxonomyShowsDependencyPicker(v.payload.productType), true);
  }
}

// Reject self-dep
{
  const v = validateProductTaxonomyInput({
    productKey: "design_pack",
    productType: "addon",
    categoryId: "addons",
    dependsOnProductKeys: ["design_pack"],
  });
  assert.equal(v.ok, false);
  if (!v.ok) assert.equal(v.error, "self_dependency");
}

// Reject invalid type / category
assert.equal(
  validateProductTaxonomyInput({
    productKey: "x",
    productType: "bundle",
    categoryId: null,
    dependsOnProductKeys: [],
  }).ok,
  false,
);
assert.equal(
  validateProductTaxonomyInput({
    productKey: "x",
    productType: "primary",
    categoryId: "ALL",
    dependsOnProductKeys: [],
  }).ok,
  false,
);

// Parse Core row + RPC args
{
  const snap = parseTaxonomyFromCoreRow({
    product_key: "design_pack",
    product_type: "addon",
    category_id: "addons",
    depends_on_product_keys: ["kompis_web"],
  });
  assert.ok(snap);
  assert.equal(snap?.unconfigured, false);
  assert.deepEqual(toTaxonomyRpcArgs(snap!), {
    p_product_key: "design_pack",
    p_product_type: "addon",
    p_category_id: "addons",
    p_depends_on_product_keys: ["kompis_web"],
  });
  const clear = toTaxonomyRpcArgs({
    productKey: "kompis_web",
    productType: null,
    categoryId: null,
    dependsOnProductKeys: [],
    unconfigured: true,
  });
  assert.equal(clear.p_product_type, "");
  assert.equal(clear.p_category_id, "");
}

// Contract: Agent 1 variant routes / upsert payload untouched by taxonomy module
const upsert = readFileSync(join(process.cwd(), "app/api/platform/sellers/products/route.ts"), "utf8");
assert.doesNotMatch(upsert, /csp_set_app_store_product_taxonomy/);
assert.doesNotMatch(upsert, /product_type/);
const variants = readFileSync(
  join(process.cwd(), "app/api/platform/sellers/products/variants/route.ts"),
  "utf8",
);
assert.doesNotMatch(variants, /csp_set_app_store_product_taxonomy/);
const taxonomyRoute = readFileSync(
  join(process.cwd(), "app/api/platform/sellers/products/taxonomy/route.ts"),
  "utf8",
);
assert.match(taxonomyRoute, /csp_set_app_store_product_taxonomy/);
assert.match(taxonomyRoute, /guardPrivilegedPlatformApi/);
assert.doesNotMatch(taxonomyRoute, /publish_app\s*[:=]\s*true/);
assert.doesNotMatch(taxonomyRoute, /csp_set_product_channel_flags/);

console.log("product-taxonomy.test.ts: PASS");
