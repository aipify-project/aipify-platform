"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAipifyWarehouseOperationsDashboard,
  parseWarehouseInventorySearch,
  type AipifyWarehouseOperationsDashboard,
  type WarehouseInventoryItem,
} from "@/lib/aipify/aipify-warehouse-operations";

type Props = {
  labels: Record<string, string>;
};

function statusBadgeClass(status?: string) {
  switch (status) {
    case "delayed":
    case "failed":
      return "bg-rose-100 text-rose-800";
    case "picking":
    case "in_progress":
    case "sent_to_printer":
      return "bg-amber-100 text-amber-800";
    case "shipped":
    case "picked":
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function InventoryResultCard({ item, labels }: { item: WarehouseInventoryItem; labels: Record<string, string> }) {
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{item.product_name}</span>
        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-800">{item.sku}</span>
      </div>
      {item.location_label ? (
        <p className="mt-1 text-xs text-gray-700">
          <span className="font-medium">{labels.location}:</span> {item.location_label}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
        <span>
          {labels.quantity}: {item.quantity_on_hand ?? 0}
        </span>
        <span>
          {labels.reserved}: {item.quantity_reserved ?? 0}
        </span>
        <span>
          {labels.available}: {item.quantity_available ?? 0}
        </span>
        {item.unit_price != null ? (
          <span>
            {labels.price}: {item.currency} {item.unit_price.toFixed(2)}
          </span>
        ) : null}
      </div>
      {item.below_reorder ? (
        <p className="mt-1 text-xs text-amber-700">
          {labels.reorderThreshold}: {item.reorder_threshold}
        </p>
      ) : null}
    </li>
  );
}

export function AipifyWarehouseOperationsDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyWarehouseOperationsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WarehouseInventoryItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/aipify-warehouse-operations/dashboard");
    if (res.ok) setDashboard(parseAipifyWarehouseOperationsDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runInventorySearch(query?: string) {
    const q = query ?? searchQuery;
    setSearching(true);
    setActionError(null);
    const res = await fetch(`/api/aipify/aipify-warehouse-operations/inventory?q=${encodeURIComponent(q)}`);
    if (res.ok) {
      const parsed = parseWarehouseInventorySearch(await res.json());
      setSearchResults(parsed.results ?? []);
    }
    setSearching(false);
  }

  async function runAction(action: string, payload: Record<string, unknown>, busyKey?: string) {
    setBusyId(busyKey ?? action);
    setActionError(null);
    const res = await fetch("/api/aipify/aipify-warehouse-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
      if (action === "generate_picking_list" || action === "print_document") {
        await runInventorySearch(searchQuery);
      }
    }
    setBusyId(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_tenant) return null;

  const metrics = dashboard.metrics ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {dashboard.marketplace_route ? (
          <Link href={dashboard.marketplace_route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.marketplace}
          </Link>
        ) : null}
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.approvals}
        </Link>
      </div>

      <section className="rounded-xl border border-orange-200 bg-orange-50/50 p-6">
        <h2 className="text-sm font-semibold text-orange-900">{labels.warehousePack}</h2>
        {dashboard.principle ? (
          <p className="mt-2 text-sm font-medium text-orange-900">{dashboard.principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-2 text-sm text-orange-900">{dashboard.vision}</p> : null}
        {dashboard.workflow_steps && dashboard.workflow_steps.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.workflow_steps.map((step) => (
              <span key={step} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-orange-800">
                {step}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: labels.ordersAwaiting, value: metrics.orders_awaiting_fulfillment ?? 0 },
          { label: labels.delayedShipments, value: metrics.delayed_shipments ?? 0 },
          { label: labels.inventoryShortages, value: metrics.inventory_shortages ?? 0 },
          { label: labels.pickupsScheduled, value: metrics.pickups_scheduled ?? 0 },
          { label: labels.picksToday, value: metrics.picks_completed_today ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.inventorySearch}</h3>
        <p className="mt-1 text-xs text-gray-600">{labels.inventorySearchHint}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void runInventorySearch();
            }}
            placeholder={labels.searchPlaceholder}
            className="min-w-[240px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={searching}
            onClick={() => void runInventorySearch()}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {labels.search}
          </button>
          <button
            type="button"
            disabled={searching}
            onClick={() => {
              setSearchQuery("Product ABC");
              void runInventorySearch("Product ABC");
            }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            {labels.exampleQuery}
          </button>
        </div>
        {searchResults.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {searchResults.map((item) => (
              <InventoryResultCard key={item.id ?? item.sku} item={item} labels={labels} />
            ))}
          </ul>
        ) : searching ? (
          <p className="mt-3 text-xs text-gray-500">{labels.searching}</p>
        ) : null}
      </section>

      {dashboard.voice_examples && dashboard.voice_examples.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.voiceInteraction}</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {dashboard.voice_examples.map((ex) => (
              <li key={ex} className="rounded bg-gray-50 px-3 py-2 italic">
                &ldquo;{ex}&rdquo;
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.ordersAwaitingList}</h3>
        {(dashboard.orders_awaiting ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noOrders}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.orders_awaiting?.map((order) =>
              order.id ? (
                <li key={order.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{order.order_key}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs uppercase ${statusBadgeClass(order.fulfillment_status)}`}
                    >
                      {(order.fulfillment_status ?? "").replace(/_/g, " ")}
                    </span>
                  </div>
                  {order.customer_label ? (
                    <p className="mt-1 text-xs text-gray-600">{order.customer_label}</p>
                  ) : null}
                  {order.packaging_instructions ? (
                    <p className="mt-1 text-xs text-gray-700">
                      <span className="font-medium">{labels.packaging}:</span> {order.packaging_instructions}
                    </p>
                  ) : null}
                  {order.shipping_requirements ? (
                    <p className="mt-1 text-xs text-gray-700">
                      <span className="font-medium">{labels.shipping}:</span> {order.shipping_requirements}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    disabled={busyId === order.id}
                    onClick={() =>
                      void runAction(
                        "generate_picking_list",
                        { order_id: order.id, order_key: order.order_key },
                        order.id
                      )
                    }
                    className="mt-2 rounded border border-orange-200 px-2 py-1 text-xs text-orange-800 disabled:opacity-50"
                  >
                    {labels.generatePickingList}
                  </button>
                </li>
              ) : null
            )}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.pickingTasks}</h3>
        {(dashboard.picking_tasks ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noPickingTasks}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.picking_tasks?.map((task) =>
              task.id ? (
                <li key={task.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">
                      {task.product_name} × {task.quantity_to_pick}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(task.task_status)}`}>
                      {(task.task_status ?? "").replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    {labels.pickAt}: {task.pick_location}
                  </p>
                  {task.task_status === "pending" ? (
                    <button
                      type="button"
                      disabled={busyId === task.id}
                      onClick={() => void runAction("mark_pick_complete", { task_id: task.id }, task.id)}
                      className="mt-2 rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50"
                    >
                      {labels.markPicked}
                    </button>
                  ) : null}
                </li>
              ) : null
            )}
          </ul>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.pickupSchedules}</h3>
          {(dashboard.pickup_schedules ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noPickups}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.pickup_schedules?.map((pickup) =>
                pickup.id ? (
                  <li key={pickup.id} className="rounded border border-gray-100 px-3 py-2">
                    <span className="font-medium">{pickup.carrier}</span>
                    <span className="ml-2 text-xs text-gray-500">{pickup.order_key}</span>
                    {pickup.pickup_window_start ? (
                      <p className="mt-1 text-xs text-gray-600">
                        {new Date(pickup.pickup_window_start).toLocaleString()}
                      </p>
                    ) : null}
                  </li>
                ) : null
              )}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.printJobs}</h3>
          {(dashboard.recent_print_jobs ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noPrintJobs}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.recent_print_jobs?.map((job) =>
                job.id ? (
                  <li key={job.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 px-3 py-2">
                    <span className="capitalize">{(job.document_type ?? "").replace(/_/g, " ")}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(job.print_status)}`}>
                      {(job.print_status ?? "").replace(/_/g, " ")}
                    </span>
                  </li>
                ) : null
              )}
            </ul>
          )}
          <button
            type="button"
            disabled={busyId === "print_label"}
            onClick={() =>
              void runAction("print_document", {
                document_type: "shipping_label",
                reference_key: "demo-label",
              }, "print_label")
            }
            className="mt-3 rounded border border-gray-200 px-3 py-1.5 text-xs disabled:opacity-50"
          >
            {labels.printShippingLabel}
          </button>
        </section>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.pendingApprovals}</h3>
        <p className="mt-1 text-xs text-gray-600">{labels.approvalRulesNote}</p>
        {(dashboard.pending_approvals ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noApprovals}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.pending_approvals?.map((approval) =>
              approval.id ? (
                <li key={approval.id} className="rounded border border-amber-100 bg-amber-50/40 px-3 py-2">
                  <span className="font-medium capitalize">
                    {(approval.approval_type ?? "").replace(/_/g, " ")}
                  </span>
                  <p className="mt-1 text-xs text-gray-700">{approval.summary}</p>
                </li>
              ) : null
            )}
          </ul>
        )}
      </section>

      {dashboard.integrations && dashboard.integrations.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrations}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.integrations.map((integration) => (
              <span
                key={integration.key}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700"
              >
                {integration.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.success_criteria && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            {dashboard.success_criteria.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {actionError ? <p className="text-sm text-rose-700">{actionError}</p> : null}
    </div>
  );
}
