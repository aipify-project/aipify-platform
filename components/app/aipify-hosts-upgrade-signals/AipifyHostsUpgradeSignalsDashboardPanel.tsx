"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsUpgradeSignalActionResult,
  parseAipifyHostsUpgradeSignalsDashboard,
  type HostsUpgradeRecommendation,
  type HostsUpgradeSignal,
  type HostsUpgradeSignalsDashboard,
} from "@/lib/aipify/aipify-hosts-upgrade-signals";

type Props = { labels: Record<string, string> };

function SignalRow({
  signal,
  labels,
  busy,
  onDismiss,
}: {
  signal: HostsUpgradeSignal;
  labels: Record<string, string>;
  busy: boolean;
  onDismiss: (key: string) => void;
}) {
  const severityClass =
    signal.severity === "high"
      ? "border-amber-200 bg-amber-50/60"
      : signal.severity === "moderate"
        ? "border-indigo-100 bg-indigo-50/40"
        : "border-gray-200 bg-gray-50/60";

  return (
    <article className={`rounded-xl border px-4 py-3 ${severityClass}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{signal.title}</p>
          <p className="mt-1 text-sm text-gray-600">{signal.message}</p>
          <p className="mt-1 text-xs text-gray-500">{labels[`signal_${signal.signal_key}`] ?? signal.signal_key.replace(/_/g, " ")}</p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => onDismiss(signal.signal_key)}
          className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-60"
        >
          {labels.dismiss}
        </button>
      </div>
    </article>
  );
}

function RecommendationCard({
  rec,
  labels,
  busy,
  onAction,
}: {
  rec: HostsUpgradeRecommendation;
  labels: Record<string, string>;
  busy: boolean;
  onAction: (rec: HostsUpgradeRecommendation, actionType: string) => void;
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
      <p className="mt-2 text-sm text-gray-600">{rec.message}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {rec.action_type === "upgrade" && (
          <button type="button" disabled={busy} onClick={() => onAction(rec, "start_upgrade")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
            {labels.upgrade}
          </button>
        )}
        {rec.action_type === "add_license" && (
          <button type="button" disabled={busy} onClick={() => onAction(rec, "add_property_license")} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100 disabled:opacity-60">
            {labels.addPropertyLicense}
          </button>
        )}
        {rec.action_type === "activate_pack" && (
          <Link href={rec.routes?.marketplace ?? "/app/marketplace/activation"} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">
            {labels.activatePack}
          </Link>
        )}
        <Link href={rec.routes?.upgrade ?? "/app/settings/billing/packages"} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          {labels.viewPlans}
        </Link>
      </div>
    </article>
  );
}

export function AipifyHostsUpgradeSignalsDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsUpgradeSignalsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/aipify-hosts/upgrade-signals/dashboard?surface=upgrade_signals");
    if (res.ok) setDashboard(parseAipifyHostsUpgradeSignalsDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (actionType: string, rec?: HostsUpgradeRecommendation, signalKey?: string) => {
    setBusy(true);
    setActionError(null);
    setSuccessMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/upgrade-signals/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: actionType,
        recommendation_key: rec?.recommendation_key,
        signal_key: signalKey,
        payload: rec ? { action_target: rec.action_target } : {},
      }),
    });
    const body = await res.json();
    setBusy(false);
    if (!res.ok) {
      setActionError(typeof body.error === "string" ? body.error : labels.actionFailed);
      return;
    }
    const result = parseAipifyHostsUpgradeSignalActionResult(body);
    if (result.billing_route) {
      window.location.href = result.billing_route;
      return;
    }
    setSuccessMessage(result.message ?? labels.actionRecorded);
    await load();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <AipifyLoader size="sm" />
        {labels.loading}
      </div>
    );
  }

  if (!dashboard?.has_customer) {
    return <PlatformEmptyState title={labels.errorTitle} message={labels.errorMessage} />;
  }

  const licensing = dashboard.licensing ?? {};

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm text-indigo-950">
        <p>{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-indigo-800">{dashboard.principle}</p>
      </div>
      <p className="text-xs text-gray-500">{dashboard.governance_note}</p>

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{successMessage}</div>
      )}
      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">{labels.currentPlan}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{String(licensing.plan_type ?? dashboard.package_key)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">{labels.propertyCapacity}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{String(licensing.capacity_label ?? "—")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">{labels.activeSignals}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{dashboard.signals.length}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">{labels.recommendations}</h2>
        {dashboard.recommendations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center text-sm text-gray-500">
            {labels.emptyRecommendations}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.recommendations.map((rec) => (
              <RecommendationCard key={rec.recommendation_key} rec={rec} labels={labels} busy={busy} onAction={(r, a) => void runAction(a, r)} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">{labels.growthSignals}</h2>
        {dashboard.signals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center text-sm text-gray-500">
            {labels.emptySignals}
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard.signals.map((signal) => (
              <SignalRow key={signal.signal_key} signal={signal} labels={labels} busy={busy} onDismiss={(key) => void runAction("dismiss_signal", undefined, key)} />
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/app/aipify-hosts" className="text-indigo-700 hover:text-indigo-900">{labels.backToHosts}</Link>
        <Link href="/app/marketplace/activation" className="text-gray-600 hover:text-gray-900">{labels.openMarketplace}</Link>
        <Link href="/app/settings/billing/packages" className="text-gray-600 hover:text-gray-900">{labels.viewPlans}</Link>
      </div>
    </div>
  );
}
