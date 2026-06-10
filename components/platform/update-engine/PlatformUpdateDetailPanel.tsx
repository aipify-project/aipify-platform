"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type PlatformUpdateDetailPanelProps = {
  updateId: string;
  locale: string;
  labels: {
    back: string;
    loading: string;
    notFound: string;
    summary: string;
    targets: string;
    audit: string;
    rollback: string;
    migration: string;
    notifications: string;
    rollout: string;
    installation: string;
    targetStatus: string;
    noTargets: string;
    noAudit: string;
    rollbackAvailable: string;
    rollbackUnavailable: string;
  };
};

export default function PlatformUpdateDetailPanel({
  updateId,
  locale,
  labels,
}: PlatformUpdateDetailPanelProps) {
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_update_detail", {
        p_update_id: updateId,
      });
      if (!error && data) {
        setDetail(data as Record<string, unknown>);
      }
      setLoading(false);
    }
    void load();
  }, [updateId]);

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!detail?.update) {
    return <p className="p-6 text-sm text-gray-500">{labels.notFound}</p>;
  }

  const update = detail.update as Record<string, unknown>;
  const targets = (detail.targets as Record<string, unknown>[]) ?? [];
  const auditLog = (detail.audit_log as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <Link href="/platform/updates" className="text-sm text-indigo-600 hover:text-indigo-800">
        ← {labels.back}
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {String(update.title)} · {String(update.version)}
        </h1>
        <p className="mt-2 text-sm text-gray-600">{String(update.description)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.summary}</h2>
          <dl className="mt-3 space-y-2 text-sm text-gray-600">
            <div>
              <dt className="font-medium text-gray-700">Status</dt>
              <dd className="capitalize">{String(update.status).replace(/_/g, " ")}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Type</dt>
              <dd>{String(update.update_type)}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Channel</dt>
              <dd>{String(update.update_channel)}</dd>
            </div>
            {update.scheduled_at ? (
              <div>
                <dt className="font-medium text-gray-700">Scheduled</dt>
                <dd>{formatDate(String(update.scheduled_at), locale)}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.rollback}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {update.rollback_available
              ? labels.rollbackAvailable
              : labels.rollbackUnavailable}
          </p>
          {update.previous_version ? (
            <p className="mt-1 text-xs text-gray-500">
              Previous: {String(update.previous_version)}
            </p>
          ) : null}
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">{labels.targets}</h2>
        {targets.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noTargets}</p>
        ) : (
          <ul className="mt-3 divide-y divide-gray-100 text-sm">
            {targets.map((target) => (
              <li key={String(target.id)} className="flex justify-between py-2">
                <span>
                  {String(target.installation_name ?? target.installation_id)}
                </span>
                <span className="capitalize text-gray-500">
                  {String(target.status).replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">{labels.audit}</h2>
        {auditLog.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noAudit}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {auditLog.map((entry) => (
              <li key={String(entry.id)}>
                <span className="font-medium">{String(entry.event_type)}</span>
                {" · "}
                {formatDate(String(entry.created_at), locale)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
