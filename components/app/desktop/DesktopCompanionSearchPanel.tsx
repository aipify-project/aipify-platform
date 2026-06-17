"use client";

import { useState } from "react";
import { parseDesktopCompanionSearch } from "@/lib/desktop-companion-foundation";

type Props = {
  labels: Record<string, string>;
};

export function DesktopCompanionSearchPanel({ labels }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof parseDesktopCompanionSearch> | null>(
    null
  );
  const [busy, setBusy] = useState(false);

  async function search() {
    if (!query.trim()) return;
    setBusy(true);
    const res = await fetch(
      `/api/aipify/desktop/foundation/search?q=${encodeURIComponent(query.trim())}`
    );
    if (res.ok) setResults(parseDesktopCompanionSearch(await res.json()));
    setBusy(false);
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">{labels.searchPlaceholder}</h1>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder={labels.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void search();
          }}
        />
        <button
          type="button"
          disabled={busy}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
          onClick={() => void search()}
        >
          Search
        </button>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {(results?.results ?? []).map((r, i) => (
          <li key={`${r.type}-${r.id ?? i}`} className="rounded border border-gray-100 p-3">
            <span className="text-xs uppercase text-gray-400">{r.type}</span>
            <p>{r.title}</p>
          </li>
        ))}
        {results && results.results.length === 0 ? (
          <li className="text-gray-500">{labels.searchNoResults}</li>
        ) : null}
      </ul>
    </section>
  );
}
