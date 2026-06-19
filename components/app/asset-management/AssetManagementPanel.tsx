"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAssetManagementCenter,
  type AssetManagementCenter,
  type AssetManagementLabels,
  type AssetRecord,
} from "@/lib/asset-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab = "overview" | "assets" | "equipment" | "vehicles" | "properties" | "itEquipment" | "softwareLicenses" | "maintenance" | "reports";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  reserved: "bg-sky-50 text-sky-800 ring-sky-200",
  maintenance_required: "bg-amber-50 text-amber-900 ring-amber-200",
  restricted: "bg-violet-50 text-violet-800 ring-violet-200",
  retired: "bg-gray-100 text-gray-600 ring-gray-200",
};

function AssetRow({ asset, labels }: { asset: AssetRecord; labels: AssetManagementLabels }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-gray-500">{asset.asset_number}</p>
          <h3 className="font-semibold text-gray-900">{asset.name}</h3>
          <p className="mt-1 text-sm text-gray-500 capitalize">{asset.category.replace(/_/g, " ")} · {asset.asset_type.replace(/_/g, " ")}</p>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[asset.status] ?? STATUS_STYLE.active}`}>
          {asset.status.replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        {asset.department_name ? <span>{labels.department}: {asset.department_name}</span> : null}
        {asset.assigned_employee_name ? <span>{labels.assignedTo}: {asset.assigned_employee_name}</span> : null}
        {asset.domain ? <span>{labels.domain}: {asset.domain}</span> : null}
        {asset.warranty_date ? <span>{labels.warranty}: {asset.warranty_date}</span> : null}
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

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (initialAssetType) params.set("asset_type", initialAssetType);
    const res = await fetch(`/api/app/assets?${params}`);
    if (res.ok) setCenter(parseAssetManagementCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [initialAssetType]);

  useEffect(() => { void load(); }, [load]);

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

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "assets", label: labels.assets },
    { key: "equipment", label: labels.equipment },
    { key: "vehicles", label: labels.vehicles },
    { key: "properties", label: labels.properties },
    { key: "itEquipment", label: labels.itEquipment },
    { key: "softwareLicenses", label: labels.softwareLicenses },
    { key: "maintenance", label: labels.maintenance },
    { key: "reports", label: labels.reports },
  ];

  const filterAssets = (list: AssetRecord[]) => {
    if (tab === "vehicles") return list.filter((a) => a.asset_type === "vehicle");
    if (tab === "properties") return list.filter((a) => a.asset_type === "property");
    if (tab === "itEquipment") return list.filter((a) => a.asset_type === "it_equipment");
    if (tab === "equipment") return list.filter((a) => a.asset_type === "equipment");
    return list;
  };

  const assets = filterAssets(center.assets ?? []);
  const routes = center.routes;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        {initialAssetType === "vehicle" ? (
          <Link href="/app/assets" className="text-sm text-indigo-600 hover:underline">{labels.backToAssets}</Link>
        ) : null}
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {routes?.calendar ? <Link href={routes.calendar} className="text-indigo-700 hover:underline">{labels.calendarLink}</Link> : null}
          {routes?.organization ? <Link href={routes.organization} className="text-indigo-700 hover:underline">{labels.organizationLink}</Link> : null}
          {!initialAssetType && routes?.vehicles ? <Link href={routes.vehicles} className="text-indigo-700 hover:underline">{labels.vehicles}</Link> : null}
        </div>
      </div>

      {center.overview ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
          {[
            [labels.assets, center.overview.total_assets],
            [labels.active, center.overview.active],
            [labels.maintenanceRequired, center.overview.maintenance_required],
            [labels.vehicles, center.overview.vehicles],
            [labels.softwareLicenses, center.overview.software_licenses],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{value ?? 0}</p>
            </div>
          ))}
        </div>
      ) : null}

      {!initialAssetType ? (
        <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2">
          {tabs.map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{t.label}</button>
          ))}
        </div>
      ) : null}

      {(tab === "assets" || tab === "equipment" || tab === "vehicles" || tab === "properties" || tab === "itEquipment" || initialAssetType) && (
        <div className="space-y-4">
          {!initialAssetType ? (
            <form className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row" onSubmit={(e) => {
              e.preventDefault();
              void runAction("create_asset", {
                name: assetName,
                category: assetCategory,
                asset_type: tab === "vehicles" ? "vehicle" : tab === "properties" ? "property" : tab === "itEquipment" ? "it_equipment" : "equipment",
              });
              setAssetName("");
            }}>
              <input value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder={labels.assetName} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
              <select value={assetCategory} onChange={(e) => setAssetCategory(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="equipment">{labels.equipment}</option>
                <option value="laptop">Laptop</option>
                <option value="vehicle">{labels.vehicles}</option>
                <option value="property">{labels.properties}</option>
                <option value="warehouse_equipment">Warehouse</option>
              </select>
              <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.createAsset}</button>
            </form>
          ) : null}
          {assets.length === 0 ? (
            <PlatformEmptyState title={labels.noAssets} message={labels.noAssetsHint} primaryAction={{ label: labels.createAsset, href: "#" }} />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">{assets.map((a) => <AssetRow key={a.id} asset={a} labels={labels} />)}</div>
          )}
        </div>
      )}

      {tab === "softwareLicenses" && (
        <div className="space-y-2">
          {(center.software_licenses ?? []).map((lic, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(lic.license_name ?? "")}</p>
              <p className="text-gray-500">{String(lic.vendor ?? "")} · {labels.licenseSeats}: {String(lic.seats_used ?? 0)}/{String(lic.seat_count ?? 0)}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "maintenance" && (
        <div className="space-y-2">
          {(center.maintenance ?? []).map((m, i) => (
            <div key={i} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4 text-sm">
              <p className="font-medium text-gray-900">{String(m.title ?? "")}</p>
              <p className="text-gray-600">{String(m.asset_name ?? "")} · {String(m.maintenance_type ?? "")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && center.reports ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 grid gap-4 sm:grid-cols-2 text-sm">
          <div><p className="text-gray-500">{labels.totalValue}</p><p className="text-lg font-semibold">{String(center.reports.total_value ?? "—")}</p></div>
          <div><p className="text-gray-500">{labels.maintenanceCosts}</p><p className="text-lg font-semibold">{String(center.reports.maintenance_costs_ytd ?? "—")}</p></div>
        </div>
      ) : null}

      {tab === "overview" && !initialAssetType ? (
        <div className="grid gap-3 lg:grid-cols-2">{(center.assets ?? []).slice(0, 6).map((a) => <AssetRow key={a.id} asset={a} labels={labels} />)}</div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-2">
            {center.audit_recent.slice(0, 8).map((a, i) => (
              <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm">
                <p className="font-medium text-gray-900">{a.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
