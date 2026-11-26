"use client";

import { useMemo, useState } from "react";
import type { UnifiedCatalogProduct } from "@/lib/product-catalog";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import {
  countProductCenterChannels,
  type ProductCenterCounts,
} from "@/lib/platform/product-center-views";
import { formatPlatformDateTimeClock } from "@/lib/platform-presentation-quality/date-time";

export type UnifiedProductRegisterLabels = {
  colImage: string;
  colName: string;
  colSku: string;
  colType: string;
  colAppStatus: string;
  colSaleStatus: string;
  colChannels?: string;
  colCustomerPrice: string;
  colCommission: string;
  colUpdated?: string;
  colActions?: string;
  appPublished: string;
  appUnpublished: string;
  /** Controlled temporary APP listing — Core publish_app not persisted yet. */
  appRegistryFallback: string;
  salePublished: string;
  saleDraft: string;
  saleNotConfigured: string;
  channelsBoth?: string;
  channelsAppOnly?: string;
  channelsSaleOnly?: string;
  channelsNone?: string;
  pricePlanned: string;
  priceUnavailable: string;
  commissionUnknown: string;
  percentBlocked: string;
  empty: string;
  channelNote: string;
  newProduct?: string;
  editProduct?: string;
  searchPlaceholder?: string;
  countTotal?: string;
  countApp?: string;
  countSale?: string;
  countDraft?: string;
  listPendingNote?: string;
};

