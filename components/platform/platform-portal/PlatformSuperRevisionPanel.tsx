"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PlatformLayoutClasses } from "@/lib/design";
import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality";
import type { Locale } from "@/lib/i18n/config";
import { SUPER_ADMIN_GLOBAL_AUDIT_HREF } from "@/lib/super-portal/dashboard-access-constants";
import { parseSuperGlobalAuditCenter } from "@/lib/super-portal/parse";
import { summarizeAuditState } from "@/lib/super-portal/platform-revision";
import type { PlatformSuperRevisionLabels } from "@/lib/super-portal/platform-revision-labels";
import type { SuperGlobalAuditEntry } from "@/lib/super-portal/types";
import { AipifyLoader } from "@/components/ui/aipify-loader";

type PlatformSuperRevisionPanelProps = {
  labels: PlatformSuperRevisionLabels;
  locale: Locale;
};

export default function PlatformSuperRevisionPanel({
  labels,
  locale,
}: PlatformSuperRevisionPanelProps) {
  const [logs, setLogs] = useState<SuperGlobalAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    setLogs([]);

    try {
      const res = await fetch("/api/super-portal/global-audit", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!res.ok) {
        setLoadError(true);
        return;
      }

      let payload: unknown;
      try {
        payload = await res.json();
      } catch {
        setLoadError(true);
        return;
      }

      setLogs(parseSuperGlobalAuditCenter(payload));
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section
      className={`${PlatformLayoutClasses.card} border-violet-200/80 bg-white dark:border-violet-900/50 dark:bg-slate-900/40`}
      data-area="super-revision-log"
      aria-labelledby="super-revision-title"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            id="super-revision-title"
            className="text-base font-semibold text-slate-900 dark:text-slate-100"
          >
            {labels.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{labels.sourceNote}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{labels.periodNote}</p>
        </div>
        <Link
          href={SUPER_ADMIN_GLOBAL_AUDIT_HREF}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm font-medium text-violet-900 shadow-sm transition hover:bg-violet-50 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-100 dark:hover:bg-violet-900"
        >
          {labels.openSuperRevision}
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 flex min-h-[8rem] items-center justify-center">
          <AipifyLoader centered />
          <span className="sr-only">{labels.loading}</span>
        </div>
      ) : null}

      {!loading && loadError ? (
        <div
          role="alert"
          className="mt-6 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-rose-800 dark:bg-rose-950/40"
        >
          <p className="text-sm text-rose-900 dark:text-rose-100">{labels.loadError}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-medium text-rose-900 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-50"
          >
            {labels.retry}
          </button>
        </div>
      ) : null}

      {!loading && !loadError && logs.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{labels.empty}</p>
      ) : null}

      {!loading && !loadError && logs.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">{labels.columns.actor}</th>
                <th className="px-4 py-3 font-medium">{labels.columns.action}</th>
                <th className="px-4 py-3 font-medium">{labels.columns.when}</th>
                <th className="px-4 py-3 font-medium">{labels.columns.previous}</th>
                <th className="px-4 py-3 font-medium">{labels.columns.next}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="bg-white dark:bg-slate-950/40">
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                    {log.user_email || labels.noValue}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {log.action || labels.noValue}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500 dark:text-slate-400">
                    {formatPlatformDateTimeShort(log.created_at, {
                      locale,
                      emptyFallback: labels.noValue,
                      invalidFallback: labels.noValue,
                    })}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-600 dark:text-slate-300">
                    {summarizeAuditState(log.previous_state, labels.noValue)}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-600 dark:text-slate-300">
                    {summarizeAuditState(log.new_state, labels.noValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
