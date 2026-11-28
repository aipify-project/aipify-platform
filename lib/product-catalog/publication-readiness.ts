/**
 * Product Center → APP / Partner publication readiness.
 * Feature owner: PLATFORM ADMIN (Product Center) + CUSTOMER APP storefront contract.
 *
 * Honest assessment only — never pretends registry/planned copy is Core-published truth.
 * Does not flip publish flags, write SQL, or invent locale/media Core writers.
 */

import { PRODUCT_CATALOG_FIELD_OWNERSHIP } from "./field-ownership";
import { CANONICAL_PRODUCT_REGISTRY } from "./registry";
import type { UnifiedCatalogProduct } from "./types";
import { variantHasPaidCustomerPrice } from "./quota-labels";

export type PublicationFieldStatus =
  | "core_ready"
  | "core_missing"
  | "registry_only"
  | "planned_not_core"
  | "blocked"
  | "not_applicable";

export type PublicationReadinessItem = {
  field: string;
  status: PublicationFieldStatus;
  owner: string;
  detail: string;
};

export type PublicationReadinessReport = {
  productKey: string;
  items: PublicationReadinessItem[];
  /** Channel flags may be saved when Core product row + channel RPC exist. */
  channelFlagsSavable: boolean;
  /** Storefront presentation is complete from Core (locale + media + prices). Always false until Core contracts land. */
  storefrontCoreComplete: boolean;
  /** Safe to claim APP store listing will show this product from Core publish_app. */
  appListingFromCore: boolean;
  /** Safe to claim SALE partner catalog will show this product from Core publish_sale. */
  saleListingFromCore: boolean;
  /** Checkout must stay fail-closed. */
  checkoutFailClosed: true;
  /** APP payloads must never include partner commission. */
  appStripsCommission: true;
  missingForHonestPublication: string[];
  nextCoreCandidates: string[];
};

export type PublicationReadinessInput = {
  productKey: string;
  coreProductId: string | null;
  channelSchemaAvailable: boolean;
  publishApp: boolean | null;
  publishSale: boolean | null;
  masterActive: boolean | null;
  /** Title returned from Core row (not editor draft). */
  titleFromCore: string | null;
  productType: string | null;
  categoryId: string | null;
  dependsOnProductKeys: string[];
  /** True only when Core locale copy RPC/table is read and approved. */
  localeCopyFromCore: boolean;
  /** True only when Core logo_path/hero_path (or equivalent) is set. */
  mediaFromCore: boolean;
  registryLogoSrc: string | null;
  registryHeroSrc: string | null;
  variantsSource: "core" | "planned" | "empty";
  /** Active variants for price honesty checks. */
  variants: Array<{
    variantKey: string;
    monthlyAmount: number | null;
    yearlyAmount: number | null;
    oneTimeAmount: number | null;
    hasPaidCustomerPrice: boolean;
  }>;
  fixedCommissionAmount: number | null;
  currency: string | null;
};

function item(
  field: string,
  status: PublicationFieldStatus,
  owner: string,
  detail: string,
): PublicationReadinessItem {
  return { field, status, owner, detail };
}

