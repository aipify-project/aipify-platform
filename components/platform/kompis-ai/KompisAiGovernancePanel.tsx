"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { KompisAiGovernanceLabels } from "@/lib/platform/kompis-ai-labels";
import { SEVERITY_BADGE_CLASS, providerReadinessTone, type KompisOperatorSeverityTone } from "@/lib/kompis-operator/severity";

type StatusPayload = {
  readiness?: {
    status?: string;
    liveAiActive?: boolean;
    providerConfigured?: boolean;
    circuitOpen?: boolean;
    cooldownUntil?: string | null;
    lastHealthAt?: string | null;
    lastSuccessAt?: string | null;
    lastLatencyMs?: number | null;
    lastSafeErrorCode?: string | null;
    modelProfile?: string;
    systemPromptVersion?: string;
    plannerVersion?: string;
    authoritativeEnvName?: string;
  };
  modelProfile?: string;
  systemPromptVersion?: string;
  plannerVersion?: string;
  authoritativeEnvName?: string;
  usage24h?: {
    events_24h?: number;
    success_24h?: number;
    fallback_24h?: number;
    error_24h?: number;
    avg_latency_ms_24h?: number;
  };
  activeOrganizations24h?: number;
  circuitOpen?: boolean;
  cooldownUntil?: string | null;
  lastHealthAt?: string | null;
  lastSuccessAt?: string | null;
  lastLatencyMs?: number | null;
  canCheck?: boolean;
};

function statusLabel(labels: KompisAiGovernanceLabels, status: string): string {
  switch (status) {
    case "ready":
      return labels.ready;
    case "degraded":
      return labels.limited;
    case "cooldown":
      return labels.cooldown;
    case "unavailable":
      return labels.unavailable;
    case "disabled":
      return labels.disabled;
    default:
      return labels.liveAiNotEnabled;
  }
}

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

export function KompisAiGovernancePanel({
  labels,
  canCheck,
}: {
  labels: KompisAiGovernanceLabels;
  canCheck: boolean;
}) {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(false);
      try {
        const response = await fetch("/api/platform-portal/kompis-ai-status", {
          cache: "no-store",
        });
        if (!response.ok) {
          setError(true);
          setData(null);
          return;
        }
        const json = (await response.json()) as StatusPayload;
        setData(json);
      } catch {
        setError(true);
        setData(null);
      }
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runCheck = () => {
    startTransition(async () => {
      setMessage(null);
      try {
        const response = await fetch("/api/platform-portal/kompis-ai-status/check", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{}",
        });
        const json = (await response.json().catch(() => ({}))) as { ok?: boolean; code?: string };
        if (!response.ok) {
          setMessage(labels.checkFailed);
        } else {
          setMessage(json.ok ? labels.checkSucceeded : labels.checkFailed);
        }
        load();
      } catch {
        setMessage(labels.checkFailed);
      }
    });
  };

  if (pending && !data && !error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (error || !data) {
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

  const status = data.readiness?.status ?? "not_configured";
  const tone = providerReadinessTone(status);
  const configured = data.readiness?.providerConfigured === true;
  const events = data.usage24h?.events_24h ?? 0;
  const fallbackEvents = data.usage24h?.fallback_24h ?? 0;
  const fallbackShare = events > 0 ? Math.round((fallbackEvents / events) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 py-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{labels.title}</h1>
          <Badge tone={tone} label={statusLabel(labels, status)} />
        </div>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{labels.noSensitiveInfo}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label={labels.liveAi}
          value={
            data.readiness?.liveAiActive
              ? labels.liveAiActive
              : configured
                ? labels.liveAiTemporarilyLimited
                : labels.liveAiNotEnabled
          }
        />
        <Metric label={labels.safeFallback} value={labels.usingSafeFallback} />
        <Metric label={labels.modelProfile} value={data.modelProfile ?? data.readiness?.modelProfile ?? "—"} />
        <Metric
          label={labels.circuitBreaker}
          value={data.circuitOpen || data.readiness?.circuitOpen ? labels.open : labels.closed}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{labels.operationsStatus}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{labels.systemPromptVersion}</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {data.systemPromptVersion ?? data.readiness?.systemPromptVersion ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{labels.plannerVersion}</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {data.plannerVersion ?? data.readiness?.plannerVersion ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{labels.lastCheck}</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {data.lastHealthAt ?? data.readiness?.lastHealthAt ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{labels.lastSuccessfulCall}</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {data.lastSuccessAt ?? data.readiness?.lastSuccessAt ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{labels.responseTime}</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {data.lastLatencyMs ?? data.readiness?.lastLatencyMs ?? data.usage24h?.avg_latency_ms_24h ?? "—"}
                {(data.lastLatencyMs ?? data.readiness?.lastLatencyMs) != null ? " ms" : ""}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{labels.usageLast24h}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label={labels.events} value={String(events)} />
            <Metric label={labels.success} value={String(data.usage24h?.success_24h ?? 0)} />
            <Metric label={labels.fallback} value={String(fallbackEvents)} />
            <Metric label={labels.fallbackShare} value={`${fallbackShare}%`} />
            <Metric label={labels.errors} value={String(data.usage24h?.error_24h ?? 0)} />
            <Metric
              label={labels.activeOrganizations}
              value={String(data.activeOrganizations24h ?? 0)}
            />
          </div>
        </div>
      </section>

      {!configured ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
          <h2 className="text-sm font-semibold text-amber-950 dark:text-amber-100">
            {labels.configurationMissing}
          </h2>
          <p className="mt-2 text-sm text-amber-900 dark:text-amber-200">{labels.usingSafeFallback}</p>
          <p className="mt-2 text-sm text-amber-900 dark:text-amber-200">
            {labels.environmentVariable}:{" "}
            <span className="font-mono">
              {data.authoritativeEnvName ?? data.readiness?.authoritativeEnvName ?? "AIPIFY_KOMPIS_AI_API_KEY"}
            </span>
          </p>
          <p className="mt-2 text-sm text-amber-900 dark:text-amber-200">{labels.mustConfigureSecurely}</p>
          <p className="mt-2 text-sm text-amber-900 dark:text-amber-200">{labels.continuesWithSafeFeatures}</p>
        </section>
      ) : null}

      <section className="flex flex-wrap items-center gap-3">
        {canCheck ? (
          <button
            type="button"
            disabled={pending}
            className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            onClick={runCheck}
          >
            {labels.checkProvider}
          </button>
        ) : null}
        {message ? (
          <p className="text-sm text-slate-600 dark:text-slate-300" role="status">
            {message}
          </p>
        ) : null}
      </section>
    </div>
  );
}
