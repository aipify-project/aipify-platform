"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseTemplates, type AutomationTemplate } from "@/lib/aipify/adaptive-automation";

type AutomationLibraryPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    createFromTemplate: string;
    empty: string;
    riskLevels: Record<string, string>;
    global: string;
    tenant: string;
  };
};

export function AutomationLibraryPanel({ labels }: AutomationLibraryPanelProps) {
  const [templates, setTemplates] = useState<AutomationTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/aipify/automation/templates");
    if (res.ok) setTemplates(parseTemplates(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createFromTemplate(id: string) {
    await fetch("/api/aipify/automation/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: id }),
    });
    window.location.href = "/app/automations";
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/app/automations" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
      </div>
      {templates.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">{labels.empty}</p>
      ) : (
        <div className="space-y-3">
          {templates.map((t) => (
            <article key={t.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-gray-900">{t.template_name}</h2>
                <span className="text-xs text-gray-500">{t.category}</span>
                <span className="text-xs text-gray-400">{t.is_global ? labels.global : labels.tenant}</span>
                <span className="text-xs text-gray-500">{labels.riskLevels[t.risk_level] ?? t.risk_level}</span>
              </div>
              {t.description ? <p className="mt-2 text-sm text-gray-600">{t.description}</p> : null}
              {t.risk_level !== "blocked" ? (
                <button
                  type="button"
                  onClick={() => void createFromTemplate(t.id)}
                  className="mt-4 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
                >
                  {labels.createFromTemplate}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
