"use client";

import type { UnifiedCatalogProduct } from "@/lib/product-catalog";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";

export type UnifiedProductRegisterLabels = {
  colImage: string;
  colName: string;
  colSku: string;
  colType: string;
  colAppStatus: string;
  colSaleStatus: string;
  colCustomerPrice: string;
  colCommission: string;
  appPublished: string;
  appUnpublished: string;
  /** Controlled temporary APP listing — Core publish_app not persisted yet. */
  appRegistryFallback: string;
  salePublished: string;
  saleDraft: string;
  saleNotConfigured: string;
  pricePlanned: string;
  priceUnavailable: string;
  commissionUnknown: string;
  percentBlocked: string;
  empty: string;
  channelNote: string;
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

export function UnifiedProductRegisterTable({
  products,
  labels,
  locale,
}: {
  products: UnifiedCatalogProduct[];
  labels: UnifiedProductRegisterLabels;
  locale: string;
}) {
  if (products.length === 0) {
    return <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.empty}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.channelNote}</p>
      <div className="overflow-x-auto rounded-2xl border border-[color:var(--aipify-border)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[color:var(--aipify-surface-muted)] text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
            <tr>
              <th className="px-3 py-3">{labels.colImage}</th>
              <th className="px-3 py-3">{labels.colName}</th>
              <th className="px-3 py-3">{labels.colSku}</th>
              <th className="px-3 py-3">{labels.colType}</th>
              <th className="px-3 py-3">{labels.colAppStatus}</th>
              <th className="px-3 py-3">{labels.colSaleStatus}</th>
              <th className="px-3 py-3">{labels.colCustomerPrice}</th>
              <th className="px-3 py-3">{labels.colCommission}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const saleLabel =
                product.sale.status === "published"
                  ? labels.salePublished
                  : product.sale.status === "not_configured"
                    ? labels.saleNotConfigured
                    : labels.saleDraft;
              const appLabel =
                product.app.source === "registry_fallback"
                  ? labels.appRegistryFallback
                  : product.app.visibleInStore
                    ? labels.appPublished
                    : labels.appUnpublished;
              const appBadgeKind =
                product.app.source === "registry_fallback"
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
                        locale
                      )
                    )
                  : labels.priceUnavailable;

              return (
                <tr key={product.productKey} className="border-t border-[color:var(--aipify-border)]">
                  <td className="px-3 py-3">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--aipify-accent-soft)] text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
                      aria-hidden
                    >
                      {product.letter}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-semibold text-[color:var(--aipify-text-primary)]">{product.title}</p>
                    <p className="text-xs text-[color:var(--aipify-text-secondary)]">{product.productKey}</p>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">{product.sku}</td>
                  <td className="px-3 py-3 capitalize">{product.category}</td>
                  <td className="px-3 py-3">
                    <AipifyStatusBadge kind={appBadgeKind} label={appLabel} />
                  </td>
                  <td className="px-3 py-3">
                    <AipifyStatusBadge
                      kind={product.sale.visibleInStore ? "completed" : "waiting"}
                      label={saleLabel}
                    />
                  </td>
                  <td className="px-3 py-3 text-[color:var(--aipify-text-secondary)]">{price}</td>
                  <td className="px-3 py-3 text-[color:var(--aipify-text-secondary)]">{commission}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
