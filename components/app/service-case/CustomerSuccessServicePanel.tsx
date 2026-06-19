"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseServiceCustomerSuccessCenter,
  type ServiceCaseLabels,
  type ServiceCustomerSuccessCenter,
} from "@/lib/service-case";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

const HEALTH_STYLE: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  stable: "bg-aipify-accent-soft text-aipify-accent ring-aipify-accent-muted",
  at_risk: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-900 ring-red-200",
};

type Props = { labels: ServiceCaseLabels };

export function CustomerSuccessServicePanel({ labels }: Props) {
  const [center, setCenter] = useState<ServiceCustomerSuccessCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/service-case/customer-success");
    if (res.ok) setCenter(parseServiceCustomerSuccessCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }
  if (!center?.found) {
    return (
      <AipifyModuleAccessDenied message={labels.accessDenied} />
    );
  }

  const summary = center.summary ?? {};

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        {center.routes?.cases ? (
          <Link href={center.routes.cases} className={`text-sm ${AipifyShellClasses.link}`}>
            {labels.backToCases}
          </Link>
        ) : null}
        <h1 className="mt-2 text-2xl font-bold text-aipify-text">{labels.customerSuccessTitle}</h1>
        {center.principle ? (
          <p className="mt-2 text-sm font-medium text-aipify-companion">{center.principle}</p>
        ) : null}
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {(
          [
            [labels.healthy, summary.healthy],
            [labels.stable, summary.stable],
            [labels.atRisk, summary.at_risk],
            [labels.critical, summary.critical],
          ] as [string, unknown][]
        ).map(([label, value]) => (
          <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <p className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{label}</p>
            <p className="mt-1 text-xl font-semibold text-aipify-text">{String(value ?? "—")}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-aipify-text">{labels.customerHealth}</h2>
        {(center.customer_health ?? []).length === 0 ? (
          <PlatformEmptyState title={labels.noCases} message={labels.noCasesHint} />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {(center.customer_health ?? []).map((h, i) => (
              <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-aipify-text">{String(h.customer_name ?? "")}</p>
                    <p className="text-aipify-text-secondary">
                      Score {String(h.health_score ?? "—")} · {String(h.open_issues_count ?? 0)} open issues
                    </p>
                    <p className="text-aipify-text-muted">Renewal risk: {String(h.renewal_risk ?? "—")}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${HEALTH_STYLE[String(h.health_status ?? "stable")] ?? HEALTH_STYLE.stable}`}
                  >
                    {String(h.health_status ?? "").replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-aipify-text">{labels.successActions}</h2>
        <div className="space-y-2">
          {(center.success_actions ?? []).map((a, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(a.title ?? "")}</p>
              <p className="text-aipify-text-secondary">
                {String(a.customer_name ?? "")} · {String(a.action_type ?? "").replace(/_/g, " ")} ·{" "}
                {String(a.status ?? "")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-aipify-text">{labels.feedback}</h2>
        <div className="space-y-2">
          {(center.feedback ?? []).map((f, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">
                {f.rating != null ? `${String(f.rating)}/5` : "Feedback"}
              </p>
              <p className="text-aipify-text-secondary">{String(f.comment ?? "")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
