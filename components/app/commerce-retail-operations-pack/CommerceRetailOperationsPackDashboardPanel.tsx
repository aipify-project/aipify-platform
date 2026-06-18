"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseCommerceRetailOperationsCenter,
  type CommerceRetailOperationsCenter,
} from "@/lib/aipify/commerce-retail-operations-pack";

type Props = { labels: Record<string, string> };

export function CommerceRetailOperationsPackDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<CommerceRetailOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storePlatform, setStorePlatform] = useState("custom");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/commerce-retail-operations-pack/dashboard");
    if (res.ok) {
      setCenter(parseCommerceRetailOperationsCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const createStore = async () => {
    if (!storeName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/commerce-retail-operations-pack/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_store",
        store_name: storeName.trim(),
        platform: storePlatform,
        country: "Nordic",
        currency: "NOK",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setStoreName("");
      await load();
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader centered />
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
  const legacyLinks = center.legacy_module_cross_links ?? [];

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
            [labels.metricStores, formatOverviewMetric(overview.stores)],
            [labels.metricProducts, formatOverviewMetric(overview.products)],
            [labels.metricOrders, formatOverviewMetric(overview.orders)],
            [labels.metricRevenue, formatOverviewMetric(overview.revenue)],
            [labels.metricProfit, formatOverviewMetric(overview.profit)],
            [labels.metricCustomers, formatOverviewMetric(overview.customers)],
            [labels.metricConversion, formatOverviewMetric(overview.conversion_rate)],
            [labels.metricHealth, formatOverviewMetric(overview.commerce_health_score)],
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
            [labels.openIntelligence, ops.commerce_intelligence_route],
            [labels.openAutomation, ops.product_automation_route],
            [labels.openDropshipping, ops.dropshipping_route],
            [labels.openPerformance, ops.commerce_performance_route],
            [labels.openMultiStore, ops.multi_store_route],
            [labels.openCompanion, ops.commerce_companion_route],
            [labels.openGlobalExpansion, ops.global_expansion_route],
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
        <h2 className="text-lg font-semibold text-gray-900">{labels.storesTitle}</h2>
        {(center.stores ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noStores}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.stores ?? []).map((s) => (
              <li key={s.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span>
                  <span className="font-medium text-gray-900">{s.store_name}</span>
                  <span className="ml-2 text-gray-500">{s.platform}</span>
                </span>
                <span className="text-gray-600">{s.country ?? s.currency}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.storeNamePlaceholder}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={storePlatform}
            onChange={(e) => setStorePlatform(e.target.value)}
          >
            <option value="custom">{labels.platformCustom}</option>
            <option value="shopify">{labels.platformShopify}</option>
            <option value="woocommerce">{labels.platformWooCommerce}</option>
            <option value="magento">{labels.platformMagento}</option>
            <option value="bigcommerce">{labels.platformBigCommerce}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createStore()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.addStore}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.productsTitle}</h2>
        {(center.products ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noProducts}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {(center.products ?? []).slice(0, 10).map((p) => (
              <li key={p.id} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium text-gray-900">{p.name}</span>
                <span className="text-gray-500">{p.category}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        {(center.advisor_signals ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noAdvisor}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {(center.advisor_signals ?? []).map((sig) => (
              <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{sig.observation}</p>
                {sig.impact ? <p className="mt-1 text-sm text-gray-600">{sig.impact}</p> : null}
                {sig.recommendation ? (
                  <p className="mt-2 text-sm font-medium text-gray-800">
                    {labels.recommendation}: {sig.recommendation}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.platformsTitle}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(center.platforms ?? []).map((c) => (
            <span key={String(c.id)} className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-900">
              {String(c.platform_key)} · {String(c.status)}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.legacyModulesTitle}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {legacyLinks.map((m) =>
            m.route ? (
              <Link
                key={m.key}
                href={m.route}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {m.key}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <p className="text-sm text-gray-500">
        {labels.commerceCrossLink}{" "}
        <Link href={center.commerce_intelligence_route ?? "/app/commerce-intelligence"} className="underline">
          {labels.commerceIntelligenceLink}
        </Link>
        {" · "}
        <Link href={center.industry_packs_route ?? "/app/industry-packs"} className="underline">
          {labels.industryPacksLink}
        </Link>
      </p>
    </div>
  );
}
