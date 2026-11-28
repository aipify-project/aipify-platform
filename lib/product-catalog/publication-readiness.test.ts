import assert from "node:assert/strict";
import {
  assessPublicationReadiness,
  buildRegistryPublicationChecklist,
  readinessInputFromCatalogProduct,
} from "./publication-readiness";
import { buildUnifiedCatalog, filterAppStoreProducts } from "./merge";
import { PRODUCT_CATALOG_FIELD_OWNERSHIP } from "./field-ownership";
import { toAppStorefrontProduct } from "./app-storefront-view-model";

assert.equal(PRODUCT_CATALOG_FIELD_OWNERSHIP.productType, "core_csp_sales_products");
assert.equal(PRODUCT_CATALOG_FIELD_OWNERSHIP.localeCopyApproved, "core_channel_sql_pending");

const unpublished = assessPublicationReadiness({
  productKey: "kompis_web",
  coreProductId: "uuid-1",
  channelSchemaAvailable: true,
  publishApp: false,
  publishSale: true,
  masterActive: true,
  titleFromCore: null,
  productType: "primary",
  categoryId: "kompis",
  dependsOnProductKeys: [],
  localeCopyFromCore: false,
  mediaFromCore: false,
  registryLogoSrc: "/brand/kompis.svg",
  registryHeroSrc: null,
  variantsSource: "planned",
  variants: [
    {
      variantKey: "a",
      monthlyAmount: null,
      yearlyAmount: null,
      oneTimeAmount: null,
      hasPaidCustomerPrice: false,
    },
    {
      variantKey: "b",
      monthlyAmount: 0,
      yearlyAmount: null,
      oneTimeAmount: null,
      hasPaidCustomerPrice: false,
    },
    {
      variantKey: "c",
      monthlyAmount: 599,
      yearlyAmount: 5990,
      oneTimeAmount: null,
      hasPaidCustomerPrice: true,
    },
  ],
  fixedCommissionAmount: 500,
  currency: "NOK",
});

assert.equal(unpublished.checkoutFailClosed, true);
assert.equal(unpublished.appStripsCommission, true);
assert.equal(unpublished.storefrontCoreComplete, false);
assert.equal(unpublished.appListingFromCore, false);
assert.equal(unpublished.saleListingFromCore, true);
assert.ok(unpublished.missingForHonestPublication.includes("localeCopy"));
assert.ok(unpublished.missingForHonestPublication.includes("media"));
assert.ok(unpublished.missingForHonestPublication.includes("variants"));
assert.ok(unpublished.nextCoreCandidates.length >= 3);

const publishedApp = assessPublicationReadiness({
  productKey: "kompis_web",
  coreProductId: "uuid-1",
  channelSchemaAvailable: true,
  publishApp: true,
  publishSale: false,
  masterActive: true,
  titleFromCore: "Website Companion",
  productType: "primary",
  categoryId: "kompis",
  dependsOnProductKeys: [],
  localeCopyFromCore: true,
  mediaFromCore: true,
  registryLogoSrc: "/brand/kompis.svg",
  registryHeroSrc: null,
  variantsSource: "core",
  variants: [
    {
      variantKey: "c",
      monthlyAmount: 599,
      yearlyAmount: 5990,
      oneTimeAmount: null,
      hasPaidCustomerPrice: true,
    },
  ],
  fixedCommissionAmount: 500,
  currency: "NOK",
});
assert.equal(publishedApp.appListingFromCore, true);
assert.equal(publishedApp.saleListingFromCore, false);
assert.equal(publishedApp.storefrontCoreComplete, true);

const addonMissingDeps = assessPublicationReadiness({
  productKey: "aipify_voice",
  coreProductId: "uuid-2",
  channelSchemaAvailable: true,
  publishApp: true,
  publishSale: false,
  masterActive: true,
  titleFromCore: null,
  productType: "addon",
  categoryId: "voice",
  dependsOnProductKeys: [],
  localeCopyFromCore: false,
  mediaFromCore: false,
  registryLogoSrc: null,
  registryHeroSrc: null,
  variantsSource: "empty",
  variants: [],
  fixedCommissionAmount: null,
  currency: null,
});
assert.ok(
  addonMissingDeps.items.some(
    (i) => i.field === "dependsOnProductKeys" && i.status === "core_missing",
  ),
);

const emptyCoreChannel = buildUnifiedCatalog({
  locale: "en",
  coreProducts: [],
  coreChannelApplied: true,
});
assert.equal(filterAppStoreProducts(emptyCoreChannel).length, 0);

const withCore = buildUnifiedCatalog({
  locale: "no",
  coreChannelApplied: true,
  coreProducts: [
    {
      id: "uuid-web",
      productKey: "kompis_web",
      currency: "NOK",
      fixedCommissionAmount: 500,
      published: true,
      publishApp: true,
      publishSale: true,
      productType: "primary",
      categoryId: "kompis",
      dependsOnProductKeys: [],
    },
  ],
});
const web = withCore.find((p) => p.productKey === "kompis_web");
assert.ok(web);
const storefront = toAppStorefrontProduct(web!);
assert.ok(!("commission" in storefront));
assert.ok(
  storefront.checkoutCta.kind !== "buy" ||
    (storefront.checkoutCta.kind === "buy" && storefront.checkoutCta.enabled === false),
);

const fromCatalog = readinessInputFromCatalogProduct({
  product: web!,
  channelSchemaAvailable: true,
  masterActive: true,
  variantsSource: "planned",
});
assert.equal(fromCatalog.localeCopyFromCore, false);
assert.equal(fromCatalog.mediaFromCore, false);
assert.equal(fromCatalog.publishApp, true);

const checklist = buildRegistryPublicationChecklist({ channelSchemaAvailable: true });
assert.ok(checklist.length >= 2);
assert.ok(checklist.every((row) => row.checkoutFailClosed === true));
assert.ok(checklist.every((row) => row.storefrontCoreComplete === false));
assert.ok(checklist.every((row) => row.appStripsCommission === true));

const unauthorizedShape = assessPublicationReadiness({
  productKey: "kompis_web",
  coreProductId: null,
  channelSchemaAvailable: false,
  publishApp: null,
  publishSale: null,
  masterActive: null,
  titleFromCore: null,
  productType: null,
  categoryId: null,
  dependsOnProductKeys: [],
  localeCopyFromCore: false,
  mediaFromCore: false,
  registryLogoSrc: null,
  registryHeroSrc: null,
  variantsSource: "empty",
  variants: [],
  fixedCommissionAmount: null,
  currency: null,
});
assert.equal(unauthorizedShape.channelFlagsSavable, false);
assert.equal(unauthorizedShape.appListingFromCore, false);

console.log("publication-readiness.test.ts: ok");
console.log(
  JSON.stringify(
    {
      checklist_count: checklist.length,
      sample_missing: checklist[0]?.missingForHonestPublication,
      products: checklist.map((r) => ({
        productKey: r.productKey,
        appListingFromCore: r.appListingFromCore,
        storefrontCoreComplete: r.storefrontCoreComplete,
        missing: r.missingForHonestPublication,
      })),
    },
    null,
    2,
  ),
);
