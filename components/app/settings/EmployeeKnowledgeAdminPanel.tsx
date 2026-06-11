"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEmployeeAnswer,
  parseEmployeeKnowledgeCenter,
  type EkeSettings,
  type EmployeeAnswer,
  type EmployeeKnowledgeCenter,
} from "@/lib/employee-knowledge-engine";

type EmployeeKnowledgeAdminPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    privacy: string;
    viewBusinessDna: string;
    empty: string;
    youControl: string;
    sections: {
      health: string;
      coverage: string;
      gaps: string;
      onboarding: string;
      permissions: string;
      sources: string;
      pending: string;
      ask: string;
      search: string;
      audit: string;
      ethics: string;
      settings: string;
    };
    settings: {
      assistant: string;
      gapDetection: string;
      onboarding: string;
      improvementLoop: string;
      adminApproval: string;
      videoSupport: string;
    };
    ask: {
      placeholder: string;
      run: string;
      confidence: string;
      escalate: string;
      steps: string;
    };
    search: {
      placeholder: string;
      run: string;
    };
    create: {
      title: string;
      category: string;
      content: string;
      submit: string;
    };
  };
};

const HEALTH_STYLES: Record<string, string> = {
  critical: "bg-rose-100 text-rose-800",
  limited: "bg-amber-100 text-amber-800",
  operational: "bg-sky-100 text-sky-800",
  strong: "bg-emerald-100 text-emerald-800",
};

