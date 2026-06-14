"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSinceLastLoginEngineBundle,
  severityAccentClass,
  type SinceLastLoginEngineBundle,
  type SinceLastLoginScope,
} from "@/lib/since-last-login";

export type SinceLastLoginSummaryLabels = {
  title: string;
  criticalHeader: string;
  emptyTitle: string;
  emptyBody: string;
  reviewNow: string;
  loading: string;
  loadError: string;
};

type SinceLastLoginSummaryPanelProps = {
  scope: SinceLastLoginScope;
  labels: SinceLastLoginSummaryLabels;
  variant?: "full" | "compact";
  touchLogin?: boolean;
  apiPath?: string;
  className?: string;
};

export default function SinceLastLoginSummaryPanel({
  scope,
  labels,
  variant = "full",
  touchLogin = true,
  apiPath,
  className = "",
}: SinceLastLoginSummaryPanelProps) {
  const [bundle, setBundle] = useState<SinceLastLoginEngineBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const path =
        apiPath ??
        (scope === "customer"
          ? `/api/app/since-last-login?touch=${touchLogin ? "1" : "0"}`
          : `/api/platform/since-last-login?scope=${scope}&touch=${touchLogin ? "1" : "0"}`);

      const res = await fetch(path);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? labels.loadError);
      }
      const parsed = parseSinceLastLoginEngineBundle(await res.json());
      if (!parsed) throw new Error(labels.loadError);
      setBundle(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.loadError);
    } finally {
      setLoading(false);
    }
  }, [apiPath, labels.loadError, scope, touchLogin]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <section className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ${className}`}>
        <p className="text-sm text-zinc-500">{labels.loading}</p>
      </section>
    );
  }

  if (error || !bundle) {
    return (
      <section className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ${className}`}>
        <p className="text-sm text-red-600">{error ?? labels.loadError}</p>
      </section>
    );
  }

  const cardClass =
    variant === "compact"
      ? `rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ${className}`
      : `rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8 ${className}`;

  if (bundle.is_empty) {
    return (
      <section className={cardClass}>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {labels.title}
        </h2>
        <p className="mt-4 text-sm font-medium text-zinc-800">{labels.emptyTitle}</p>
        <p className="mt-1 text-sm text-zinc-600">{labels.emptyBody}</p>
      </section>
    );
  }

  return (
    <section className={cardClass}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {labels.title}
      </h2>

      {bundle.critical_header ? (
        <p className="mt-4 text-sm font-semibold text-red-800">
          {labels.criticalHeader}
        </p>
      ) : null}

      <ul className={`space-y-2.5 ${bundle.critical_header ? "mt-3" : "mt-5"}`}>
        {bundle.items.map((item) => (
          <li key={item.id}>
            {item.action_required ? (
              <Link
                href={item.deep_link}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 px-3 py-2.5 transition hover:border-zinc-300 hover:bg-white"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityAccentClass(item.severity)}`}
                    aria-hidden
                  />
                  <span className="text-sm text-zinc-800">{item.summary_text}</span>
                </div>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                  {labels.reviewNow}
                </span>
              </Link>
            ) : (
              <div className="flex items-start gap-3 px-1 py-0.5 text-sm text-zinc-800">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityAccentClass(item.severity)}`}
                  aria-hidden
                />
                {item.deep_link ? (
                  <Link href={item.deep_link} className="hover:text-zinc-950 hover:underline">
                    {item.summary_text}
                  </Link>
                ) : (
                  <span>{item.summary_text}</span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
