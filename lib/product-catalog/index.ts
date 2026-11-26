export {
  assertChannelIsolation,
  buildUnifiedCatalog,
  filterAppStoreProducts,
  filterSalesCatalogProducts,
  type AppEntitlementHint,
  type CoreSalesProductRow,
} from "./merge";
export { CANONICAL_PRODUCT_REGISTRY, getCanonicalProduct } from "./registry";
export type {
  CanonicalProductDefinition,
  ProductCatalogChannel,
  ProductCatalogChannelStatus,
  ProductCatalogCommissionModel,
  ProductCatalogCopy,
  ProductCatalogLocaleCode,
  ProductCatalogPurchaseReadiness,
  UnifiedCatalogProduct,
  UnifiedProductChannelState,
} from "./types";
