"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseProductAutomationDashboard,
  type ProductAutomationDashboard,
} from "@/lib/aipify/product-automation";

type ProductAutomationDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "ready_for_review":
    case "published_ready":
    case "approved":
    case "informational":
      return "bg-emerald-100 text-emerald-800";
    case "awaiting_review":
    case "processing":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "needs_improvement":
    case "imported":
    case "important":
      return "bg-orange-100 text-orange-800";
    case "not_ready":
    case "rejected":
    case "critical":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function ProductAutomationDashboardPanel({ labels }: ProductAutomationDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<ProductAutomationDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/product-automation/dashboard");
    if (res.ok) setDashboard(parseProductAutomationDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/product-automation/briefings/generate", { method: "POST" });
    await load();
  };

  const runAction = async (key: string, url: string, body: Record<string, unknown>) => {
    setActing(key);
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/commerce-intelligence" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commerceIntelligence}
        </Link>
        <Link href="/app/dropshipping-operations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.dropshippingOperations}
        </Link>
        <Link href="/app/platform-install" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.platformInstall}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.readinessOverview}</h2>
        <p className="mt-2 text-4xl font-bold text-violet-800">
          {dashboard.avg_readiness_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-violet-700">
          {dashboard.awaiting_approval_count ?? 0} {labels.awaitingApproval} · {dashboard.seo_recommendations_count ?? 0}{" "}
          {labels.seoRecommendations} · {dashboard.quality_warnings_count ?? 0} {labels.qualityWarnings}
        </p>
        <p className="mt-2 text-sm text-violet-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-800"
        >
          {labels.generateBriefing}
        </button>
      </section>

      {dashboard.brand_voice ? (
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.brandVoice}</h2>
          <p className="mt-1 text-xs text-gray-600">
            {dashboard.brand_voice.writing_style} · {dashboard.brand_voice.tone_preference}
          </p>
          <p className="mt-1 text-xs italic text-gray-500">{dashboard.brand_voice.personality_guidelines}</p>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.importedProducts, value: dashboard.imported_products_count ?? 0 },
          { label: labels.awaitingApproval, value: dashboard.awaiting_approval_count ?? 0 },
          { label: labels.translationOpportunities, value: dashboard.translation_opportunities ?? 0 },
          { label: labels.pendingApprovals, value: dashboard.pending_approvals ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={acting === "bulk-translate"}
          onClick={() => void runAction("bulk-translate", "/api/products/bulk-action", { action_type: "translate" })}
          className="rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-50 disabled:opacity-50"
        >
          {labels.bulkTranslate}
        </button>
        <button
          type="button"
          disabled={acting === "bulk-seo"}
          onClick={() => void runAction("bulk-seo", "/api/products/bulk-action", { action_type: "seo_analyze" })}
          className="rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-50 disabled:opacity-50"
        >
          {labels.bulkSeo}
        </button>
      </section>

      {dashboard.imported_products.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.importedProducts}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.imported_products.map((p) => (
              <article key={p.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{p.title}</p>
                  {p.readiness_score != null ? (
                    <span className="text-sm font-bold text-violet-700">{p.readiness_score}/100</span>
                  ) : null}
                </div>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(p.status)}`}>
                  {p.status?.replace(/_/g, " ")}
                </span>
                {p.readiness_status ? (
                  <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(p.readiness_status)}`}>
                    {p.readiness_status.replace(/_/g, " ")}
                  </span>
                ) : null}
                <p className="mt-2 text-xs text-gray-600 line-clamp-2">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={acting === `tr-${p.id}`}
                    onClick={() => void runAction(`tr-${p.id}`, "/api/products/translate", { product_id: p.id, target_language: "no" })}
                    className="text-xs text-violet-700 underline hover:text-violet-900 disabled:opacity-50"
                  >
                    {labels.translate}
                  </button>
                  <button
                    type="button"
                    disabled={acting === `rw-${p.id}`}
                    onClick={() => void runAction(`rw-${p.id}`, "/api/products/rewrite", { product_id: p.id, rewriting_mode: "professional" })}
                    className="text-xs text-violet-700 underline hover:text-violet-900 disabled:opacity-50"
                  >
                    {labels.rewrite}
                  </button>
                  <button
                    type="button"
                    disabled={acting === `seo-${p.id}`}
                    onClick={() => void runAction(`seo-${p.id}`, "/api/products/seo/analyze", { product_id: p.id })}
                    className="text-xs text-violet-700 underline hover:text-violet-900 disabled:opacity-50"
                  >
                    {labels.analyzeSeo}
                  </button>
                  <button
                    type="button"
                    disabled={acting === `ap-${p.id}`}
                    onClick={() => void runAction(`ap-${p.id}`, "/api/products/approve", { product_id: p.id, decision: "approve_all" })}
                    className="text-xs text-emerald-700 underline hover:text-emerald-900 disabled:opacity-50"
                  >
                    {labels.approve}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.seo_recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.seoRecommendations}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.seo_recommendations.map((s) => (
              <li key={s.id} className="rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-blue-900">{s.title}</span>
                <span className="ml-2 text-xs text-blue-700">({s.product_title})</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(s.priority)}`}>{s.priority}</span>
                <p className="mt-1 text-xs text-blue-800">{s.suggestion}</p>
                <p className="mt-1 text-xs italic text-blue-700">{s.rationale}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.quality_warnings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.qualityWarnings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.quality_warnings.map((q) => (
              <li key={q.id} className="rounded-lg border border-orange-100 bg-orange-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-orange-900">{q.title}</span>
                <span className="ml-2 text-xs text-orange-700">({q.product_title})</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(q.severity)}`}>{q.severity}</span>
                <p className="mt-1 text-xs text-orange-800">{q.explanation}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.category_suggestions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.categorySuggestions}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.category_suggestions.map((c) => (
              <article key={c.id} className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
                <p className="font-medium text-teal-900">{c.product_title}</p>
                <p className="mt-1 text-sm text-teal-800">{c.primary_category}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(c.confidence)}`}>
                  {c.confidence} confidence
                </span>
                <p className="mt-2 text-xs text-teal-700">{c.rationale}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.approval_requests.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.approvalWorkflow}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.approval_requests.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{a.product_title}</span>
                  <p className="text-xs text-gray-600">{a.summary}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(a.status)}`}>{a.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recent_translations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentTranslations}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_translations.map((t) => (
              <li key={t.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
                <span className="font-medium text-indigo-900">{t.product_title}</span>
                <span className="ml-2 text-xs uppercase text-indigo-600">{t.target_language}</span>
                <p className="mt-1 text-xs text-indigo-800">{t.translated_preview}…</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recent_rewrites.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentRewrites}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_rewrites.map((r) => (
              <li key={r.id} className="rounded-lg border border-purple-100 bg-purple-50/30 px-3 py-2 text-sm">
                <span className="font-medium text-purple-900">{r.product_title}</span>
                <span className="ml-2 text-xs capitalize text-purple-600">{r.rewriting_mode?.replace(/_/g, " ")}</span>
                <p className="mt-1 text-xs text-purple-800">{r.rewritten_preview}…</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.bulk_jobs.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.bulkActions}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.bulk_jobs.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium capitalize">{b.action_type?.replace(/_/g, " ")}</span>
                <span className="ml-2 text-xs">({b.product_count} products)</span>
                <p className="text-xs text-gray-600">{b.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentBriefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
