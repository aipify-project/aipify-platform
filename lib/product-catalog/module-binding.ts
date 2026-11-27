/**
 * Product catalog SKU ↔ software module binding (read model for Platform + APP).
 * Purchasability stays in the catalog; entitlement stays in Core.
 */

import { getSoftwareModuleManifest } from "@/lib/app-module-manifest";
import { CANONICAL_PRODUCT_REGISTRY, getCanonicalProduct } from "./registry";

export type ProductModuleBinding = {
  productKey: string;
  moduleKey: string | null;
  moduleCanonicalRoute: string | null;
  moduleReadiness: string | null;
  appMenuEligible: boolean;
};

export function resolveProductModuleBinding(productKey: string): ProductModuleBinding {
  const product = getCanonicalProduct(productKey);
  const moduleKey = product?.moduleKey ?? null;
  const manifest = moduleKey ? getSoftwareModuleManifest(moduleKey) : null;
  return {
    productKey,
    moduleKey,
    moduleCanonicalRoute: manifest?.canonicalRoute ?? null,
    moduleReadiness: manifest?.readiness ?? null,
    appMenuEligible:
      Boolean(manifest) &&
      (manifest!.readiness === "activated" ||
        manifest!.readiness === "implemented" ||
        manifest!.readiness === "test_ready"),
  };
}

export function listProductModuleBindings(): ProductModuleBinding[] {
  return CANONICAL_PRODUCT_REGISTRY.map((product) =>
    resolveProductModuleBinding(product.productKey)
  );
}
