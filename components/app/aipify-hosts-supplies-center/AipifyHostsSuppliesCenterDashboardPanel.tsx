"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsSuppliesCenterActionResult,
  parseAipifyHostsSuppliesCenterDashboard,
  type HostsInventoryItemRow,
  type HostsPropertyInventoryRow,
  type HostsPurchaseRow,
  type HostsSuppliesCenterDashboard,
  type HostsSuppliesCenterSectionKey,
  type HostsSupplierRow,
} from "@/lib/aipify/aipify-hosts-supplies-center";

type Props = { labels: Record<string, string> };

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    in_stock: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    low_stock: "bg-amber-50 text-amber-900 ring-amber-200",
    out_of_stock: "bg-red-50 text-red-800 ring-red-200",
    discontinued: "bg-gray-100 text-gray-600 ring-gray-200",
    healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    attention: "bg-amber-50 text-amber-900 ring-amber-200",
    critical: "bg-red-50 text-red-800 ring-red-200",
    pending: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function InventoryTable({
  rows,
  labels,
  busy,
  showActions,
  onAction,
  onUpdateQty,
}: {
  rows: HostsInventoryItemRow[];
  labels: Record<string, string>;
  busy: boolean;
  showActions?: boolean;
  onAction: (id: string, type: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
}) {
  const [qtyDraft, setQtyDraft] = useState<Record<string, string>>({});

  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyItemsTitle} message={labels.emptyItemsMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.itemName}</th>
            <th className="px-4 py-3">{labels.category}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.currentQty}</th>
            <th className="px-4 py-3">{labels.minimumQty}</th>
            <th className="px-4 py-3">{labels.unitType}</th>
            <th className="px-4 py-3">{labels.status}</th>
            {showActions && <th className="px-4 py-3">{labels.actions}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.status === "out_of_stock" ? "bg-red-50/30" : row.status === "low_stock" ? "bg-amber-50/20" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.item_name}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "cat", row.category)}</td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-900">{row.current_quantity}</td>
              <td className="px-4 py-3 text-gray-700">{row.minimum_quantity}</td>
              <td className="px-4 py-3 text-gray-700">{row.unit_type}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "status", row.status)}
                </span>
              </td>
              {showActions && (
                <td className="px-4 py-3 min-w-[200px] space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "reorder_item")} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.reorder}</button>
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "assign_purchase_task")} className="text-xs font-medium text-teal-700 disabled:opacity-60">{labels.assignPurchase}</button>
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "restock_supplies")} className="text-xs font-medium text-sky-700 disabled:opacity-60">{labels.restock}</button>
                    {(row.status === "low_stock" || row.status === "out_of_stock") && (
                      <button type="button" disabled={busy} onClick={() => onAction(row.id, "escalate_critical")} className="text-xs font-medium text-red-700 disabled:opacity-60">{labels.escalate}</button>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <input type="number" min={0} value={qtyDraft[row.id] ?? String(row.current_quantity)} onChange={(e) => setQtyDraft({ ...qtyDraft, [row.id]: e.target.value })} className="w-20 rounded border border-gray-300 px-2 py-1 text-xs" />
                    <button type="button" disabled={busy} onClick={() => onUpdateQty(row.id, Number(qtyDraft[row.id] ?? row.current_quantity))} className="text-xs font-medium text-gray-700 disabled:opacity-60">{labels.updateQty}</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PropertyInventoryGrid({ rows, labels }: { rows: HostsPropertyInventoryRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyPropertyTitle} message={labels.emptyPropertyMessage} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((p) => (
        <div key={p.property_id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900">{p.property_name}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(p.inventory_health)}`}>
              {labelFor(labels, "health", p.inventory_health)}
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div><dt className="text-gray-500">{labels.totalItems}</dt><dd className="font-medium">{p.total_items}</dd></div>
            <div><dt className="text-gray-500">{labels.lowStockCount}</dt><dd className="font-medium">{p.low_stock_count}</dd></div>
            <div><dt className="text-gray-500">{labels.outstandingOrders}</dt><dd className="font-medium">{p.outstanding_orders}</dd></div>
          </dl>
        </div>
      ))}
    </div>
  );
}

function PurchaseTable({ rows, labels }: { rows: HostsPurchaseRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyPurchasesTitle} message={labels.emptyPurchasesMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.supplier}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.purchaseDate}</th>
            <th className="px-4 py-3">{labels.quantity}</th>
            <th className="px-4 py-3">{labels.cost}</th>
            <th className="px-4 py-3">{labels.status}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-900">{row.supplier}</td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{row.purchase_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.quantity}</td>
              <td className="px-4 py-3 text-gray-700">{row.cost != null ? row.cost : "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "purchstatus", row.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SuppliersGrid({ rows, labels }: { rows: HostsSupplierRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptySuppliersTitle} message={labels.emptySuppliersMessage} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rows.map((s) => (
        <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900">{s.supplier_name}</h3>
            {s.preferred_supplier && (
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800 ring-1 ring-teal-200">{labels.preferred}</span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600">{labelFor(labels, "cat", s.category)}</p>
          {s.contact_information && <p className="mt-2 text-sm text-gray-700">{s.contact_information}</p>}
        </div>
      ))}
    </div>
  );
}

export function AipifyHostsSuppliesCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsSuppliesCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsSuppliesCenterSectionKey>("inventory_overview");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newCategory, setNewCategory] = useState("bathroom_supplies");
  const [newPropertyId, setNewPropertyId] = useState("");
  const [newMinQty, setNewMinQty] = useState("5");
  const [newCurrentQty, setNewCurrentQty] = useState("10");
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierCategory, setNewSupplierCategory] = useState("cleaning_supplies");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/aipify/aipify-hosts/supplies-center/dashboard?section=${activeSection}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsSuppliesCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/supplies-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsSuppliesCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(labels.actionRecorded);
      setNewItemName("");
      setNewSupplierName("");
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const itemRows =
    activeSection === "inventory_overview" || activeSection === "property_supplies"
      ? dashboard.inventory_overview
      : activeSection === "low_stock_alerts"
        ? dashboard.low_stock_alerts
        : [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-6">
        <p className="text-sm font-medium text-cyan-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-cyan-900">{labels.governanceNote}</p>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-cyan-200 bg-white px-4 py-2 text-sm font-medium text-cyan-900 hover:bg-cyan-50">
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label={labels.totalItems} value={dashboard.stats.total_items} />
        <MetricCard label={labels.lowStockCount} value={dashboard.stats.low_stock_count} />
        <MetricCard label={labels.outOfStockCount} value={dashboard.stats.out_of_stock_count} />
        <MetricCard label={labels.pendingOrders} value={dashboard.stats.pending_orders} />
        <MetricCard label={labels.supplierCount} value={dashboard.stats.supplier_count} />
      </dl>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsSuppliesCenterSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-cyan-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {(activeSection === "inventory_overview" || activeSection === "property_supplies") && (
        <>
          <PropertyInventoryGrid rows={dashboard.property_inventory} labels={labels} />
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">{labels.addItem}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder={labels.itemNamePlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                {dashboard.inventory_categories.map((c) => (
                  <option key={c} value={c}>{labelFor(labels, "cat", c)}</option>
                ))}
              </select>
              <select value={newPropertyId} onChange={(e) => setNewPropertyId(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="">{labels.allProperties}</option>
                {dashboard.properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.display_name}</option>
                ))}
              </select>
              <input type="number" min={0} value={newCurrentQty} onChange={(e) => setNewCurrentQty(e.target.value)} placeholder={labels.currentQty} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input type="number" min={0} value={newMinQty} onChange={(e) => setNewMinQty(e.target.value)} placeholder={labels.minimumQty} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <button
              type="button"
              disabled={busy || !newItemName.trim()}
              onClick={() =>
                void runAction({
                  action: "create_item",
                  item_name: newItemName,
                  category: newCategory,
                  property_id: newPropertyId || undefined,
                  current_quantity: Number(newCurrentQty),
                  minimum_quantity: Number(newMinQty),
                })
              }
              className="inline-flex rounded-lg bg-cyan-700 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-800 disabled:opacity-60"
            >
              {labels.addItem}
            </button>
          </div>
        </>
      )}

      {(activeSection === "inventory_overview" || activeSection === "property_supplies" || activeSection === "low_stock_alerts") && (
        <InventoryTable
          rows={itemRows}
          labels={labels}
          busy={busy}
          showActions={activeSection !== "inventory_overview"}
          onAction={(id, type) => void runAction({ action: "inventory_action", item_id: id, action_type: type })}
          onUpdateQty={(id, qty) => void runAction({ action: "update_quantity", item_id: id, quantity: qty })}
        />
      )}

      {activeSection === "purchase_history" && <PurchaseTable rows={dashboard.purchase_history} labels={labels} />}

      {activeSection === "suppliers" && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">{labels.addSupplier}</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <input type="text" value={newSupplierName} onChange={(e) => setNewSupplierName(e.target.value)} placeholder={labels.supplierNamePlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <select value={newSupplierCategory} onChange={(e) => setNewSupplierCategory(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                {dashboard.inventory_categories.map((c) => (
                  <option key={c} value={c}>{labelFor(labels, "cat", c)}</option>
                ))}
              </select>
              <button
                type="button"
                disabled={busy || !newSupplierName.trim()}
                onClick={() => void runAction({ action: "create_supplier", supplier_name: newSupplierName, category: newSupplierCategory, preferred_supplier: true })}
                className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-800 disabled:opacity-60"
              >
                {labels.addSupplier}
              </button>
            </div>
          </div>
          <SuppliersGrid rows={dashboard.suppliers} labels={labels} />
        </>
      )}

      {dashboard.inventory_tasks.length > 0 && activeSection !== "suppliers" && (
        <section>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">{labels.inventoryTasks}</h3>
          <ul className="space-y-2">
            {dashboard.inventory_tasks.slice(0, 5).map((t) => (
              <li key={t.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
                {labelFor(labels, "task", t.task_type)} · {t.task_summary}
                {t.due_date && <span className="text-gray-500"> · {t.due_date}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
