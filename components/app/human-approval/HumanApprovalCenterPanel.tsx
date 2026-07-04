"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import type { HumanApprovalUiLabels } from "@/lib/core/human-approval/labels-client";
import type { HumanApprovalAccessState } from "@/lib/app/human-approval-nav";
import { HUMAN_APPROVAL_ROUTE } from "@/lib/app/human-approval-nav";
import { formatDate } from "@/lib/i18n/format-date";
import {
  HumanApprovalAccessModeBadge,
  HumanApprovalRiskBadge,
  HumanApprovalStatusBadge,
} from "./HumanApprovalStatusBadge";

type HumanApprovalListItem = {
  id: string;
  core_approval_id: string;
  title: string;
  summary: string;
  status: string;
  risk_level: number;
  access_mode: string;
  action_category: string;
  action_key: string;
  scope_summary: string;
  target_environment: string;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  correlation_id: string | null;
  latest_audit_id: string | null;
};

type Props = {
  locale: string;
  labels: HumanApprovalUiLabels;
  accessState: HumanApprovalAccessState;
};

export function HumanApprovalCenterPanel({ locale, labels, accessState }: Props) {
  const [items, setItems] = useState<HumanApprovalListItem[]>([]);
  const [loading, setLoading] = useState(accessState === "ready");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (accessState !== "ready") {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/app/human-approval");
      const payload = (await response.json()) as {
        items?: HumanApprovalListItem[];
        error?: string;
        enabled?: boolean;
      };
      if (!response.ok || payload.enabled === false) {
        setError(typeof payload.error === "string" ? payload.error : labels.loadError);
        setItems([]);
      } else {
        setItems(Array.isArray(payload.items) ? payload.items : []);
      }
    } catch {
      setError(labels.loadError);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [accessState, labels.loadError]);

  useEffect(() => {
    void load();
  }, [load]);

  if (accessState === "feature_disabled") {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <HumanApprovalBreadcrumb labels={labels} />
        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.disabledTitle}</h1>
          <p className="mt-3 text-sm text-gray-600">{labels.disabledBody}</p>
          <Link
            href="/app/command-center"
            className="mt-6 inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            {labels.backToApp}
          </Link>
        </section>
      </div>
    );
  }

  if (accessState === "forbidden" || accessState === "unauthenticated") {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <HumanApprovalBreadcrumb labels={labels} />
        <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.forbiddenTitle}</h1>
          <p className="mt-3 text-sm text-gray-700">{labels.forbiddenBody}</p>
          <Link
            href="/app/command-center"
            className="mt-6 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            {labels.backToApp}
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <HumanApprovalBreadcrumb labels={labels} />

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="text-gray-600">{labels.subtitle}</p>
        <p className="text-sm text-gray-500">{labels.intro}</p>
      </header>

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <AipifyLoader centered />
          <span className="sr-only">{labels.loading}</span>
        </div>
      ) : error ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-6">
          <p className="text-sm text-rose-900">{labels.loadError}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-900 hover:bg-rose-50"
          >
            {labels.retry}
          </button>
        </section>
      ) : items.length === 0 ? (
        <PlatformEmptyState
          title={labels.emptyTitle}
          message={labels.emptyBody}
          primaryAction={{ label: labels.emptyAction, href: "/app/command-center" }}
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-violet-200"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">{item.title}</h2>
                <HumanApprovalStatusBadge status={item.status} labels={labels} />
                <HumanApprovalRiskBadge level={item.risk_level} labels={labels} />
                <HumanApprovalAccessModeBadge mode={item.access_mode} labels={labels} />
              </div>

              {item.summary && <p className="mt-2 text-sm text-gray-600">{item.summary}</p>}

              <dl className="mt-3 grid gap-1 text-xs text-gray-500 sm:grid-cols-2">
                <div>
                  <dt className="inline font-medium text-gray-700">{labels.actionCategory}: </dt>
                  <dd className="inline">{item.action_category || labels.notAvailable}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-gray-700">{labels.scopeSummary}: </dt>
                  <dd className="inline">{item.scope_summary || labels.notAvailable}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-gray-700">{labels.createdAt}: </dt>
                  <dd className="inline">{formatDate(item.created_at, locale)}</dd>
                </div>
                {item.expires_at && (
                  <div>
                    <dt className="inline font-medium text-gray-700">{labels.expiresAt}: </dt>
                    <dd className="inline">{formatDate(item.expires_at, locale)}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-4">
                <Link
                  href={`${HUMAN_APPROVAL_ROUTE}/${item.core_approval_id}`}
                  className="text-sm font-medium text-violet-700 hover:underline"
                >
                  {labels.viewDetail}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HumanApprovalBreadcrumb({ labels }: { labels: HumanApprovalUiLabels }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/app/command-center" className="hover:text-violet-700">
            {labels.backToApp}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="font-medium text-gray-900">{labels.title}</li>
      </ol>
    </nav>
  );
}
