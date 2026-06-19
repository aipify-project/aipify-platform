"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchMarketingIndex } from "@/lib/marketing/governance/search-index";
import type { MarketingSearchResult } from "@/lib/marketing/governance/types";

type MarketingGlobalSearchProps = {
  placeholder: string;
  noResults: string;
  index: MarketingSearchResult[];
};

export default function MarketingGlobalSearch({ placeholder, noResults, index }: MarketingGlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchMarketingIndex(index, query), [index, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative hidden md:block">
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="rounded-lg border border-aipify-border bg-aipify-surface-muted px-3 py-1.5 text-xs text-aipify-text-muted transition hover:border-aipify-companion/40"
        aria-label={placeholder}
      >
        {placeholder}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/20 p-4 pt-24">
          <div className="w-full max-w-lg rounded-2xl border border-aipify-border bg-aipify-surface shadow-xl">
            <div className="border-b border-aipify-border p-3">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-aipify-border bg-aipify-surface-muted px-3 py-2 text-sm text-aipify-text focus:outline-none focus:ring-2 focus:ring-aipify-focus"
              />
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && query ? (
                <li className="px-3 py-4 text-sm text-aipify-text-muted">{noResults}</li>
              ) : null}
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 hover:bg-aipify-surface-muted"
                  >
                    <span className="text-sm font-medium text-aipify-text">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-aipify-text-muted">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-aipify-border px-3 py-2 text-right">
              <button type="button" onClick={() => setOpen(false)} className="text-xs text-aipify-text-muted hover:text-aipify-text">
                Esc
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
