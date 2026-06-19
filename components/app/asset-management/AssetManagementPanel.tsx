"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseAssetManagementCenter,
  type AssetManagementCenter,
  type AssetManagementLabels,
  type AssetRecord,
} from "@/lib/asset-management";

type Tab =
  | "overview"
  | "assets"
  | "assignments"
  | "maintenance"
  | "vehicles"
  | "equipment"
  | "licenses"
  | "audits"
  | "reports";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  available: "bg-sky-50 text-sky-900 ring-sky-200",
  assigned: "bg-violet-50 text-violet-900 ring-violet-200",
  awaiting_assignment: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  reserved: "bg-sky-50 text-sky-800 ring-sky-200",
  maintenance_required: "bg-amber-50 text-amber-900 ring-amber-200",
  restricted: "bg-violet-50 text-violet-800 ring-violet-200",
  retired: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
};

function AssetRow({ asset, labels }: { asset: AssetRecord; labels: AssetManagementLabels }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{asset.asset_number}</p>
          <h3 className="font-semibold text-aipify-text">{asset.name}</h3>
          <p className="mt-1 text-sm capitalize text-aipify-text-secondary">
            {asset.category.replace(/_/g, " ")} · {asset.asset_type.replace(/_/g, " ")}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[asset.status] ?? STATUS_STYLE.active}`}
        >
          {asset.status.replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-aipify-text-muted">
        {asset.department_name ? (
          <span>
            {labels.department}: {asset.department_name}
          </span>
        ) : null}
        {asset.assigned_employee_name ? (
          <span>
            {labels.assignedTo}: {asset.assigned_employee_name}
          </span>
        ) : null}
        {asset.domain ? (
          <span>
            {labels.domain}: {asset.domain}
          </span>
        ) : null}
        {asset.qr_code ? (
          <span>
            {labels.qrCode}: {asset.qr_code}
          </span>
        ) : null}
        {asset.warranty_date ? (
          <span>
            {labels.warranty}: {asset.warranty_date}
          </span>
        ) : null}
      </div>
    </div>
  );
}

type Props = {
  labels: AssetManagementLabels;
  initialAssetType?: string;
  initialTab?: Tab;
  titleOverride?: string;
};

export function AssetManagementPanel({ labels, initialAssetType, initialTab, titleOverride }: Props) {
  const [center, setCenter] = useState<AssetManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab ?? "overview");
  const [busy, setBusy] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetCategory, setAssetCategory] = useState("equipment");
  const [scanCode, setScanCode] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (initialAssetType) params.set("asset_type", initialAssetType);
    const res = await fetch(`/api/app/assets?${params}`);
    if (res.ok) setCenter(parseAssetManagementCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [initialAssetType]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/assets/action", {
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

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "assets", label: labels.assets },
    { key: "assignments", label: labels.assignments },
    { key: "maintenance", label: labels.maintenance },
    { key: "vehicles", label: labels.vehicles },
    { key: "equipment", label: labels.equipment },
    { key: "licenses", label: labels.licenses },
    { key: "audits", label: labels.audits },
    { key: "reports", label: labels.reports },
  ];

  const filterAssets = (list: AssetRecord[]) => {
    if (tab === "vehicles" || initialAssetType === "vehicle") return list.filter((a) => a.asset_type === "vehicle");
    if (tab === "equipment") return list.filter((a) => a.asset_type === "equipment");
    return list;
  };

  const assets = filterAssets(center.assets ?? []);
  const routes = center.routes ?? {};
  const overview = center.overview ?? {};
  const reports = center.reports ?? {};

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        {initialAssetType === "vehicle" ? (
          <Link href={routes.assets ?? "/app/assets"} className={`text-sm ${AipifyShellClasses.link}`}>
            {labels.backToAssets}
          </Link>
        ) : null}
        <h1 className="mt-2 text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        <p className="mt-2 text-xs text-aipify-text-muted">{center.principle ?? labels.principle}</p>
        {center.philosophy ? <p className="mt-1 text-xs text-aipify-text-muted">{center.philosophy}</p> : null}
        <p className="mt-1 text-xs text-aipify-text-muted">{labels.mobileReady}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {routes.vehicles && !initialAssetType ? (
            <Link href={routes.vehicles} className={AipifyShellClasses.link}>
              {labels.vehicles}
            </Link>
          ) : null}
          {routes.people ? (
            <Link href={routes.people} className={AipifyShellClasses.link}>
              {labels.peopleLink}
            </Link>
          ) : null}
          {routes.inventory ? (
            <Link href={routes.inventory} className={AipifyShellClasses.link}>
              {labels.inventoryLink}
            </Link>
          ) : null}
        </div>
      </header>

      {(tab === "overview" || !initialAssetType) && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
          {(
            [
              [labels.assets, overview.total_assets],
              [labels.assigned, overview.assigned],
              [labels.available, overview.available],
              [labels.maintenanceRequired, overview.maintenance_required],
              [labels.vehicles, overview.vehicles],
              [labels.licenses, overview.software_licenses],
              [labels.audits, overview.audits_in_progress],
              [labels.totalValue, overview.total_value],
            ] as [string, string | number | undefined][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      )}

      {!initialAssetType ? (
        <nav className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                tab === t.key
                  ? `${AipifyShellClasses.primaryButton} text-sm`
                  : `${AipifyShellClasses.secondaryButton} text-sm`
              }
            >
              {t.label}
            </button>
          ))}
        </nav>
      ) : null}

      {(tab === "assets" || tab === "equipment" || tab === "vehicles" || initialAssetType) && (
        <div className="space-y-4">
          {!initialAssetType ? (
            <div className={`${AipifyShellClasses.surfaceCard} flex flex-col gap-2 p-4 sm:flex-row`}>
              <input
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder={labels.assetName}
                className={AipifyShellClasses.input}
              />
              <select
                value={assetCategory}
                onChange={(e) => setAssetCategory(e.target.value)}
                className={AipifyShellClasses.input}
              >
                <option value="equipment">{labels.equipment}</option>
                <option value="laptop">Laptop</option>
                <option value="vehicle">{labels.vehicles}</option>
                <option value="warehouse_equipment">Warehouse</option>
              </select>
              <button
                type="button"
                disabled={busy || !assetName.trim()}
                onClick={() => {
                  void runAction("create_asset", {
                    name: assetName.trim(),
                    category: assetCategory,
                    asset_type:
                      tab === "vehicles" ? "vehicle" : tab === "equipment" ? "equipment" : "equipment",
                  });
                  setAssetName("");
                }}
                className={`${AipifyShellClasses.primaryButton} text-sm`}
              >
                {labels.createAsset}
              </button>
            </div>
          ) : null}
          {assets.length === 0 ? (
            <PlatformEmptyState title={labels.noAssets} message={labels.noAssetsHint} />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {assets.map((a) => (
                <AssetRow key={a.id} asset={a} labels={labels} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "assignments" && (
        <div className="space-y-2">
          {(center.assignments ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.assignments} message={labels.noAssetsHint} />
          ) : (
            (center.assignments ?? []).map((item) => (
              <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">
                  {item.asset_name} ({item.asset_number})
                </p>
                <p className="text-aipify-text-secondary">
                  {item.assignment_type} · {item.assigned_label ?? labels.assignedTo}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "maintenance" && (
        <div className="space-y-2">
          {(center.maintenance ?? []).map((m, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} border-l-4 border-amber-400 p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(m.title ?? "")}</p>
              <p className="text-aipify-text-secondary">
                {String(m.asset_name ?? "")} · {String(m.maintenance_type ?? "")}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "licenses" && (
        <div className="space-y-2">
          {(center.software_licenses ?? []).map((lic, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(lic.license_name ?? "")}</p>
              <p className="text-aipify-text-secondary">
                {String(lic.vendor ?? "")} · {labels.licenseSeats}: {String(lic.seats_used ?? 0)}/
                {String(lic.seat_count ?? 0)}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "audits" && (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4`}>
            <p className="text-sm font-medium text-aipify-text">{labels.startAudit}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
                placeholder={labels.scanQr}
                className={AipifyShellClasses.input}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction("start_audit", { audit_type: "qr_scan" })}
                className={`${AipifyShellClasses.primaryButton} text-sm`}
              >
                {labels.startAudit}
              </button>
              {scanCode.trim() ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction("lookup_qr", { code: scanCode.trim() })}
                  className={`${AipifyShellClasses.secondaryButton} text-sm`}
                >
                  {labels.lookupAsset}
                </button>
              ) : null}
            </div>
          </div>
          {(center.audits ?? []).map((audit) => (
            <div key={audit.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">
                {audit.audit_number} · {audit.audit_type}
              </p>
              <p className="text-aipify-text-secondary">
                {audit.status} · {audit.items_verified ?? 0} verified
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && (
        <div className={`${AipifyShellClasses.surfaceCard} grid gap-4 p-5 sm:grid-cols-2 text-sm`}>
          <div>
            <p className="text-aipify-text-muted">{labels.totalValue}</p>
            <p className="text-lg font-semibold text-aipify-text">{String(reports.total_value ?? "—")}</p>
          </div>
          <div>
            <p className="text-aipify-text-muted">{labels.maintenanceCosts}</p>
            <p className="text-lg font-semibold text-aipify-text">
              {String(reports.maintenance_costs_ytd ?? "—")}
            </p>
          </div>
          <div>
            <p className="text-aipify-text-muted">{labels.assetUtilization}</p>
            <p className="text-lg font-semibold text-aipify-text">
              {String(reports.asset_utilization_pct ?? "—")}%
            </p>
          </div>
          <div>
            <p className="text-aipify-text-muted">{labels.auditCompliance}</p>
            <p className="text-lg font-semibold text-aipify-text">
              {String(reports.audit_compliance_pct ?? "—")}%
            </p>
          </div>
        </div>
      )}

      {tab === "overview" && !initialAssetType ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.assets ?? []).slice(0, 6).map((a) => (
            <AssetRow key={a.id} asset={a} labels={labels} />
          ))}
        </div>
      ) : null}

      {initialAssetType === "vehicle" && (center.vehicles ?? []).length > 0 ? (
        <div className="space-y-2">
          {(center.vehicles ?? []).map((v) => (
            <div key={v.asset_id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">
                {v.name} ({v.asset_number})
              </p>
              <p className="text-aipify-text-secondary">
                {v.registration_number ?? "—"} · {labels.nextService}: {v.next_service_date ?? "—"}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {(center.audit_recent ?? []).length > 0 ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
          <h2 className="text-sm font-medium text-aipify-text">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-2">
            {(center.audit_recent ?? []).slice(0, 8).map((a, i) => (
              <li key={i} className="text-xs text-aipify-text-secondary">
                {a.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
