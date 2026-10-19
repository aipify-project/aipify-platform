"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { FAQ_CONTENT_LANGUAGE_CODES, sortFaqContentLanguageCodes } from "@/lib/website-kompis-faq/content-languages";

type FaqContentLanguagePickerProps = {
  value: string;
  onChange: (code: string) => void;
  labels: Record<string, string>;
  searchLabel: string;
  noMatchLabel: string;
  listLabel: string;
  collationLocale: string;
  emptyLabel?: string;
  allowEmpty?: boolean;
  disabled?: boolean;
};

export function FaqContentLanguagePicker({
  value,
  onChange,
  labels,
  searchLabel,
  noMatchLabel,
  listLabel,
  collationLocale,
  emptyLabel,
  allowEmpty = false,
  disabled = false,
}: FaqContentLanguagePickerProps) {
  const listId = useId();
  const searchId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const options = useMemo(() => {
    const codes = sortFaqContentLanguageCodes(
      FAQ_CONTENT_LANGUAGE_CODES,
      (code) => labels[code] ?? code,
      collationLocale || "nb",
    );
    const preserved = value && !codes.includes(value) ? [value] : [];
    const rows = [
      ...(allowEmpty ? [{ code: "", name: emptyLabel ?? "" }] : []),
      ...preserved.map((code) => ({ code, name: labels[code] ?? code })),
      ...codes.map((code) => ({ code, name: labels[code] ?? code })),
    ];
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (row) =>
        row.code.toLowerCase().includes(needle) ||
        row.name.toLowerCase().includes(needle),
    );
  }, [allowEmpty, collationLocale, emptyLabel, labels, query, value]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    searchRef.current?.focus();
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        if (previous instanceof HTMLElement) previous.focus();
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const selectedName = value ? (labels[value] ?? value) : (emptyLabel ?? "");

  function choose(code: string) {
    onChange(code);
    setOpen(false);
    setQuery("");
  }

  function onSearchKey(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(options.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) choose(option.code);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-11 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] disabled:opacity-60"
      >
        <span>{selectedName}</span>
        <span className="text-xs text-slate-500">{value}</span>
      </button>
      {open ? (
        <div className="absolute z-30 mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          <input
            ref={searchRef}
            id={searchId}
            type="search"
            value={query}
            aria-label={searchLabel}
            aria-controls={listId}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onSearchKey}
            placeholder={searchLabel}
            className="mb-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
          />
          <ul
            id={listId}
            role="listbox"
            aria-label={listLabel}
            className="max-h-64 overflow-y-auto overscroll-contain"
          >
            {options.length === 0 ? (
              <li className="px-2 py-2 text-sm text-slate-600">{noMatchLabel}</li>
            ) : (
              options.map((option, index) => {
                const selected = option.code === value;
                return (
                  <li key={option.code || "all"} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => choose(option.code)}
                      className={`flex min-h-11 w-full items-center justify-between rounded-lg px-2 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] ${
                        index === activeIndex ? "bg-[#f3eefe] text-slate-900" : "text-slate-800"
                      }`}
                    >
                      <span>{option.name}</span>
                      <span className="text-xs text-slate-500">{option.code}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
