"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSuperLanguageAdministration,
  type SuperLanguageSetting,
  type SuperPortalLabels,
} from "@/lib/super-portal";

export function SuperPortalLanguageAdministrationPanel({
  labels,
}: {
  labels: SuperPortalLabels["languageAdministration"];
}) {
  const [languages, setLanguages] = useState<SuperLanguageSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/super-portal/language-administration");
    if (res.ok) {
      const data = await res.json();
      setLanguages(parseSuperLanguageAdministration(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (action: string, locale: string) => {
    setBusy(true);
    try {
      const res = await fetch("/api/super-portal/language-administration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, locale }),
      });
      if (res.ok) await load();
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="p-6 text-sm text-zinc-500">{labels.loading}</p>;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href="/super" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {languages.map((lang) => (
          <article key={lang.locale} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">
              {labels.locales[lang.locale] ?? lang.locale}
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">{labels.enabled}</dt>
                <dd className="font-medium text-zinc-900">{lang.enabled ? labels.yes : labels.no}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">{labels.completeness}</dt>
                <dd className="font-medium text-zinc-900">{lang.completeness_pct}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">{labels.missingKeys}</dt>
                <dd className="font-medium text-zinc-900">{lang.missing_keys_count}</dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-2">
              {!lang.enabled && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void act("enable_language", lang.locale)}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {labels.enable}
                </button>
              )}
              {lang.enabled && lang.locale !== "en" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void act("disable_language", lang.locale)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                >
                  {labels.disable}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
