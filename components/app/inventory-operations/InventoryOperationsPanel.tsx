"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseInventoryOperationsCenter,
  type InventoryItem,
  type InventoryOperationsCenter,
  type InventoryOperationsLabels,
  type InventoryProduct,
  type InventoryWarehouse,
} from "@/lib/inventory-operations";

type Tab =
  | "overview"
  | "products"
  | "inventory"
  | "warehouses"
  | "movements"
  | "receiving"
  | "transfers"
  | "adjustments"
  | "reports";

const STOCK_STATUS_STYLE: Record<string, string> = {
  in_stock: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  low_stock: "bg-amber-50 text-amber-900 ring-amber-200",
  reserved: "bg-sky-50 text-sky-900 ring-sky-200",
  out_of_stock: "bg-red-50 text-red-900 ring-red-200",
  incoming: "bg-violet-50 text-violet-900 ring-violet-200",
};

function formatAmount(amount: number, currency = "NOK") {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
}

function stockLabel(labels: InventoryOperationsLabels, status: string) {
  if (status === "low_stock") return labels.lowStock;
  if (status === "out_of_stock") return labels.outOfStock;
  if (status === "reserved") return labels.reserved;
  if (status === "incoming") return labels.incoming;
  return labels.inStock;
}

function ItemCard({ item, labels }: { item: InventoryItem; labels: InventoryOperationsLabels }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{item.sku ?? item.product_id.slice(0, 8)}</p>
          <h3 className="font-semibold text-aipify-text">{item.product_name ?? "—"}</h3>
          <p className="text-aipify-text-secondary">
            {item.warehouse_name ?? "—"}
            {item.location_name ? ` · ${item.location_name}` : ""}
          </p>
          <p className="text-aipify-text-muted">
            {labels.quantity}: {item.available_quantity} / {item.quantity}
            {item.reserved_quantity > 0 ? ` · ${item.reserved_quantity} ${labels.reserved.toLowerCase()}` : ""}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STOCK_STATUS_STYLE[item.stock_status] ?? STOCK_STATUS_STYLE.in_stock}`}
        >
          {stockLabel(labels, item.stock_status)}
        </span>
      </div>
    </div>
  );
}

type Props = {
  labels: InventoryOperationsLabels;
  initialTab?: Tab;
};

export function InventoryOperationsPanel({ labels, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<InventoryOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/inventory-operations");
    if (res.ok) setCenter(parseInventoryOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/inventory-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const reports = center.reports ?? {};
  const products = center.products ?? [];
  const inventoryItems = center.inventory_items ?? [];
  const lowStockItems = center.low_stock_items ?? [];
  const warehouses = center.warehouses ?? [];
  const movements = center.movements ?? [];
  const receiving = center.receiving ?? [];
  const transfers = center.transfers ?? [];
  const adjustments = center.adjustments ?? [];
  const reorderRecommendations = center.reorder_recommendations ?? [];
  const defaultWarehouse = warehouses[0];

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "products", label: labels.products },
    { id: "inventory", label: labels.inventory },
    { id: "warehouses", label: labels.warehouses },
    { id: "movements", label: labels.movements },
    { id: "receiving", label: labels.receiving },
    { id: "transfers", label: labels.transfers },
    { id: "adjustments", label: labels.adjustments },
    { id: "reports", label: labels.reports },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
      </header>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={
              tab === item.id
                ? `${AipifyShellClasses.primaryButton} text-sm`
                : `${AipifyShellClasses.secondaryButton} text-sm`
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [labels.totalProducts, overview.total_products],
              [labels.totalWarehouses, overview.total_warehouses],
              [labels.inventoryValue, formatAmount(Number(overview.inventory_value ?? 0))],
              [labels.lowStockCount, overview.low_stock_count],
              [labels.outOfStockCount, overview.out_of_stock_count],
              [labels.pendingReceiving, overview.pending_receiving],
              [labels.activeTransfers, overview.active_transfers],
              [labels.activeReservations, overview.active_reservations],
              [labels.pendingReorders, overview.pending_reorders],
              [labels.movements7d, overview.movements_7d],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">
                {typeof value === "number" || typeof value === "string" ? value : "—"}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "products" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-4`}>
            <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={labels.productName} className={AipifyShellClasses.input} />
            <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder={labels.sku} className={AipifyShellClasses.input} />
            <input value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder={labels.supplier} className={AipifyShellClasses.input} />
            <button
              type="button"
              disabled={busy || !productName.trim()}
              onClick={() =>
                void runAction("create_product", {
                  name: productName.trim(),
                  sku: sku.trim() || undefined,
                  supplier_name: supplier.trim(),
                }).then(() => {
                  setProductName("");
                  setSku("");
                  setSupplier("");
                })
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createProduct}
            </button>
          </div>
          {products.length === 0 ? (
            <PlatformEmptyState title={labels.noProducts} message={labels.noProductsHint} />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {products.map((p: InventoryProduct) => (
                <div key={p.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="text-xs text-aipify-text-muted">{p.sku}</p>
                  <h3 className="font-semibold text-aipify-text">{p.name}</h3>
                  <p className="text-aipify-text-secondary">
                    {p.category_key?.replace(/_/g, " ")} · {formatAmount(p.unit_cost, p.currency)}
                  </p>
                  <p className="text-aipify-text-muted">
                    {labels.quantity}: {p.total_quantity ?? 0} · Min {p.min_level}
                  </p>
                  {defaultWarehouse ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void runAction("upsert_stock", {
                          product_id: p.id,
                          warehouse_id: defaultWarehouse.id,
                          quantity: Number(quantity) || p.min_level || 10,
                        })
                      }
                      className={`mt-2 ${AipifyShellClasses.secondaryButton}`}
                    >
                      {labels.updateStock}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "inventory" ? (
        <div className="space-y-4">
          {lowStockItems.length > 0 ? (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.lowStockCount}</h2>
              <div className="grid gap-3">
                {lowStockItems.map((item) => (
                  <ItemCard key={item.id} item={item} labels={labels} />
                ))}
              </div>
            </div>
          ) : null}
          {inventoryItems.length === 0 ? (
            <PlatformEmptyState title={labels.noInventory} message={labels.noProductsHint} />
          ) : (
            <div className="grid gap-3">
              {inventoryItems.map((item) => (
                <ItemCard key={item.id} item={item} labels={labels} />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "warehouses" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={warehouseName} onChange={(e) => setWarehouseName(e.target.value)} placeholder={labels.warehouseName} className={AipifyShellClasses.input} />
            <button
              type="button"
              disabled={busy || !warehouseName.trim()}
              onClick={() => void runAction("create_warehouse", { name: warehouseName.trim() }).then(() => setWarehouseName(""))}
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createWarehouse}
            </button>
          </div>
          {warehouses.length === 0 ? (
            <PlatformEmptyState title={labels.noWarehouses} message={labels.noProductsHint} />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {warehouses.map((w: InventoryWarehouse) => (
                <div key={w.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="text-xs text-aipify-text-muted">{w.warehouse_number ?? w.id.slice(0, 8)}</p>
                  <h3 className="font-semibold text-aipify-text">{w.name}</h3>
                  <p className="text-aipify-text-secondary">{w.location ?? "—"} · {w.warehouse_type.replace(/_/g, " ")}</p>
                  <p className="text-aipify-text-muted">{w.inventory_count ?? 0} items</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "movements" ? (
        <div className="grid gap-3">
          {movements.map((m) => (
            <div key={String(m.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs text-aipify-text-muted">{String(m.movement_type ?? "").replace(/_/g, " ")}</p>
              <h3 className="font-semibold text-aipify-text">{String(m.product_name ?? "")}</h3>
              <p className="text-aipify-text-secondary">
                {labels.quantity}: {String(m.quantity ?? 0)}
                {m.reason ? ` · ${String(m.reason)}` : ""}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "receiving" ? (
        <div className="space-y-4">
          {defaultWarehouse ? (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void runAction("create_receiving", {
                  warehouse_id: defaultWarehouse.id,
                  supplier_name: supplier.trim() || "Supplier",
                  expected_quantity: Number(quantity) || 1,
                })
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createReceiving}
            </button>
          ) : null}
          <div className="grid gap-3">
            {receiving.map((r) => (
              <div key={String(r.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{String(r.reference_number ?? "")}</p>
                <h3 className="font-semibold text-aipify-text">{String(r.supplier_name ?? "")}</h3>
                <p className="text-aipify-text-secondary">
                  {String(r.warehouse_name ?? "")} · {String(r.status ?? "").replace(/_/g, " ")}
                </p>
                {r.status === "pending" || r.status === "inspecting" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void runAction("complete_receiving", {
                        receiving_id: r.id,
                        accepted_quantity: Number(r.expected_quantity ?? 0),
                      })
                    }
                    className={`mt-2 ${AipifyShellClasses.primaryButton}`}
                  >
                    {labels.completeReceiving}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "transfers" ? (
        <div className="grid gap-3">
          {transfers.map((t) => (
            <div key={String(t.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs text-aipify-text-muted">{String(t.transfer_number ?? "")}</p>
              <h3 className="font-semibold text-aipify-text">{String(t.product_name ?? "")}</h3>
              <p className="text-aipify-text-secondary">
                {String(t.source_warehouse ?? "")} → {String(t.dest_warehouse ?? "")} · {String(t.quantity ?? 0)}
              </p>
              {t.status === "pending" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction("complete_transfer", { transfer_id: t.id })}
                  className={`mt-2 ${AipifyShellClasses.primaryButton}`}
                >
                  {labels.completeTransfer}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "adjustments" ? (
        <div className="grid gap-3">
          {adjustments.map((a) => (
            <div key={String(a.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs text-aipify-text-muted">{String(a.adjustment_type ?? "").replace(/_/g, " ")}</p>
              <h3 className="font-semibold text-aipify-text">{String(a.product_name ?? "")}</h3>
              <p className="text-aipify-text-secondary">
                {labels.quantity}: {String(a.quantity_change ?? 0)}
                {a.reason ? ` · ${String(a.reason)}` : ""}
              </p>
            </div>
          ))}
          {reorderRecommendations.map((rr) => (
            <div key={String(rr.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{String(rr.product_name ?? "")}</h3>
              <p className="text-aipify-text-secondary">{String(rr.reason ?? "")}</p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction("acknowledge_reorder", { recommendation_id: rr.id })}
                className={`mt-2 ${AipifyShellClasses.secondaryButton}`}
              >
                {labels.acknowledgeReorder}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
          <p>
            {labels.inventoryValue}: {formatAmount(Number(reports.inventory_value ?? 0))}
          </p>
          <p>
            {labels.lowStockCount}: {String(reports.low_stock_count ?? 0)}
          </p>
          <p>
            {labels.movementActivity}: {String(reports.movement_count_month ?? 0)}
          </p>
          {Array.isArray(reports.warehouse_utilization) && reports.warehouse_utilization.length > 0 ? (
            <div>
              <p className="font-medium text-aipify-text">{labels.warehouseUtilization}</p>
              <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                {(reports.warehouse_utilization as Record<string, unknown>[]).map((row, i) => (
                  <li key={i}>
                    {String(row.warehouse_name ?? "")} · {String(row.item_count ?? 0)} items
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <ul className={`${AipifyShellClasses.surfaceCard} divide-y divide-aipify-border text-sm`}>
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.action}-${i}`} className="px-4 py-2 text-aipify-text-secondary">
                {entry.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
