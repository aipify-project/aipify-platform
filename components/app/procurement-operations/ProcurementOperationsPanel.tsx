"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  Contract,
  Delivery,
  ProcurementOperationsCenter,
  ProcurementOperationsLabels,
  ProcurementOperationsTab,
  PurchaseOrder,
  PurchaseRequest,
  Quotation,
  Vendor,
} from "@/lib/procurement-operations";
import { parseProcurementOperationsCenter } from "@/lib/procurement-operations/parse";

type Tab = ProcurementOperationsTab;

const REQUEST_STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  submitted: "bg-sky-50 text-sky-900 ring-sky-200",
  awaiting_approval: "bg-amber-50 text-amber-900 ring-amber-200",
  requires_review: "bg-orange-50 text-orange-900 ring-orange-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-50 text-red-900 ring-red-200",
  ordered: "bg-violet-50 text-violet-900 ring-violet-200",
};

const VENDOR_STATUS_STYLE: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  active: "bg-aipify-accent-soft text-aipify-accent ring-aipify-accent-muted",
  under_review: "bg-amber-50 text-amber-900 ring-amber-200",
  restricted: "bg-orange-50 text-orange-900 ring-orange-200",
  blocked: "bg-red-50 text-red-900 ring-red-200",
};

const ORDER_STATUS_STYLE: Record<string, string> = {
  pending: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  processing: "bg-sky-50 text-sky-900 ring-sky-200",
  ordered: "bg-aipify-accent-soft text-aipify-accent ring-aipify-accent-muted",
  shipped: "bg-violet-50 text-violet-900 ring-violet-200",
  delivered: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  cancelled: "bg-red-50 text-red-900 ring-red-200",
};

function formatAmount(amount: number, currency: string) {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
}

function RequestCard({
  req,
  labels,
  busy,
  showApprovalActions,
  onSubmit,
  onApprove,
  onReject,
  onCreateOrder,
}: {
  req: PurchaseRequest;
  labels: ProcurementOperationsLabels;
  busy: boolean;
  showApprovalActions?: boolean;
  onSubmit: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onCreateOrder: (req: PurchaseRequest) => void;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{req.request_number ?? req.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-aipify-text">{req.title}</h3>
          <p className="text-aipify-text-secondary">
            {req.requester_name ?? "—"} · {formatAmount(req.estimated_cost, req.currency)}
          </p>
          {req.vendor_name ? <p className="text-aipify-text-muted">{req.vendor_name}</p> : null}
          {req.required_date ? <p className="text-aipify-text-muted">Required {req.required_date}</p> : null}
          {req.domain_name ? <p className="text-aipify-text-muted">{req.domain_name}</p> : null}
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${REQUEST_STATUS_STYLE[req.status] ?? REQUEST_STATUS_STYLE.draft}`}
        >
          {req.status.replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {req.status === "draft" ? (
          <button type="button" disabled={busy} onClick={() => onSubmit(req.id)} className={AipifyShellClasses.primaryButton}>
            {labels.submitRequest}
          </button>
        ) : null}
        {showApprovalActions && req.approval_status.startsWith("pending") ? (
          <>
            <button type="button" disabled={busy} onClick={() => onApprove(req.id)} className={AipifyShellClasses.primaryButton}>
              {labels.approveRequest}
            </button>
            <button type="button" disabled={busy} onClick={() => onReject(req.id)} className={AipifyShellClasses.secondaryButton}>
              {labels.rejectRequest}
            </button>
          </>
        ) : null}
        {req.status === "approved" ? (
          <button type="button" disabled={busy} onClick={() => onCreateOrder(req)} className={AipifyShellClasses.primaryButton}>
            {labels.createOrder}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function VendorCard({
  vendor,
  labels,
  busy,
  onApprove,
  onRefreshScorecard,
}: {
  vendor: Vendor;
  labels: ProcurementOperationsLabels;
  busy: boolean;
  onApprove: (id: string) => void;
  onRefreshScorecard: (id: string) => void;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{vendor.vendor_number ?? vendor.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-aipify-text">{vendor.vendor_name}</h3>
          {vendor.contact_person ? <p className="text-aipify-text-secondary">{vendor.contact_person}</p> : null}
          {vendor.email ? <p className="text-aipify-text-muted">{vendor.email}</p> : null}
          {vendor.health_score != null ? (
            <p className="text-aipify-text-muted">
              {labels.supplierHealth}: {vendor.health_score} ({vendor.health_status?.replace(/_/g, " ") ?? "—"})
            </p>
          ) : null}
          {vendor.is_preferred ? <p className="text-aipify-text-muted">{labels.preferred}</p> : null}
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${VENDOR_STATUS_STYLE[vendor.status] ?? VENDOR_STATUS_STYLE.active}`}
        >
          {vendor.status.replace(/_/g, " ")}
        </span>
      </div>
      {vendor.status === "under_review" || vendor.status === "evaluation" ? (
        <button type="button" disabled={busy} onClick={() => onApprove(vendor.id)} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
          {labels.approveRequest}
        </button>
      ) : null}
      <button type="button" disabled={busy} onClick={() => onRefreshScorecard(vendor.id)} className={`mt-3 ${AipifyShellClasses.secondaryButton}`}>
        {labels.refreshScorecard}
      </button>
    </div>
  );
}