export function EmployeeKnowledgeAdminPanel({ labels }: EmployeeKnowledgeAdminPanelProps) {
  const [center, setCenter] = useState<EmployeeKnowledgeCenter | null>(null);
  const [settings, setSettings] = useState<EkeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [question, setQuestion] = useState("How do we process a refund?");
  const [searchQuery, setSearchQuery] = useState("");
  const [answer, setAnswer] = useState<EmployeeAnswer | null>(null);
  const [searchResults, setSearchResults] = useState<Array<Record<string, unknown>>>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("operational_procedures");
  const [newContent, setNewContent] = useState("");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/employee-knowledge");
    if (res.ok) {
      const data = parseEmployeeKnowledgeCenter(await res.json());
      setCenter(data);
      if (data.settings) setSettings(data.settings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveSettings() {
    if (!settings) return;
    await fetch("/api/employee-knowledge", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    await refresh();
  }

  async function runAsk() {
    const res = await fetch("/api/employee-knowledge/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    setAnswer(parseEmployeeAnswer(await res.json()));
  }

  async function runSearch() {
    const res = await fetch("/api/employee-knowledge/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchQuery }),
    });
    const data = (await res.json()) as { results?: Array<Record<string, unknown>> };
    setSearchResults(data.results ?? []);
  }

  async function createItem() {
    if (!newTitle.trim() || !newContent.trim()) return;
    await fetch("/api/employee-knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_item",
        category: newCategory,
        title: newTitle,
        content: newContent,
      }),
    });
    setNewTitle("");
    setNewContent("");
    await refresh();
  }

  async function approveItem(id: string) {
    await fetch("/api/employee-knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve_item", item_id: id }),
    });
    await refresh();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  const health = center?.health;
  const onboarding = center?.onboarding as Record<string, unknown> | undefined;
  const path = onboarding?.path as Record<string, unknown> | undefined;
  const progress = onboarding?.progress as Record<string, unknown> | undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-1 text-sm font-medium text-indigo-800">{labels.youControl}</p>
        {center?.privacy_note && (
          <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            {center.privacy_note}
          </p>
        )}
        <div className="mt-3">
          <Link href="/app/settings/business-dna" className="text-sm text-indigo-600 hover:underline">
            {labels.viewBusinessDna}
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.health}</h2>
        {health && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">{health.health_score}</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${HEALTH_STYLES[health.level] ?? HEALTH_STYLES.operational}`}
            >
              {health.health_label}
            </span>
            {center?.user_role && (
              <span className="text-sm text-gray-500">Role: {center.user_role}</span>
            )}
          </div>
        )}
      </section>

      {settings && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-indigo-900">{labels.sections.settings}</h2>
          <div className="mt-3 space-y-3 text-sm">
            {(
              [
                ["employee_assistant_enabled", labels.settings.assistant],
                ["gap_detection_enabled", labels.settings.gapDetection],
                ["onboarding_enabled", labels.settings.onboarding],
                ["improvement_loop_enabled", labels.settings.improvementLoop],
                ["require_admin_approval", labels.settings.adminApproval],
                ["video_support_enabled", labels.settings.videoSupport],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(settings[key])}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                />
                {label}
              </label>
            ))}
            <button
              type="button"
              onClick={() => void saveSettings()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              {saved ? labels.saved : labels.save}
            </button>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
        <h2 className="font-semibold text-sky-900">{labels.sections.ask}</h2>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          placeholder={labels.ask.placeholder}
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => void runAsk()}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {labels.ask.run}
        </button>
        {answer?.answer && (
          <div className="mt-4 rounded-lg bg-white p-4 text-sm">
            <p className="font-medium">{answer.title}</p>
            <p className="mt-2 text-gray-700">{answer.answer}</p>
            <p className="mt-2 text-xs text-gray-500">
              {labels.ask.confidence}: {answer.confidence_level} ({answer.confidence_score}%)
            </p>
            {answer.escalate_recommended && (
              <p className="mt-1 text-xs text-rose-700">{labels.ask.escalate}</p>
            )}
            {Array.isArray(answer.steps) && answer.steps.length > 0 && (
              <div className="mt-3">
                <p className="font-medium">{labels.ask.steps}</p>
                <ol className="mt-1 list-decimal pl-5">
                  {answer.steps.map((step, i) => (
                    <li key={i}>{String((step as Record<string, unknown>).step ?? step)}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
        <h2 className="font-semibold text-violet-900">{labels.sections.search}</h2>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.search.placeholder}
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => void runSearch()}
          className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
        >
          {labels.search.run}
        </button>
        <ul className="mt-3 space-y-2 text-sm">
          {searchResults.map((r) => (
            <li key={String(r.id)} className="rounded-lg bg-white px-3 py-2">
              {String(r.title)} — {String(r.category)}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
        <h2 className="font-semibold text-emerald-900">{labels.sections.onboarding}</h2>
        {path ? (
          <div className="mt-2 text-sm">
            <p className="font-medium">{String(path.title)}</p>
            <p className="text-gray-600">{String(path.description)}</p>
            {progress && (
              <p className="mt-2">
                Progress: {String(progress.progress_percent ?? 0)}%
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.empty}</p>
        )}
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
        <h2 className="font-semibold text-amber-900">{labels.sections.gaps}</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {center?.knowledge_gaps?.map((g) => (
            <li key={String(g.id)}>
              <span className="font-medium">{String(g.category)}</span> ({String(g.occurrence_count)}×) —{" "}
              {String(g.suggestion)}
            </li>
          )) ?? <li className="text-gray-500">{labels.empty}</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.pending}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {center?.pending_approval?.map((item) => (
            <li key={String(item.id)} className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
              <span>
                {String(item.title)} — {String(item.category)}
              </span>
              <button
                type="button"
                onClick={() => void approveItem(String(item.id))}
                className="text-xs text-indigo-600 hover:underline"
              >
                Approve
              </button>
            </li>
          )) ?? <li className="text-gray-500">{labels.empty}</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.create.title}</h2>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={labels.create.title}
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          {center?.categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder={labels.create.content}
          rows={4}
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => void createItem()}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {labels.create.submit}
        </button>
      </section>

      {Array.isArray(center?.ethical_principles) && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.sections.ethics}</h2>
          <ul className="mt-2 space-y-1 text-sm text-violet-800">
            {center.ethical_principles.map((p, i) => (
              <li key={i}>· {p}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        <ul className="mt-3 space-y-1 text-sm text-gray-600">
          {center?.audit_log?.map((a) => (
            <li key={String(a.id)}>
              {String(a.event_type)} — {new Date(String(a.created_at)).toLocaleString()}
            </li>
          )) ?? <li>{labels.empty}</li>}
        </ul>
      </section>
    </div>
  );
}
