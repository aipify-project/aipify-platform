"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSupportAssistantSearch,
  SUPPORT_ASSISTANT_CONTEXT_STORAGE_KEY,
  SUPPORT_ASSISTANT_SUGGESTED_IDS,
  type SupportAssistantArticle,
  type SupportAssistantLabels,
} from "@/lib/app-portal/support-assistant";

type Props = { labels: SupportAssistantLabels };

export function SupportAssistantPanel({ labels }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [articles, setArticles] = useState<SupportAssistantArticle[]>([]);
  const [selected, setSelected] = useState<SupportAssistantArticle | null>(null);
  const [escalating, setEscalating] = useState(false);

  const search = useCallback(async (q: string, articleId?: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (articleId) params.set("article_id", articleId);
    else if (q.trim()) params.set("q", q.trim());
    const res = await fetch(`/api/aipify/support-assistant/search?${params}`);
    if (res.ok) {
      const parsed = parseSupportAssistantSearch(await res.json());
      setArticles(parsed.articles);
      if (articleId) {
        setSelected(parsed.articles[0] ?? null);
      } else if (parsed.articles.length === 1 && q.trim()) {
        setSelected(parsed.articles[0]);
      }
    }
    setLoading(false);
    setInitialLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial corpus load
    void search("");
  }, [search]);

  async function openArticle(id: string) {
    setQuery(labels.suggested[id]?.title ?? id);
    await search("", id);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSelected(null);
    await search(query);
  }

  async function escalate() {
    if (!selected) return;
    setEscalating(true);
    const res = await fetch("/api/aipify/support-assistant/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_asked: query || selected.title,
        article_id: selected.id,
        article_title: selected.title,
        related_module: selected.related_module,
      }),
    });
    if (res.ok) {
      const ctx = await res.json();
      sessionStorage.setItem(SUPPORT_ASSISTANT_CONTEXT_STORAGE_KEY, JSON.stringify(ctx));
      window.location.href = "/app/support/requests?from=assistant";
    }
    setEscalating(false);
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={(e) => void handleSearch(e)} className="flex flex-wrap gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="min-w-[240px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            {labels.searchButton}
          </button>
        </form>
        {!query && !selected ? (
          <p className="mt-4 text-sm text-slate-500">{labels.emptyPrompt}</p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.suggestedTitle}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {SUPPORT_ASSISTANT_SUGGESTED_IDS.map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => void openArticle(id)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-800 hover:border-indigo-300 hover:bg-indigo-50"
              >
                {labels.suggested[id]?.title ?? id}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        </div>
      ) : null}

      {selected ? (
        <AnswerPanel article={selected} labels={labels} onRelated={(id) => void openArticle(id)} />
      ) : null}

      {!selected && articles.length > 0 && query ? (
        <section className="space-y-3">
          {articles.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a)}
              className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-indigo-200"
            >
              <h3 className="font-semibold text-slate-900">{a.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{a.summary}</p>
            </button>
          ))}
        </section>
      ) : null}

      {!loading && query && articles.length === 0 ? (
        <p className="text-center text-sm text-slate-600">{labels.noResults}</p>
      ) : null}

      {selected ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-center">
          <h2 className="font-semibold text-amber-950">{labels.stillNeedHelp}</h2>
          <button
            type="button"
            disabled={escalating}
            onClick={() => void escalate()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {labels.createSupportRequest}
          </button>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.replacesHuman}</dt><dd className="mt-1 text-slate-600">{labels.faq.replacesHumanAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.canCreateRequest}</dt><dd className="mt-1 text-slate-600">{labels.faq.canCreateRequestAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function AnswerPanel({
  article,
  labels,
  onRelated,
}: {
  article: SupportAssistantArticle;
  labels: SupportAssistantLabels;
  onRelated: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">{labels.answerTitle}</h2>
      <div>
        <h3 className="font-semibold text-slate-900">{article.title}</h3>
        <p className="mt-2 text-sm text-slate-700">{article.summary}</p>
      </div>
      {article.steps.length > 0 ? (
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{labels.stepsTitle}</h4>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-700">
            {article.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}
      {article.related_articles.length > 0 ? (
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{labels.relatedTitle}</h4>
          <ul className="mt-2 space-y-1">
            {article.related_articles.map((rel) => (
              <li key={rel.id}>
                <button type="button" onClick={() => onRelated(rel.id)} className="text-sm text-indigo-700 hover:underline">
                  {rel.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
