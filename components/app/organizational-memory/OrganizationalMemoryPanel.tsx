"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  MEMORY_CATEGORIES,
  parseOrganizationalMemoryCenter,
  type CreateMemoryInput,
  type MemoryEntry,
  type OrganizationalMemoryCenter,
} from "@/lib/aipify/organizational-memory";

type OrganizationalMemoryPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    youControl: string;
    privacy: string;
    createEntry: string;
    saveEntry: string;
    cancel: string;
    deleteEntry: string;
    search: string;
    searchPlaceholder: string;
    refresh: string;
    upgradeCta: string;
    starterNote: string;
    sections: {
      briefing: string;
      timeline: string;
      decisions: string;
      lessons: string;
      search: string;
      create: string;
      context: string;
    };
    categories: Record<string, string>;
    visibility: Record<string, string>;
    fields: {
      title: string;
      summary: string;
      notes: string;
      category: string;
      date: string;
      visibility: string;
    };
    emptyTimeline: string;
    emptyDecisions: string;
    emptyLessons: string;
    emptySearch: string;
    noResults: string;
  };
};

export function OrganizationalMemoryPanel({ labels }: OrganizationalMemoryPanelProps) {
  const [center, setCenter] = useState<OrganizationalMemoryCenter | null>(null);
  const [timeline, setTimeline] = useState<unknown[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateMemoryInput>({
    title: "",
    summary: "",
    detailed_notes: "",
    category: "operational",
    memory_date: new Date().toISOString().slice(0, 10),
    visibility_level: "personal",
  });

  const refresh = useCallback(async () => {
    const [centerRes, timelineRes] = await Promise.all([
      fetch("/api/aipify/memory"),
      fetch("/api/aipify/memory/timeline"),
    ]);
    if (centerRes.ok) setCenter(parseOrganizationalMemoryCenter(await centerRes.json()));
    if (timelineRes.ok) {
      const data = await timelineRes.json();
      setTimeline(Array.isArray(data.timeline) ? data.timeline : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function runSearch() {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const res = await fetch(`/api/aipify/memory/search?q=${encodeURIComponent(searchQuery)}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    }
  }

  async function createEntry() {
    if (!form.title.trim()) return;
    await fetch("/api/aipify/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({
      title: "",
      summary: "",
      detailed_notes: "",
      category: "operational",
      memory_date: new Date().toISOString().slice(0, 10),
      visibility_level: center?.starter_mode ? "personal" : "tenant",
    });
    void refresh();
  }

  async function deleteEntry(id: string) {
    await fetch(`/api/aipify/memory/${id}`, { method: "DELETE" });
    void refresh();
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;
  if (!center?.has_customer) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-indigo-600 hover:underline">
            {labels.back}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {labels.refresh}
          </button>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.createEntry}
          </button>
        </div>
      </div>

      <p className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
        {labels.youControl}
      </p>

      {center.starter_mode ? (
        <p className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
          {labels.starterNote}{" "}
          <Link href="/app/settings/billing" className="font-medium underline">
            {labels.upgradeCta}
          </Link>
        </p>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.briefing}</h2>
        <p className="mt-2 text-sm text-gray-700">{center.briefing}</p>
        {(center.since_last_login?.length ?? 0) > 0 ? (
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            {center.since_last_login!.map((e: MemoryEntry) => (
              <li key={e.id}>· {e.title}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.search}</h2>
        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void runSearch()}
          />
          <button
            type="button"
            onClick={() => void runSearch()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {labels.search}
          </button>
        </div>
        {searchQuery && searchResults.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noResults}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {searchResults.map((item, i) => {
              const r = item as Record<string, unknown>;
              return (
                <li key={i} className="rounded-lg border border-gray-100 p-2">
                  {(r.title as string) ?? (r.decision_title as string) ?? (r.related_project as string)}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.create}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm text-gray-700">{labels.fields.title}</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm text-gray-700">{labels.fields.summary}</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                rows={2}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm text-gray-700">{labels.fields.notes}</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                rows={3}
                value={form.detailed_notes}
                onChange={(e) => setForm({ ...form, detailed_notes: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{labels.fields.category}</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as CreateMemoryInput["category"] })
                }
              >
                {MEMORY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {labels.categories[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{labels.fields.date}</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.memory_date}
                onChange={(e) => setForm({ ...form, memory_date: e.target.value })}
              />
            </label>
            {!center.starter_mode ? (
              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-700">{labels.fields.visibility}</span>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={form.visibility_level}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      visibility_level: e.target.value as CreateMemoryInput["visibility_level"],
                    })
                  }
                >
                  <option value="personal">{labels.visibility.personal}</option>
                  <option value="tenant">{labels.visibility.tenant}</option>
                  {center.enterprise_features ? (
                    <>
                      <option value="department">{labels.visibility.department}</option>
                      <option value="executive">{labels.visibility.executive}</option>
                    </>
                  ) : null}
                </select>
              </label>
            ) : null}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => void createEntry()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {labels.saveEntry}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
            >
              {labels.cancel}
            </button>
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.timeline}</h2>
        {timeline.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.emptyTimeline}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {timeline.map((item, i) => {
              const t = item as Record<string, unknown>;
              const id = t.id as string;
              const title =
                (t.title as string) ??
                (t.decision_title as string) ??
                (t.related_project as string) ??
                "—";
              const date = (t.sort_date as string) ?? (t.memory_date as string) ?? "";
              return (
                <li key={id ?? i} className="rounded-xl border border-gray-100 p-3">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{title}</p>
                      <p className="text-sm text-gray-600">
                        {(t.summary as string) ?? (t.decision_summary as string) ?? (t.what_worked as string) ?? ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-gray-500">{date}</span>
                  </div>
                  {t.entry_type === "memory" && id ? (
                    <button
                      type="button"
                      onClick={() => void deleteEntry(id)}
                      className="mt-2 text-sm text-gray-500 hover:underline"
                    >
                      {labels.deleteEntry}
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {center.business_features ? (
        <>
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">{labels.sections.decisions}</h2>
            {(center.decisions ?? []).length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">{labels.emptyDecisions}</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm text-gray-700">
                {center.decisions!.map((d) => (
                  <li key={d.id} className="rounded-lg border border-gray-100 p-2">
                    <p className="font-medium">{d.decision_title}</p>
                    <p className="text-gray-600">{d.rationale}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">{labels.sections.lessons}</h2>
            {(center.lessons ?? []).length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">{labels.emptyLessons}</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm text-gray-700">
                {center.lessons!.map((l) => (
                  <li key={l.id} className="rounded-lg border border-gray-100 p-2">
                    <p className="font-medium">{l.related_project || labels.sections.lessons}</p>
                    <p className="text-gray-600">{l.future_recommendations}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}

      {center.integration_context &&
      (center.business_features ||
        (center.integration_context.completed_goals?.length ?? 0) > 0) ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.context}</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {center.integration_context.completed_goals?.map((g, i) => (
              <li key={`g-${i}`}>· Goal completed: {g.title}</li>
            ))}
            {center.integration_context.pulse_history?.map((p, i) => (
              <li key={`p-${i}`}>· Pulse ({p.date}): {p.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.privacy_note ? (
        <p className="text-xs text-gray-500">
          {labels.privacy}: {center.privacy_note}
        </p>
      ) : null}
    </div>
  );
}
