"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/shared/AipifyLoader";
import {
  parseHospitalityAccommodationCenter,
  type HospitalityAccommodationCenter,
} from "@/lib/aipify/hospitality-accommodation-pack";

type Props = { labels: Record<string, string> };

export function HospitalityAccommodationPackDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<HospitalityAccommodationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("apartment");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/hospitality-accommodation-pack/dashboard");
    if (res.ok) {
      setCenter(parseHospitalityAccommodationCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const createProperty = async () => {
    if (!propertyName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/hospitality-accommodation-pack/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_property",
        display_name: propertyName.trim(),
        property_type: propertyType,
        platform_source: "direct",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setPropertyName("");
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
            [labels.metricProperties, overview.properties ?? 0],
            [labels.metricReservations, overview.reservations ?? 0],
            [labels.metricOccupancy, overview.occupancy_rate ?? 0],
            [labels.metricCheckIns, overview.upcoming_check_ins ?? 0],
            [labels.metricCheckOuts, overview.upcoming_check_outs ?? 0],
            [labels.metricRevenue, overview.revenue ?? 0],
            [labels.metricSatisfaction, overview.guest_satisfaction ?? 0],
            [labels.metricHealth, overview.hospitality_health_score ?? 0],
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
            [labels.openCleaning, ops.cleaning_route],
            [labels.openMaintenance, ops.maintenance_route],
            [labels.openCheckIn, ops.check_in_route],
            [labels.openBookings, ops.booking_route],
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
        <h2 className="text-lg font-semibold text-gray-900">{labels.propertiesTitle}</h2>
        {(center.properties ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noProperties}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.properties ?? []).map((p) => (
              <li key={p.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span>
                  <span className="font-medium text-gray-900">{p.display_name}</span>
                  <span className="ml-2 text-gray-500">{p.property_type}</span>
                </span>
                <span className="text-gray-600">{labels.health}: {p.health_score}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.propertyNamePlaceholder}
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="apartment">{labels.typeApartment}</option>
            <option value="house">{labels.typeHouse}</option>
            <option value="cabin">{labels.typeCabin}</option>
            <option value="villa">{labels.typeVilla}</option>
            <option value="hotel_room">{labels.typeHotelRoom}</option>
            <option value="boutique_hotel">{labels.typeBoutiqueHotel}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createProperty()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.addProperty}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.reservationsTitle}</h2>
        {(center.reservations ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noReservations}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {(center.reservations ?? []).slice(0, 10).map((r) => (
              <li key={r.id} className="rounded-lg bg-gray-50 px-3 py-2">
                {r.guest_name} · {r.check_in_date} → {r.check_out_date} · {r.booking_status}
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

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.channelsTitle}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(center.channels ?? []).map((c) => (
            <span key={String(c.id)} className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-900">
              {String(c.channel_key)} · {String(c.status)}
            </span>
          ))}
        </div>
      </section>

      <p className="text-sm text-gray-500">
        {labels.hostsCrossLink}{" "}
        <Link href={center.aipify_hosts_route ?? "/app/aipify-hosts"} className="underline">
          {labels.hostsLink}
        </Link>
        {" · "}
        <Link href={center.industry_packs_route ?? "/app/industry-packs"} className="underline">
          {labels.industryPacksLink}
        </Link>
      </p>
    </div>
  );
}
