"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { CoreHumanApprovalRequest } from "@/lib/core/human-approval/types";
import type { HumanApprovalUiLabels } from "@/lib/core/human-approval/labels-client";
import type { HumanApprovalAccessState } from "@/lib/app/human-approval-nav";
import { HUMAN_APPROVAL_ROUTE } from "@/lib/app/human-approval-nav";
import { formatDate } from "@/lib/i18n/format-date";
import {
  HumanApprovalAccessModeBadge,
  HumanApprovalRiskBadge,
  HumanApprovalStatusBadge,
} from "./HumanApprovalStatusBadge";

type Props = {
  requestId: string;
  locale: string;
  labels: HumanApprovalUiLabels;
  accessState: HumanApprovalAccessState;
};

export function HumanApprovalDetailPanel({ requestId, locale, labels, accessState }: Props) {
  const [request, setRequest] = useState<CoreHumanApprovalRequest | null>(null);
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
      const response = await fetch(`/api/app/human-approval/${requestId}`);
      const payload = (await response.json()) as {
        request?: CoreHumanApprovalRequest;
        error?: string;
        enabled?: boolean;
      };
      if (!response.ok || payload.enabled === false || !payload.request) {
        setError(typeof payload.error === "string" ? payload.error : labels.loadError);
        setRequest(null);
      } else {
        setRequest(payload.request);
      }
    } catch {
      setError(labels.loadError);
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [accessState, labels.loadError, requestId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (accessState === "feature_disabled") {
    return (
      <AccessMessage
        title={labels.disabledTitle}
        body={labels.disabledBody}
        backHref="/app/command-center"
        backLabel={labels.backToApp}
      />
    );
  }

  if (accessState === "forbidden" || accessState === "unauthenticated") {
    return (
      <AccessMessage
        title={labels.forbiddenTitle}
        body={labels.forbiddenBody}
        backHref="/app/command-center"
        backLabel={labels.backToApp}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/app/command-center" className="hover:text-violet-700">
              {labels.backToApp}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={HUMAN_APPROVAL_ROUTE} className="hover:text-violet-700">
              {labels.title}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-gray-900">{request?.title ?? labels.loading}</li>
        </ol>
      </nav>

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <AipifyLoader centered />
          <span className="sr-only">{labels.loading}</span>
        </div>
      ) : error || !request ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-6">
          <p className="text-sm text-rose-900">{labels.loadError}</p>
          <Link
            href={HUMAN_APPROVAL_ROUTE}
            className="mt-4 inline-flex text-sm font-medium text-violet-700 hover:underline"
          >
            {labels.backToList}
          </Link>
        </section>
      ) : (
        <>
          <header className="space-y-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{request.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <HumanApprovalStatusBadge status={request.status} labels={labels} />
              <HumanApprovalRiskBadge level={request.risk_level} labels={labels} />
              <HumanApprovalAccessModeBadge mode={request.access_mode} labels={labels} />
            </div>
          </header>

          {request.summary && (
            <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">{labels.summary}</h2>
              <p className="mt-2 text-sm text-gray-600">{request.summary}</p>
            </section>
          )}

          {request.unchanged_summary && (
            <section className="rounded-xl border border-gray-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold text-gray-900">{labels.unchangedSummary}</h2>
              <p className="mt-2 text-sm text-gray-600">{request.unchanged_summary}</p>
            </section>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <DetailRow label={labels.actionCategory} value={request.action_category} />
              <DetailRow label={labels.actionKey} value={request.action_key} />
              <DetailRow label={labels.scopeSummary} value={request.scope_summary} />
              <DetailRow label={labels.targetEnvironment} value={request.target_environment} />
              <DetailRow label={labels.createdAt} value={formatDate(request.created_at, locale)} />
              <DetailRow label={labels.updatedAt} value={formatDate(request.updated_at, locale)} />
              {request.expires_at && (
                <DetailRow label={labels.expiresAt} value={formatDate(request.expires_at, locale)} />
              )}
              {request.approved_by_display && (
                <DetailRow label={labels.approvedBy} value={request.approved_by_display} />
              )}
              {request.approver_role_snapshot && (
                <DetailRow label={labels.approverRole} value={request.approver_role_snapshot} />
              )}
              {request.execution_result && (
                <DetailRow label={labels.executionResult} value={request.execution_result} />
              )}
              {request.execution_error_summary && (
                <DetailRow label={labels.executionError} value={request.execution_error_summary} />
              )}
              <DetailRow label={labels.correlationId} value={request.correlation_id} mono />
              <DetailRow
                label={labels.latestAuditId}
                value={request.latest_audit_id ?? labels.notAvailable}
                mono
              />
            </dl>
          </section>

          <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">{labels.latestAuditId}</h2>
            <p className="mt-2 text-sm text-gray-600">{labels.auditTimelinePlaceholder}</p>
          </section>

          <Link
            href={HUMAN_APPROVAL_ROUTE}
            className="inline-flex text-sm font-medium text-violet-700 hover:underline"
          >
            {labels.backToList}
          </Link>
        </>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="font-medium text-gray-700">{label}</dt>
      <dd className={`mt-0.5 text-gray-600 ${mono ? "font-mono text-xs break-all" : ""}`}>{value}</dd>
    </div>
  );
}

function AccessMessage({
  title,
  body,
  backHref,
  backLabel,
}: {
  title: string;
  body: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <section className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-3 text-sm text-gray-600">{body}</p>
        <Link
          href={backHref}
          className="mt-6 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          {backLabel}
        </Link>
      </section>
    </div>
  );
}
