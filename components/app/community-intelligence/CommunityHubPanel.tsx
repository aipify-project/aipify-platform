"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommunityIntelligenceDashboard,
  type CommunityIntelligenceDashboard,
  type CommunityContribution,
} from "@/lib/aipify/community-intelligence";

type CommunityHubPanelProps = {
  labels: Record<string, string>;
};

function InsightCard({ item, labels }: { item: CommunityContribution; labels: Record<string, string> }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
          {item.category_label ?? item.type_label ?? item.contribution_type?.replace(/_/g, " ")}
        </span>
        {item.rating_avg && item.rating_avg > 0 ? (
          <span className="text-xs text-amber-700">
            {item.rating_avg.toFixed(1)} ★ ({item.rating_count ?? 0})
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 font-medium text-gray-900">{item.title}</h3>
      {item.description ? <p className="mt-1 text-sm text-gray-600">{item.description}</p> : null}
    </article>
  );
}

export function CommunityHubPanel({ labels }: CommunityHubPanelProps) {
  const [dashboard, setDashboard] = useState<CommunityIntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/community-intelligence/dashboard");
    if (res.ok) setDashboard(parseCommunityIntelligenceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/community-intelligence/briefings/generate", { method: "POST" });
    await load();
  };

  const rateContribution = async (id: string, rating: number) => {
    setActing(id);
    await fetch(`/api/aipify/community-intelligence/contributions/${id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/community/admin"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-violet-300"
        >
          {labels.adminDashboard}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-violet-900">{labels.healthScore}</h2>
            <p className="mt-2 text-3xl font-bold text-violet-800">
              {dashboard.health_score ?? 0}
              <span className="text-lg font-normal text-gray-500">/100</span>
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-violet-900">{labels.intelligenceScore}</h2>
            <p className="mt-2 text-3xl font-bold text-violet-800">
              {dashboard.intelligence_score ?? dashboard.contribution_score ?? 0}
              <span className="text-lg font-normal text-gray-500">/100</span>
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-violet-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      {dashboard.score_components ? (
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.scoreComponents}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(dashboard.score_components).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs capitalize text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(value)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.featuredLearnings}</h2>
        {(dashboard.featured_learnings.length > 0 ? dashboard.featured_learnings : dashboard.featured_insights).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noInsights}</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(dashboard.featured_learnings.length > 0 ? dashboard.featured_learnings : dashboard.featured_insights).map((item) => (
              <InsightCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.bestPractices}</h2>
        {dashboard.best_practices.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noInsights}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.best_practices.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{item.title}</span>
                <span className="ml-2 text-xs text-gray-500">{item.type_label}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.popularResources}</h2>
        {(dashboard.popular_resources.length > 0 ? dashboard.popular_resources : dashboard.top_rated).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noInsights}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {(dashboard.popular_resources.length > 0 ? dashboard.popular_resources : dashboard.top_rated).map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm">
                <span className="text-gray-900">{item.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-700">
                    {(item.rating_avg ?? 0).toFixed(1)} ★
                  </span>
                  <button
                    type="button"
                    disabled={acting === item.id}
                    onClick={() => rateContribution(item.id, 5)}
                    className="rounded border border-amber-200 px-2 py-0.5 text-xs text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                  >
                    {labels.rate}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.industry_insights.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.industryInsights}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.industry_insights.map((item) => (
              <li key={item.id} className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
                {item.title}
                {item.description ? <p className="mt-1 text-xs text-indigo-800">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.blueprint_recommendations.length > 0 ? dashboard.blueprint_recommendations : dashboard.blueprint_discussions).length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.blueprintRecommendations}</h2>
          <ul className="mt-3 space-y-2">
            {(dashboard.blueprint_recommendations.length > 0 ? dashboard.blueprint_recommendations : dashboard.blueprint_discussions).map((item) => (
              <li key={item.id} className="rounded-lg border border-purple-100 bg-purple-50 px-3 py-2 text-sm text-purple-900">
                {item.title}
                {item.description ? <p className="mt-1 text-xs text-purple-800">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recently_validated.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentlyValidated}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recently_validated.map((item) => (
              <li key={item.id} className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-sm text-teal-900">
                {item.title}
                <span className="ml-2 text-xs text-teal-700">{item.type_label}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.briefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.intelligence_categories && dashboard.intelligence_categories.length > 0 ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.intelligenceCategories}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.intelligence_categories.map((c) => (
              <span key={c.key} className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">
                {c.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.approval_workflow && dashboard.approval_workflow.length > 0 ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.approvalWorkflow}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.approval_workflow.map((step, i) => (
              <span key={step.step} className="flex items-center gap-1 text-xs text-gray-600">
                {i > 0 ? <span className="text-gray-400">→</span> : null}
                <span className="rounded-full bg-white px-3 py-1 shadow-sm">{step.label}</span>
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
