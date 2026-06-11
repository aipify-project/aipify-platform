"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCertificationAchievementEngineDashboard,
  type CertificationAchievementEngineDashboard,
} from "@/lib/aipify/certification-achievement-engine";
import { formatEuropeanDate } from "@/lib/core/date";

type Props = { labels: Record<string, string> };

function statusClass(status?: string) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "expired":
      return "bg-amber-100 text-amber-800";
    case "revoked":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function CertificationAchievementEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CertificationAchievementEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/certification-achievement-engine/dashboard");
    if (res.ok) setDashboard(parseCertificationAchievementEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function exportCertificate(id: string) {
    setExportLoading(id);
    const res = await fetch("/api/aipify/certification-achievement-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_certification_id: id }),
    });
    if (res.ok) {
      const payload = await res.json();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `certificate-${payload.certificate_number ?? id}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    }
    setExportLoading(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const training = dashboard.training_integration ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/app/learning-training-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.learningTraining}
        </Link>
        <Link href="/app/team" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.team}
        </Link>
        <Link href="/app/customer-onboarding-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.onboarding}
        </Link>
      </div>

      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-amber-800">{dashboard.distinction_note}</p>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeCertifications}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_certifications ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.expiredCertifications}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.expired_certifications ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.badgesAwarded}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.badges_awarded ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.definitionsCount}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.definitions_count ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.myCertifications}</h3>
        {(dashboard.my_certifications ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.my_certifications.map((item, idx) => (
              <li key={String(item.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{String(item.certification_name ?? item.certification_key)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(item.certificate_status as string)}`}>
                    {String(item.certificate_status ?? "active")}
                  </span>
                  <span className="text-xs text-gray-500">{String(item.certificate_number ?? "")}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {labels.issued}: {String(item.issued_at_european ?? formatEuropeanDate(item.issued_at as string))}
                  {item.expires_at_european || item.expires_at
                    ? ` · ${labels.expires}: ${String(item.expires_at_european ?? formatEuropeanDate(item.expires_at as string))}`
                    : null}
                </p>
                {item.id ? (
                  <button
                    type="button"
                    disabled={exportLoading === String(item.id)}
                    onClick={() => void exportCertificate(String(item.id))}
                    className="mt-2 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-900"
                  >
                    {labels.exportCertificate}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.certificationDefinitions}</h3>
        {(dashboard.certification_definitions ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.certification_definitions.map((item, idx) => {
              const eligibility = (item.eligibility ?? {}) as Record<string, unknown>;
              return (
                <li key={String(item.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                  <p className="font-medium">{String(item.name ?? item.certification_key)}</p>
                  <p className="text-xs text-gray-500">
                    {String(item.target_role ?? "")} · {String(eligibility.reason ?? labels.checkEligibility)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.teamReadiness}</h3>
        {(dashboard.team_readiness ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.teamReadinessRestricted}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.team_readiness.map((item, idx) => (
              <li key={String(item.certification_key ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{String(item.certification_name ?? item.certification_key)}</span>
                <span className="ml-2 text-gray-600">{String(item.readiness_label ?? "")}</span>
                <span className="ml-2 text-xs text-gray-500">({String(item.target_role ?? "")})</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.userBadges}</h3>
        {(dashboard.user_badges ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noBadges}</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.user_badges.map((badge, idx) => (
              <span
                key={String(badge.badge_key ?? idx)}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900"
                title={String(badge.description ?? "")}
              >
                {String(badge.name ?? badge.badge_key)}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.trainingIntegration}</h3>
        <p className="mt-2 text-sm text-gray-600">{String(training.note ?? "")}</p>
        {training.learning_training_route ? (
          <Link href={String(training.learning_training_route)} className="mt-2 inline-block text-sm text-amber-800 underline">
            {labels.openLearningTraining}
          </Link>
        ) : null}
      </section>

      {dashboard.principles?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
