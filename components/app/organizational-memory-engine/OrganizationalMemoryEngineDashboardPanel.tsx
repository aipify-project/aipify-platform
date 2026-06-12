"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalMemoryEngineDashboard,
  type OrganizationalMemoryEngineDashboard,
} from "@/lib/aipify/organizational-memory-engine";

type Props = { labels: Record<string, string> };

export function OrganizationalMemoryEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationalMemoryEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/organizational-memory-engine/dashboard");
    if (res.ok) setDashboard(parseOrganizationalMemoryEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/memory" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.legacyMemory}
        </Link>
        <Link href="/app/learning" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.learningEngine}
        </Link>
        <Link href="/app/assistant/memory" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.personalMemory}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.mission}</p>
        ) : null}
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.privacy_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.privacy_note}</p>
        ) : null}
      </section>

      {dashboard.memory_levels && dashboard.memory_levels.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.memoryLevels}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.memory_levels.map((level) => (
              <li key={level.level} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{level.label}</span>
                <p className="mt-1 text-xs text-gray-500">{level.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_note ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          {dashboard.self_love_note}
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeRecords}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_records ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.archivedRecords}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.archived_records ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeDecisions}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_decisions ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.pendingReviews}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.pending_reviews ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recentLearnings}</h3>
        {dashboard.recent_learnings.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.recent_learnings.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{item.title}</span>
                {item.memory_level ? (
                  <span className="ml-2 text-xs text-gray-400">({item.memory_level})</span>
                ) : null}
                {item.category ? (
                  <span className="ml-2 text-xs text-gray-500">{item.category}</span>
                ) : null}
                {item.summary ? <p className="mt-1 text-gray-600">{item.summary}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recurringThemes}</h3>
        {dashboard.recurring_themes.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {dashboard.recurring_themes.map((theme) => (
              <li
                key={theme.category}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs"
              >
                {theme.category} · {String(theme.count ?? 0)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.frequentlyReferenced}</h3>
        {dashboard.frequently_referenced.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.frequently_referenced.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.title}
                {typeof item.reference_count === "number" ? (
                  <span className="ml-2 text-xs text-gray-500">
                    {labels.references}: {item.reference_count}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.archivedDecisions}</h3>
        {dashboard.archived_decisions.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.archived_decisions.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.decision_title}
                {item.review_date ? (
                  <span className="ml-2 text-xs text-gray-500">{item.review_date}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recommendedReviews}</h3>
        {dashboard.recommended_reviews.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.recommended_reviews.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.review_type} · {item.scheduled_at}
                {item.status ? (
                  <span className="ml-2 text-xs text-gray-500">{item.status}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