function formatMoney(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function CountsBar({
  counts,
  labels,
}: {
  counts: ProductCenterCounts;
  labels: UnifiedProductRegisterLabels;
}) {
  if (!labels.countTotal) return null;
  const items = [
    { label: labels.countTotal, value: counts.total },
    { label: labels.countApp, value: counts.appPublished },
    { label: labels.countSale, value: counts.salePublished },
    { label: labels.countDraft, value: counts.draft },
  ].filter((item): item is { label: string; value: number } => Boolean(item.label));
  return (
    <dl className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-[color:var(--aipify-border)] bg-white px-3 py-2"
        >
          <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
            {item.label}
          </dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums text-[color:var(--aipify-text-primary)]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function UnifiedProductRegisterTable({
  products,
  labels,
  locale,
  listFromCore = true,
  onNewProduct,
  onEditProduct,
}: {
  products: UnifiedCatalogProduct[];
  labels: UnifiedProductRegisterLabels;
  locale: string;
  /** False when Core overview has no products[] yet — register still shows registry truth. */
  listFromCore?: boolean;
  onNewProduct?: () => void;
  onEditProduct?: (productKey: string) => void;
}) {
  const [query, setQuery] = useState("");
  const counts = useMemo(() => countProductCenterChannels(products), [products]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) =>
      `${product.title} ${product.productKey} ${product.sku} ${product.category}`
        .toLowerCase()
        .includes(q),
    );
  }, [products, query]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.channelNote}</p>
      {!listFromCore && labels.listPendingNote ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {labels.listPendingNote}
        </p>
      ) : null}
      <CountsBar counts={counts} labels={labels} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        {labels.searchPlaceholder ? (
          <label className="min-w-[12rem] flex-1 text-sm">
            <span className="sr-only">{labels.searchPlaceholder}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full max-w-md rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
            />
          </label>
        ) : (
          <span />
        )}
        {onNewProduct && labels.newProduct ? (
          <button
            type="button"
            onClick={onNewProduct}
            className="inline-flex min-h-10 items-center rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 text-sm font-semibold text-white"
          >
            {labels.newProduct}
          </button>
        ) : null}
      </div>
      {visible.length === 0 ? (
        <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.empty}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[color:var(--aipify-border)] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[color:var(--aipify-surface-muted)] text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
              <tr>
                <th className="px-3 py-3">{labels.colImage}</th>
                <th className="px-3 py-3">{labels.colName}</th>
                <th className="px-3 py-3">{labels.colSku}</th>
                <th className="px-3 py-3">{labels.colType}</th>
                {labels.colChannels ? (
                  <th className="px-3 py-3">{labels.colChannels}</th>
                ) : (
                  <>
                    <th className="px-3 py-3">{labels.colAppStatus}</th>
                    <th className="px-3 py-3">{labels.colSaleStatus}</th>
                  </>
                )}
                <th className="px-3 py-3">{labels.colCustomerPrice}</th>
                <th className="px-3 py-3">{labels.colCommission}</th>
                {labels.colUpdated ? <th className="px-3 py-3">{labels.colUpdated}</th> : null}
                {onEditProduct && labels.colActions ? (
                  <th className="px-3 py-3">{labels.colActions}</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => {
                const saleLabel =
                  product.sale.status === "published"
                    ? labels.salePublished
                    : product.sale.status === "not_configured"
                      ? labels.saleNotConfigured
                      : labels.saleDraft;
                const appLabel =
                  product.app.source === "registry_fallback" || product.app.status === "blocked_needs_sql"
                    ? labels.appRegistryFallback
                    : product.app.visibleInStore
                      ? labels.appPublished
                      : labels.appUnpublished;
                const appBadgeKind =
                  product.app.source === "registry_fallback" || product.app.status === "blocked_needs_sql"
                    ? "waiting"
                    : product.app.visibleInStore
                      ? "completed"
                      : "waiting";
                const commission =
                  product.commission.kind === "fixed"
                    ? `${formatMoney(product.commission.amount, product.commission.currency, locale)} · ${labels.percentBlocked}`
                    : product.commission.kind === "percent"
                      ? labels.percentBlocked
                      : `${labels.commissionUnknown} · ${labels.percentBlocked}`;
                const price =
                  product.customerPrice.fromMonthly != null
                    ? labels.pricePlanned.replace(
                        "{price}",
                        formatMoney(
                          product.customerPrice.fromMonthly,
                          product.customerPrice.currency,
                          locale,
                        ),
                      )
                    : labels.priceUnavailable;

                const appOn = product.app.visibleInStore && product.app.source === "core";
                const saleOn = product.sale.visibleInStore;
                const channelsLabel =
                  appOn && saleOn
                    ? labels.channelsBoth ?? "APP · SALE PARTNER"
                    : appOn
                      ? labels.channelsAppOnly ?? "APP"
                      : saleOn
                        ? labels.channelsSaleOnly ?? "SALE PARTNER"
                        : labels.channelsNone ?? "—";

                return (
                  <tr key={product.productKey} className="border-t border-[color:var(--aipify-border)]">
                    <td className="px-3 py-3">
                      {product.logoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element -- brand mark paths from registry
                        <img
                          src={product.logoSrc}
                          alt=""
                          className="h-10 w-10 rounded-xl object-contain"
                        />
                      ) : (
                        <span
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--aipify-accent-soft)] text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
                          aria-hidden
                        >
                          {product.letter}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {onEditProduct ? (
                        <button
                          type="button"
                          onClick={() => onEditProduct(product.productKey)}
                          className="text-left"
                        >
                          <p className="font-semibold text-[color:var(--aipify-companion-purple)] underline-offset-2 hover:underline">
                            {product.title}
                          </p>
                          <p className="text-xs text-[color:var(--aipify-text-secondary)]">
                            {product.productKey}
                          </p>
                        </button>
                      ) : (
                        <>
                          <p className="font-semibold text-[color:var(--aipify-text-primary)]">
                            {product.title}
                          </p>
                          <p className="text-xs text-[color:var(--aipify-text-secondary)]">
                            {product.productKey}
                          </p>
                        </>
                      )}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">{product.sku}</td>
                    <td className="px-3 py-3 capitalize">{product.category}</td>
                    {labels.colChannels ? (
                      <td className="px-3 py-3">
                        <AipifyStatusBadge
                          kind={appOn || saleOn ? "completed" : "waiting"}
                          label={channelsLabel}
                        />
                      </td>
                    ) : (
                      <>
                        <td className="px-3 py-3">
                          <AipifyStatusBadge kind={appBadgeKind} label={appLabel} />
                        </td>
                        <td className="px-3 py-3">
                          <AipifyStatusBadge
                            kind={product.sale.visibleInStore ? "completed" : "waiting"}
                            label={saleLabel}
                          />
                        </td>
                      </>
                    )}
                    <td className="px-3 py-3 text-[color:var(--aipify-text-secondary)]">{price}</td>
                    <td className="px-3 py-3 text-[color:var(--aipify-text-secondary)]">{commission}</td>
                    {labels.colUpdated ? (
                      <td className="px-3 py-3 text-xs text-[color:var(--aipify-text-secondary)]">
                        {product.updatedAt
                          ? formatPlatformDateTimeClock(product.updatedAt, {
                              locale,
                              emptyFallback: "—",
                              invalidFallback: "—",
                            })
                          : "—"}
                      </td>
                    ) : null}
                    {onEditProduct && labels.editProduct ? (
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => onEditProduct(product.productKey)}
                          className="text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
                        >
                          {labels.editProduct}
                        </button>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