export function assessPublicationReadiness(
  input: PublicationReadinessInput,
): PublicationReadinessReport {
  const key = input.productKey.trim().toLowerCase();
  const hasCoreRow = Boolean(input.coreProductId);
  const items: PublicationReadinessItem[] = [];

  items.push(
    item(
      "coreProductRow",
      hasCoreRow ? "core_ready" : "core_missing",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.coreProductId,
      hasCoreRow ? "Core product row present." : "No Core product row — create/save product first.",
    ),
  );

  items.push(
    item(
      "channelSchema",
      input.channelSchemaAvailable ? "core_ready" : "core_missing",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.publishApp,
      input.channelSchemaAvailable
        ? "Channel flags RPC/schema available."
        : "Channel schema/RPC not available — flags cannot be treated as Core truth.",
    ),
  );

  items.push(
    item(
      "publishApp",
      input.publishApp === true
        ? "core_ready"
        : input.publishApp === false
          ? "core_ready"
          : "core_missing",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.publishApp,
      input.publishApp === true
        ? "publish_app=true in Core (listing still requires master_active)."
        : input.publishApp === false
          ? "publish_app=false — not listed in APP store."
          : "publish_app unknown — not Core-confirmed.",
    ),
  );

  items.push(
    item(
      "publishSale",
      input.publishSale === true
        ? "core_ready"
        : input.publishSale === false
          ? "core_ready"
          : "core_missing",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.publishSale,
      input.publishSale === true
        ? "publish_sale=true in Core."
        : input.publishSale === false
          ? "publish_sale=false — not listed in partner SALE catalog."
          : "publish_sale unknown — not Core-confirmed.",
    ),
  );

  items.push(
    item(
      "masterActive",
      input.masterActive === true
        ? "core_ready"
        : input.masterActive === false
          ? "core_ready"
          : "core_missing",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.publishApp,
      input.masterActive === true
        ? "master_active=true."
        : input.masterActive === false
          ? "master_active=false — APP list RPC excludes this product."
          : "master_active unknown from overview.",
    ),
  );

  items.push(
    item(
      "title",
      input.titleFromCore
        ? "core_ready"
        : "registry_only",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.copy,
      input.titleFromCore
        ? "Core returned a title string (locale-approved copy still pending)."
        : "Title for cards comes from registry/editor draft — not Core locale copy.",
    ),
  );

  items.push(
    item(
      "localeCopy",
      input.localeCopyFromCore ? "core_ready" : "registry_only",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.localeCopyApproved,
      input.localeCopyFromCore
        ? "Approved locale copy read from Core."
        : "Locale title/tagline/description are not stored in Core yet (editor drafts are local-only).",
    ),
  );

  items.push(
    item(
      "media",
      input.mediaFromCore
        ? "core_ready"
        : input.registryLogoSrc || input.registryHeroSrc
          ? "registry_only"
          : "core_missing",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.mediaPathsPersisted,
      input.mediaFromCore
        ? "Core media paths present."
        : input.registryLogoSrc || input.registryHeroSrc
          ? "Cards use registry brand marks — Core media upload is blocked."
          : "No Core media and no registry image.",
    ),
  );

  items.push(
    item(
      "productType",
      input.productType ? "core_ready" : "core_missing",
      "core_csp_sales_products",
      input.productType
        ? `product_type=${input.productType}.`
        : "product_type unconfigured in Core.",
    ),
  );

  items.push(
    item(
      "categoryId",
      input.categoryId ? "core_ready" : "core_missing",
      "core_csp_sales_products",
      input.categoryId
        ? `category_id=${input.categoryId}.`
        : "category_id unconfigured in Core.",
    ),
  );

  const isAddon = input.productType === "addon";
  items.push(
    item(
      "dependsOnProductKeys",
      !isAddon
        ? "not_applicable"
        : input.dependsOnProductKeys.length > 0
          ? "core_ready"
          : "core_missing",
      "core_csp_sales_products",
      !isAddon
        ? "Dependencies apply to add-ons (ALL semantics)."
        : input.dependsOnProductKeys.length > 0
          ? `ALL deps: ${input.dependsOnProductKeys.join(", ")}.`
          : "Add-on has no depends_on_product_keys configured.",
    ),
  );

  items.push(
    item(
      "variants",
      input.variantsSource === "core"
        ? "core_ready"
        : input.variantsSource === "planned"
          ? "planned_not_core"
          : "core_missing",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.variants,
      input.variantsSource === "core"
        ? "Variants loaded from Core."
        : input.variantsSource === "planned"
          ? "Variant prices are planned catalog reference — not Core-published billing."
          : "No variants available.",
    ),
  );

  const freeOrNull = input.variants.filter((v) => !v.hasPaidCustomerPrice);
  const paidWithNullish = input.variants.filter(
    (v) =>
      v.hasPaidCustomerPrice === false &&
      v.monthlyAmount == null &&
      v.yearlyAmount == null &&
      v.oneTimeAmount == null,
  );
  items.push(
    item(
      "prices",
      input.variantsSource === "core"
        ? "core_ready"
        : input.variantsSource === "planned"
          ? "planned_not_core"
          : "core_missing",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.variantPrices,
      input.variants.length === 0
        ? "No prices to show — null is not free."
        : `Variants=${input.variants.length}; free/unpriced=${freeOrNull.length}; explicit null amounts=${paidWithNullish.length}. Null ≠ free; explicit 0 is free.`,
    ),
  );

  items.push(
    item(
      "commission",
      input.fixedCommissionAmount != null && input.currency
        ? "core_ready"
        : "core_missing",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.fixedCommissionAmount,
      input.fixedCommissionAmount != null && input.currency
        ? `Fixed commission ${input.fixedCommissionAmount} ${input.currency} (SALE/Partner only — never APP).`
        : "No fixed commission configured for SALE.",
    ),
  );

  items.push(
    item(
      "checkout",
      "blocked",
      PRODUCT_CATALOG_FIELD_OWNERSHIP.checkoutLive,
      "Buy/Upgrade remain fail-closed until authorized checkout + dependency enforcement.",
    ),
  );

  const missingForHonestPublication = items
    .filter((row) =>
      ["core_missing", "registry_only", "planned_not_core", "blocked"].includes(row.status),
    )
    .filter((row) =>
      [
        "localeCopy",
        "media",
        "variants",
        "prices",
        "checkout",
        "productType",
        "categoryId",
        "dependsOnProductKeys",
        "coreProductRow",
        "channelSchema",
      ].includes(row.field),
    )
    .filter((row) => row.status !== "not_applicable")
    .map((row) => row.field);

  const nextCoreCandidates: string[] = [];
  if (!input.localeCopyFromCore) {
    nextCoreCandidates.push(
      "Core locale copy writer/reader (csp_product_locale_copy or equivalent) — separate YES",
    );
  }
  if (!input.mediaFromCore) {
    nextCoreCandidates.push(
      "Core media path persistence (logo_path/hero_path) + upload — separate YES",
    );
  }
  if (input.variantsSource !== "core") {
    nextCoreCandidates.push(
      "Core variants/prices as authoritative APP/Partner prices (Agent 1 ownership) — separate YES",
    );
  }
  nextCoreCandidates.push(
    "Authorized checkout session + server-side dependency gate before enabling Buy — separate YES",
  );

  const channelFlagsSavable = hasCoreRow && input.channelSchemaAvailable;
  const storefrontCoreComplete =
    input.localeCopyFromCore &&
    input.mediaFromCore &&
    input.variantsSource === "core";
  const appListingFromCore =
    hasCoreRow &&
    input.channelSchemaAvailable &&
    input.publishApp === true &&
    input.masterActive !== false;
  const saleListingFromCore =
    hasCoreRow &&
    input.channelSchemaAvailable &&
    input.publishSale === true;

  return {
    productKey: key,
    items,
    channelFlagsSavable,
    storefrontCoreComplete,
    appListingFromCore,
    saleListingFromCore,
    checkoutFailClosed: true,
    appStripsCommission: true,
    missingForHonestPublication,
    nextCoreCandidates,
  };
}

