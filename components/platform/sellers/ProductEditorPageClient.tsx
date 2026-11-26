"use client";

import { useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { CertifiedSellersActionPanel } from "@/components/platform/sellers/CertifiedSellersActionPanel";
import type { SellersActionLabels } from "@/components/platform/sellers/CertifiedSellersActionPanel";
import type { ProductShopifyEditorLabels } from "@/components/platform/sellers/ProductShopifyEditor";
import type { SellersOverview, SellersProductRow } from "@/lib/certified-sales-partner/platform-sellers-view";
import { buildUnifiedCatalog, type ProductCatalogLocaleCode } from "@/lib/product-catalog";

export function ProductEditorPageClient({
  mode,
  productKey,
  locale,
  actionLabels,
  editorLabels,
  notReadyTitle,
  notReadyBody,
}: {
  mode: "create" | "edit";
  productKey: string | null;
  locale: string;
  actionLabels: SellersActionLabels;
  editorLabels: ProductShopifyEditorLabels;
  notReadyTitle: string;
  notReadyBody: string;
}) {
  const [overview, setOverview] = useState<SellersOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/platform/sellers/products", { cache: "no-store" });
      if (res.status === 401 || res.status === 403) {
        setError(notReadyTitle);
        setOverview(null);
        return;
      }
      if (!res.ok) {
        setError(notReadyBody);
        setOverview(null);
        return;
      }
      const json = (await res.json()) as SellersOverview;
      setOverview(json);
    } catch {
      setError(notReadyBody);
      setOverview(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount load
  }, []);

  const catalogLocale = (
    ["en", "no", "sv", "da", "pl", "uk", "es"].includes(locale) ? locale : "en"
  ) as ProductCatalogLocaleCode;

  const selected = useMemo(() => {
    if (mode !== "edit" || !productKey || !overview) return null;
    const listFromCore = overview.products !== null;
    const catalog = buildUnifiedCatalog({
      locale: catalogLocale,
      coreProducts: listFromCore
        ? (overview.products ?? []).map((p: SellersProductRow) => ({
            id: p.id,
            productKey: p.productKey,
            title: p.title,
            currency: p.currency,
            fixedCommissionAmount: p.fixedCommissionAmount,
            published: p.published,
            publishSale: p.publishSale,
            publishApp: p.publishApp,
          }))
        : null,
    });
    return catalog.find((p) => p.productKey === productKey) ?? null;
  }, [catalogLocale, mode, overview, productKey]);

  const coreRow =
    mode === "edit" && productKey && overview?.products
      ? overview.products.find((p) => p.productKey === productKey) ?? null
      : null;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-6">
        <h1 className="text-lg font-semibold">{notReadyTitle}</h1>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{error}</p>
      </div>
    );
  }

  if (mode === "edit" && productKey && !selected && overview) {
    return (
      <div className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-6">
        <h1 className="text-lg font-semibold">{editorLabels.editHeading}</h1>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">
          {productKey}
        </p>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{notReadyBody}</p>
      </div>
    );
  }

  return (
    <CertifiedSellersActionPanel
      key={`${mode}:${productKey ?? "new"}`}
      section="products"
      labels={actionLabels}
      editorLabels={editorLabels}
      standaloneEditor
      editorMode={mode}
      selectedProductKey={mode === "edit" ? productKey : null}
      selectedTitle={selected?.title ?? null}
      selectedCurrency={
        selected?.commission.kind === "fixed" ? selected.commission.currency : null
      }
      selectedCommission={
        selected?.commission.kind === "fixed" ? selected.commission.amount : null
      }
      selectedPublishSale={selected ? selected.sale.visibleInStore : null}
      selectedPublishApp={
        selected ? selected.app.visibleInStore && selected.app.source === "core" : null
      }
      selectedMasterActive={coreRow?.masterActive ?? null}
      selectedLogoSrc={selected?.logoSrc ?? null}
      selectedCategory={selected?.category ?? null}
      selectedProductType={selected?.category ?? null}
      onSuccess={() => void load()}
    />
  );
}
