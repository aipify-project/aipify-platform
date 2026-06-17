"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  deliveryStatusLabel,
  parsePartnerCommunications,
  type PartnerCommunicationsBundle,
} from "@/lib/partner-communications-email";

type Props = {
  labels: Record<string, string>;
};

function statusLabel(labels: Record<string, string>, status: string): string {
  const key = `status_${status}`;
  return labels[key] ?? deliveryStatusLabel(status);
}

export function PartnerCommunicationsPanel({ labels }: Props) {
  const [bundle, setBundle] = useState<PartnerCommunicationsBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({
    sales_notifications: true,
    milestone_notifications: true,
    settlement_notifications: true,
    academy_notifications: true,
    compliance_notifications: true,
    marketing_material_updates: true,
    general_announcements: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setDenied(false);
    try {
      const res = await fetch("/api/partner/communications");
      const json = res.ok ? await res.json() : null;
      const parsed = parsePartnerCommunications(json);
      if (!parsed?.has_access) {
        setDenied(true);
        setLoading(false);
        return;
      }
      setBundle(parsed);
      setPrefs({
        sales_notifications: parsed.preferences.sales_notifications,
        milestone_notifications: parsed.preferences.milestone_notifications,
        settlement_notifications: parsed.preferences.settlement_notifications,
        academy_notifications: parsed.preferences.academy_notifications,
        compliance_notifications: parsed.preferences.compliance_notifications,
        marketing_material_updates: parsed.preferences.marketing_material_updates,
        general_announcements: parsed.preferences.general_announcements,
      });
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const savePreferences = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/partner/communications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
    if (res.ok) {
      setBundle(parsePartnerCommunications(await res.json()));
      setMessage(labels.preferencesSaved);
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading) return <AipifyLoader centered fullPage />;

  if (denied) {
    return (
      <PlatformEmptyState
        title={labels.accessDenied}
        message={labels.subtitle}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  if (error || !bundle) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const prefItems: Array<{ key: keyof typeof prefs; label: string }> = [
    { key: "sales_notifications", label: labels.salesNotifications },
    { key: "milestone_notifications", label: labels.milestoneNotifications },
    { key: "settlement_notifications", label: labels.settlementNotifications },
    { key: "academy_notifications", label: labels.academyNotifications },
    { key: "compliance_notifications", label: labels.complianceNotifications },
    { key: "marketing_material_updates", label: labels.marketingMaterialUpdates },
    { key: "general_announcements", label: labels.generalAnnouncements },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.preferencesTitle}</h2>
        <p className="mt-1 text-sm text-slate-600">{labels.preferencesSubtitle}</p>
        <p className="mt-3 text-sm text-indigo-700">{labels.systemCriticalNote}</p>
        <ul className="mt-4 space-y-3">
          {prefItems.map((item) => (
            <li key={item.key} className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-700">{item.label}</span>
              <input
                type="checkbox"
                checked={prefs[item.key]}
                onChange={(e) => setPrefs((current) => ({ ...current, [item.key]: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={busy}
          onClick={() => void savePreferences()}
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {labels.savePreferences}
        </button>
        {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">{labels.historyTitle}</h2>
        {bundle.communications.length === 0 ? (
          <PlatformEmptyState
            title={labels.emptyTitle}
            message={labels.emptyMessage}
            primaryAction={{ label: labels.retry, onClick: () => void load() }}
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{labels.subject}</th>
                  <th className="px-4 py-3">{labels.status}</th>
                  <th className="px-4 py-3">{labels.sentAt}</th>
                  <th className="px-4 py-3">{labels.preview}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bundle.communications.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{entry.subject}</td>
                    <td className="px-4 py-3 text-slate-600">{statusLabel(labels, entry.delivery_status)}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {entry.sent_at ? new Date(entry.sent_at).toLocaleString() : "—"}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-slate-600">{entry.preview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.faqTitle}</h2>
        <dl className="mt-4 space-y-4 text-sm text-slate-700">
          <div>
            <dt className="font-medium text-slate-900">{labels.faqWhyEmail}</dt>
            <dd className="mt-1">{labels.faqWhyEmailAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqPreferences}</dt>
            <dd className="mt-1">{labels.faqPreferencesAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqSender}</dt>
            <dd className="mt-1">{labels.faqSenderAnswer}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
