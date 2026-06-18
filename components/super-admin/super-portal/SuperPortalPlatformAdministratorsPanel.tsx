"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  STATUS_BADGES,
  parseSuperPlatformAdministrators,
  type SuperPlatformAdministrator,
  type SuperPortalLabels,
} from "@/lib/super-portal";

export function SuperPortalPlatformAdministratorsPanel({
  labels,
}: {
  labels: SuperPortalLabels["platformAdministrators"];
}) {
  const [admins, setAdmins] = useState<SuperPlatformAdministrator[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/super-portal/platform-administrators");
    if (res.ok) {
      const data = await res.json();
      setAdmins(parseSuperPlatformAdministrators(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (payload: Record<string, string>) => {
    setBusy(true);
    try {
      const res = await fetch("/api/super-portal/platform-administrators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) await load();
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href="/super" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <input
            className="min-w-[240px] flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            placeholder={labels.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            disabled={busy || !email.trim()}
            onClick={() =>
              void act({ action: "create_platform_administrator", email: email.trim() }).then(
                () => setEmail("")
              )
            }
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {busy ? labels.saving : labels.create}
          </button>
        </div>
      </section>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">{labels.displayName}</th>
              <th className="px-4 py-3">{labels.email}</th>
              <th className="px-4 py-3">{labels.role}</th>
              <th className="px-4 py-3">{labels.status}</th>
              <th className="px-4 py-3">{labels.activitySummary}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-4 py-3 font-medium text-zinc-900">{admin.display_name}</td>
                <td className="px-4 py-3 text-zinc-600">{admin.email}</td>
                <td className="px-4 py-3">{labels.roles[admin.role]}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${STATUS_BADGES[admin.status]}`}
                  >
                    {labels.statuses[admin.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {labels.auditEvents30d}: {admin.activity_summary.audit_events_30d}
                </td>
                <td className="px-4 py-3">
                  {admin.role === "platform_support" && admin.status === "active" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void act({
                          action: "suspend_platform_administrator",
                          administrator_id: admin.id,
                        })
                      }
                      className="text-xs font-medium text-rose-700 hover:text-rose-800"
                    >
                      {labels.suspend}
                    </button>
                  )}
                  {admin.role === "platform_support" && admin.status === "suspended" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void act({
                          action: "reactivate_platform_administrator",
                          administrator_id: admin.id,
                        })
                      }
                      className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      {labels.reactivate}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
