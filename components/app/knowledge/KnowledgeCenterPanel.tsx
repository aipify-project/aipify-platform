"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseKnowledgeCenter, type KnowledgeCenter } from "@/lib/aipify/knowledge";

type KnowledgeCenterPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    privacy: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    metrics: Record<string, string>;
    sections: { articles: string; gaps: string };
    actions: { createArticle: string; importSeed: string; createFromGap: string; dismiss: string; publish: string };
    emptyArticles: string;
    emptyGaps: string;
    links: { gaps: string; settings: string; organizationalMemory?: string };
    statuses: Record<string, string>;
  };
};

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800",
  draft: "bg-gray-100 text-gray-700",
  review: "bg-amber-100 text-amber-900",
  archived: "bg-rose-100 text-rose-800",
};

export function KnowledgeCenterPanel({ labels }: KnowledgeCenterPanelProps) {
  const [center, setCenter] = useState<KnowledgeCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/knowledge");
    if (res.ok) setCenter(parseKnowledgeCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function importSeed() {
    await fetch("/api/aipify/knowledge/import-seed-content", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    await refresh();
  }

  async function createFromGap(id: string) {
    setActingId(id);
    await fetch(`/api/aipify/knowledge/gaps/${id}/create-article`, { method: "POST" });
    await refresh();
    setActingId(null);
  }

  async function dismissGap(id: string) {
    setActingId(id);
    await fetch(`/api/aipify/knowledge/gaps/${id}/dismiss`, { method: "POST" });
    await refresh();
    setActingId(null);
  }

  async function publishArticle(id: string) {
    setActingId(id);
    await fetch(`/api/aipify/knowledge/articles/${id}/publish`, { method: "POST" });
    await refresh();
    setActingId(null);
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  if (!center?.has_customer) {
    return <div className="p-6"><Link href="/app" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link></div>;
  }

  if (center.upgrade_required || !center.has_access) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">{labels.upgradeTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.upgradeBody}</p>
          <Link href="/app/settings/billing" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">{labels.upgradeCta}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
          <h1 className="mt-2 text-2xl font-semibold">{labels.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          <p className="mt-2 text-xs text-gray-500">{labels.privacy}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/knowledge-center/gaps" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.gaps}</Link>
          <Link href="/app/knowledge-center/organizational-memory" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.organizationalMemory ?? "Organizational Memory"}</Link>
          <Link href="/app/settings/knowledge" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.settings}</Link>
          <button type="button" onClick={() => void importSeed()} className="rounded-lg border px-3 py-1.5 text-sm">{labels.actions.importSeed}</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(center.metrics).map(([key, value]) => (
          <div key={key} className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">{labels.metrics[key] ?? key}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{labels.sections.articles}</h2>
        {center.recent_articles.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.emptyArticles}</p>
        ) : (
          <div className="space-y-2">
            {center.recent_articles.map((article) => (
              <div key={article.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="text-xs text-gray-500">{article.slug} · {article.language} · {article.category_slug}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[article.status] ?? "bg-gray-100"}`}>
                    {labels.statuses[article.status] ?? article.status}
                  </span>
                </div>
                {article.status !== "published" ? (
                  <button type="button" disabled={actingId === article.id} onClick={() => void publishArticle(article.id)}
                    className="mt-2 rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white disabled:opacity-50">
                    {labels.actions.publish}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{labels.sections.gaps}</h2>
        {center.open_gaps.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.emptyGaps}</p>
        ) : (
          <div className="space-y-2">
            {center.open_gaps.map((gap) => (
              <div key={gap.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="font-medium">{gap.question}</p>
                <p className="mt-1 text-xs text-gray-500">{gap.source_type} · {gap.frequency_count}×</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" disabled={actingId === gap.id} onClick={() => void createFromGap(gap.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white disabled:opacity-50">{labels.actions.createFromGap}</button>
                  <button type="button" disabled={actingId === gap.id} onClick={() => void dismissGap(gap.id)}
                    className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50">{labels.actions.dismiss}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
