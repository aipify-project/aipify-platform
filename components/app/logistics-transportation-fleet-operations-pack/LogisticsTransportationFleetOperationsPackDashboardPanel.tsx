"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatExecutiveMetric, formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseLogisticsTransportationFleetOperationsCenter,
  type LogisticsTransportationFleetOperationsCenter,
} from "@/lib/aipify/logistics-transportation-fleet-operations-pack";

type Props = { labels: Record<string, string> };

export function LogisticsTransportationFleetOperationsPackDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<LogisticsTransportationFleetOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("truck");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/logistics-transportation-fleet-operations-pack/dashboard");
    if (res.ok) {
      setCenter(parseLogisticsTransportationFleetOperationsCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const createVehicle = async () => {
    if (!vehicleName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/logistics-transportation-fleet-operations-pack/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_vehicle",
        vehicle_name: vehicleName.trim(),
        vehicle_type: vehicleType,
        vehicle_status: "available",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setVehicleName("");
      await load();
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const ops = center.operations ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricShipments, formatOverviewMetric(overview.active_shipments)],
            [labels.metricFleet, formatOverviewMetric(overview.fleet_size)],
            [labels.metricDrivers, formatOverviewMetric(overview.drivers)],
            [labels.metricRoutes, formatOverviewMetric(overview.routes)],
            [labels.metricCenters, formatOverviewMetric(overview.distribution_centers)],
            [labels.metricOnTime, formatOverviewMetric(overview.on_time_delivery)],
            [labels.metricCosts, formatOverviewMetric(overview.transportation_costs)],
            [labels.metricHealth, formatOverviewMetric(overview.logistics_health_score)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openFleet, ops.fleet_route],
            [labels.openDrivers, ops.drivers_route],
            [labels.openRoutes, ops.routes_route],
            [labels.openShipments, ops.shipments_route],
            [labels.openCenters, ops.distribution_centers_route],
            [labels.openWarehouse, ops.warehouse_route],
            [labels.openExecutive, center.executive_dashboard?.executive_route as string],
          ].map(([label, href]) =>
            href ? (
              <Link
                key={String(label)}
                href={href}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.fleetTitle}</h2>
        {(center.vehicles ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noVehicles}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.vehicles ?? []).map((v) => (
              <li key={v.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span>
                  <span className="font-medium text-gray-900">{v.vehicle_name}</span>
                  <span className="ml-2 text-gray-500">{v.vehicle_type}</span>
                </span>
                <span className="text-gray-600">{v.vehicle_status}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.vehicleNamePlaceholder}
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="truck">{labels.typeTruck}</option>
            <option value="van">{labels.typeVan}</option>
            <option value="trailer">{labels.typeTrailer}</option>
            <option value="special_equipment">{labels.typeSpecial}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createVehicle()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.addVehicle}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.shipmentsTitle}</h2>
        {(center.shipments ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noShipments}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {(center.shipments ?? []).slice(0, 10).map((s) => (
              <li key={s.id} className="rounded-lg bg-gray-50 px-3 py-2">
                {s.shipment_reference} · {s.origin_label} → {s.destination_label} · {s.shipment_status}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <p className="text-sm text-gray-500">
        {labels.warehouseCrossLink}{" "}
        <Link href={center.warehouse_operations_route ?? "/app/aipify-warehouse-operations"} className="underline">
          {labels.warehouseLink}
        </Link>
        {" · "}
        <Link href={center.industry_packs_route ?? "/app/industry-packs"} className="underline">
          {labels.industryPacksLink}
        </Link>
      </p>
    </div>
  );
}
