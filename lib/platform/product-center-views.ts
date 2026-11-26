/**
 * Product Center top navigation — one product register, filtered channel views.
 * Not five parallel data models.
 */

export const PRODUCT_CENTER_VIEWS = [
  "products",
  "categories",
  "app",
  "sale",
  "media",
] as const;

export type ProductCenterView = (typeof PRODUCT_CENTER_VIEWS)[number];

export function parseProductCenterView(raw: string | null | undefined): ProductCenterView {
  if (raw && (PRODUCT_CENTER_VIEWS as readonly string[]).includes(raw)) {
    return raw as ProductCenterView;
  }
  return "products";
}

export type ProductCenterCounts = {
  total: number;
  appPublished: number;
  salePublished: number;
  draft: number;
};

export function countProductCenterChannels(
  products: Array<{
    app: { visibleInStore: boolean };
    sale: { visibleInStore: boolean; status: string };
  }>,
): ProductCenterCounts {
  let appPublished = 0;
  let salePublished = 0;
  let draft = 0;
  for (const product of products) {
    if (product.app.visibleInStore) appPublished += 1;
    if (product.sale.visibleInStore) salePublished += 1;
    if (product.sale.status === "draft" || product.sale.status === "not_configured") draft += 1;
  }
  return {
    total: products.length,
    appPublished,
    salePublished,
    draft,
  };
}

export function filterProductCenterView<
  T extends {
    productKey: string;
    category: string;
    app: { visibleInStore: boolean };
    sale: { visibleInStore: boolean };
  },
>(products: T[], view: ProductCenterView): T[] {
  switch (view) {
    case "app":
      return products.filter((p) => p.app.visibleInStore);
    case "sale":
      return products.filter((p) => p.sale.visibleInStore);
    case "categories":
    case "media":
    case "products":
    default:
      return products;
  }
}
