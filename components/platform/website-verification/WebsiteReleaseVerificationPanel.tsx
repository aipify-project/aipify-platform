"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { SEVERITY_BADGE_CLASS, type KompisOperatorSeverityTone } from "@/lib/kompis-operator/severity";
import {
  websiteStagingEnvironmentStatusTone,
  websiteStagingFixtureStatusTone,
  websiteStagingRunStatusTone,
} from "@/lib/website-staging-verification/severity";
import {
  websiteStagingEnvironmentStatusLabelKey,
  websiteStagingFixtureStatusLabelKey,
  websiteStagingRunPhaseLabelKey,
  websiteStagingRunStatusLabelKey,
  type WebsiteStagingVerificationLabels,
} from "@/lib/website-staging-verification/labels";
import { buildWebsiteStagingIdempotencyKey } from "@/lib/website-staging-verification/schema";
import type {
  WebsiteStagingEnsureResult,
  WebsiteStagingFixtureSummary,
  WebsiteStagingKpis,
  WebsiteStagingRunListItem,
  WebsiteStagingRunSummary,
  WebsiteStagingVerificationOverview,
} from "@/lib/website-staging-verification/types";

function Badge({ tone, label }: { tone: KompisOperatorSeverityTone; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${SEVERITY_BADGE_CLASS[tone]}`}
      role="status"
    >
      {label}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  );
}

async function postJson<T>(url: string, body: Record<string, unknown>): Promise<
  { ok: true; value: T } | { ok: false; message: string }
> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!response.ok) {
      return { ok: false, message: typeof json.code === "string" ? json.code : "unknown" };
    }
    return { ok: true, value: json as T };
  } catch {
    return { ok: false, message: "network_error" };
  }
}

function formatDateTime(value: string | null | undefined, locale: string, fallback: string): string {
  if (!value) return fallback;
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDuration(seconds: number | null | undefined, locale: string, fallback: string): string {
  if (seconds == null || Number.isNaN(seconds)) return fallback;
  try {
    const formatter = new Intl.NumberFormat(locale, { style: "unit", unit: "second", unitDisplay: "short" });
    return formatter.format(seconds);
  } catch {
    return `${seconds}s`;
  }
}

function formatNumber(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}

export function WebsiteReleaseVerificationPanel({
  labels,
  canOperate,
  locale = "en",
}: {
  labels: WebsiteStagingVerificationLabels;
  canOperate: boolean;
  locale?: string;
}) {
  const [overview, setOverview] = useState<WebsiteStagingVerificationOverview | null>(null);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [issuedToken, setIssuedToken] = useState<string | null>(null);
  const [selectedRun, setSelectedRun] = useState<WebsiteStagingRunSummary | null>(null);

  const [ensureReason, setEnsureReason] = useState("");
  const [fixtureKey, setFixtureKey] = useState("");
  const [fixtureLocale, setFixtureLocale] = useState("en");
  const [fixtureReason, setFixtureReason] = useState("");
  const [selectedFixtureId, setSelectedFixtureId] = useState("");
  const [runReason, setRunReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const load = useCallback(() => {
    startTransition(async () => {
      setError(false);
      try {
        const response = await fetch("/api/platform-portal/website-verification", { cache: "no-store" });
        if (!response.ok) {
          setError(true);
          setOverview(null);
          return;
        }
        const json = (await response.json()) as WebsiteStagingVerificationOverview;
        setOverview(json);
        if (json.fixtures.length > 0 && !selectedFixtureId) {
          setSelectedFixtureId(json.fixtures[0].id);
        }
      } catch {
        setError(true);
        setOverview(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runEnsure = () => {
    if (!confirmed) {
      setMessage(labels.confirmationRequired);
      return;
    }
    startTransition(async () => {
      setMessage(null);
      const idempotencyKey = buildWebsiteStagingIdempotencyKey("ensure-environment", ensureReason || "staging");
      const result = await postJson<WebsiteStagingEnsureResult>("/api/platform-portal/website-verification/staging", {
        internalReason: ensureReason,
        confirmation: true,
        idempotencyKey,
      });
      if (!result.ok) {
        setMessage(labels.actionFailed);
        return;
      }
      setMessage(labels.actionSucceeded);
      if (result.value.accessToken) {
        setIssuedToken(result.value.accessToken.token);
      }
      setEnsureReason("");
      load();
    });
  };

  const runCreateFixture = () => {
    if (!overview?.environment) return;
    if (!confirmed) {
      setMessage(labels.confirmationRequired);
      return;
    }
    startTransition(async () => {
      setMessage(null);
      const idempotencyKey = buildWebsiteStagingIdempotencyKey("create-fixture", fixtureKey || "fixture");
      const result = await postJson("/api/platform-portal/website-verification/fixture", {
        environmentId: overview.environment!.id,
        fixtureKey,
        locale: fixtureLocale,
        internalReason: fixtureReason,
        confirmation: true,
        idempotencyKey,
      });
      if (!result.ok) {
        setMessage(labels.actionFailed);
        return;
      }
      setMessage(labels.actionSucceeded);
      setFixtureKey("");
      setFixtureReason("");
      load();
    });
  };

  const runArchiveFixture = (fixtureId: string) => {
    if (!confirmed) {
      setMessage(labels.confirmationRequired);
      return;
    }
    startTransition(async () => {
      setMessage(null);
      const result = await postJson(`/api/platform-portal/website-verification/fixtures/${fixtureId}/archive`, {
        internalReason: "Archiving release verification fixture no longer needed.",
        confirmation: true,
      });
      setMessage(result.ok ? labels.actionSucceeded : labels.actionFailed);
      load();
    });
  };

  const runStartRun = () => {
    if (!overview?.environment || !selectedFixtureId) return;
    if (!confirmed) {
      setMessage(labels.confirmationRequired);
      return;
    }
    startTransition(async () => {
      setMessage(null);
      const idempotencyKey = buildWebsiteStagingIdempotencyKey("start-run", `${selectedFixtureId}-${Date.now()}`);
      const result = await postJson<WebsiteStagingRunSummary>("/api/platform-portal/website-verification/runs", {
        environmentId: overview.environment!.id,
        fixtureId: selectedFixtureId,
        internalReason: runReason,
        confirmation: true,
        idempotencyKey,
      });
      if (!result.ok) {
        setMessage(labels.actionFailed);
        return;
      }
      setMessage(labels.actionSucceeded);
      setSelectedRun(result.value);
      setRunReason("");
      load();
    });
  };

  const runResume = (runId: string) => {
    startTransition(async () => {
      setMessage(null);
      const result = await postJson<WebsiteStagingRunSummary>(
        `/api/platform-portal/website-verification/runs/${runId}/resume`,
        {},
      );
      if (!result.ok) {
        setMessage(labels.actionFailed);
        return;
      }
      setMessage(labels.actionSucceeded);
      setSelectedRun(result.value);
      load();
    });
  };

  const runVerifyRuntime = (runId: string) => {
    startTransition(async () => {
      setMessage(null);
      const result = await postJson<WebsiteStagingRunSummary>(
        `/api/platform-portal/website-verification/runs/${runId}/verify-runtime`,
        {},
      );
      if (!result.ok) {
        setMessage(labels.actionFailed);
        return;
      }
      setMessage(labels.actionSucceeded);
      setSelectedRun(result.value);
      load();
    });
  };

  const kpis: WebsiteStagingKpis = overview?.kpis ?? {
    totalRuns: 0,
    passedRuns: 0,
    failedRuns: 0,
    blockedRuns: 0,
    lastRunAt: null,
  };

  const activeFixtures = useMemo<WebsiteStagingFixtureSummary[]>(
    () => (overview?.fixtures ?? []).filter((fixture) => fixture.status === "active"),
    [overview],
  );

  if (pending && !overview && !error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-950">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{labels.errorTitle}</h1>
        <button
          type="button"
          className="mt-4 rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white"
          onClick={load}
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  const environment = overview.environment;
  const control = overview.control;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 py-6" lang={locale}>
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{labels.title}</h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{labels.noSensitiveInfo}</p>
        {canOperate ? (
          <label className="mt-3 flex max-w-3xl items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              className="mt-1"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            <span>{labels.confirmCheckboxLabel}</span>
          </label>
        ) : null}
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label={labels.kpiTotalRuns} value={formatNumber(kpis.totalRuns, locale)} />
        <Metric label={labels.kpiPassedRuns} value={formatNumber(kpis.passedRuns, locale)} />
        <Metric label={labels.kpiFailedRuns} value={formatNumber(kpis.failedRuns, locale)} />
        <Metric label={labels.kpiBlockedRuns} value={formatNumber(kpis.blockedRuns, locale)} />
        <Metric
          label={labels.kpiLastRunAt}
          value={formatDateTime(kpis.lastRunAt, locale, labels.never)}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{labels.controlTitle}</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.appLicense}</dt>
            <dd>
              <Badge
                tone={control.appLicenseActive ? "success" : "warning"}
                label={control.appLicenseActive ? labels.activeLabel : labels.inactiveLabel}
              />
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.websiteKompisCapability}</dt>
            <dd>
              <Badge
                tone={control.websiteKompisCapability ? "success" : "warning"}
                label={control.websiteKompisCapability ? labels.activeLabel : labels.inactiveLabel}
              />
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.canonicalDelivery}</dt>
            <dd>
              <Badge
                tone={control.canonicalDelivery ? "success" : "warning"}
                label={control.canonicalDelivery ? labels.activeLabel : labels.inactiveLabel}
              />
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.acknowledgement}</dt>
            <dd>
              <Badge
                tone={control.acknowledgementOk ? "success" : "warning"}
                label={control.acknowledgementOk ? labels.activeLabel : labels.inactiveLabel}
              />
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.noindexStatus}</dt>
            <dd>
              <Badge
                tone="info"
                label={control.noindexRequired ? labels.rendererBanner : labels.absent}
              />
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.productionIsolation}</dt>
            <dd>
              <Badge
                tone={control.productionIsolation ? "success" : "danger"}
                label={control.productionIsolation ? labels.activeLabel : labels.inactiveLabel}
              />
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.currentStagingVersion}</dt>
            <dd className="tabular-nums text-slate-900 dark:text-slate-100">
              {control.currentVersionNumber != null
                ? `v${formatNumber(control.currentVersionNumber, locale)}`
                : labels.absent}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.firstPublish}</dt>
            <dd>{control.firstPublishPresent ? labels.present : labels.absent}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.secondPublish}</dt>
            <dd>{control.secondPublishPresent ? labels.present : labels.absent}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.rollbackResult}</dt>
            <dd>{control.rollbackPresent ? labels.present : labels.absent}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.checksumExpected}</dt>
            <dd className="max-w-[12rem] truncate font-mono text-xs" title={control.expectedChecksum ?? undefined}>
              {control.expectedChecksum ?? labels.absent}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.checksumActual}</dt>
            <dd className="max-w-[12rem] truncate font-mono text-xs" title={control.actualChecksum ?? undefined}>
              {control.actualChecksum ?? labels.absent}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.checksumMatch}</dt>
            <dd>
              <Badge
                tone={control.checksumMatch ? "success" : "warning"}
                label={control.checksumMatch ? labels.checksumMatch : labels.checksumMismatch}
              />
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{labels.durationLabel}</dt>
            <dd>{formatDuration(control.durationSeconds, locale, labels.never)}</dd>
          </div>
          <div className="flex justify-between gap-3 sm:col-span-2 xl:col-span-3">
            <dt className="text-slate-500">{labels.auditReference}</dt>
            <dd className="font-mono text-xs text-slate-700 dark:text-slate-200">
              {control.auditReference ?? labels.absent}
            </dd>
          </div>
        </dl>
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.blockersTitle}</p>
          {control.blockers.length === 0 ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{labels.blockersNone}</p>
          ) : (
            <ul className="mt-2 flex flex-wrap gap-2">
              {control.blockers.map((blocker) => (
                <li key={blocker}>
                  <Badge tone="danger" label={blocker} />
                </li>
              ))}
            </ul>
          )}
        </div>
        {control.latestPhase ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            {labels.latestRun}: {labels[websiteStagingRunPhaseLabelKey(control.latestPhase)]}
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{labels.environmentTitle}</h2>
          {environment ? (
            <Badge
              tone={websiteStagingEnvironmentStatusTone(environment.status)}
              label={labels[websiteStagingEnvironmentStatusLabelKey(environment.status)]}
            />
          ) : null}
        </div>

        {!environment ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">{labels.noEnvironmentBody}</p>
            {canOperate ? (
              <div className="space-y-2">
                <textarea
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-900"
                  rows={2}
                  placeholder={labels.internalReasonPlaceholder}
                  value={ensureReason}
                  onChange={(event) => setEnsureReason(event.target.value)}
                />
                <button
                  type="button"
                  disabled={pending || ensureReason.trim().length < 8}
                  className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  onClick={runEnsure}
                >
                  {labels.ensureEnvironment}
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400">{labels.ensureEnvironmentHelp}</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{labels.stagingHost}</dt>
                <dd className="font-mono text-xs text-slate-900 dark:text-slate-100">
                  {environment.stagingHostKey}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{labels.stagingPreviewPath}</dt>
                <dd className="font-mono text-xs text-slate-900 dark:text-slate-100">
                  {"/website-staging/<signed-reference>/"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">
                  {environment.accessTokenPresent ? labels.accessTokenPresent : labels.accessTokenMissing}
                </dt>
                <dd>
                  <Badge
                    tone={environment.accessTokenPresent ? "success" : "warning"}
                    label={environment.accessTokenPresent ? labels.accessTokenPresent : labels.accessTokenMissing}
                  />
                </dd>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{labels.productionIsolation}</p>
            </dl>
            {issuedToken ? (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
                <p className="font-medium">{labels.accessTokenIssued}</p>
                <p className="mt-1 break-all font-mono">{issuedToken}</p>
                <p className="mt-1">{labels.accessTokenIssuedHelp}</p>
                <a
                  className="mt-2 inline-block font-medium text-violet-700 underline dark:text-violet-300"
                  href={`/website-staging/${issuedToken}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {labels.openStagingPreview}
                </a>
              </div>
            ) : null}
          </div>
        )}
      </section>

      {environment ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{labels.fixturesTitle}</h2>

          {overview.fixtures.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">{labels.fixturesEmpty}</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-2">{labels.fixtureKeyLabel}</th>
                    <th className="pb-2">{labels.fixturePathLabel}</th>
                    <th className="pb-2">{labels.fixtureLocaleLabel}</th>
                    <th className="pb-2" />
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {overview.fixtures.map((fixture) => (
                    <tr key={fixture.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="py-2 font-medium text-slate-900 dark:text-slate-100">{fixture.fixtureKey}</td>
                      <td className="py-2 font-mono text-xs text-slate-600 dark:text-slate-300">
                        {fixture.pagePath}
                      </td>
                      <td className="py-2 text-slate-600 dark:text-slate-300">{fixture.locale}</td>
                      <td className="py-2">
                        <Badge
                          tone={websiteStagingFixtureStatusTone(fixture.status)}
                          label={labels[websiteStagingFixtureStatusLabelKey(fixture.status)]}
                        />
                      </td>
                      <td className="py-2 text-right">
                        {canOperate && fixture.status === "active" ? (
                          <button
                            type="button"
                            disabled={pending}
                            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200"
                            onClick={() => runArchiveFixture(fixture.id)}
                          >
                            {labels.archiveFixture}
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {canOperate ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              <input
                className="rounded-xl border border-slate-300 p-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                placeholder={labels.fixtureKeyPlaceholder}
                value={fixtureKey}
                onChange={(event) => setFixtureKey(event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-300 p-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                placeholder={labels.fixtureLocalePlaceholder}
                value={fixtureLocale}
                onChange={(event) => setFixtureLocale(event.target.value)}
              />
              <input
                className="rounded-xl border border-slate-300 p-2 text-sm sm:col-span-2 dark:border-slate-600 dark:bg-slate-900"
                placeholder={labels.internalReasonPlaceholder}
                value={fixtureReason}
                onChange={(event) => setFixtureReason(event.target.value)}
              />
              <button
                type="button"
                disabled={pending || fixtureKey.trim().length < 3 || fixtureReason.trim().length < 8}
                className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 sm:col-span-4 sm:w-fit"
                onClick={runCreateFixture}
              >
                {labels.createFixture}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {environment ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{labels.runsTitle}</h2>

          {canOperate && activeFixtures.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              <select
                className="rounded-xl border border-slate-300 p-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                value={selectedFixtureId}
                onChange={(event) => setSelectedFixtureId(event.target.value)}
              >
                {activeFixtures.map((fixture) => (
                  <option key={fixture.id} value={fixture.id}>
                    {fixture.fixtureKey}
                  </option>
                ))}
              </select>
              <input
                className="rounded-xl border border-slate-300 p-2 text-sm sm:col-span-2 dark:border-slate-600 dark:bg-slate-900"
                placeholder={labels.internalReasonPlaceholder}
                value={runReason}
                onChange={(event) => setRunReason(event.target.value)}
              />
              <button
                type="button"
                disabled={pending || runReason.trim().length < 8}
                className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                onClick={runStartRun}
              >
                {labels.startRun}
              </button>
            </div>
          ) : null}

          {overview.runs.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">{labels.runsEmpty}</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-2">{labels.startedAt}</th>
                    <th className="pb-2">{labels.statusColumn}</th>
                    <th className="pb-2">{labels.phaseColumn}</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {overview.runs.map((run: WebsiteStagingRunListItem) => (
                    <tr key={run.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="py-2 text-xs text-slate-600 dark:text-slate-300">
                        {formatDateTime(run.startedAt, locale, "—")}
                      </td>
                      <td className="py-2">
                        <Badge
                          tone={websiteStagingRunStatusTone(run.status)}
                          label={labels[websiteStagingRunStatusLabelKey(run.status)]}
                        />
                      </td>
                      <td className="py-2 text-xs text-slate-600 dark:text-slate-300">
                        {labels[websiteStagingRunPhaseLabelKey(run.currentPhase)]}
                      </td>
                      <td className="py-2 text-right">
                        {canOperate && (run.status === "pending" || run.status === "running") ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={pending}
                              className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200"
                              onClick={() => runResume(run.id)}
                            >
                              {labels.resumeRun}
                            </button>
                          </div>
                        ) : canOperate ? (
                          <button
                            type="button"
                            disabled={pending}
                            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200"
                            onClick={() => runVerifyRuntime(run.id)}
                          >
                            {labels.verifyRuntime}
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedRun ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-700 dark:bg-slate-900">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  tone={websiteStagingRunStatusTone(selectedRun.status)}
                  label={labels[websiteStagingRunStatusLabelKey(selectedRun.status)]}
                />
                <span className="text-slate-600 dark:text-slate-300">
                  {labels[websiteStagingRunPhaseLabelKey(selectedRun.currentPhase)]}
                </span>
              </div>
              {selectedRun.safeErrorCode ? (
                <p className="mt-2 text-rose-700 dark:text-rose-300">
                  {labels.safeErrorCode}: {selectedRun.safeErrorCode}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {message ? (
        <p className="text-sm text-slate-600 dark:text-slate-300" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
