"use client";

import { useCallback, useState } from "react";
import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";
import type {
  FaqLocaleDryRunResult,
  FaqVisibilityBlockReason,
  FaqVisibilityDiagnosticReport,
} from "@/lib/website-kompis-faq/visibility-diagnostic";

type WebsiteKompisFaqVisibilityDiagnosticProps = {
  labels: WebsiteKompisFaqLabels;
  itemId: string;
  installId: string | null;
};

function reasonLabel(
  labels: WebsiteKompisFaqLabels["visibility"],
  reason: FaqVisibilityBlockReason,
): string {
  return labels.reasons[reason] ?? reason;
}

function displayInstant(value: string | null | undefined, unknownLabel: string): string {
  if (value == null || value === "") return unknownLabel;
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return unknownLabel;
  return new Date(ms).toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

function formatUnknown(value: string | null | undefined, unknownLabel: string): string {
  if (value == null || value === "") return unknownLabel;
  return value;
}

function DryRunRow({
  labels,
  run,
}: {
  labels: WebsiteKompisFaqLabels["visibility"];
  run: FaqLocaleDryRunResult;
}) {
  const localeLabel =
    run.visitorLocale === "no" ? labels.visitorLocaleNo : labels.visitorLocaleEn;

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
      <p className="font-medium text-slate-900">{localeLabel}</p>
      {run.dryRunSkipped ? (
        <p className="mt-1 text-slate-600">
          {run.skipReason === "missing_context"
            ? labels.dryRunMissingContext
            : run.skipReason === "rpc_unavailable"
              ? labels.dryRunUnavailable
              : labels.dryRunSkippedIneligible}
        </p>
      ) : (
        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-700">
          <li>
            {labels.sqlCandidate}:{" "}
            {run.sqlCandidateMatch ? labels.resultYes : labels.resultNo}
          </li>
          <li>
            {labels.selectedAnswer}:{" "}
            {run.wouldBeSelectedAnswer ? labels.resultYes : labels.resultNo}
          </li>
        </ul>
      )}
      {!run.localeEligible && run.localeReasons.length > 0 ? (
        <p className="mt-1 text-amber-900">
          {run.localeReasons.map((reason) => reasonLabel(labels, reason)).join(" · ")}
        </p>
      ) : null}
      <p className="mt-1 text-xs text-slate-500">{labels.citationCaveat}</p>
    </div>
  );
}

export function WebsiteKompisFaqVisibilityDiagnostic({
  labels,
  itemId,
  installId,
}: WebsiteKompisFaqVisibilityDiagnosticProps) {
  const v = labels.visibility;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<FaqVisibilityDiagnosticReport | null>(null);

  const runDiagnostic = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (installId) params.set("installId", installId);
      const res = await fetch(
        `/api/website-kompis/faq/${encodeURIComponent(itemId)}/visibility?${params.toString()}`,
      );
      if (res.status === 401 || res.status === 403) {
        setError(v.unauthorized);
        setReport(null);
        return;
      }
      if (res.status === 404) {
        setError(v.notFound);
        setReport(null);
        return;
      }
      if (!res.ok) {
        setError(v.error);
        setReport(null);
        return;
      }
      const body = (await res.json()) as { report?: FaqVisibilityDiagnosticReport };
      if (!body.report) {
        setError(v.error);
        setReport(null);
        return;
      }
      setReport(body.report);
      setOpen(true);
    } catch {
      setError(v.error);
      setReport(null);
    } finally {
      setBusy(false);
    }
  }, [installId, itemId, v.error, v.notFound, v.unauthorized]);

  const statusLabel =
    report && report.facts.status in labels.statuses
      ? labels.statuses[report.facts.status as keyof typeof labels.statuses]
      : report?.facts.status;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{v.title}</h3>
          <p className="mt-1 text-xs text-slate-600">{v.subtitle}</p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runDiagnostic()}
          className="rounded-md border border-violet-300 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-900 hover:bg-violet-100 disabled:opacity-50"
        >
          {busy ? v.running : v.run}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500">{v.appLocaleNote}</p>
      <p className="mt-1 text-xs text-slate-500">{v.notIndexedNote}</p>

      {error ? (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {error}
        </p>
      ) : null}

      {open && report ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800">
            <p className="font-medium text-slate-900">{v.factsTitle}</p>
            <dl className="mt-2 grid gap-1 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">{v.factStatus}</dt>
                <dd>{statusLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{v.factPublicSafe}</dt>
                <dd>{report.facts.publicSafe ? v.resultYes : v.resultNo}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{v.factFaqLocale}</dt>
                <dd>
                  {labels.locales[report.facts.faqLocale as keyof typeof labels.locales] ??
                    report.facts.faqLocale}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{v.factInstall}</dt>
                <dd>{formatUnknown(report.facts.installId, v.unknown)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{v.factDomain}</dt>
                <dd>{formatUnknown(report.facts.domain, v.unknown)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{v.factPublishedAt}</dt>
                <dd>{displayInstant(report.facts.publishedAt, v.unknown)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{v.factValidFrom}</dt>
                <dd>{displayInstant(report.facts.validFrom, v.unknown)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{v.factValidUntil}</dt>
                <dd>{displayInstant(report.facts.validUntil, v.openEnded)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{v.factFaqSource}</dt>
                <dd>
                  {report.facts.faqSource === "enabled"
                    ? v.sourceEnabled
                    : report.facts.faqSource === "disabled"
                      ? v.sourceDisabled
                      : v.unknown}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800">
            <p className="font-medium text-slate-900">{v.eligibilityTitle}</p>
            <p className="mt-1">
              {report.eligibility.structuralReasons.length === 0
                ? v.eligibilityPass
                : v.eligibilityFail}
            </p>
            {report.eligibility.structuralReasons.length > 0 ? (
              <ul className="mt-2 list-disc space-y-0.5 pl-4 text-amber-950">
                {report.eligibility.structuralReasons.map((reason) => (
                  <li key={reason}>{reasonLabel(v, reason)}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">{v.dryRunTitle}</p>
            {report.dryRuns.map((run) => (
              <DryRunRow key={run.visitorLocale} labels={v} run={run} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
