"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildVisibleCommandItems,
  recordRecentDestination,
  type CommandBarItem,
  type CommandBarLabels,
  type CommandBarPortal,
  type CommandBarRecommendation,
  type CommandBarRoleContext,
  type CommandBarSearchResult,
} from "@/lib/command-bar";

type AipifyCommandBarProps = {
  open: boolean;
  onClose: () => void;
  portal: CommandBarPortal;
  labels: CommandBarLabels;
  registry: CommandBarItem[];
  roleContext: CommandBarRoleContext;
  recent: Array<{ id: string; label: string; href: string; visitedAt: number }>;
};

const SECTION_ORDER = ["recommendation", "recent", "navigation", "action", "search"] as const;

function sectionLabel(labels: CommandBarLabels, section: CommandBarItem["section"]): string {
  return labels.sections[section];
}

export default function AipifyCommandBar({
  open,
  onClose,
  portal,
  labels,
  registry,
  roleContext,
  recent,
}: AipifyCommandBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<CommandBarSearchResult[]>([]);
  const [recommendations, setRecommendations] = useState<CommandBarRecommendation[]>([]);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = useMemo(
    () =>
      buildVisibleCommandItems({
        registry,
        recent,
        recommendations,
        searchResults,
        query,
        roleContext,
      }),
    [registry, recent, recommendations, searchResults, query, roleContext]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, CommandBarItem[]>();
    for (const section of SECTION_ORDER) {
      map.set(section, []);
    }
    for (const item of items) {
      const bucket = map.get(item.section) ?? [];
      bucket.push(item);
      map.set(item.section, bucket);
    }
    return SECTION_ORDER.map((section) => ({
      section,
      items: map.get(section) ?? [],
    })).filter((group) => group.items.length > 0);
  }, [items]);

  const flatItems = useMemo(() => grouped.flatMap((group) => group.items), [grouped]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    setSearchResults([]);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    void fetch(`/api/command-bar/context?portal=${portal}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.recommendations) setRecommendations(data.recommendations);
      })
      .catch(() => undefined);
  }, [open, portal]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      void fetch(`/api/command-bar/search?portal=${portal}&q=${encodeURIComponent(q)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.results) setSearchResults(data.results);
        })
        .catch(() => undefined);
    }, 200);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [open, portal, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, items.length]);

  const executeItem = useCallback(
    (item: CommandBarItem) => {
      if (!item.href) return;
      recordRecentDestination(portal, {
        id: item.id,
        label: item.label,
        href: item.href,
      });
      onClose();
      router.push(item.href);
    },
    [onClose, portal, router]
  );

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, Math.max(flatItems.length - 1, 0)));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        return;
      }

      if (event.key === "Enter" && flatItems[activeIndex]) {
        event.preventDefault();
        executeItem(flatItems[activeIndex]);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, flatItems, activeIndex, executeItem, onClose]);

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        aria-label={labels.close}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels.placeholder}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-gray-900/10 animate-fade-in-up"
      >
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.placeholder}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        <div ref={listRef} className="max-h-[min(420px,50vh)] overflow-y-auto px-2 py-2">
          {flatItems.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-gray-500">{labels.noResults}</p>
          ) : (
            grouped.map((group) => (
              <div key={group.section} className="mb-2">
                <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {sectionLabel(labels, group.section)}
                </p>
                <ul>
                  {group.items.map((item) => {
                    runningIndex += 1;
                    const index = runningIndex;
                    const isActive = index === activeIndex;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          data-active={isActive ? "true" : "false"}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => executeItem(item)}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                            isActive ? "bg-violet-50 text-violet-950" : "text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{item.label}</span>
                            {item.description ? (
                              <span className="block truncate text-xs text-gray-500">{item.description}</span>
                            ) : null}
                          </span>
                          {item.href ? (
                            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                              {group.section === "search" ? item.keywords?.[0] ?? "Go" : "Open"}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 bg-gray-50/80 px-4 py-2.5 text-[11px] text-gray-500">
          <span className="font-medium text-gray-600">{labels.shortcuts.title}</span>
          <span>{labels.shortcuts.navigate}</span>
          <span>{labels.shortcuts.select}</span>
          <span>{labels.shortcuts.close}</span>
          <span className="ml-auto hidden sm:inline">{labels.shortcuts.open}</span>
        </div>
      </div>
    </div>
  );
}
