import assert from "node:assert/strict";
import test from "node:test";
import { LOCALES } from "@/lib/i18n/config";
import {
  CSP_CATALOG_PRODUCTS,
  filterCspCatalogProducts,
  getLocalizedCspCatalogProducts,
  localizeCspCatalogProduct,
} from "./product-catalog-display";

test("catalog: three products, voice is future and not sellable", () => {
  assert.deepEqual(CSP_CATALOG_PRODUCTS.map((p) => p.key), ["kompis_web", "kompis_bedrift", "aipify_voice"]);
  const voice = CSP_CATALOG_PRODUCTS.find((p) => p.key === "aipify_voice")!;
  assert.equal(voice.future, true);
  assert.equal(voice.sellable, false);
  assert.equal(voice.plannedReferencePrice, null);
});

test("catalog: filters by category", () => {
  assert.equal(filterCspCatalogProducts("all").length, 3);
  assert.deepEqual(filterCspCatalogProducts("kompis").map((p) => p.key), ["kompis_web", "kompis_bedrift"]);
  assert.deepEqual(filterCspCatalogProducts("voice").map((p) => p.key), ["aipify_voice"]);
});

test("catalog: every product has text for every locale and no commission data", () => {
  for (const product of CSP_CATALOG_PRODUCTS) {
    for (const locale of LOCALES) {
      const localized = localizeCspCatalogProduct(product, locale);
      assert.ok(localized.title.length > 0 && localized.description.length > 0);
    }
    assert.equal("commission" in product, false);
  }
  assert.equal(getLocalizedCspCatalogProducts("no")[0].description.includes("Nettstedskompisen"), true);
});

test("catalog: planned price is marked planned_not_stripe_live", () => {
  const web = CSP_CATALOG_PRODUCTS.find((p) => p.key === "kompis_web")!;
  assert.equal(web.plannedReferencePrice?.status, "planned_not_stripe_live");
});
