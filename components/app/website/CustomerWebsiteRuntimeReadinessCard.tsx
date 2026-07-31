"use client";

import { useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { CustomerWebsiteRuntimeLabels } from "@/lib/customer-website-runtime/labels";
import {
  runtimeAckStatusLabelKey,
  runtimeAckStatusTone,
  runtimeFullyVerifiedTone,
} from "@/lib/customer-website-runtime/labels";
import { parseRuntimeStatusRpc } from "@/lib/customer-website-runtime/parse";
import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality";

type RuntimeStatusView = ReturnType<typeof parseRuntimeStatusRpc>;

type Props = {
  labels: CustomerWebsiteRuntimeLabels;
  locale?: string;
  /** Prefer authoritative parent payload — avoids a parallel stale fetch. */
  initialStatus?: RuntimeStatusView | null;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "success"; data: RuntimeStatusView };

const TONE: Record<string, string> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200",
  danger:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200",
  muted:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200",
};

function Badge({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${TONE[tone] ?? TONE.muted}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function CustomerWebsiteRuntimeReadinessCard({
  labels,
  locale = "en",
  initialStatus = null,
}: Props) {
  const [state, setState] = useState<LoadState>(() =>
    initialStatus ? { kind: "success", data: initialStatus } : { kind: "loading" },
  );

  useEffect(() => {
    if (initialStatus) {
      setState({ kind: "success", data: initialStatus });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/app/website/runtime", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setState({ kind: "error" });
          return;
        }
        const json = await res.json();
        const parsed = parseRuntimeStatusRpc(json.status ?? json);
        if (!cancelled) setState({ kind: "success", data: parsed });
      } catch {
        if (!cancelled) setState({ kind: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialStatus]);

  if (state.kind === "loading") {
    return (
      <section
        className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950"
        aria-busy="true"
        aria-label={labels.loading}
      >
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </section>
    );
  }

  if (state.kind === "error") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{labels.sectionTitle}</h2>
        <p className="mt-2 text-sm text-rose-700 dark:text-rose-300" role="alert">
          {labels.error}
        </p>
      </section>
    );
  }

  const data = state.data;
  const ackKey = runtimeAckStatusLabelKey(data.acknowledgementStatus);
  const httpKey = runtimeAckStatusLabelKey(data.httpStatus);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{labels.sectionTitle}</h2>
        <Badge
          tone={runtimeFullyVerifiedTone(data.fullyVerified)}
          label={data.fullyVerified ? labels.fullyVerified : labels.notFullyVerified}
        />
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">{labels.websiteProvisioned}</dt>
          <dd className="mt-1">
            <Badge
              tone={data.websiteProvisioned ? "success" : "muted"}
              label={data.websiteProvisioned ? labels.statusVerified : labels.statusNotConfigured}
            />
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.mountedPaths}</dt>
          <dd className="mt-1">
            {data.mountedPaths.length > 0 ? data.mountedPaths.join(", ") : labels.noMountedPaths}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.activeVersion}</dt>
          <dd className="mt-1">
            {data.activeVersionNumber != null ? `v${data.activeVersionNumber}` : labels.noActiveVersion}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.acknowledgementStatus}</dt>
          <dd className="mt-1">
            <Badge tone={runtimeAckStatusTone(data.acknowledgementStatus)} label={labels[ackKey]} />
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.httpVerification}</dt>
          <dd className="mt-1">
            <Badge tone={runtimeAckStatusTone(data.httpStatus)} label={labels[httpKey]} />
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.safeFallback}</dt>
          <dd className="mt-1">
            {data.fallbackMode === "unavailable"
              ? labels.fallbackUnavailable
              : labels.fallbackCustomerRuntime}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.publishReadiness}</dt>
          <dd className="mt-1">
            <Badge
              tone={data.dbPublished ? "success" : "warning"}
              label={data.dbPublished ? labels.statusVerified : labels.statusNotPublished}
            />
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.lastVerified}</dt>
          <dd className="mt-1">
            {formatPlatformDateTimeFull(data.lastFullyVerifiedAt, {
              locale,
              emptyFallback: labels.emptyDate,
              invalidFallback: labels.invalidDate,
            })}
          </dd>
        </div>
      </dl>
      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
          {labels.integrationHelpTitle}
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{labels.integrationHelpBody}</p>
      </div>
    </section>
  );
}