type Props = {
  labels: ProcurementOperationsLabels;
  initialTab?: Tab;
  titleOverride?: string;
  visibleTabs?: Tab[];
};

export function ProcurementOperationsPanel({ labels, initialTab = "overview", titleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<ProcurementOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [amount, setAmount] = useState("");
  const [contractName, setContractName] = useState("");
  const [rfqTitle, setRfqTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/procurement-operations");
    if (res.ok) setCenter(parseProcurementOperationsCenter(await res.json()));
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
    await fetch("/api/app/procurement-operations/action", {
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
  const purchaseRequests = center.purchase_requests ?? [];
  const pendingApprovals = center.pending_approvals ?? [];
  const contracts = center.contracts ?? [];
  const orders = center.orders ?? [];
  const deliveries = center.incoming_goods ?? center.deliveries ?? [];
  const quotations = center.quotations ?? [];
  const spendAnalysis = center.spend_analysis ?? {};
  const supplierList = center.suppliers ?? center.vendors ?? [];

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "suppliers", label: labels.suppliers },
    { id: "purchase_requests", label: labels.purchaseRequests },
    { id: "approvals", label: labels.approvals },
    { id: "orders", label: labels.orders },
    { id: "quotations", label: labels.quotations },
    { id: "contracts", label: labels.contracts },
    { id: "incoming_goods", label: labels.incomingGoods },
    { id: "spend_analysis", label: labels.spendAnalysis },
    { id: "reports", label: labels.reports },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;
  const activeTab = tab === "vendors" ? "suppliers" : tab === "deliveries" ? "incoming_goods" : tab;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
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
              activeTab === item.id
                ? `${AipifyShellClasses.primaryButton} text-sm`
                : `${AipifyShellClasses.secondaryButton} text-sm`
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                [labels.pendingApprovals, overview.pending_approvals],
                [labels.openRequests, overview.open_requests],
                [labels.activeSuppliers, overview.active_suppliers ?? overview.active_vendors],
                [labels.preferredSuppliers, overview.preferred_suppliers],
                [labels.highRiskSuppliers, overview.high_risk_suppliers ?? overview.high_risk_vendors],
                [labels.openRfqs, overview.open_rfqs],
                [labels.pendingReceiving, overview.pending_receiving],
                [labels.purchasingVolume, formatAmount(Number(overview.purchasing_volume_quarter ?? 0), "NOK")],
              ] as [string, string | number | undefined][]
            ).map(([label, value]) => (
              <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-xl font-semibold text-aipify-text">
                  {typeof value === "number" || typeof value === "string" ? value : "—"}
                </p>
              </div>
            ))}
          </div>
          {center.companion_insights ? (
            <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <h2 className="text-sm font-semibold text-aipify-text">{labels.companionInsights}</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-3 text-sm">
                {Array.isArray(center.companion_insights.top_suppliers) &&
                (center.companion_insights.top_suppliers as Record<string, unknown>[]).length > 0 ? (
                  <div>
                    <p className="font-medium text-aipify-text">{labels.preferredSuppliers}</p>
                    <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                      {(center.companion_insights.top_suppliers as Record<string, unknown>[]).map((row, i) => (
                        <li key={i}>
                          {String(row.name ?? "")}
                          {row.health_status ? ` · ${String(row.health_status).replace(/_/g, " ")}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {Array.isArray(center.companion_insights.expiring_contracts) &&
                (center.companion_insights.expiring_contracts as Record<string, unknown>[]).length > 0 ? (
                  <div>
                    <p className="font-medium text-aipify-text">{labels.expiringContracts}</p>
                    <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                      {(center.companion_insights.expiring_contracts as Record<string, unknown>[]).map((row, i) => (
                        <li key={i}>
                          {String(row.name ?? "")}
                          {row.renewal_date ? ` · ${String(row.renewal_date)}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {Array.isArray(center.companion_insights.high_risk_suppliers) &&
                (center.companion_insights.high_risk_suppliers as Record<string, unknown>[]).length > 0 ? (
                  <div>
                    <p className="font-medium text-aipify-text">{labels.highRiskSuppliers}</p>
                    <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                      {(center.companion_insights.high_risk_suppliers as Record<string, unknown>[]).map((row, i) => (
                        <li key={i}>{String(row.name ?? "")}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {tab === "purchase_requests" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-4`}>
            <input
              value={requestTitle}
              onChange={(e) => setRequestTitle(e.target.value)}
              placeholder={labels.requestTitle}
              className={AipifyShellClasses.input}
            />
            <input
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder={labels.vendorName}
              className={AipifyShellClasses.input}
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={labels.amount}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !requestTitle.trim()}
              onClick={() =>
                void runAction("create_purchase_request", {
                  title: requestTitle.trim(),
                  vendor_name: vendorName.trim(),
                  estimated_cost: Number(amount) || 0,
                }).then(() => {
                  setRequestTitle("");
                  setVendorName("");
                  setAmount("");
                })
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createRequest}
            </button>
          </div>
          {purchaseRequests.length === 0 ? (
            <PlatformEmptyState title={labels.noRequests} message={labels.noRequestsHint} />
          ) : (
            <div className="grid gap-3">
              {purchaseRequests.map((req) => (
                <RequestCard
                  key={req.id}
                  req={req}
                  labels={labels}
                  busy={busy}
                  onSubmit={(id) => void runAction("submit_purchase_request", { request_id: id })}
                  onApprove={(id) => void runAction("approve_purchase_request", { request_id: id })}
                  onReject={(id) => void runAction("reject_purchase_request", { request_id: id })}
                  onCreateOrder={(r) =>
                    void runAction("create_purchase_order", {
                      request_id: r.id,
                      vendor_name: r.vendor_name ?? "",
                      total_cost: r.estimated_cost,
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "approvals" ? (
        <div className="grid gap-3">
          {pendingApprovals.length === 0 ? (
            <PlatformEmptyState title={labels.pendingApprovals} message={labels.noRequestsHint} />
          ) : (
            pendingApprovals.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                labels={labels}
                busy={busy}
                showApprovalActions
                onSubmit={(id) => void runAction("submit_purchase_request", { request_id: id })}
                onApprove={(id) => void runAction("approve_purchase_request", { request_id: id })}
                onReject={(id) => void runAction("reject_purchase_request", { request_id: id })}
                onCreateOrder={(r) =>
                  void runAction("create_purchase_order", {
                    request_id: r.id,
                    vendor_name: r.vendor_name ?? "",
                    total_cost: r.estimated_cost,
                  })
                }
              />
            ))
          )}
        </div>
      ) : null}

      {(tab === "vendors" || tab === "suppliers") ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder={labels.supplierName}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !vendorName.trim()}
              onClick={() =>
                void runAction("create_vendor", { vendor_name: vendorName.trim() }).then(() => setVendorName(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createSupplier}
            </button>
          </div>
          {supplierList.length === 0 ? (
            <PlatformEmptyState title={labels.noSuppliers} message={labels.noRequestsHint} />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {supplierList.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  labels={labels}
                  busy={busy}
                  onApprove={(id) => void runAction("update_vendor_status", { vendor_id: id, status: "active" })}
                  onRefreshScorecard={(id) => void runAction("refresh_supplier_scorecard", { vendor_id: id })}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "quotations" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={rfqTitle} onChange={(e) => setRfqTitle(e.target.value)} placeholder={labels.rfqTitle} className={AipifyShellClasses.input} />
            <button
              type="button"
              disabled={busy || !rfqTitle.trim()}
              onClick={() => void runAction("create_rfq", { title: rfqTitle.trim() }).then(() => setRfqTitle(""))}
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createRfq}
            </button>
          </div>
          <div className="grid gap-3">
            {quotations.map((q: Quotation) => (
              <div key={q.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{q.rfq_number ?? q.id.slice(0, 8)}</p>
                <h3 className="font-semibold text-aipify-text">{q.title}</h3>
                <p className="text-aipify-text-secondary">{q.status.replace(/_/g, " ")} · {q.quotes_received ?? 0}/{q.required_quotes ?? 3} quotes</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "spend_analysis" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-4 p-4 text-sm`}>
          <p className="text-aipify-text-secondary">{String(spendAnalysis.budget_variance_note ?? "")}</p>
          {Array.isArray(spendAnalysis.spend_by_supplier) ? (
            <div>
              <p className="font-medium text-aipify-text">{labels.spendBySupplier}</p>
              <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                {(spendAnalysis.spend_by_supplier as Record<string, unknown>[]).map((row, i) => (
                  <li key={i}>{String(row.supplier_name ?? "")} · {formatAmount(Number(row.total_spend ?? 0), "NOK")}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "contracts" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-3`}>
            <input
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              placeholder={labels.contractName}
              className={AipifyShellClasses.input}
            />
            <input
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder={labels.vendorName}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !contractName.trim()}
              onClick={() =>
                void runAction("create_contract", {
                  contract_name: contractName.trim(),
                  vendor_name: vendorName.trim(),
                  contract_value: Number(amount) || 0,
                }).then(() => {
                  setContractName("");
                  setVendorName("");
                })
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createContract}
            </button>
          </div>
          <div className="grid gap-3">
            {contracts.map((c: Contract) => (
              <div key={c.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{c.contract_number ?? c.id.slice(0, 8)}</p>
                <h3 className="font-semibold text-aipify-text">{c.contract_name}</h3>
                <p className="text-aipify-text-secondary">
                  {c.vendor_name ?? "—"} · {formatAmount(c.contract_value, c.currency)}
                </p>
                {c.renewal_date ? <p className="text-aipify-text-muted">Renewal {c.renewal_date}</p> : null}
                <p className="text-aipify-text-muted">{c.status.replace(/_/g, " ")}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "orders" ? (
        <div className="grid gap-3">
          {orders.length === 0 ? (
            <PlatformEmptyState title={labels.noOrders} message={labels.noRequestsHint} />
          ) : (
            orders.map((order: PurchaseOrder) => (
              <div key={order.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-aipify-text-muted">{order.order_number ?? order.id.slice(0, 8)}</p>
                    <h3 className="font-semibold text-aipify-text">{order.vendor_name ?? "—"}</h3>
                    <p className="text-aipify-text-secondary">{formatAmount(order.total_cost, order.currency)}</p>
                    {order.expected_delivery ? (
                      <p className="text-aipify-text-muted">Expected {order.expected_delivery}</p>
                    ) : null}
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ORDER_STATUS_STYLE[order.status] ?? ORDER_STATUS_STYLE.pending}`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
                {!["delivered", "cancelled"].includes(order.status) ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("mark_order_delivered", { order_id: order.id })}
                    className={`mt-3 ${AipifyShellClasses.primaryButton}`}
                  >
                    {labels.markDelivered}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {(tab === "deliveries" || tab === "incoming_goods") ? (
        <div className="grid gap-3">
          {deliveries.length === 0 ? (
            <PlatformEmptyState title={labels.noIncomingGoods} message={labels.noRequestsHint} />
          ) : (
            deliveries.map((d: Delivery) => (
              <div key={d.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{d.order_number ?? d.order_id.slice(0, 8)}</p>
                <p className="font-semibold text-aipify-text">{d.delivery_status.replace(/_/g, " ")}</p>
                {d.expected_delivery ? <p className="text-aipify-text-secondary">Expected {d.expected_delivery}</p> : null}
                {d.quantity_received != null ? <p className="text-aipify-text-muted">Qty {d.quantity_received}</p> : null}
                {d.condition_status ? <p className="text-aipify-text-muted">{labels.condition}: {d.condition_status}</p> : null}
                {d.delivery_status === "pending" ? (
                  <button type="button" disabled={busy} onClick={() => void runAction("receive_goods", { order_id: d.order_id, delivery_status: "received" })} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
                    {labels.receiveGoods}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
          <p>
            {labels.purchasingVolume}: {formatAmount(Number(reports.purchasing_volume ?? 0), "NOK")}
          </p>
          <p>
            {labels.contractExposure}: {formatAmount(Number(reports.contract_exposure ?? 0), "NOK")}
          </p>
          <p>
            {labels.avgApprovalDays}: {String(reports.avg_approval_days ?? 0)}
          </p>
          {Array.isArray(reports.supplier_concentration) && reports.supplier_concentration.length > 0 ? (
            <div>
              <p className="font-medium text-aipify-text">{labels.supplierConcentration}</p>
              <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                {(reports.supplier_concentration as Record<string, unknown>[]).map((row, i) => (
                  <li key={i}>
                    {String(row.vendor_name ?? "")} · {formatAmount(Number(row.total_spend ?? 0), "NOK")}
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