/** Build readiness input from a unified catalog product + Core hints. */
export function readinessInputFromCatalogProduct(input: {
  product: UnifiedCatalogProduct;
  channelSchemaAvailable: boolean;
  masterActive?: boolean | null;
  localeCopyFromCore?: boolean;
  mediaFromCore?: boolean;
  variantsSource?: "core" | "planned" | "empty";
}): PublicationReadinessInput {
  const { product } = input;
  const variants = product.variants.filter((v) => v.active);
  const variantsSource =
    input.variantsSource ??
    (variants.length > 0 ? "planned" : "empty");

  return {
    productKey: product.productKey,
    coreProductId: product.coreProductId,
    channelSchemaAvailable: input.channelSchemaAvailable,
    publishApp:
      product.app.source === "core" ? product.app.visibleInStore : null,
    publishSale:
      product.sale.source === "core" ? product.sale.visibleInStore : null,
    masterActive: input.masterActive ?? null,
    // Title may be registry fallback even when a Core row exists — callers should
    // pass an explicit Core title via assessPublicationReadiness when known.
    titleFromCore: null,
    productType: product.productType,
    categoryId: product.productType ? product.storeCategoryId : null,
    dependsOnProductKeys: product.dependsOnProductKeys,
    localeCopyFromCore: input.localeCopyFromCore === true,
    mediaFromCore: input.mediaFromCore === true,
    registryLogoSrc: product.logoSrc,
    registryHeroSrc: product.heroImagePath,
    variantsSource,
    variants: variants.map((v) => ({
      variantKey: v.variantKey,
      monthlyAmount: v.monthlyPrice?.amountMajor ?? null,
      yearlyAmount: v.yearlyPrice?.amountMajor ?? null,
      oneTimeAmount: v.oneTimePrice?.amountMajor ?? null,
      hasPaidCustomerPrice: variantHasPaidCustomerPrice(v),
    })),
    fixedCommissionAmount:
      product.commission.kind === "fixed" ? product.commission.amount : null,
    currency: product.commission.kind === "fixed" ? product.commission.currency : null,
  };
}

/** Read-only checklist for every registry product (no PII, no Production writes). */
export function buildRegistryPublicationChecklist(input: {
  channelSchemaAvailable: boolean;
  coreByKey?: Map<
    string,
    {
      id: string;
      publishApp: boolean | null;
      publishSale: boolean | null;
      masterActive: boolean | null;
      title: string | null;
      productType: string | null;
      categoryId: string | null;
      dependsOnProductKeys: string[];
    }
  >;
}): PublicationReadinessReport[] {
  return CANONICAL_PRODUCT_REGISTRY.map((def) => {
    const core = input.coreByKey?.get(def.productKey);
    return assessPublicationReadiness({
      productKey: def.productKey,
      coreProductId: core?.id ?? null,
      channelSchemaAvailable: input.channelSchemaAvailable,
      publishApp: core?.publishApp ?? null,
      publishSale: core?.publishSale ?? null,
      masterActive: core?.masterActive ?? null,
      titleFromCore: core?.title ?? null,
      productType: core?.productType ?? null,
      categoryId: core?.categoryId ?? null,
      dependsOnProductKeys: core?.dependsOnProductKeys ?? [],
      localeCopyFromCore: false,
      mediaFromCore: false,
      registryLogoSrc: def.logoSrc,
      registryHeroSrc: def.heroImagePath,
      variantsSource: def.productKey === "kompis_web" ? "planned" : "empty",
      variants:
        def.productKey === "kompis_web"
          ? [
              {
                variantKey: "kompis_web_standard",
                monthlyAmount: 599,
                yearlyAmount: 5990,
                oneTimeAmount: null,
                hasPaidCustomerPrice: true,
              },
            ]
          : [],
      fixedCommissionAmount: null,
      currency: null,
    });
  });
}
