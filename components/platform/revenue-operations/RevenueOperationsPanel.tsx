"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  OUTCOME_BADGES,
  RESOLUTION_BADGES,
  parseRevenueOperationsCenter,
  type RevenueOperationsCenter,
  type RevenueOperationsLabels,
} from "@/lib/revenue-operations";

type RevenueOperationsPanelProps = {
  labels: RevenueOperationsLabels;
  backHref: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">{value}</dd>
    </div>
  );
}

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

export function RevenueOperationsPanel({ labels, backHref }: RevenueOperationsPanelProps) {
  const [center, setCenter] = useState<RevenueOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const auditRef = useRef<HTMLElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/revenue-operations/overview");
    if (res.ok) setCenter(parseRevenueOperationsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = useCallback(
    async (activationId: string, action: string) => {
      setBusyId(activationId);
      try {
        const res = await fetch("/api/revenue-operations/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, activation_id: activationId }),
        });
        if (res.ok) {
          if (action === "review_logs") {
            auditRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          await load();
        }
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  if (loading) {
    return <p className="p-6 text-sm text-neutral-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { overview } = center;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-neutral-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm text-neutral-800">
          {center.principle}
        </p>
        <p className="mt-2 text-xs text-neutral-500">{center.founding_principle}</p>
      </div>

      <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-neutral-900">{labels.sections.overview}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.activeProviders} value={overview.active_billing_providers} />
          <OverviewCard
            label={labels.overview.successfulActivations}
            value={overview.successful_activations_30d}
          />
          <OverviewCard label={labels.overview.pendingActivations} value={overview.pending_activations} />
          <OverviewCard label={labels.overview.failedActivations} value={overview.failed_activations} />
          <OverviewCard label={labels.overview.upgrades} value={overview.subscription_upgrades} />
          <OverviewCard label={labels.overview.downgrades} value={overview.subscription_downgrades} />
        </dl>
      </section>

      <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-neutral-900">{labels.sections.trialConversion}</h2>
        <p className="mt-2 text-sm text-neutral-600">{labels.trialConversion.title}</p>
        <ol className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-neutral-800">
          {center.activation_flow.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-full bg-neutral-100 px-3 py-1.5 ring-1 ring-neutral-200">{step}</span>
              {index < center.activation_flow.length - 1 ? (
                <span className="text-neutral-400" aria-hidden="true">
                  ↓
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-neutral-900">{labels.sections.packageSync}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="rounded-xl bg-neutral-50 px-4 py-3">
            <dt className="font-medium text-neutral-900">{labels.packageSync.onSuccess}</dt>
            <dd className="mt-1 text-neutral-600">{center.package_sync.on_payment_success}</dd>
          </div>
          <div className="rounded-xl bg-neutral-50 px-4 py-3">
            <dt className="font-medium text-neutral-900">{labels.packageSync.onExpiry}</dt>
            <dd className="mt-1 text-neutral-600">{center.package_sync.on_subscription_expiry}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-neutral-900">{labels.sections.failedActivations}</h2>
        {center.failed_activations.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">{labels.empty.failed}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-3 py-2">{labels.table.customer}</th>
                  <th className="px-3 py-2">{labels.table.provider}</th>
                  <th className="px-3 py-2">{labels.table.failureReason}</th>
                  <th className="px-3 py-2">{labels.table.detectedAt}</th>
                  <th className="px-3 py-2">{labels.table.resolutionStatus}</th>
                  <th className="px-3 py-2">{labels.table.action}</th>
                </tr>
              </thead>
              <tbody>
                {center.failed_activations.map((row) => {
                  const busy = busyId === row.id;
                  return (
                    <tr key={row.id} className="border-b border-neutral-50 align-top">
                      <td className="px-3 py-3 font-medium text-neutral-900">{row.customer}</td>
                      <td className="px-3 py-3 text-neutral-700">
                        {labels.providers[row.provider] ?? row.provider}
                      </td>
                      <td className="px-3 py-3 text-neutral-600">{row.failure_reason}</td>
                      <td className="px-3 py-3 text-neutral-600">
                        {new Date(row.detected_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill
                          label={labels.resolutions[row.resolution_status] ?? row.resolution_status}
                          className={
                            RESOLUTION_BADGES[row.resolution_status] ?? RESOLUTION_BADGES.open
                          }
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void handleAction(row.id, "retry_activation")}
                            className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
                          >
                            {busy ? labels.actions.applying : labels.actions.retry}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void handleAction(row.id, "escalate_issue")}
                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-60"
                          >
                            {labels.actions.escalate}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void handleAction(row.id, "contact_customer")}
                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-60"
                          >
                            {labels.actions.contact}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void handleAction(row.id, "review_logs")}
                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-60"
                          >
                            {labels.actions.reviewLogs}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-neutral-900">{labels.sections.timeline}</h2>
        {center.timeline.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">{labels.empty.timeline}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center.timeline.map((event) => (
              <li key={event.id} className="rounded-xl border border-neutral-100 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-neutral-900">{event.customer}</span>
                  <StatusPill
                    label={labels.eventTypes[event.event_type] ?? event.event_type}
                    className="bg-neutral-100 text-neutral-700 ring-neutral-200"
                  />
                  <StatusPill
                    label={labels.outcomes[event.outcome] ?? event.outcome}
                    className={OUTCOME_BADGES[event.outcome] ?? OUTCOME_BADGES.received}
                  />
                </div>
                <p className="mt-2 text-sm text-neutral-600">{event.summary}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {labels.providers[event.provider] ?? event.provider} ·{" "}
                  {new Date(event.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-neutral-900">{labels.sections.notifications}</h2>
        {center.notifications.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">{labels.empty.notifications}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {center.notifications.map((item) => (
              <li key={item.id} className="rounded-xl bg-neutral-50 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-neutral-900">{item.customer}</span>
                  <span className="text-xs text-neutral-500">
                    {labels.notificationTypes[item.notification_type] ?? item.notification_type}
                  </span>
                </div>
                <p className="mt-1 text-neutral-600">{item.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        ref={auditRef}
        className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm"
      >
        <h2 className="font-semibold text-neutral-900">{labels.sections.audit}</h2>
        {center.audit.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">{labels.empty.audit}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {center.audit.map((entry) => (
              <li key={entry.id} className="rounded-xl bg-neutral-50 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-neutral-900">
                    {labels.auditActions[entry.action] ?? entry.action}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-neutral-600">{entry.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6">
        <h2 className="font-semibold text-neutral-900">{labels.sections.externalResponsibilities}</h2>
        <p className="mt-2 text-sm font-medium text-neutral-800">{labels.external.title}</p>
        <p className="mt-2 text-sm text-neutral-700">{center.external_responsibilities.note}</p>
      </section>
    </div>
  );
}
